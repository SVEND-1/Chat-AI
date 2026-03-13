package org.example.chatai.payments.db;

import jakarta.persistence.*;
import lombok.*;
import org.example.chatai.users.db.UserEntity;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "payments")
public class PaymentEntity {//TODO сделать так чтобы один и тот же платеж нельзя было несколько раз использовать

    @Id
    private String idempotencyKey;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "receipt_id")
    private String receiptId;

    @ManyToOne
    private UserEntity user;

    @Column(name = "create_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}