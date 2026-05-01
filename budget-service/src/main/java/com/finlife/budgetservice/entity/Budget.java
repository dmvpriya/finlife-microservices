package com.finlife.budgetservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "monthly_limit", nullable = false,
            precision = 10, scale = 2)
    private BigDecimal monthlyLimit;

    @Column(name = "spent_amount", precision = 10, scale = 2)
    private BigDecimal spentAmount;

    @Column
    private Integer month;

    @Column
    private Integer year;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (spentAmount == null) {
            spentAmount = BigDecimal.ZERO;
        }
    }

    public enum Category {
        FOOD, TRAVEL, ENTERTAINMENT, SHOPPING,
        HEALTH, EDUCATION, UTILITIES, OTHER
    }
}