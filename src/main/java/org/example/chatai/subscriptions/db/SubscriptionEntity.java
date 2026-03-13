package org.example.chatai.subscriptions.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.chatai.users.db.UserEntity;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "subscriptions")
public class SubscriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "active")
    private Status active;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "payment_id")
    private String paymentId;

    @OneToOne
    private UserEntity user;
}
