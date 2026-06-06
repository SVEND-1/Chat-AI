package org.example.chatai.chat.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity,Long> {
    List<ChatEntity> findByUserId(Long userId);
}
