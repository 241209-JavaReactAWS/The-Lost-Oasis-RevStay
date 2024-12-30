package com.Revature.RevStay.dao;

import com.Revature.RevStay.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface UserReposiroy extends JpaRepository<User, Integer> {

    User findByEmail(String email);



}
