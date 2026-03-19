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

    @Column(name = "message_user")
    private String messageUser;

    @Column(name = "answer_admin")
    private String answerAdmin;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_role")
    private StatusRole statusRole;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "answer_time")
    private LocalDateTime answerTime;

    @ManyToOne
    private UserEntity user;
}
