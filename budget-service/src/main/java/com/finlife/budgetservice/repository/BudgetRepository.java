package com.finlife.budgetservice.repository;

import com.finlife.budgetservice.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    List<Budget> findByUserEmailAndMonthAndYear(
            String userEmail, Integer month, Integer year);

    Optional<Budget> findByUserEmailAndCategoryAndMonthAndYear(
            String userEmail, Budget.Category category,
            Integer month, Integer year);

    List<Budget> findByUserEmailOrderByCreatedAtDesc(
            String userEmail);
}