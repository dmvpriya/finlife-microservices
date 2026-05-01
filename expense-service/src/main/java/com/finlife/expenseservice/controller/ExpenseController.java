package com.finlife.expenseservice.controller;

import com.finlife.expenseservice.dto.ExpenseRequest;
import com.finlife.expenseservice.dto.ExpenseResponse;
import com.finlife.expenseservice.service.ExpenseService;
import com.finlife.expenseservice.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final JwtUtil jwtUtil;

    private String extractEmail(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.extractEmail(token);
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(
            @Valid @RequestBody ExpenseRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                expenseService.addExpense(request, email));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                expenseService.getAllExpenses(email));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseResponse>> getByCategory(
            @PathVariable String category,
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                expenseService.getByCategory(email, category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        return ResponseEntity.ok(
                expenseService.updateExpense(id, request, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmail(authHeader);
        expenseService.deleteExpense(id, email);
        return ResponseEntity.ok("Expense deleted successfully!");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Expense Service is running!");
    }
}