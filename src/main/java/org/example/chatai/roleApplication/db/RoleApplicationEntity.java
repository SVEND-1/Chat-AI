package org.example.chatai.roleApplication.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.chatai.users.db.UserEntity;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "role_applications")
public class RoleApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_user",length = 1000)
    private String messageUser;

    @Column(name = "answer_admin",length = 1000)
    private String answerAdmin;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_role")
    private StatusRole statusRole;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @ManyToOne
    private UserEntity user;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
