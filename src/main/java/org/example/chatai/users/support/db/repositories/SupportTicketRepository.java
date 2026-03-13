package org.example.chatai.users.support.db.repositories;

import org.example.chatai.users.support.db.entities.SupportTicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportTicketRepository extends JpaRepository<SupportTicketEntity, Long> {
}
