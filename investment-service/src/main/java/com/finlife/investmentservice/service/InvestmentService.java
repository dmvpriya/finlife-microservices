package com.finlife.investmentservice.service;

import com.finlife.investmentservice.dto.InvestmentRequest;
import com.finlife.investmentservice.dto.InvestmentResponse;
import com.finlife.investmentservice.entity.Investment;
import com.finlife.investmentservice.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;

    public InvestmentResponse addInvestment(
            InvestmentRequest request, String userEmail) {
        Investment investment = Investment.builder()
                .userEmail(userEmail)
                .name(request.getName())
                .symbol(request.getSymbol())
                .type(request.getType())
                .quantity(request.getQuantity())
                .buyPrice(request.getBuyPrice())
                .currentPrice(request.getCurrentPrice() != null
                        ? request.getCurrentPrice()
                        : request.getBuyPrice())
                .buyDate(request.getBuyDate())
                .build();

        return InvestmentResponse.from(
                investmentRepository.save(investment));
    }

    public List<InvestmentResponse> getAllInvestments(
            String userEmail) {
        return investmentRepository
                .findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(InvestmentResponse::from)
                .collect(Collectors.toList());
    }

    public InvestmentResponse updateCurrentPrice(
            Long id, BigDecimal currentPrice,
            String userEmail) {
        Investment investment = investmentRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new RuntimeException("Investment not found!"));

        investment.setCurrentPrice(currentPrice);
        return InvestmentResponse.from(
                investmentRepository.save(investment));
    }

    public InvestmentResponse getPortfolioSummary(
            String userEmail) {
        List<Investment> investments = investmentRepository
                .findByUserEmailOrderByCreatedAtDesc(userEmail);

        BigDecimal totalInvested = investments.stream()
                .map(i -> i.getBuyPrice()
                        .multiply(i.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCurrent = investments.stream()
                .map(i -> i.getCurrentPrice()
                        .multiply(i.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPL = totalCurrent
                .subtract(totalInvested);

        return InvestmentResponse.builder()
                .userEmail(userEmail)
                .investedAmount(totalInvested)
                .currentValue(totalCurrent)
                .profitLoss(totalPL)
                .performance(totalPL.compareTo(
                        BigDecimal.ZERO) >= 0
                        ? "PROFIT" : "LOSS")
                .build();
    }

    public void deleteInvestment(Long id, String userEmail) {
        Investment investment = investmentRepository
                .findByIdAndUserEmail(id, userEmail)
                .orElseThrow(() ->
                        new RuntimeException("Investment not found!"));
        investmentRepository.delete(investment);
    }
}