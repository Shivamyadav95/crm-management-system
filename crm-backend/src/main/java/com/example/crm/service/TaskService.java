package com.example.crm.service;

import com.example.crm.dto.TaskDto;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.model.Task;
import com.example.crm.model.TaskStatus;
import com.example.crm.model.User;
import com.example.crm.repository.TaskRepository;
import com.example.crm.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service

public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    public TaskService(TaskRepository taskRepository , UserRepository userRepository){
        this.taskRepository=taskRepository;
        this.userRepository=userRepository;
    }

    public TaskDto create(TaskDto dto) {
        Task task = new Task();
        mapDtoToEntity(dto, task);
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.OPEN);
        }
        return toDto(taskRepository.save(task));
    }

    public Page<TaskDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return taskRepository.findAll(pageable)
                .map(this::toDto);
    }

    public TaskDto update(Long id, TaskDto dto) {
        Task task = findEntity(id);
        mapDtoToEntity(dto, task);
        return toDto(taskRepository.save(task));
    }

    public void delete(Long id) {
        taskRepository.delete(findEntity(id));
    }

    private Task findEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private void mapDtoToEntity(TaskDto dto, Task task) {
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        task.setPriority(dto.getPriority());
        if (dto.getStatus() != null) {
            task.setStatus(dto.getStatus());
        }

        if (dto.getAssignedToId() != null) {
            User user = userRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User not found with id: " + dto.getAssignedToId()));
            task.setAssignedTo(user);
        } else {
            task.setAssignedTo(null);
        }
    }

    private TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        if (task.getAssignedTo() != null) {
            dto.setAssignedToId(task.getAssignedTo().getId());
            dto.setAssignedToName(task.getAssignedTo().getFullName());
        }
        return dto;
    }
}
