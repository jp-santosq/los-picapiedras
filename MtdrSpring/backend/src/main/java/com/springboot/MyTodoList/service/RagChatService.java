package com.springboot.MyTodoList.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
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
public class RagChatService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final RagService ragService;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

    public RagChatService(
            RestTemplateBuilder restTemplateBuilder,
            ObjectMapper objectMapper,
            RagService ragService,
            @Value("${openai.api.key:}") String apiKey,
            @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}") String apiUrl,
            @Value("${openai.model:gpt-4o-mini}") String model) {
        this.restTemplate = restTemplateBuilder.build();
        this.objectMapper = objectMapper;
        this.ragService = ragService;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
    }

    public String chatWithContext(String question) {
        if (!StringUtils.hasText(apiKey)) {
            return "⚠️ No hay API key configurada para el chat.";
        }
        if (!StringUtils.hasText(question)) {
            return "Envía una pregunta para consultar el conocimiento cargado.";
        }

        try {
            String context = ragService.buildContextForPrompt(question, 4);
            Map<String, Object> payload = Map.of(
                    "model", model,
                    "temperature", 0.3,
                    "messages", List.of(
                            Map.of("role", "system",
                                    "content", "Eres un asistente de proyectos. Usa el contexto si está presente. Responde en español en 5-8 líneas máximo."),
                            Map.of("role", "user",
                                    "content", buildPrompt(context, question))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return "⚠️ No se pudo obtener respuesta del modelo.";
            }

            return extractAnswer(response.getBody());
        } catch (RestClientException e) {
            return "⚠️ Error al llamar al modelo: " + e.getMessage();
        } catch (IOException e) {
            return "⚠️ No se pudo procesar la respuesta del modelo.";
        }
    }

    private String buildPrompt(String context, String question) {
        String prefix = StringUtils.hasText(context)
                ? "Contexto disponible:\n" + context + "\n\n"
                : "Contexto: (no hay documentos cargados todavía)\n\n";
        return prefix + "Pregunta: " + question;
    }

    private String extractAnswer(String rawResponse) throws IOException {
        JsonNode root = objectMapper.readTree(rawResponse);
        JsonNode choices = root.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            return "⚠️ El modelo no devolvió contenido.";
        }
        JsonNode contentNode = choices.get(0).path("message").path("content");
        if (contentNode.isMissingNode()) {
            return "⚠️ El modelo devolvió un mensaje vacío.";
        }
        return contentNode.asText().trim();
    }
}
