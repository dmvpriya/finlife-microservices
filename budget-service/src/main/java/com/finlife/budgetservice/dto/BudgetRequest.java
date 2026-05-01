package com.finlife.budgetservice.dto;

import com.finlife.budgetservice.entity.Budget;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BudgetRequest {

    @NotNull(message = "Category is required")
    private Budget.Category category;

    @NotNull(message = "Monthly limit is required")
    @Positive(message = "Monthly limit must be positive")
    private java.math.BigDecimal monthlyLimit;

    @NotNull(message = "Month is required")
    private Integer month;

    @NotNull(message = "Year is required")
    private Integer year;
}