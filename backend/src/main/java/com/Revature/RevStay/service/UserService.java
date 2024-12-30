package com.Revature.RevStay.service;

import com.Revature.RevStay.dao.UserReposiroy;
import com.Revature.RevStay.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserReposiroy userReposiroy;

    @Autowired
    public UserService(UserReposiroy userReposiroy) {
        this.userReposiroy = userReposiroy;
    }

    // Register a new user
    public Optional<User> registerUser(User user) {
        // Validate user input
        if (user.getEmail() == null || user.getEmail().isBlank() ||
                user.getPassword() == null || user.getPassword().length() < 6 ||
                userReposiroy.findByEmail(user.getEmail()) != null) {
            return Optional.empty();
        }

        // Save the user with raw password
        return Optional.of(userReposiroy.save(user));
    }

    // Find a user by email
    public User findUserByEmail(String email) {
        return userReposiroy.findByEmail(email);
    }

    // Login a user
    public Optional<User> loginUser(User user) {
        // Find user by email
        User loginUser = userReposiroy.findByEmail(user.getEmail());

        // Validate password (plain text comparison)
        if (loginUser != null && loginUser.getPassword().equals(user.getPassword())) {
            return Optional.of(loginUser);
        }

        // Return empty if authentication fails
        return Optional.empty();
    }
}
