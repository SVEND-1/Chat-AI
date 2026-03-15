package org.example.chatai.payments.api;

import org.example.chatai.payments.api.dto.response.payment.PaymentCreateResponse;
import org.example.chatai.payments.api.dto.response.payment.PaymentPageResponse;
import org.example.chatai.payments.api.dto.response.payment.PaymentResponse;
import org.example.chatai.payments.api.dto.response.receipt.ReceiptResponse;
import org.example.chatai.payments.domain.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.loolzaaa.youkassa.model.Receipt;


@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<PaymentPageResponse> getPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return  ResponseEntity.ok(paymentService.findAllPaymentsByUser(page, size));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(
            @PathVariable String paymentId
    ){
        return ResponseEntity.ok(paymentService.findPaymentDto(paymentId));
    }



    @PostMapping
    public ResponseEntity<PaymentCreateResponse> createPayment() {
        return ResponseEntity.ok(paymentService.createPayment());
    }

}
