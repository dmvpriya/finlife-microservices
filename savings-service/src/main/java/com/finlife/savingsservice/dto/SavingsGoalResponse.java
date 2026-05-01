package com.finlife.savingsservice.dto;

import com.finlife.savingsservice.entity.SavingsGoal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavingsGoalResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal targetAmount;
    private BigDecimal savedAmount;
    private BigDecimal remainingAmount;
    private Double progressPercentage;
    private BigDecimal monthlySavingsNeeded;
    private LocalDate targetDate;
    private SavingsGoal.Status status;
    private LocalDateTime createdAt;
    private String userEmail;

    public static SavingsGoalResponse from(SavingsGoal goal) {
        BigDecimal remaining = goal.getTargetAmount()
                .subtract(goal.getSavedAmount());

        double progress = goal.getSavedAmount()
                .divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();

        BigDecimal monthly = BigDecimal.ZERO;
        if (goal.getTargetDate() != null
                && goal.getTargetDate().isAfter(LocalDate.now())) {
            long months = ChronoUnit.MONTHS.between(
                    LocalDate.now(), goal.getTargetDate());
            if (months > 0) {
                monthly = remaining.divide(
                        BigDecimal.valueOf(months), 2,
                        RoundingMode.CEILING);
            }
        }

        return SavingsGoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .targetAmount(goal.getTargetAmount())
                .savedAmount(goal.getSavedAmount())
                .remainingAmount(remaining)
                .progressPercentage(progress)
                .monthlySavingsNeeded(monthly)
                .targetDate(goal.getTargetDate())
                .status(goal.getStatus())
                .createdAt(goal.getCreatedAt())
                .userEmail(goal.getUserEmail())
                .build();
    }
}