package com.finlife.expenseservice.dto;

import com.finlife.expenseservice.entity.Expense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private Expense.Category category;
    private LocalDate expenseDate;
    private LocalDateTime createdAt;
    private String userEmail;
}