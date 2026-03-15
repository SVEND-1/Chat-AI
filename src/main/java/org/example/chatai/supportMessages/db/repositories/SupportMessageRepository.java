package org.example.chatai.supportMessages.db.repositories;

import org.example.chatai.supportMessages.db.entities.SupportMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportMessageRepository extends JpaRepository<SupportMessageEntity, Long> {
}
