package org.example.chatai.users.support.db.repositories;

import org.example.chatai.users.support.db.entities.SupportMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportMessageRepository extends JpaRepository<SupportMessageEntity, Long> {
}
