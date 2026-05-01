package com.finlife.budgetservice.service;

import com.finlife.budgetservice.dto.BudgetRequest;
import com.finlife.budgetservice.dto.BudgetResponse;
import com.finlife.budgetservice.entity.Budget;
import com.finlife.budgetservice.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetResponse setBudget(BudgetRequest request,
                                    String userEmail) {
        var existing = budgetRepository
                .findByUserEmailAndCategoryAndMonthAndYear(
                        userEmail, request.getCategory(),
                        request.getMonth(), request.getYear());

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setMonthlyLimit(request.getMonthlyLimit());
        } else {
            budget = Budget.builder()
                    .userEmail(userEmail)
                    .category(request.getCategory())
                    .monthlyLimit(request.getMonthlyLimit())
                    .month(request.getMonth())
                    .year(request.getYear())
                    .build();
        }

        return BudgetResponse.from(
                budgetRepository.save(budget));
    }

    public List<BudgetResponse> getBudgetsByMonth(
            String userEmail, Integer month, Integer year) {
        return budgetRepository
                .findByUserEmailAndMonthAndYear(
                        userEmail, month, year)
                .stream()
                .map(BudgetResponse::from)
                .collect(Collectors.toList());
    }

    public List<BudgetResponse> getAllBudgets(
            String userEmail) {
        return budgetRepository
                .findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(BudgetResponse::from)
                .collect(Collectors.toList());
    }

    public BudgetResponse updateSpentAmount(Long id,
                                            BigDecimal amount,
                                            String userEmail) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Budget not found!"));

        if (!budget.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized!");
        }

        budget.setSpentAmount(
                budget.getSpentAmount().add(amount));

        return BudgetResponse.from(
                budgetRepository.save(budget));
    }

    public void deleteBudget(Long id, String userEmail) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Budget not found!"));

        if (!budget.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized!");
        }

        budgetRepository.delete(budget);
    }
}