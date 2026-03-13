package org.example.chatai.payments.domain;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ApiException;
import org.example.chatai.payments.api.dto.response.PaymentCreateResponse;
import org.example.chatai.payments.api.dto.response.PaymentPageResponse;
import org.example.chatai.payments.api.dto.response.PaymentResponse;
import org.example.chatai.payments.db.PaymentEntity;
import org.example.chatai.payments.db.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.loolzaaa.youkassa.client.ApiClient;
import ru.loolzaaa.youkassa.client.ApiClientBuilder;
import ru.loolzaaa.youkassa.model.Payment;
import ru.loolzaaa.youkassa.model.Receipt;
import ru.loolzaaa.youkassa.processors.PaymentProcessor;
import ru.loolzaaa.youkassa.processors.ReceiptProcessor;

import java.util.UUID;

@Service
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final YooKassaManager yooKassaManager;
    private final PaymentManager paymentManager;
    @Value("${shop_id}")
    private String shopId;

    @Value("${payment_key}")
    private String secretKey;

    private ApiClient apiClient;

    private PaymentProcessor paymentProcessor;
    private ReceiptProcessor receiptProcessor;

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper, YooKassaManager yooKassaManager, PaymentManager paymentManager) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.yooKassaManager = yooKassaManager;
        this.paymentManager = paymentManager;
    }

    @PostConstruct
    public void init() {
        log.info("Инициализация YooKassa: shopId={}, secretKey={} chars",
                shopId, secretKey.length());

        apiClient = ApiClientBuilder.newBuilder()
                .configureBasicAuth(shopId, secretKey)
                .build();
        paymentProcessor = new PaymentProcessor(apiClient);
        receiptProcessor = new ReceiptProcessor(apiClient);

        log.info("YooKassa инициализирована");
    }

    //================================Controller Methods================================================
    public PaymentResponse findPaymentDto(String paymentId){
        return paymentMapper.convertEntityToPaymentResponse(findPayment(paymentId));
    }

    public PaymentPageResponse findAllPaymentsByUser(int page, int size) {
        return paymentMapper.toPageResponse(paymentManager.findAllPaymentsByUser(page,size));
    }

    public Receipt findReceipt(String paymentId){
        return yooKassaManager.findReceipt(receiptProcessor,paymentId);
    }

    @Transactional
    public PaymentCreateResponse createPayment() {//TODO если у фронтенда не получиться с оплатой сделатьь через куки
        String idempotencyKey = UUID.randomUUID().toString();
        try {
            Payment saved = yooKassaManager.createYooKassaPayment(paymentProcessor,idempotencyKey);

            paymentManager.savePayment(idempotencyKey,saved);

            return new PaymentCreateResponse(
                    saved.getId(),
                    saved.getConfirmation().getConfirmationUrl()
            );
        } catch (ApiException e) {
            log.error("Ошибка создания платежа: {}", e.getMessage());
            throw new RuntimeException("Не удалось создать платеж", e);
        }
    }

    //TODO УЗНАТЬ ЧТО НАДО УКАЗЫВАТЬ В ЧЕКЕ
    @Transactional
    public Receipt createReceipt(String paymentId) {
        try {
            Receipt saved = yooKassaManager.createYooKassaReceipt(receiptProcessor,paymentId);
            paymentManager.saveReceipt(paymentId,saved);
            return saved;
        } catch (ApiException e) {
            log.error("Ошибка создания чека для платежа {}: {}", paymentId, e.getMessage());
            throw new RuntimeException("Не удалось создать чек", e);
        }
    }

    //================================Service Methods================================================

    public PaymentEntity findByPaymentId(String paymentId){
        return paymentRepository.findByPaymentId(paymentId);
    }

    public Payment findPayment(String paymentId) {
        return yooKassaManager.findPayment(paymentProcessor,paymentId);
    }

    public PaymentEntity save(PaymentEntity payment) {
        return paymentRepository.save(payment);
    }
}
