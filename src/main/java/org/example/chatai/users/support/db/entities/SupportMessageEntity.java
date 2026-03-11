package org.example.chatai.users.support.db.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.support.db.enums.SenderType;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_messages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
    private SenderType senderType;

    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
