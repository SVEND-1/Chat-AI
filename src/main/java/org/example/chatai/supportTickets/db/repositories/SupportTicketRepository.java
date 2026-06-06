package org.example.chatai.supportTickets.db.repositories;

import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.users.db.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicketEntity, Long> {
    @Query("""
            SELECT u FROM UserEntity u
            WHERE u.role = 'SUPPORT'
            AND NOT EXISTS (
                SELECT 1 FROM SupportTicketEntity t
                WHERE t.support = u
            )
            """)
    List<UserEntity> findSupportWithNoTickets();

    @Query("""
            SELECT t.support
            FROM SupportTicketEntity t
            WHERE t.status = 'OPEN'
            GROUP BY t.support
            HAVING COUNT(t) = (
                SELECT MIN(c.cnt)
                FROM (
                    SELECT COUNT(t2) AS cnt
                    FROM SupportTicketEntity t2
                    WHERE t2.status = 'OPEN'
                    GROUP BY t2.support
                ) AS c
            )
            """)
    List<UserEntity> getMinimumCountOfOpenTicketsBySupportId();


    boolean existsByUserIdAndStatus(Long userId, SupportStatus supportStatus);

    @Query("""
            SELECT t FROM SupportTicketEntity t
            WHERE (t.user.id = :userId) OR
                  (t.support.id = :userId)
            """)
    List<SupportTicketEntity> findAllByUserId(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query("""
            SELECT t FROM SupportTicketEntity t
            LEFT JOIN FETCH t.user
            WHERE t.id = :id
            """)
    Optional<SupportTicketEntity> findByIdWithUser(
            @Param("id") Long id
    );
}
