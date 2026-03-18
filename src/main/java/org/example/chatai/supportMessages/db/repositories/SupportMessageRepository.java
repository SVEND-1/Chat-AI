package org.example.chatai.supportMessages.db.repositories;

import org.example.chatai.supportMessages.db.entities.SupportMessageEntity;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.users.db.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportMessageRepository extends JpaRepository<SupportMessageEntity, Long> {
    @Query("""
            SELECT m FROM SupportMessageEntity m
            WHERE m.supportTicket = :supportTicket
            ORDER BY m.createdAt ASC
            """)
    List<SupportMessageEntity> findAllBySupportTicket(
            @Param("supportTicket") SupportTicketEntity supportTicket
    );

    @Query("""
            SELECT m FROM SupportMessageEntity m
            WHERE m.supportTicket = :supportTicket
            ORDER BY m.createdAt DESC
            LIMIT 1
            """)
    SupportMessageEntity findLastMessageBySupportTicket(
            @Param("supportTicket") SupportTicketEntity supportTicket
    );

    @Query("""
            SELECT m FROM SupportMessageEntity m
            WHERE
            m.supportTicket = :supportTicket
            AND
            m.senderType = :senderType
            ORDER BY m.createdAt ASC
            """)
    List<SupportMessageEntity> findAllBySupportTicketAndSenderType(
            @Param("supportTicket") SupportTicketEntity supportTicket,
            @Param("senderType") Role senderType
    );
}
