package com.finlife.expenseservice.service;

import com.finlife.expenseservice.dto.ExpenseRequest;
import com.finlife.expenseservice.dto.ExpenseResponse;
import com.finlife.expenseservice.entity.Expense;
import com.finlife.expenseservice.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseResponse addExpense(ExpenseRequest request,
                                      String userEmail) {
        Expense expense = Expense.builder()
                .userEmail(userEmail)
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .category(request.getCategory())
                .expenseDate(request.getExpenseDate())
                .build();

        Expense saved = expenseRepository.save(expense);
        return mapToResponse(saved);
    }

    public List<ExpenseResponse> getAllExpenses(String userEmail) {
        return expenseRepository
                .findByUserEmailOrderByExpenseDateDesc(userEmail)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponse> getByCategory(String userEmail,
                                               String category) {
        Expense.Category cat = Expense.Category.valueOf(
                category.toUpperCase());
        return expenseRepository
                .findByUserEmailAndCategory(userEmail, cat)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse updateExpense(Long id,
                                         ExpenseRequest request,
                                         String userEmail) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found!"));

        if (!expense.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized!");
        }

        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());

        return mapToResponse(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id, String userEmail) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Expense not found!"));

        if (!expense.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized!");
        }

        expenseRepository.delete(expense);
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .expenseDate(expense.getExpenseDate())
                .createdAt(expense.getCreatedAt())
                .userEmail(expense.getUserEmail())
                .build();
    }
}