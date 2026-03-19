package org.example.chatai.subscriptions.domain;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.payments.api.dto.response.payment.PaymentResponse;
import org.example.chatai.payments.domain.PaymentService;
import org.example.chatai.subscriptions.api.dto.response.SubscriptionDetailResponse;
import org.example.chatai.subscriptions.db.Status;
import org.example.chatai.subscriptions.db.SubscriptionEntity;
import org.example.chatai.subscriptions.db.SubscriptionRepository;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.domain.UserService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final PaymentService paymentService;
    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;

    public SubscriptionEntity findByUserEmail(String userEmail) {
        return subscriptionRepository.findByUserEmail(userEmail).orElse(null);
    }

    public SubscriptionDetailResponse getSubscription(Long id) {
        if (id == null) {
            return null;
        }
        SubscriptionEntity sub = subscriptionRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Подписка не найдена"));

        if(!sub.getUser().getId().equals(userService.getCurrentUser().getId())){
            log.warn("Пользователь не является владельцем подписки");
            throw new RuntimeException("Пользователь не является владельцем подписки");
        }

        String endDate =
                sub.getEndDate().getDayOfMonth() + " " +
                switchMonthTranslationInRussian(sub.getEndDate().getMonth())  + " " +
                sub.getEndDate().getYear() + "г.";

        return new SubscriptionDetailResponse(
                sub.getActive().name(),
                endDate
        );
    }

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
        sub.setEndDate(LocalDateTime.now().plusMinutes(3));
        subscriptionRepository.save(sub);

        return "Успешно";
    }

    //@Scheduled(cron = "0 0 0 * * *") раз в день //TODO в проде это поставить
    //@Scheduled(cron = "0 * * * * *") минута
    @Scheduled(fixedDelay = 1800000)//Каждые 30 минут
    public void checkExpiredSubscriptions(){//Сделать фильтр при загрузки из бд
        subscriptionRepository.findAllByActive(Status.ACTIVE)
                .stream()
                .filter(el -> el.getEndDate().getMonth() == LocalDate.now().getMonth() &&
                        el.getEndDate().getDayOfMonth() == LocalDate.now().getDayOfMonth())//если делать подписку на год добавить проверку
                .forEach(sub -> {
                    sub.setActive(Status.BLOCKED);
                    subscriptionRepository.save(sub);
                });
    }

    private String validateSubscription(String paymentId) {
        if (paymentId == null || paymentId.trim().isEmpty()) {
            return "Неверный paymentId";
        }
        paymentService.isValidUser(paymentId);

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

    private String switchMonthTranslationInRussian(Month month) {//возможно перенести на фронтенд
        switch (month) {
            case JANUARY:
                return "января";
            case FEBRUARY:
                return "февраля";
            case MARCH:
                return "марта";
            case APRIL:
                return "апреля";
            case MAY:
                return "мая";
            case JUNE:
                return "июня";
            case JULY:
                return "июля";
            case AUGUST:
                return "августа";
            case SEPTEMBER:
                return "сентября";
            case OCTOBER:
                return "октября";
            case NOVEMBER:
                return "ноября";
            case DECEMBER:
                return "декабря";
            default:
                return "месяц не указан";
        }
    }


}
