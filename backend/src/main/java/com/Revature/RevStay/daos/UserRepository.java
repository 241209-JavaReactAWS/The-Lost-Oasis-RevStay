package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
<<<<<<< HEAD
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
=======
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
>>>>>>> sagar-dev
}
