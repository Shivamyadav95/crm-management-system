package com.example.crm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "sales")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private SaleStatus status;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "assigned_sales_rep_id")
    private User assignedSalesRep;
}
