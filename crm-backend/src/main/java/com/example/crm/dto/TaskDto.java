package com.example.crm.dto;

import com.example.crm.model.TaskPriority;
import com.example.crm.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private LocalDate dueDate;
    private TaskPriority priority;
    private Long assignedToId;
    private String assignedToName;
    private TaskStatus status;
}
