package com.example.crm.dto;

import com.example.crm.model.SaleStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SaleDto {
    private Long id;

    @NotNull(message = "Customer id is required")
    private Long customerId;

    private String customerName;
    private Double amount;
    private SaleStatus status;
    private LocalDate date;
    private Long assignedSalesRepId;
    private String assignedSalesRepName;
}
