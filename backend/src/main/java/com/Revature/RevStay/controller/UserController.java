package com.Revature.RevStay.controller;

import com.Revature.RevStay.models.User;
import com.Revature.RevStay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        Optional<User> registeredUser = userService.registerUser(user);
        if (registeredUser.isPresent()) {
            return ResponseEntity.ok(registeredUser.get());
        } else {
            return ResponseEntity.status(400).build();
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        System.out.println("Received User: " + user);
        String token = userService.verifyUser(user);
        System.out.println("JWT Token: " + token);
        return token; // Return the token directly
    }
}
