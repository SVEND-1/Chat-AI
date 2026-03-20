package org.example.chatai.supportMessages.db.entities;

import jakarta.persistence.*;
import lombok.*;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SupportMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "support_ticket_id")
    private SupportTicketEntity supportTicket;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private UserEntity sender;

    @Column(name = "sender_type")
    @Enumerated(EnumType.STRING)
    private Role senderType;

    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
