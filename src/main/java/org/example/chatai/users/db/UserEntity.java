package org.example.chatai.users.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.chatai.chat.db.ChatEntity;
import org.example.chatai.payments.db.PaymentEntity;
import org.example.chatai.roleApplication.db.RoleApplicationEntity;
import org.example.chatai.subscriptions.db.SubscriptionEntity;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PaymentEntity> payments = new ArrayList<>();

    @OneToOne(mappedBy = "user")
    private SubscriptionEntity subscription;

    @OneToMany(mappedBy = "user")
    private List<ChatEntity> chats = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<RoleApplicationEntity> roleApplicationEntities = new ArrayList<>();
}
