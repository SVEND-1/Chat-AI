package org.example.chatai.subscriptions.domain;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.payments.api.dto.response.PaymentResponse;
import org.example.chatai.payments.domain.PaymentService;
import org.example.chatai.subscriptions.db.Status;
import org.example.chatai.subscriptions.db.SubscriptionEntity;
import org.example.chatai.subscriptions.db.SubscriptionRepository;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.domain.UserService;
import org.example.chatai.users.domain.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final PaymentService paymentService;
    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;

    @Transactional
    public String createSubscription(String paymentId) {
        String validationError = validateSubscription(paymentId);
        if (validationError != null) {
            return validationError;
        }

        UserEntity user = userService.getCurrentUser();
        Optional<SubscriptionEntity> optionalSub = subscriptionRepository
                .findByUserEmail(user.getEmail());

        SubscriptionEntity sub = optionalSub.orElseGet(() ->
                SubscriptionEntity.builder().user(user).build());

        sub.setActive(Status.ACTIVE);
        sub.setPaymentId(paymentId);
        sub.setEndDate(LocalDateTime.now().plusMinutes(1));
        subscriptionRepository.save(sub);

        return "Успешно";
    }

    private String validateSubscription(String paymentId) {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            return "Неверный paymentId";
        }

        PaymentResponse payment = paymentService.findPaymentDto(paymentId);
        if (!"succeeded".equals(payment.status())) {
            return "Платёж не прошёл";
        }

        UserEntity user = userService.getCurrentUser();
        Optional<SubscriptionEntity> optionalSub = subscriptionRepository
                .findByUserEmail(user.getEmail());

        if (optionalSub.isPresent()) {
            SubscriptionEntity sub = optionalSub.get();
            if (Status.ACTIVE.equals(sub.getActive())
                    && sub.getEndDate() != null
                    && sub.getEndDate().isAfter(LocalDateTime.now())) {
                return "Подписка уже активна до " + sub.getEndDate();
            }

            if(sub.getPaymentId().equals(paymentId)) {
                return "Этот платеж уже был использован для оплаты";
            }
        }

        return null;
    }

}
