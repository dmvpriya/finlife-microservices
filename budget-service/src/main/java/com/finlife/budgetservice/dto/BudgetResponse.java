package com.finlife.budgetservice.dto;

import com.finlife.budgetservice.entity.Budget;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {

    private Long id;
    private String userEmail;
    private Budget.Category category;
    private BigDecimal monthlyLimit;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private Double utilizationPercentage;
    private String alertStatus;
    private Integer month;
    private Integer year;

    public static BudgetResponse from(Budget budget) {
        BigDecimal remaining = budget.getMonthlyLimit()
                .subtract(budget.getSpentAmount());

        double utilization = budget.getSpentAmount()
                .divide(budget.getMonthlyLimit(), 4,
                        RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();

        String alert = "SAFE";
        if (utilization >= 100) {
            alert = "EXCEEDED";
        } else if (utilization >= 80) {
            alert = "WARNING";
        } else if (utilization >= 50) {
            alert = "MODERATE";
        }

        return BudgetResponse.builder()
                .id(budget.getId())
                .userEmail(budget.getUserEmail())
                .category(budget.getCategory())
                .monthlyLimit(budget.getMonthlyLimit())
                .spentAmount(budget.getSpentAmount())
                .remainingAmount(remaining)
                .utilizationPercentage(utilization)
                .alertStatus(alert)
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}