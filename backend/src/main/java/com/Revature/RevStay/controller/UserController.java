package com.Revature.RevStay.controller;


import com.Revature.RevStay.models.User;
import com.Revature.RevStay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/")
public class UserController {
    private UserService userService;


    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        Optional<User> registeredUser = userService.registerUser(user);

        if (registeredUser.isPresent()) {
            return ResponseEntity.ok(registeredUser.get());
        }
        else if(!userService.verifyUser(user).isEmpty()) {
            return ResponseEntity.status(409).build();
        }
        else {
            return ResponseEntity.status(400).build();
        }
    }

//    @PostMapping("/login")
//    public ResponseEntity<User> login(@RequestBody User user) {
//        Optional<User> loggedinUser = userService.loginUser(user);
//        if(loggedinUser.isPresent()) {
//            return ResponseEntity.ok(loggedinUser.get());
//        }
//        else{
//            return ResponseEntity.status(401).build();
//        }
//    }


    @PostMapping("/login")
    public String login(@RequestBody User user) {
        System.out.println("Received User: " + user);
        return userService.verifyUser(user);
    }


}
