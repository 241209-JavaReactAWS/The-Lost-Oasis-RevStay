package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

<<<<<<< HEAD
=======
    Optional<User> findUserByEmail(String email);
>>>>>>> 69ad766 (Added hotel service and controller.)
}
