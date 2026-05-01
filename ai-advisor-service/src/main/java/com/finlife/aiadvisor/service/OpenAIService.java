package com.finlife.aiadvisor.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.model}")
    private String model;

    private final WebClient webClient = WebClient.builder()
            .codecs(configurer -> configurer
                    .defaultCodecs()
                    .maxInMemorySize(2 * 1024 * 1024))
            .build();

    public String getAdvice(String prompt) {
        try {
            List<Map<String, Object>> messages =
                    new ArrayList<>();

            Map<String, Object> systemMsg =
                    new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content",
                    "You are FinLife AI, a helpful " +
                            "personal finance advisor.");
            messages.add(systemMsg);

            Map<String, Object> userMsg =
                    new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", prompt);
            messages.add(userMsg);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("messages", messages);
            body.put("max_tokens", 500);

            String response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization",
                            "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError(),
                            clientResponse -> clientResponse
                                    .bodyToMono(String.class)
                                    .map(errorBody -> {
                                        System.out.println(
                                                "GROQ ERROR: " + errorBody);
                                        return new RuntimeException(
                                                "Groq error: " + errorBody);
                                    })
                    )
                    .bodyToMono(Map.class)
                    .map(resp -> {
                        List<Map> choices =
                                (List<Map>) resp.get("choices");
                        Map msg = (Map) choices
                                .get(0).get("message");
                        return (String) msg.get("content");
                    })
                    .block();

            return response;

        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}