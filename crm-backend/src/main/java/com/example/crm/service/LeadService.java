package com.example.crm.service;

import com.example.crm.dto.LeadDto;
import com.example.crm.exception.ResourceNotFoundException;
import com.example.crm.model.Lead;
import com.example.crm.model.LeadStatus;
import com.example.crm.model.User;
import com.example.crm.repository.LeadRepository;
import com.example.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    public LeadDto create(LeadDto dto) {
        Lead lead = new Lead();
        mapDtoToEntity(dto, lead);
        if (lead.getStatus() == null) {
            lead.setStatus(LeadStatus.NEW);
        }
        return toDto(leadRepository.save(lead));
    }

    public Page<LeadDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return leadRepository.findAll(pageable)
                .map(this::toDto);
    }

    public LeadDto update(Long id, LeadDto dto) {
        Lead lead = findEntity(id);
        mapDtoToEntity(dto, lead);
        return toDto(leadRepository.save(lead));
    }

    public void delete(Long id) {
        leadRepository.delete(findEntity(id));
    }

    private Lead findEntity(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
    }

    private void mapDtoToEntity(LeadDto dto, Lead lead) {
        lead.setName(dto.getName());
        lead.setContactInfo(dto.getContactInfo());
        lead.setSource(dto.getSource());
        if (dto.getStatus() != null) {
            lead.setStatus(dto.getStatus());
        }

        if (dto.getAssignedSalesRepId() != null) {
            User rep = userRepository.findById(dto.getAssignedSalesRepId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Sales rep not found with id: " + dto.getAssignedSalesRepId()));
            lead.setAssignedSalesRep(rep);
        } else {
            lead.setAssignedSalesRep(null);
        }
    }

    private LeadDto toDto(Lead lead) {
        LeadDto dto = new LeadDto();
        dto.setId(lead.getId());
        dto.setName(lead.getName());
        dto.setContactInfo(lead.getContactInfo());
        dto.setSource(lead.getSource());
        dto.setStatus(lead.getStatus());
        if (lead.getAssignedSalesRep() != null) {
            dto.setAssignedSalesRepId(lead.getAssignedSalesRep().getId());
            dto.setAssignedSalesRepName(lead.getAssignedSalesRep().getFullName());
        }
        return dto;
    }
}
