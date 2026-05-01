package com.finlife.aiadvisor.controller;

import com.finlife.aiadvisor.dto.AdvisorRequest;
import com.finlife.aiadvisor.dto.AdvisorResponse;
import com.finlife.aiadvisor.service.AdvisorService;
import com.finlife.aiadvisor.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/advisor")
@RequiredArgsConstructor
public class AdvisorController {

    private final AdvisorService advisorService;
    private final JwtUtil jwtUtil;

    private String extractEmail(String authHeader) {
        return jwtUtil.extractEmail(authHeader.substring(7));
    }

    @PostMapping("/ask")
    public ResponseEntity<AdvisorResponse> askAdvisor(
            @Valid @RequestBody AdvisorRequest request,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                advisorService.getAdvice(request,
                        extractEmail(authHeader)));
    }

    @PostMapping("/budget-tip")
    public ResponseEntity<AdvisorResponse> getBudgetTip(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        AdvisorRequest request = new AdvisorRequest();
        request.setQuestion(
                "Give me 3 quick tips to reduce my " +
                        "monthly expenses and save more money.");
        return ResponseEntity.ok(
                advisorService.getAdvice(request, email));
    }

    @PostMapping("/investment-tip")
    public ResponseEntity<AdvisorResponse> getInvestmentTip(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        AdvisorRequest request = new AdvisorRequest();
        request.setQuestion(
                "What are the best investment options " +
                        "for a young professional in India " +
                        "looking for long term wealth creation?");
        return ResponseEntity.ok(
                advisorService.getAdvice(request, email));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "AI Advisor Service is running!");
    }
}