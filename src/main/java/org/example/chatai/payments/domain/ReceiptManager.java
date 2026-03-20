package org.example.chatai.payments.domain;

import lombok.extern.slf4j.Slf4j;
import org.example.chatai.payments.api.dto.response.receipt.ReceiptItem;
import org.example.chatai.payments.api.dto.response.receipt.ReceiptResponse;
import org.example.chatai.payments.api.dto.response.receipt.SettlementReceipt;
import org.example.chatai.payments.db.PaymentEntity;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import ru.loolzaaa.youkassa.model.Receipt;
import ru.loolzaaa.youkassa.pojo.Item;
import ru.loolzaaa.youkassa.pojo.Settlement;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Slf4j
@Component
public class ReceiptManager {

    private final PaymentService paymentService;

    public ReceiptManager(@Lazy PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    public void saveReceipt(String paymentId, Receipt saved) {
        try {
            PaymentEntity paymentEntity = paymentService.findByPaymentId(paymentId);
            paymentEntity.setReceiptId(saved.getId());
            paymentService.save(paymentEntity);
        }catch (Exception e) {
            log.error("Не удалось сохранить чек id={},ex={}",saved.getId(),e.getMessage());
        }
    }


}
