package org.example.chatai.payments.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.chatai.payments.domain.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.loolzaaa.youkassa.model.Payment;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestParam String amountRub,
            @RequestParam String description,
            @RequestParam(defaultValue = "http://localhost:8080/") String returnUrl
    ) {
        Payment payment = paymentService.createPayment(amountRub, description, returnUrl);

        return ResponseEntity.ok(Map.of(
                "paymentId", payment.getId(),
                "confirmationUrl", payment.getConfirmation().getConfirmationUrl()//TODO В ФРОНТЕНДЕ ПЕРЕКИНУТЬ СЮДА НАДО
        ));
    }

}
