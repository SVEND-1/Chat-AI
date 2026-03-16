package org.example.chatai.users.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmailEqualsIgnoreCase(String email);

    boolean existsByRole(Role role);

    List<UserEntity> findByRole(Role role);
}