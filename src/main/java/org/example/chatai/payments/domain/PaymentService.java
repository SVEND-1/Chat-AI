package org.example.chatai.payments.domain;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ApiException;
import org.springframework.beans.factory.annotation.Value;
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

import java.util.List;

@Service
@Slf4j
public class PaymentService {
    @Value("${shop_id}")
    private String shopId;

    @Value("${payment_key}")
    private String secretKey;

    private ApiClient apiClient;

    private PaymentProcessor paymentProcessor;
    private RefundProcessor refundProcessor;
    private ReceiptProcessor receiptProcessor;

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

    public Payment createPayment(String amountRub, String description, String returnUrl) {//TODO Добавить индепотентность
        try {
            Amount amount = Amount.builder()
                    .value(amountRub)
                    .currency(Currency.RUB)
                    .build();

            Confirmation confirmation = Confirmation.builder()
                    .type(Confirmation.Type.REDIRECT)
                    .returnUrl(returnUrl)
                    .build();

            Payment payment = Payment.builder()
                    .amount(amount)
                    .description(description)
                    .confirmation(confirmation)
                    .capture(true)
                    .build();

            return paymentProcessor.create(payment, null);
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

    public Receipt createReceipt(String paymentId, String customerPhone, String itemDescription) {//TODO ПЕРЕДЕЛАТЬ
        try {
            Customer customer = Customer.builder()
                    .phone(customerPhone)
                    .build();

            Amount itemAmount = Amount.builder()
                    .value("1000")
                    .currency(Currency.RUB)
                    .build();

            Item item = Item.builder()
                    .description(itemDescription)
                    .amount(itemAmount)
                    .vatCode(1)
                    .quantity("1")
                    .build();

            Settlement settlement = Settlement.builder()
                    .type("cashless")
                    .amount(itemAmount)
                    .build();

            Receipt receipt = Receipt.builder()
                    .type(Receipt.Type.PAYMENT)
                    .paymentId(paymentId)
                    .customer(customer)
                    .items(List.of(item))
                    .settlements(List.of(settlement))
                    .send(true)
                    .build();

            return receiptProcessor.create(receipt, null);
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
}
