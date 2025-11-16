package com.springboot.MyTodoList.service;

import java.io.IOException;
import java.util.HashMap;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.MyTodoList.dto.TareaDTO;

@Service
public class SprintPlanningService {

    private static final String JSON_FORMAT_INSTRUCTIONS = String.join("\n",
            "Devuelve únicamente un JSON válido con el siguiente formato exacto:",
            "{",
            "  \"tareas\": [",
            "    {",
            "      \"titulo\": \"string corto\",",
            "      \"descripcion\": \"detalle de lo que se debe hacer\",",
            "      \"prioridad\": numero entero entre 1 y 5,",
            "      \"fechaInicio\": \"YYYY-MM-DD\",",
            "      \"fechaFinEstimada\": \"YYYY-MM-DD\",",
            "      \"fechaFinReal\": null,",
            "      \"estadoTareaId\": null,",
            "      \"proyectoId\": null,",
            "      \"sprintId\": null,",
            "      \"desarrolladorId\": null,",
            "      \"historiaUsuarioId\": null",
            "    }",
            "  ]",
            "}",
            "Si no tienes información cierta sobre una fecha, deja el campo en null."
    );

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

    public SprintPlanningService(
            RestTemplateBuilder restTemplateBuilder,
            ObjectMapper objectMapper,
            @Value("${openai.api.key:}") String apiKey,
            @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}") String apiUrl,
            @Value("${openai.model:gpt-4o-mini}") String model) {
        this.restTemplate = restTemplateBuilder.build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
    }

    public List<TareaDTO> generarTareas(String descripcionSprint) {
        if (!StringUtils.hasText(apiKey)) {
            throw new IllegalStateException("La llave de OpenAI (openai.api.key) no está configurada.");
        }
        if (!StringUtils.hasText(descripcionSprint)) {
            throw new IllegalArgumentException("La descripción del sprint es obligatoria.");
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", model);
            payload.put("temperature", 0.2);
            payload.put("messages", buildMessages(descripcionSprint));
            payload.put("response_format", Map.of("type", "json_object"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new IllegalStateException("No se pudo obtener una respuesta del modelo de lenguaje.");
            }

            return parseTareasFromResponse(response.getBody());
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo procesar la respuesta del modelo de lenguaje.", e);
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo leer la respuesta del modelo de lenguaje.", e);
        } catch (RestClientException e) {
            throw new IllegalStateException("Ocurrió un error al invocar el modelo de lenguaje.", e);
        }
    }

    private List<Map<String, String>> buildMessages(String descripcionSprint) {
        String userPrompt = descripcionSprint + "\n\n" + JSON_FORMAT_INSTRUCTIONS;
        return List.of(
                Map.of(
                        "role", "system",
                        "content", "Eres un project manager senior que desglosa requisitos en tareas técnicas para un equipo de desarrollo. Responde únicamente en JSON."),
                Map.of(
                        "role", "user",
                        "content", userPrompt));
    }

    private List<TareaDTO> parseTareasFromResponse(String rawResponse) throws IOException {
        JsonNode root = objectMapper.readTree(rawResponse);
        JsonNode choices = root.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            throw new IllegalStateException("La respuesta del modelo no contiene propuestas de tareas.");
        }

        JsonNode contentNode = choices.get(0).path("message").path("content");
        if (contentNode.isMissingNode()) {
            throw new IllegalStateException("El mensaje del modelo llegó vacío.");
        }

        JsonNode tareasNode = objectMapper.readTree(contentNode.asText()).path("tareas");
        if (tareasNode.isMissingNode()) {
            throw new IllegalStateException("El modelo no devolvió la lista de tareas solicitada.");
        }

        return objectMapper.readerFor(new TypeReference<List<TareaDTO>>() {}).readValue(tareasNode);
    }
}
