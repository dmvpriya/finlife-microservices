package com.finlife.investmentservice.repository;

import com.finlife.investmentservice.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentRepository
        extends JpaRepository<Investment, Long> {

    List<Investment> findByUserEmailOrderByCreatedAtDesc(
            String userEmail);

    List<Investment> findByUserEmailAndType(
            String userEmail, Investment.Type type);

    Optional<Investment> findByIdAndUserEmail(
            Long id, String userEmail);
}