package com.finlife.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finlife.notification.model.NotificationEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationConsumer {

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    @KafkaListener(topics = "budget-alerts",
            groupId = "finlife-notifications")
    public void consumeBudgetAlert(String message) {
        try {
            NotificationEvent event = objectMapper
                    .readValue(message,
                            NotificationEvent.class);
            log.info("🔔 BUDGET ALERT received: {} - {}",
                    event.getUserEmail(),
                    event.getMessage());
            processNotification(event);
        } catch (Exception e) {
            log.error("Error consuming budget alert", e);
        }
    }

    @KafkaListener(topics = "savings-goals",
            groupId = "finlife-notifications")
    public void consumeSavingsGoal(String message) {
        try {
            NotificationEvent event = objectMapper
                    .readValue(message,
                            NotificationEvent.class);
            log.info("🔔 SAVINGS GOAL received: {} - {}",
                    event.getUserEmail(),
                    event.getMessage());
            processNotification(event);
        } catch (Exception e) {
            log.error("Error consuming savings alert", e);
        }
    }

    @KafkaListener(topics = "expense-added",
            groupId = "finlife-notifications")
    public void consumeExpenseAdded(String message) {
        try {
            NotificationEvent event = objectMapper
                    .readValue(message,
                            NotificationEvent.class);
            log.info("🔔 EXPENSE ADDED received: {} - {}",
                    event.getUserEmail(),
                    event.getMessage());
            processNotification(event);
        } catch (Exception e) {
            log.error("Error consuming expense alert", e);
        }
    }

    @KafkaListener(topics = "investment-alerts",
            groupId = "finlife-notifications")
    public void consumeInvestmentAlert(String message) {
        try {
            NotificationEvent event = objectMapper
                    .readValue(message,
                            NotificationEvent.class);
            log.info("🔔 INVESTMENT ALERT received: {} - {}",
                    event.getUserEmail(),
                    event.getMessage());
            processNotification(event);
        } catch (Exception e) {
            log.error("Error consuming investment alert", e);
        }
    }

    private void processNotification(
            NotificationEvent event) {
        log.info("Processing notification: Type={} " +
                        "Severity={} Message={}",
                event.getType(),
                event.getSeverity(),
                event.getMessage());
    }
}