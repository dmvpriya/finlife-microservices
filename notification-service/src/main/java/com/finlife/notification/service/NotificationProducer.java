package com.finlife.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finlife.notification.model.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper =
            new ObjectMapper();

    public void sendBudgetAlert(String userEmail,
                                String category, double utilization) {
        try {
            NotificationEvent event =
                    NotificationEvent.builder()
                            .type("BUDGET_ALERT")
                            .userEmail(userEmail)
                            .message(String.format(
                                    "⚠️ Budget Alert: %s category " +
                                            "is %.1f%% utilized!",
                                    category, utilization))
                            .severity(utilization >= 100
                                    ? "HIGH" : "MEDIUM")
                            .timestamp(java.time.LocalDateTime
                                    .now().toString())
                            .build();

            String json = objectMapper
                    .writeValueAsString(event);
            kafkaTemplate.send("budget-alerts", json);
            log.info("Budget alert sent for {}",
                    userEmail);
        } catch (Exception e) {
            log.error("Error sending budget alert", e);
        }
    }

    public void sendSavingsGoalAlert(String userEmail,
                                     String goalName, double progress) {
        try {
            NotificationEvent event =
                    NotificationEvent.builder()
                            .type("SAVINGS_GOAL")
                            .userEmail(userEmail)
                            .message(String.format(
                                    "🎯 Savings Goal: %s is %.1f%% complete!",
                                    goalName, progress))
                            .severity(progress >= 100
                                    ? "SUCCESS" : "INFO")
                            .timestamp(java.time.LocalDateTime
                                    .now().toString())
                            .build();

            String json = objectMapper
                    .writeValueAsString(event);
            kafkaTemplate.send("savings-goals", json);
            log.info("Savings goal alert sent for {}",
                    userEmail);
        } catch (Exception e) {
            log.error("Error sending savings alert", e);
        }
    }

    public void sendExpenseAlert(String userEmail,
                                 String title, double amount) {
        try {
            NotificationEvent event =
                    NotificationEvent.builder()
                            .type("EXPENSE_ADDED")
                            .userEmail(userEmail)
                            .message(String.format(
                                    "💸 New expense added: %s " +
                                            "- ₹%.2f", title, amount))
                            .severity("INFO")
                            .timestamp(java.time.LocalDateTime
                                    .now().toString())
                            .build();

            String json = objectMapper
                    .writeValueAsString(event);
            kafkaTemplate.send("expense-added", json);
        } catch (Exception e) {
            log.error("Error sending expense alert", e);
        }
    }

    public void sendInvestmentAlert(String userEmail,
                                    String symbol, double plPercent) {
        try {
            NotificationEvent event =
                    NotificationEvent.builder()
                            .type("INVESTMENT_ALERT")
                            .userEmail(userEmail)
                            .message(String.format(
                                    "📈 Investment Alert: %s is " +
                                            "%.1f%% %s!", symbol,
                                    Math.abs(plPercent),
                                    plPercent >= 0 ? "up" : "down"))
                            .severity(plPercent <= -10
                                    ? "HIGH" : "INFO")
                            .timestamp(java.time.LocalDateTime
                                    .now().toString())
                            .build();

            String json = objectMapper
                    .writeValueAsString(event);
            kafkaTemplate.send("investment-alerts", json);
        } catch (Exception e) {
            log.error("Error sending investment alert", e);
        }
    }
}