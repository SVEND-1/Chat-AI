package org.example.chatai.chat.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.chatai.users.db.UserEntity;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "chats")
public class ChatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;

    @ManyToOne
    private UserEntity user;
}
