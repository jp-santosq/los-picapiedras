package com.springboot.MyTodoList.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class EmbeddingService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String embeddingModel;
    private final String embeddingUrl;

    public EmbeddingService(
            RestTemplateBuilder restTemplateBuilder,
            ObjectMapper objectMapper,
            @Value("${openai.api.key:}") String apiKey,
            @Value("${openai.embedding.model:text-embedding-3-small}") String embeddingModel,
            @Value("${openai.embedding.url:https://api.openai.com/v1/embeddings}") String embeddingUrl) {
        this.restTemplate = restTemplateBuilder.build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.embeddingModel = embeddingModel;
        this.embeddingUrl = embeddingUrl;
    }

    public float[] embedText(String text) {
        if (!StringUtils.hasText(apiKey)) {
            throw new IllegalStateException("La llave de OpenAI (openai.api.key) no está configurada.");
        }
        if (!StringUtils.hasText(text)) {
            throw new IllegalArgumentException("El texto para generar embeddings no puede estar vacío.");
        }

        try {
            Map<String, Object> payload = Map.of(
                    "model", embeddingModel,
                    "input", text);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    embeddingUrl, new HttpEntity<>(payload, headers), String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new IllegalStateException("No se pudo obtener una respuesta del servicio de embeddings.");
            }

            return parseEmbedding(response.getBody());
        } catch (RestClientException e) {
            throw new IllegalStateException("Error al invocar el servicio de embeddings.", e);
        } catch (IOException e) {
            throw new IllegalStateException("Error al procesar la respuesta del servicio de embeddings.", e);
        }
    }

    private float[] parseEmbedding(String rawResponse) throws IOException {
        JsonNode root = objectMapper.readTree(rawResponse);
        JsonNode data = root.path("data");
        if (!data.isArray() || data.isEmpty()) {
            throw new IllegalStateException("La respuesta de embeddings no contiene datos.");
        }
        JsonNode embeddingNode = data.get(0).path("embedding");
        if (!embeddingNode.isArray()) {
            throw new IllegalStateException("El vector de embeddings llegó vacío.");
        }
        float[] result = new float[embeddingNode.size()];
        for (int i = 0; i < embeddingNode.size(); i++) {
            result[i] = (float) embeddingNode.get(i).asDouble();
        }
        return result;
    }
}
