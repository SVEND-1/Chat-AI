package org.example.chatai.subscriptions.domain;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.payments.domain.PaymentService;
import org.example.chatai.subscriptions.db.Status;
import org.example.chatai.subscriptions.db.SubscriptionEntity;
import org.example.chatai.subscriptions.db.SubscriptionRepository;
import org.example.chatai.users.domain.UserService;
import org.example.chatai.users.domain.mapper.UserMapper;
import org.springframework.stereotype.Service;
import ru.loolzaaa.youkassa.model.Payment;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final PaymentService paymentService;
    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;
    private final UserMapper userMapper;

    @Transactional
    public String createSubscription(String paymentId) {
        try {
            Payment payment = paymentService.findPayment(paymentId);

            if ("succeeded".equals(payment.getStatus())) {
                subscriptionRepository.save(SubscriptionEntity.builder()
                        .active(Status.ACTIVE)
                        .paymentId(paymentId)
                        .user(userMapper.convertDtoToEntity(userService.findUserByEmail("s5090@inbox.ru")))
                                //.user(userService.getCurrentUser())
                        .endDate(LocalDateTime.now().plusMonths(1))
                        .build());
                return "Успешно";
            } else {
                return "Не получилось оформить подписку";
            }
        }catch (Exception e) {
            log.error("Ошибка при оформление подписки, ex={}", e.getMessage());
            throw new RuntimeException(e);
        }

    }
}
