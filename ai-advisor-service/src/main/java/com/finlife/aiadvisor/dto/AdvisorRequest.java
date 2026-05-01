package com.finlife.aiadvisor.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class AdvisorRequest {

    @NotBlank(message = "Question is required")
    private String question;

    private FinancialContext context;
}