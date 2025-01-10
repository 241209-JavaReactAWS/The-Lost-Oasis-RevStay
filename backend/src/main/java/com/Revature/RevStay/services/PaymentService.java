package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.PaymentRepository;
import com.Revature.RevStay.daos.UserRepository;
import com.Revature.RevStay.models.Payment;
import com.Revature.RevStay.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    //Create a payment
    public Payment createPayment(String userEmail, Payment payment){
        User user = this.userRepository.findByEmail(userEmail);
        if (user == null) throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User not found");
        payment.setUser(user);
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
