package com.finlife.aiadvisor.service;

import com.finlife.aiadvisor.dto.AdvisorRequest;
import com.finlife.aiadvisor.dto.AdvisorResponse;
import com.finlife.aiadvisor.dto.FinancialContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdvisorService {

    private final OpenAIService openAIService;

    public AdvisorResponse getAdvice(AdvisorRequest request,
                                     String userEmail) {
        String prompt = buildPrompt(request);
        String advice = openAIService.getAdvice(prompt);

        return AdvisorResponse.builder()
                .advice(advice)
                .question(request.getQuestion())
                .userEmail(userEmail)
                .timestamp(LocalDateTime.now().toString())
                .build();
    }

    private String buildPrompt(AdvisorRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("User Question: ")
                .append(request.getQuestion())
                .append("\n\n");

        FinancialContext ctx = request.getContext();
        if (ctx != null) {
            prompt.append("User's Financial Context:\n");

            if (ctx.getMonthlyIncome() != null) {
                prompt.append("- Monthly Income: ₹")
                        .append(ctx.getMonthlyIncome())
                        .append("\n");
            }
            if (ctx.getTotalExpenses() != null) {
                prompt.append("- Total Expenses This Month: ₹")
                        .append(ctx.getTotalExpenses())
                        .append("\n");
            }
            if (ctx.getTotalSavings() != null) {
                prompt.append("- Total Savings: ₹")
                        .append(ctx.getTotalSavings())
                        .append("\n");
            }
            if (ctx.getTotalInvestments() != null) {
                prompt.append("- Total Investments: ₹")
                        .append(ctx.getTotalInvestments())
                        .append("\n");
            }
            if (ctx.getTotalProfitLoss() != null) {
                prompt.append("- Investment P&L: ₹")
                        .append(ctx.getTotalProfitLoss())
                        .append("\n");
            }
            if (ctx.getTopSpendingCategory() != null) {
                prompt.append("- Top Spending Category: ")
                        .append(ctx.getTopSpendingCategory())
                        .append("\n");
            }
            if (ctx.getSavingsGoal() != null) {
                prompt.append("- Savings Goal: ")
                        .append(ctx.getSavingsGoal())
                        .append(" (Target: ₹")
                        .append(ctx.getSavingsGoalTarget())
                        .append(", Progress: ₹")
                        .append(ctx.getSavingsGoalProgress())
                        .append(")\n");
            }
        }

        prompt.append("\nPlease provide personalized financial "
                + "advice based on this context.");

        return prompt.toString();
    }
}