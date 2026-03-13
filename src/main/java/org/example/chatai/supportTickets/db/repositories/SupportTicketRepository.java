package org.example.chatai.supportTickets.db.repositories;

import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.users.db.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicketEntity, Long> {
    @Query("""
            SELECT t.support
            FROM SupportTicketEntity t
            WHERE t.status = 'OPEN'
            GROUP BY t.support
            HAVING COUNT(t) = (
                SELECT MIN(COUNT(t2))
                FROM SupportTicketEntity t2
                WHERE t2.status = 'OPEN'
                GROUP BY t2.support
            )
            """)
    List<UserEntity> getMinimumCountOfOpenTicketsBySupportId();


    boolean existsByUserIdAndStatus(Long userId, SupportStatus supportStatus);
}
