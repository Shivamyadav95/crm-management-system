package com.example.crm.dto;

import com.example.crm.model.LeadSource;
import com.example.crm.model.LeadStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LeadDto {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String contactInfo;
    private LeadSource source;
    private LeadStatus status;
    private Long assignedSalesRepId;
    private String assignedSalesRepName;
}
