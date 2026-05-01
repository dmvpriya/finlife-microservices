package com.finlife.investmentservice.dto;

import com.finlife.investmentservice.entity.Investment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentResponse {

    private Long id;
    private String userEmail;
    private String name;
    private String symbol;
    private Investment.Type type;
    private BigDecimal quantity;
    private BigDecimal buyPrice;
    private BigDecimal currentPrice;
    private BigDecimal investedAmount;
    private BigDecimal currentValue;
    private BigDecimal profitLoss;
    private Double profitLossPercentage;
    private String performance;
    private LocalDate buyDate;
    private LocalDateTime createdAt;

    public static InvestmentResponse from(Investment inv) {
        BigDecimal invested = inv.getBuyPrice()
                .multiply(inv.getQuantity());
        BigDecimal current = inv.getCurrentPrice()
                .multiply(inv.getQuantity());
        BigDecimal pl = current.subtract(invested);

        double plPercent = pl
                .divide(invested, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();

        String performance = plPercent >= 0 ? "PROFIT" : "LOSS";

        return InvestmentResponse.builder()
                .id(inv.getId())
                .userEmail(inv.getUserEmail())
                .name(inv.getName())
                .symbol(inv.getSymbol())
                .type(inv.getType())
                .quantity(inv.getQuantity())
                .buyPrice(inv.getBuyPrice())
                .currentPrice(inv.getCurrentPrice())
                .investedAmount(invested)
                .currentValue(current)
                .profitLoss(pl)
                .profitLossPercentage(plPercent)
                .performance(performance)
                .buyDate(inv.getBuyDate())
                .createdAt(inv.getCreatedAt())
                .build();
    }
}