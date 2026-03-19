package org.example.chatai.payments.api;

import lombok.RequiredArgsConstructor;
import org.example.chatai.payments.api.dto.response.receipt.ReceiptResponse;
import org.example.chatai.payments.domain.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.loolzaaa.youkassa.model.Receipt;

@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
public class ReceiptController {
    private final PaymentService paymentService;

    @GetMapping("/{paymentId}")
    public ResponseEntity<ReceiptResponse> getReceipt(
            @PathVariable String paymentId
    ){
        return ResponseEntity.ok(paymentService.findReceipt(paymentId));
    }

    @PostMapping("/{paymentId}")
    public ResponseEntity<ReceiptResponse> createReceipt(
            @PathVariable String paymentId
    ){
        return ResponseEntity.ok(paymentService.createReceipt(paymentId));
    }


}
