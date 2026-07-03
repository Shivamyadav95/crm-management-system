package com.example.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerDto {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String email;
    private String phone;
    private String company;
    private String address;
    private Long assignedSalesRepId;
    private String assignedSalesRepName;
    private String notes;
}
