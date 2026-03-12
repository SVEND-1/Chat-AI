package org.example.chatai.payments.domain;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ApiException;
import org.example.chatai.payments.api.dto.response.PaymentPageResponse;
import org.example.chatai.payments.api.dto.response.PaymentResponse;
import org.example.chatai.payments.db.PaymentEntity;
import org.example.chatai.payments.db.PaymentRepository;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.domain.UserService;
import org.example.chatai.users.domain.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.loolzaaa.youkassa.client.ApiClient;
import ru.loolzaaa.youkassa.client.ApiClientBuilder;
import ru.loolzaaa.youkassa.client.PaginatedResponse;
import ru.loolzaaa.youkassa.model.Payment;
import ru.loolzaaa.youkassa.model.Receipt;
import ru.loolzaaa.youkassa.model.Refund;
import ru.loolzaaa.youkassa.pojo.*;
import ru.loolzaaa.youkassa.pojo.list.PaymentList;
import ru.loolzaaa.youkassa.processors.PaymentProcessor;
import ru.loolzaaa.youkassa.processors.ReceiptProcessor;
import ru.loolzaaa.youkassa.processors.RefundProcessor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class PaymentService {
    private final UserService userService;
    private final UserMapper userMapper;
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    @Value("${shop_id}")
    private String shopId;

    @Value("${payment_key}")
    private String secretKey;

    private ApiClient apiClient;

    private PaymentProcessor paymentProcessor;
    private RefundProcessor refundProcessor;
    private ReceiptProcessor receiptProcessor;

    public PaymentService(UserService userService, UserMapper userMapper, PaymentRepository paymentRepository, PaymentMapper paymentMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
    }

    @PostConstruct
    public void init() {
        log.info("Инициализация YooKassa: shopId={}, secretKey={} chars",
                shopId, secretKey.length());

        apiClient = ApiClientBuilder.newBuilder()
                .configureBasicAuth(shopId, secretKey)
                .build();
        paymentProcessor = new PaymentProcessor(apiClient);
        refundProcessor = new RefundProcessor(apiClient);
        receiptProcessor = new ReceiptProcessor(apiClient);

        log.info("YooKassa инициализирована");
    }

    public PaymentResponse findPaymentDto(String paymentId){
        return paymentMapper.convertEntityToPaymentResponse(
                findPayment(paymentId)
        );
    }

    public PaymentPageResponse findAllPaymentsByUser(int page, int size) {
        UserEntity user = userMapper.convertDtoToEntity(userService.findUserByEmail("s5090@inbox.ru"));

        Pageable pageable = PageRequest.of(page, size);

        Page<PaymentEntity> userPayments = paymentRepository
                .findAllByUserEmail(user.getEmail(), pageable);

        Page<PaymentResponse> responses = userPayments.map(el -> findPaymentDto(el.getPaymentId()));

        return paymentMapper.toPageResponse(responses);
    }

    public PaymentEntity findByPaymentId(String paymentId){
        return paymentRepository.findByPaymentId(paymentId);
    }

    public Payment createPayment() {
        String idempotencyKey = UUID.randomUUID().toString();

        try {//TODO если у фронтенда не получиться с оплатой сделатьь через куки
            Amount amount = Amount.builder()
                    .value("1.00")
                    .currency(Currency.RUB)
                    .build();

            Confirmation confirmation = Confirmation.builder()
                    .type(Confirmation.Type.REDIRECT)
                    .returnUrl("http://localhost:8080/")
                    .build();

            Payment payment = Payment.builder()
                    .amount(amount)
                    .description("Оплата подписки Premium")
                    .confirmation(confirmation)
                    .capture(true)
                    .build();

            Payment saved = paymentProcessor.create(payment, idempotencyKey);

            PaymentEntity paymentEntity = PaymentEntity.builder()
                    .idempotencyKey(idempotencyKey)
                    .user(userMapper.convertDtoToEntity(userService.findUserByEmail("s5090@inbox.ru")))
//                    .user(userService.getCurrentUser())
                    .paymentId(saved.getId())
                    .createdAt(LocalDateTime.now())
                    .build();

            paymentRepository.save(paymentEntity);

            return  saved;
        } catch (ApiException e) {
            log.error("Ошибка создания платежа: {}", e.getMessage());
            throw new RuntimeException("Не удалось создать платеж", e);
        }
    }

    public Payment findPayment(String paymentId) {
        try {
            return paymentProcessor.findById(paymentId);
        } catch (ApiException e) {
            log.error("Ошибка поиска платежа {}: {}", paymentId, e.getMessage());
            throw new RuntimeException("Платеж не найден", e);
        }
    }

    public Payment cancelPayment(String paymentId) {
        try {
            return paymentProcessor.cancel(paymentId, null);
        } catch (ApiException e) {
            log.error("Ошибка отмены платежа {}: {}", paymentId, e.getMessage());
            throw new RuntimeException("Не удалось отменить платеж", e);
        }
    }

    public Refund createRefund(String paymentId, String amountRub) {
        try {
            Amount amount = Amount.builder()
                    .value(amountRub)
                    .currency(Currency.RUB)
                    .build();

            Refund refund = Refund.builder()
                    .paymentId(paymentId)
                    .amount(amount)
                    .build();

            return refundProcessor.create(refund, null);
        } catch (ApiException e) {
            log.error("Ошибка создания возврата для платежа {}: {}", paymentId, e.getMessage());
            throw new RuntimeException("Не удалось создать возврат", e);
        }
    }

    public Refund findRefund(String refundId) {
        try {
            return refundProcessor.findById(refundId);
        } catch (ApiException e) {
            log.error("Ошибка поиска возврата {}: {}", refundId, e.getMessage());
            throw new RuntimeException("Возврат не найден", e);
        }
    }

    public Receipt findReceipt(String paymentId){
        try {
            PaymentEntity payment = findByPaymentId(paymentId);
            return receiptProcessor.findById(payment.getReceiptId());
        }
        catch (Exception e){
            log.error("Ошибка поиска чека,ex={}", e.getMessage());
            throw new RuntimeException("Чек не найден", e);
        }
    }




    public Receipt createReceipt(String paymentId) {
        try {
            // 1. Берем данные реального платежа из YooKassa
            Payment payment = findPayment(paymentId);
            if (!"succeeded".equals(payment.getStatus())) {
                log.warn("Чек создается для неуспешного платежа: {}", paymentId);
            }

            Customer customer = Customer.builder()
                    .email("s5090@inbox.ru")
                    .build();

            // 2. Используем реальную сумму платежа (НЕ хардкод!)
            Amount paymentAmount = payment.getAmount();
            Amount itemAmount = Amount.builder()
                    .value(paymentAmount.getValue())  // ← Реальная сумма
                    .currency(paymentAmount.getCurrency())
                    .build();

            Item item = Item.builder()
                    .description("Оплата подписки Premium")
                    .amount(itemAmount)
                    .vatCode(1) // Без НДС
                    .quantity("1")
                    .build();

            Settlement settlement = Settlement.builder()
                    .type(getSettlementType(payment))
                    .amount(itemAmount)
                    .build();

            Receipt receipt = Receipt.builder()
                    .type(Receipt.Type.PAYMENT)
                    .paymentId(paymentId)
                    .customer(customer)
                    .items(List.of(item))
                    .settlements(List.of(settlement))
                    .send(true)  // Отправить покупателю на email/телефон
                    .build();

            Receipt saved = receiptProcessor.create(receipt, null);

            PaymentEntity paymentEntity = findByPaymentId(paymentId);
            paymentEntity.setReceiptId(saved.getId());
            paymentRepository.save(paymentEntity);

            return saved;
        } catch (ApiException e) {
            log.error("Ошибка создания чека для платежа {}: {}", paymentId, e.getMessage());
            throw new RuntimeException("Не удалось создать чек", e);
        }
    }


    public PaginatedResponse<Payment> getPendingPayments() {
        try {
            PaymentList filter = PaymentList.builder()
                    .limit(10)
                    .build();
            return paymentProcessor.findAll(filter);
        } catch (ApiException e) {
            log.error("Ошибка получения списка платежей: {}", e.getMessage());
            throw new RuntimeException("Не удалось получить платежи", e);
        }
    }

    private String getSettlementType(Payment payment) {
        return switch (payment.getPaymentMethod().getType()) {
            case "bank_card", "sberbank", "tinkoff_bank", "alpha_bank", "sbp" ->
                    Settlement.Type.CASHLESS;
            case "yoo_money", "qiwi" ->
                    Settlement.Type.PREPAYMENT;
            case "cash" ->
                    Settlement.Type.PAYOUT;
            case "bank_transfer" ->
                    Settlement.Type.POSTPAYMENT;
            default ->
                    Settlement.Type.CASHLESS;
        };
    }



}
