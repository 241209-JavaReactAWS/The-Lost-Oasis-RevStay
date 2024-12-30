package com.Revature.RevStay.dao;

import com.Revature.RevStay.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface userDAO extends JpaRepository<User, Integer> {

    List<User> findByUsername(String username);

    List<User> findByEmail(String email);

    List<User> findByUsernameAndPassword(String username, String password);

    List<User> findByEmailAndPassword(String email, String password);

}
