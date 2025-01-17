package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.UserRepository;
import com.Revature.RevStay.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final AuthenticationManager authManager;
    private final JWTService jwtService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10); // Use same encoder as during registration

    @Autowired
    public UserService(AuthenticationManager authManager, JWTService jwtService, UserRepository userRepository) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    // Register a new user
    public Optional<User> registerUser(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank() ||
                user.getPassword() == null || user.getPassword().length() < 6 ||
                userRepository.findByEmail(user.getEmail()) != null) {
            return Optional.empty();
        }

        user.setPassword(encoder.encode(user.getPassword())); // Encrypt password before saving
        return Optional.of(userRepository.save(user));
    }

    // Login a user
//    public Optional<User> loginUser(User user) {
//        User loginUser = userRepository.findByEmail(user.getEmail());
//
//        // Compare raw password with hashed password
//        if (loginUser != null && encoder.matches(user.getPassword(), loginUser.getPassword())) {
//            return Optional.of(loginUser); // Password matches
//        }
//
//        return Optional.empty(); // Invalid credentials
//    }



    //For Login
    public String verifyUser(User user) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );

            if (authentication.isAuthenticated()) {
                User fullUser = userRepository.findByEmail(user.getEmail());
                if (fullUser != null) {
                    System.out.println("Authenticated User: " + fullUser);
                    String token = jwtService.generateToken(fullUser.getEmail());
                    System.out.println("JWT Token: " + token);
                    return token;
                }
            }
        } catch (Exception ex) {
            System.out.println("Authentication Failed: " + ex.getMessage());
            return "401 Unauthorized: Invalid credentials";
        }

        return "400 Bad Request: User not found or unexpected error occurred";
    }

    @Transactional(readOnly = true)
    public Long getUserIdByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + email));
    }

    public Optional<User> getUserByAuthentication(){
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (!auth.isAuthenticated()){
            return Optional.empty();
        }

        var email = auth.getName();

        return Optional.of(userRepository.findByEmail(email));
    }
}
