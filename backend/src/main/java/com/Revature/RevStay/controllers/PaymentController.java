package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.Payment;
import com.Revature.RevStay.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class PaymentController {


   private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService){
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public void createPayment(Payment payment){
        this.paymentService.createPayment(payment);
    }

    @GetMapping("/all")
    public List<Payment>  getAllPayment(){
        return this.paymentService.getAllPayment();
    }

    @GetMapping("{id}")
    public Payment getPaymentById(Integer id){
        return this.paymentService.getPaymentById(id).orElse(null);
    }

}
