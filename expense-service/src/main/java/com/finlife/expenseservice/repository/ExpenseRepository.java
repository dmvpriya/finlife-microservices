package com.finlife.expenseservice.repository;

import com.finlife.expenseservice.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserEmailOrderByExpenseDateDesc(String userEmail);

    List<Expense> findByUserEmailAndCategory(String userEmail,
                                             Expense.Category category);

    List<Expense> findByUserEmailAndExpenseDateBetween(String userEmail,
                                                       LocalDate start,
                                                       LocalDate end);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userEmail = :email " +
            "AND MONTH(e.expenseDate) = :month AND YEAR(e.expenseDate) = :year")
    BigDecimal getTotalByEmailAndMonth(String email, int month, int year);
}