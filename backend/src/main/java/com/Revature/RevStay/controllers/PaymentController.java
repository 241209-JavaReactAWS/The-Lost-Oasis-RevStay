package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.Payment;
import com.Revature.RevStay.services.PaymentService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
    private static final Logger logger = LogManager.getLogger();
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService){
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public void createPayment(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Payment payment){
        logger.info("Received payment info from user: {}, with details: {}", userDetails.getUsername(), payment);
        this.paymentService.createPayment(userDetails.getUsername(), payment);
    }

    @GetMapping("/all")
    public List<Payment>  getAllPayment(){
        return this.paymentService.getAllPayment();
    }

    @GetMapping("{id}")
    public Payment getPaymentById(@PathVariable Integer id){
        return this.paymentService.getPaymentById(id).orElse(null);
    }
}
