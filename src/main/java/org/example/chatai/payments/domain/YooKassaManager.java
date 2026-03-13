package org.example.chatai.payments.domain;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ApiException;
import org.example.chatai.payments.db.PaymentEntity;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import ru.loolzaaa.youkassa.model.Payment;
import ru.loolzaaa.youkassa.model.Receipt;
import ru.loolzaaa.youkassa.pojo.*;
import ru.loolzaaa.youkassa.processors.PaymentProcessor;
import ru.loolzaaa.youkassa.processors.ReceiptProcessor;

import java.util.List;

@Slf4j
@Component
public class YooKassaManager {

    private final PaymentService paymentService;

    public YooKassaManager(@Lazy PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    public Payment createYooKassaPayment(PaymentProcessor paymentProcessor, String idempotencyKey){
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

        return paymentProcessor.create(payment, idempotencyKey);
    }

    public Receipt createYooKassaReceipt(ReceiptProcessor receiptProcessor, String paymentId) {
        Payment payment = paymentService.findPayment(paymentId);
        if (!"succeeded".equals(payment.getStatus())) {
            log.warn("Чек создается для неуспешного платежа: {}", paymentId);
        }

        Customer customer = Customer.builder()
                .email("s5090@inbox.ru")
                .build();

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
                .send(true)
                .build();

        return receiptProcessor.create(receipt, null);
    }

    public Payment findPayment(PaymentProcessor paymentProcessor,String paymentId) {
        try {
            return paymentProcessor.findById(paymentId);
        } catch (ApiException e) {
            log.error("Ошибка поиска платежа {}: {}", paymentId, e.getMessage());
            throw new RuntimeException("Платеж не найден", e);
        }
    }

    public Receipt findReceipt(ReceiptProcessor receiptProcessor,String paymentId){
        try {
            PaymentEntity payment = paymentService.findByPaymentId(paymentId);
            return receiptProcessor.findById(payment.getReceiptId());
        }
        catch (Exception e){
            log.error("Ошибка поиска чека,ex={}", e.getMessage());
            throw new RuntimeException("Чек не найден", e);
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
