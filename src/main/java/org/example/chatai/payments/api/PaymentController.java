package org.example.chatai.payments.api;

import org.example.chatai.payments.api.dto.response.PaymentPageResponse;
import org.example.chatai.payments.api.dto.response.PaymentResponse;
import org.example.chatai.payments.domain.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.loolzaaa.youkassa.model.Payment;
import ru.loolzaaa.youkassa.model.Receipt;
import ru.loolzaaa.youkassa.pojo.Recipient;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/{paymentId}")
    public ResponseEntity<Receipt> getCheck(
            @PathVariable String paymentId
    ){
        return ResponseEntity.ok(paymentService.createReceipt(paymentId));
    }

    @GetMapping("/{paymentId}/receipt")
    public ResponseEntity<Receipt> getReceipt(
            @PathVariable String paymentId
    ){
        return ResponseEntity.ok(paymentService.findReceipt(paymentId));
    }


    @PostMapping("/")
    public ResponseEntity<Map<String, String>> createPayment() {
        Payment payment = paymentService.createPayment();

        return ResponseEntity.ok(Map.of(
                "paymentId", payment.getId(),
                "confirmationUrl", payment.getConfirmation().getConfirmationUrl()//TODO В ФРОНТЕНДЕ ПЕРЕКИНУТЬ СЮДА НАДО
        ));
    }

}
