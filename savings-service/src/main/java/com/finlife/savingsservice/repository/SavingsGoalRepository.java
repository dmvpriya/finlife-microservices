package com.finlife.savingsservice.repository;

import com.finlife.savingsservice.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsGoalRepository
        extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findByUserEmailOrderByCreatedAtDesc(
            String userEmail);

    List<SavingsGoal> findByUserEmailAndStatus(
            String userEmail, SavingsGoal.Status status);

    Optional<SavingsGoal> findByIdAndUserEmail(
            Long id, String userEmail);
}