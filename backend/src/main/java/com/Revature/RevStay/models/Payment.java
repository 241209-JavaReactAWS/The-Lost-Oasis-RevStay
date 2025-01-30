package com.Revature.RevStay.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    @JoinColumn(nullable = false)
    private Double amount;

    @JoinColumn(nullable = false)
    private String paymentMethod;

    @JoinColumn(nullable = false)
    private String paymentDate;

    @JoinColumn(nullable = false)
    private String cardNumber;

    @JoinColumn(nullable = false)
    private String cvv;

    @JoinColumn(nullable = false)
    private String expiryDate;
}
