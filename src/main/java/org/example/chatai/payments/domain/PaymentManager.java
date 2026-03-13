package org.example.chatai.payments.domain;

import org.example.chatai.payments.api.dto.response.PaymentResponse;
import org.example.chatai.payments.db.PaymentEntity;
import org.example.chatai.payments.db.PaymentRepository;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.domain.UserService;
import org.example.chatai.users.domain.mapper.UserMapper;
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
    private final UserMapper userMapper;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    public PaymentManager(UserService userService, UserMapper userMapper,
                          PaymentRepository paymentRepository,@Lazy PaymentService paymentService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
    }

    public void savePayment(String idempotencyKey, Payment saved) {
        PaymentEntity paymentEntity = PaymentEntity.builder()
                .idempotencyKey(idempotencyKey)
                .user(userMapper.convertDtoToEntity(userService.findUserByEmail("s5090@inbox.ru")))
//                    .user(userService.getCurrentUser())
                .paymentId(saved.getId())
                .createdAt(LocalDateTime.now())
                .build();

        paymentService.save(paymentEntity);
    }

    public void saveReceipt(String paymentId, Receipt saved) {
        PaymentEntity paymentEntity = paymentService.findByPaymentId(paymentId);
        paymentEntity.setReceiptId(saved.getId());
        paymentService.save(paymentEntity);
    }

    public Page<PaymentResponse> findAllPaymentsByUser(int page, int size) {
        UserEntity user = userMapper.convertDtoToEntity(userService.findUserByEmail("s5090@inbox.ru"));

        Pageable pageable = PageRequest.of(page, size);

        Page<PaymentEntity> userPayments = paymentRepository
                .findAllByUserEmail(user.getEmail(), pageable);

        return userPayments.map(el -> paymentService.findPaymentDto(el.getPaymentId()));
    }
}
