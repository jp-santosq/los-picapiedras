package com.springboot.MyTodoList.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.MyTodoList.model.RagDocumentChunk;
import com.springboot.MyTodoList.repository.RagDocumentChunkRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RagService {

    private static final int MAX_CHUNK_SIZE = 800;
    private static final int CHUNK_OVERLAP = 120;

    private final RagDocumentChunkRepository repository;
    private final EmbeddingService embeddingService;
    private final ObjectMapper objectMapper;

    public RagService(
            RagDocumentChunkRepository repository,
            EmbeddingService embeddingService,
            ObjectMapper objectMapper) {
        this.repository = repository;
        this.embeddingService = embeddingService;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> ingestFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Debes adjuntar un archivo con contenido para el RAG.");
        }

        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "documento";
        String mimeType = file.getContentType();
        String content = extractText(file, filename);

        List<String> chunks = splitIntoChunks(content);
        if (chunks.isEmpty()) {
            throw new IllegalArgumentException("El archivo no contiene texto para indexar.");
        }
        int dims = 0;
        int saved = 0;
        for (int i = 0; i < chunks.size(); i++) {
            String chunk = chunks.get(i);
            float[] embedding = embeddingService.embedText(chunk);
            dims = embedding.length;

            RagDocumentChunk entity = new RagDocumentChunk();
            entity.setFileName(filename);
            entity.setMimeType(mimeType);
            entity.setChunkIndex(i);
            entity.setChunkText(chunk);
            entity.setEmbeddingJson(toJson(embedding));
            entity.setEmbeddingDims(embedding.length);
            repository.save(entity);
            saved++;
        }

        return Map.of(
                "fileName", filename,
                "chunksStored", saved,
                "embeddingDims", dims);
    }

    public String buildContextForPrompt(String query, int maxChunks) {
        if (!StringUtils.hasText(query)) {
            return "";
        }
        List<ScoredChunk> topChunks = retrieveSimilarChunks(query, maxChunks);
        if (topChunks.isEmpty()) {
            return "";
        }

        return topChunks.stream()
                .map(scored -> {
                    RagDocumentChunk chunk = scored.chunk();
                    String snippet = chunk.getChunkText();
                    if (snippet != null && snippet.length() > MAX_CHUNK_SIZE) {
                        snippet = snippet.substring(0, MAX_CHUNK_SIZE) + "...";
                    }
                    return "- Archivo: " + chunk.getFileName()
                            + " (fragmento " + chunk.getChunkIndex() + "): "
                            + snippet;
                })
                .collect(Collectors.joining("\n"));
    }

    private List<ScoredChunk> retrieveSimilarChunks(String query, int maxChunks) {
        float[] queryEmbedding = embeddingService.embedText(query);

        return repository.findAll().stream()
                .map(chunk -> {
                    float[] embedding = fromJson(chunk.getEmbeddingJson());
                    double similarity = cosineSimilarity(queryEmbedding, embedding);
                    return new ScoredChunk(chunk, similarity);
                })
                .filter(scored -> !Double.isNaN(scored.score()))
                .sorted(Comparator.comparingDouble(ScoredChunk::score).reversed())
                .limit(maxChunks)
                .collect(Collectors.toList());
    }

    private String extractText(MultipartFile file, String filename) throws IOException {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".docx")) {
            try (XWPFDocument document = new XWPFDocument(file.getInputStream());
                 XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
                return extractor.getText();
            }
        }
        if (!lower.endsWith(".txt") && !lower.endsWith(".md")) {
            throw new IllegalArgumentException("Solo se permiten archivos .txt, .md o .docx.");
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line).append("\n");
            }
            return builder.toString();
        }
    }

    private List<String> splitIntoChunks(String content) {
        List<String> chunks = new ArrayList<>();
        if (!StringUtils.hasText(content)) {
            return chunks;
        }

        int index = 0;
        while (index < content.length()) {
            int end = Math.min(index + MAX_CHUNK_SIZE, content.length());
            String chunk = content.substring(index, end).trim();
            if (StringUtils.hasText(chunk)) {
                chunks.add(chunk);
            }
            if (end == content.length()) {
                break;
            }
            index = end - CHUNK_OVERLAP;
            if (index < 0) {
                index = end;
            }
        }
        return chunks;
    }

    private String toJson(float[] vector) {
        try {
            return objectMapper.writeValueAsString(vector);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo serializar el embedding.", e);
        }
    }

    private float[] fromJson(String json) {
        if (!StringUtils.hasText(json)) {
            return new float[0];
        }
        try {
            return objectMapper.readValue(json, float[].class);
        } catch (JsonProcessingException e) {
            return new float[0];
        }
    }

    private double cosineSimilarity(float[] a, float[] b) {
        if (a.length == 0 || b.length == 0 || a.length != b.length) {
            return Double.NaN;
        }
        double dot = 0;
        double normA = 0;
        double normB = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA == 0 || normB == 0) {
            return Double.NaN;
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private static class ScoredChunk {
        private final RagDocumentChunk chunk;
        private final double score;

        ScoredChunk(RagDocumentChunk chunk, double score) {
            this.chunk = chunk;
            this.score = score;
        }

        RagDocumentChunk chunk() {
            return chunk;
        }

        double score() {
            return score;
        }
    }
}
