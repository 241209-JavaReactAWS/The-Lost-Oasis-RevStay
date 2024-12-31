package com.Revature.RevStay.service;

import com.Revature.RevStay.dao.UserRepository;
import com.Revature.RevStay.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register a new user
    public Optional<User> registerUser(User user) {
        // Validate user input
        if (user.getEmail() == null || user.getEmail().isBlank() ||
                user.getPassword() == null || user.getPassword().length() < 6 ||
                userRepository.findByEmail(user.getEmail()) != null) {
            return Optional.empty();
        }

        // Save the user with raw password
        return Optional.of(userRepository.save(user));
    }

    // Find a user by email
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Login a user
    public Optional<User> loginUser(User user) {
        // Find user by email
        User loginUser = userRepository.findByEmail(user.getEmail());

        // Validate password (plain text comparison)
        if (loginUser != null && loginUser.getPassword().equals(user.getPassword())) {
            return Optional.of(loginUser);
        }

        // Return empty if authentication fails
        return Optional.empty();
    }
}
