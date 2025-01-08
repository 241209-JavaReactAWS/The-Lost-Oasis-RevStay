package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.PaymentRepository;
import com.Revature.RevStay.models.Payment;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {


    private PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    //Create a payment
    public Payment createPayment(Payment payment){
        return this.paymentRepository.save(payment);
    }
    //Get all payments
    public List<Payment> getAllPayment(){
        return this.paymentRepository.findAll();
    }


    //Get payment by id
    public Optional<Payment> getPaymentById(Integer id){
        return this.paymentRepository.findById(id);
    }
}
