package com.example.crm.controller;

import com.example.crm.dto.SaleDto;
import com.example.crm.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @GetMapping
    public ResponseEntity<Page<SaleDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(saleService.getAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getById(id));
    }

    @PostMapping
    public ResponseEntity<SaleDto> create(@Valid @RequestBody SaleDto dto) {
        return ResponseEntity.ok(saleService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaleDto> update(@PathVariable Long id,
                                          @Valid @RequestBody SaleDto dto) {
        return ResponseEntity.ok(saleService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        saleService.delete(id);
        return ResponseEntity.ok("Sale deleted successfully");
    }
}