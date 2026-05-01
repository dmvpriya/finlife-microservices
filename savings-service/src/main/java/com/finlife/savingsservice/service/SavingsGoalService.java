package com.finlife.savingsservice.service;

import com.finlife.savingsservice.dto.SavingsGoalRequest;
import com.finlife.savingsservice.dto.SavingsGoalResponse;
import com.finlife.savingsservice.entity.SavingsGoal;
import com.finlife.savingsservice.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    public SavingsGoalResponse createGoal(SavingsGoalRequest request,
                                          String userEmail) {
        SavingsGoal goal = SavingsGoal.builder()
                .userEmail(userEmail)
                .title(request.getTitle())
                .description(request.getDescription())
                .targetAmount(request.getTargetAmount())
                .targetDate(request.getTargetDate())
                .build();

        return SavingsGoalResponse.from(
                savingsGoalRepository.save(goal));
    }

    public List<SavingsGoalResponse> getAllGoals(String userEmail) {
        return savingsGoalRepository
                .findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(SavingsGoalResponse::from)
                .collect(Collectors.toList());
    }

    public SavingsGoalResponse addSavings(Long id,
                                          BigDecimal amount,
                                          String userEmail) {
        SavingsGoal goal = savingsGoalRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new RuntimeException("Goal not found!"));

        goal.setSavedAmount(
                goal.getSavedAmount().add(amount));

        if (goal.getSavedAmount()
                .compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(SavingsGoal.Status.COMPLETED);
        }

        return SavingsGoalResponse.from(
                savingsGoalRepository.save(goal));
    }

    public SavingsGoalResponse updateGoal(Long id,
                                          SavingsGoalRequest request,
                                          String userEmail) {
        SavingsGoal goal = savingsGoalRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new RuntimeException("Goal not found!"));

        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());

        return SavingsGoalResponse.from(
                savingsGoalRepository.save(goal));
    }

    public void deleteGoal(Long id, String userEmail) {
        SavingsGoal goal = savingsGoalRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new RuntimeException("Goal not found!"));
        savingsGoalRepository.delete(goal);
    }
}