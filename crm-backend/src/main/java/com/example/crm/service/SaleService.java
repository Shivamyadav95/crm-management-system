package com.example.crm.service;

import com.example.crm.dto.SaleDto;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.model.Customer;
import com.example.crm.model.Sale;
import com.example.crm.model.User;
import com.example.crm.repository.CustomerRepository;
import com.example.crm.repository.SaleRepository;
import com.example.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public SaleDto create(SaleDto dto) {
        Sale sale = new Sale();
        mapDtoToEntity(dto, sale);
        return toDto(saleRepository.save(sale));
    }

    public Page<SaleDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return saleRepository.findAll(pageable)
                .map(this::toDto);
    }

    public SaleDto getById(Long id) {
        return toDto(findEntity(id));
    }

    public SaleDto update(Long id, SaleDto dto) {
        Sale sale = findEntity(id);
        mapDtoToEntity(dto, sale);
        return toDto(saleRepository.save(sale));
    }

    public void delete(Long id) {
        Sale sale = findEntity(id);
        saleRepository.delete(sale);
    }

    private Sale findEntity(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Sale not found with id: " + id));
    }

    private void mapDtoToEntity(SaleDto dto, Sale sale) {

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + dto.getCustomerId()));

        sale.setCustomer(customer);
        sale.setAmount(dto.getAmount());
        sale.setStatus(dto.getStatus());
        sale.setDate(dto.getDate());

        if (dto.getAssignedSalesRepId() != null) {
            User rep = userRepository.findById(dto.getAssignedSalesRepId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Sales Rep not found with id: " + dto.getAssignedSalesRepId()));

            sale.setAssignedSalesRep(rep);
        } else {
            sale.setAssignedSalesRep(null);
        }
    }

    private SaleDto toDto(Sale sale) {

        SaleDto dto = new SaleDto();

        dto.setId(sale.getId());
        dto.setCustomerId(sale.getCustomer().getId());
        dto.setCustomerName(sale.getCustomer().getName());

        dto.setAmount(sale.getAmount());
        dto.setStatus(sale.getStatus());
        dto.setDate(sale.getDate());

        if (sale.getAssignedSalesRep() != null) {
            dto.setAssignedSalesRepId(sale.getAssignedSalesRep().getId());
            dto.setAssignedSalesRepName(sale.getAssignedSalesRep().getFullName());
        }

        return dto;
    }
}