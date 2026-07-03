package com.example.crm.controller;

import com.example.crm.dto.LeadDto;
import com.example.crm.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<Page<LeadDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(leadService.getAll(page, size));
    }

    @PostMapping
    public ResponseEntity<LeadDto> create(@Valid @RequestBody LeadDto dto) {
        return ResponseEntity.ok(leadService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadDto> update(@PathVariable Long id, @Valid @RequestBody LeadDto dto) {
        return ResponseEntity.ok(leadService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.ok("Lead deleted successfully");
    }
}
