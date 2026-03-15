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
        PaymentEntity paymentEntity = paymentService.findByPaymentId(paymentId);
        paymentEntity.setReceiptId(saved.getId());
        paymentService.save(paymentEntity);
    }

    public ReceiptResponse convertEntityToDto(Receipt receipt) {
        List<ReceiptItem> items = receipt.getItems()
                .stream()
                .map(ReceiptManager::convertReceiptItem)
                .toList();

        List<SettlementReceipt> settlements = receipt.getSettlements()
                .stream()
                .map(ReceiptManager::convertSettlementReceipt)
                .toList();

        return new ReceiptResponse(
                receipt.getId(),
                receipt.getType(),
                receipt.getPaymentId(),
                receipt.getStatus(),
                "999",

                receipt.getFiscalDocumentNumber(),
                receipt.getFiscalStorageNumber(),
                receipt.getFiscalAttribute(),
                receipt.getRegisteredAt(),
                receipt.getFiscalProviderId(),

                items,
                settlements,

                "ChatAI"
        );
    }
    private static ReceiptItem convertReceiptItem(Item el) {
        return new ReceiptItem(
                el.getDescription(),
                el.getQuantity(),
                el.getAmount().getValue(),
                el.getAmount().getCurrency(),
                el.getVatCode()
        );
    }

    private static SettlementReceipt convertSettlementReceipt(Settlement el) {
        return new SettlementReceipt(
                el.getType(),
                el.getAmount().getValue(),
                el.getAmount().getCurrency()
        );
    }
}
