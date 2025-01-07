//package com.Revature.RevStay.models;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "notifications")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Notification {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @JsonIgnore
//    @ManyToOne
//    private User user;
//
//    private String subject;
//    private String message;
//    private boolean read;
//    private LocalDateTime timestamp;
//
//    public Notification(User recipient, String subject, String message) {
//        this.user = recipient;
//        this.subject = subject;
//        this.message = message;
//        this.read = false;
//        this.timestamp = LocalDateTime.now();
//    }
//}
