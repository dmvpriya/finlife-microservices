package com.finlife.budgetservice.controller;

import com.finlife.budgetservice.dto.BudgetRequest;
import com.finlife.budgetservice.dto.BudgetResponse;
import com.finlife.budgetservice.service.BudgetService;
import com.finlife.budgetservice.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final JwtUtil jwtUtil;

    private String extractEmail(String authHeader) {
        return jwtUtil.extractEmail(authHeader.substring(7));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> setBudget(
            @Valid @RequestBody BudgetRequest request,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                budgetService.setBudget(request,
                        extractEmail(authHeader)));
    }

    @GetMapping("/month")
    public ResponseEntity<List<BudgetResponse>> getBudgetsByMonth(
            @RequestParam Integer month,
            @RequestParam Integer year,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                budgetService.getBudgetsByMonth(
                        extractEmail(authHeader), month, year));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAllBudgets(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                budgetService.getAllBudgets(
                        extractEmail(authHeader)));
    }

    @PutMapping("/{id}/spent")
    public ResponseEntity<BudgetResponse> updateSpent(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(
                budgetService.updateSpentAmount(id, amount,
                        extractEmail(authHeader)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBudget(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        budgetService.deleteBudget(id,
                extractEmail(authHeader));
        return ResponseEntity.ok(
                "Budget deleted successfully!");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "Budget Service is running!");
    }
}