package com.finlife.savingsservice.controller;

import com.finlife.savingsservice.dto.SavingsGoalRequest;
import com.finlife.savingsservice.dto.SavingsGoalResponse;
import com.finlife.savingsservice.service.SavingsGoalService;
import com.finlife.savingsservice.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/savings")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;
    private final JwtUtil jwtUtil;

    private String extractEmail(String authHeader) {
        return jwtUtil.extractEmail(authHeader.substring(7));
    }

    @PostMapping
    public ResponseEntity<SavingsGoalResponse> createGoal(
            @Valid @RequestBody SavingsGoalRequest request,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                savingsGoalService.createGoal(request,
                        extractEmail(authHeader)));
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoalResponse>> getAllGoals(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                savingsGoalService.getAllGoals(
                        extractEmail(authHeader)));
    }

    @PutMapping("/{id}/add-savings")
    public ResponseEntity<SavingsGoalResponse> addSavings(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                savingsGoalService.addSavings(id, amount,
                        extractEmail(authHeader)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoalResponse> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody SavingsGoalRequest request,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                savingsGoalService.updateGoal(id, request,
                        extractEmail(authHeader)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGoal(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        savingsGoalService.deleteGoal(id,
                extractEmail(authHeader));
        return ResponseEntity.ok(
                "Savings goal deleted successfully!");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "Savings Service is running!");
    }
}