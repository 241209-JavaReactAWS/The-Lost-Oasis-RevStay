package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.User;
import com.Revature.RevStay.services.JWTService;
import com.Revature.RevStay.services.UserService;
import com.Revature.RevStay.daos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/")
public class UserController {

    private final UserService userService;
    private final JWTService jwtService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, JWTService jwtService, UserRepository userRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
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

    @PostMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // Remove "Bearer " prefix if it exists
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Validate the token
            String email = jwtService.extractUserName(token); // Extract email from token
            User user = userRepository.findByEmail(email); // Fetch full user details

            if (user != null) {
                // Convert User to UserDetails for validation
                UserDetails userDetails = org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build();

                if (jwtService.validateToken(token, userDetails)) {
                    // Prepare the response
                    Map<String, Object> response = new HashMap<>();
                    response.put("user", user);

                    return ResponseEntity.ok(response);
                }
            }

            return ResponseEntity.status(401).body(null); // Unauthorized if token is invalid
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null); // Handle exceptions as unauthorized
        }
    }

}
