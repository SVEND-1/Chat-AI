package org.example.chatai.subscriptions.api;

import lombok.RequiredArgsConstructor;
import org.example.chatai.subscriptions.api.dto.response.SubscriptionDetailResponse;
import org.example.chatai.subscriptions.domain.SubscriptionService;
import org.reactivestreams.Subscription;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscription")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionDetailResponse> getSubscription(@PathVariable("id") Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscription(id));
    }

    @PostMapping("/{paymentId}")
    public ResponseEntity<String> subscribe(
            @PathVariable String paymentId
    ) {
        return ResponseEntity.ok().body(subscriptionService.createSubscription(paymentId));
    }
}
