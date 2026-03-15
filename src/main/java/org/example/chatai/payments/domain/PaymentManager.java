package org.example.chatai.payments.domain;

import org.example.chatai.payments.api.dto.response.payment.PaymentResponse;
import org.example.chatai.payments.db.PaymentEntity;
import org.example.chatai.payments.db.PaymentRepository;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.domain.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.loolzaaa.youkassa.model.Payment;
import ru.loolzaaa.youkassa.model.Receipt;

import java.time.LocalDateTime;

@Component
public class PaymentManager {

    private final UserService userService;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    public PaymentManager(UserService userService,
                          PaymentRepository paymentRepository,@Lazy PaymentService paymentService) {
        this.userService = userService;
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
    }

    public void savePayment(String idempotencyKey, Payment saved) {
        PaymentEntity paymentEntity = PaymentEntity.builder()
                .idempotencyKey(idempotencyKey)
                .user(userService.getCurrentUser())
                .paymentId(saved.getId())
                .createdAt(LocalDateTime.now())
                .build();

        paymentService.save(paymentEntity);
    }


    public Page<PaymentResponse> findAllPaymentsByUser(int page, int size) {
        UserEntity user = userService.getCurrentUser();

        Pageable pageable = PageRequest.of(page, size);

        Page<PaymentEntity> userPayments = paymentRepository
                .findAllByUserEmail(user.getEmail(), pageable);

        return userPayments.map(el -> paymentService.findPaymentDto(el.getPaymentId()));
    }
}
