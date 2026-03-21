package org.example.chatai.users.db;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmailEqualsIgnoreCase(String email);

    Optional<UserEntity> findByEmailIgnoreCase(String email);

    boolean existsByRole(Role role);

    List<UserEntity> findByRole(Role role);

    Long countUserEntitiesByRole(Role role);

    @Query("""
            SELECT u FROM UserEntity u
            WHERE u.role = :role OR :role IS NULL
            """)
    List<UserEntity> findAllByRole(
            @Param("role") Role role,
            Pageable pageable);

    @Query("""
            SELECT COUNT(u) FROM UserEntity u
            WHERE u.role = 'USER'
            AND
            u.subscription.active = 'ACTIVE'
            """)
    Long countUsersByRoleWithActivePayment();
}