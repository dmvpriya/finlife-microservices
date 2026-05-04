package com.finlife.notification.controller;

import com.finlife.notification.service.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationProducer producer;

    @PostMapping("/budget-alert")
    public ResponseEntity<String> sendBudgetAlert(
            @RequestParam String userEmail,
            @RequestParam String category,
            @RequestParam double utilization) {
        producer.sendBudgetAlert(
                userEmail, category, utilization);
        return ResponseEntity.ok(
                "Budget alert sent!");
    }

    @PostMapping("/savings-alert")
    public ResponseEntity<String> sendSavingsAlert(
            @RequestParam String userEmail,
            @RequestParam String goalName,
            @RequestParam double progress) {
        producer.sendSavingsGoalAlert(
                userEmail, goalName, progress);
        return ResponseEntity.ok(
                "Savings alert sent!");
    }

    @PostMapping("/expense-alert")
    public ResponseEntity<String> sendExpenseAlert(
            @RequestParam String userEmail,
            @RequestParam String title,
            @RequestParam double amount) {
        producer.sendExpenseAlert(
                userEmail, title, amount);
        return ResponseEntity.ok(
                "Expense alert sent!");
    }

    @PostMapping("/investment-alert")
    public ResponseEntity<String> sendInvestmentAlert(
            @RequestParam String userEmail,
            @RequestParam String symbol,
            @RequestParam double plPercent) {
        producer.sendInvestmentAlert(
                userEmail, symbol, plPercent);
        return ResponseEntity.ok(
                "Investment alert sent!");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
                "Notification Service is running! " +
                        "Kafka connected ✅");
    }
}