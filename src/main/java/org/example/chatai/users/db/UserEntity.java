package org.example.chatai.users.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.chatai.subscriptions.db.SubscriptionEntity;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
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
    private Role role;

    @OneToOne(mappedBy = "user")
    private SubscriptionEntity subscription;
}
