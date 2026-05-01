package com.finlife.aiadvisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdvisorResponse {

    private String advice;
    private String question;
    private String userEmail;
    private String timestamp;
}