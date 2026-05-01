package com.finlife.aiadvisor.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FinancialContext {

    private BigDecimal monthlyIncome;
    private BigDecimal totalExpenses;
    private BigDecimal totalSavings;
    private BigDecimal totalInvestments;
    private BigDecimal totalProfitLoss;
    private String topSpendingCategory;
    private BigDecimal budgetUtilization;
    private String savingsGoal;
    private BigDecimal savingsGoalTarget;
    private BigDecimal savingsGoalProgress;
}