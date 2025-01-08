package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}