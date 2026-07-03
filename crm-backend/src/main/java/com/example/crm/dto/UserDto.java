package com.example.crm.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private LocalDateTime createdAt;
}
