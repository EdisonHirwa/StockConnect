package com.stockconnect.repositories;

import com.stockconnect.models.Role;
import com.stockconnect.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(Role role);
    long countByRole(Role role);
    java.util.List<User> findAllByRole(Role role);
}

