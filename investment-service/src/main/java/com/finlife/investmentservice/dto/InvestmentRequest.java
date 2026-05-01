package com.finlife.investmentservice.dto;

import com.finlife.investmentservice.entity.Investment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InvestmentRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotNull(message = "Type is required")
    private Investment.Type type;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;

    @NotNull(message = "Buy price is required")
    @Positive(message = "Buy price must be positive")
    private BigDecimal buyPrice;

    private BigDecimal currentPrice;
    private LocalDate buyDate;
}