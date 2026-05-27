package org.example.chatai.subscriptions.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, Long> {
    Optional<SubscriptionEntity> findByUserEmail(String userEmail);

    List<SubscriptionEntity> findAllByActive(Status active);
}
