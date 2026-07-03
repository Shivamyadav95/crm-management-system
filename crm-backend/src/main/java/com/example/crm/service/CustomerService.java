package com.example.crm.service;

import com.example.crm.dto.CustomerDto;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.model.Customer;
import com.example.crm.model.User;
import com.example.crm.repository.CustomerRepository;
import com.example.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerDto create(CustomerDto dto) {
        Customer customer = new Customer();
        mapDtoToEntity(dto, customer);
        return toDto(customerRepository.save(customer));
    }

    public Page<CustomerDto> getAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return customerRepository.findAll(pageable)
                .map(this::toDto);

    }

    public CustomerDto getById(Long id) {
        return toDto(findEntity(id));
    }

    public CustomerDto update(Long id, CustomerDto dto) {
        Customer customer = findEntity(id);
        mapDtoToEntity(dto, customer);
        return toDto(customerRepository.save(customer));
    }

    public void delete(Long id) {
        customerRepository.delete(findEntity(id));
    }

    private Customer findEntity(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    private void mapDtoToEntity(CustomerDto dto, Customer customer) {
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setCompany(dto.getCompany());
        customer.setAddress(dto.getAddress());
        customer.setNotes(dto.getNotes());

        if (dto.getAssignedSalesRepId() != null) {
            User rep = userRepository.findById(dto.getAssignedSalesRepId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Sales rep not found with id: " + dto.getAssignedSalesRepId()));
            customer.setAssignedSalesRep(rep);
        } else {
            customer.setAssignedSalesRep(null);
        }
    }

    private CustomerDto toDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setCompany(customer.getCompany());
        dto.setAddress(customer.getAddress());
        dto.setNotes(customer.getNotes());
        if (customer.getAssignedSalesRep() != null) {
            dto.setAssignedSalesRepId(customer.getAssignedSalesRep().getId());
            dto.setAssignedSalesRepName(customer.getAssignedSalesRep().getFullName());
        }
        return dto;
    }
}
