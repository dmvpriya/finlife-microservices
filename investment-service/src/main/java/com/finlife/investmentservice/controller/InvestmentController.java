package com.finlife.investmentservice.controller;

import com.finlife.investmentservice.dto.InvestmentRequest;
import com.finlife.investmentservice.dto.InvestmentResponse;
import com.finlife.investmentservice.service.InvestmentService;
import com.finlife.investmentservice.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;
    private final JwtUtil jwtUtil;

    private String extractEmail(String authHeader) {
        return jwtUtil.extractEmail(authHeader.substring(7));
    }

    @PostMapping
    public ResponseEntity<InvestmentResponse> addInvestment(
            @Valid @RequestBody InvestmentRequest request,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                investmentService.addInvestment(request,
                        extractEmail(authHeader)));
    }

    @GetMapping
    public ResponseEntity<List<InvestmentResponse>> getAll(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                investmentService.getAllInvestments(
                        extractEmail(authHeader)));
    }

    @GetMapping("/summary")
    public ResponseEntity<InvestmentResponse> getSummary(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                investmentService.getPortfolioSummary(
                        extractEmail(authHeader)));
    }

    @PutMapping("/{id}/price")
    public ResponseEntity<InvestmentResponse> updatePrice(
            @PathVariable Long id,
            @RequestParam BigDecimal currentPrice,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                investmentService.updateCurrentPrice(
                        id, currentPrice,
                        extractEmail(authHeader)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInvestment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        investmentService.deleteInvestment(id,
                extractEmail(authHeader));
        return ResponseEntity.ok(
                "Investment deleted successfully!");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "Investment Service is running!");
    }
}