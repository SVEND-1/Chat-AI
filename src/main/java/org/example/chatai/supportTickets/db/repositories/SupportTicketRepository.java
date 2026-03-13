package org.example.chatai.supportTickets.db.repositories;

import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportTicketRepository extends JpaRepository<SupportTicketEntity, Long> {
}
