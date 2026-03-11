package org.example.chatai.notify.kafka;

import org.example.chatai.notify.EmailSenderService;
import org.example.chatai.notify.event.NotifyEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotifyKafkaConsumer {
    private final EmailSenderService emailSenderService;

    public NotifyKafkaConsumer(EmailSenderService emailSenderService) {
        this.emailSenderService = emailSenderService;
    }

    @KafkaListener(topics = "notifyUser")
    public void consumeNotify(NotifyEvent event) {
        emailSenderService.sendEmail(event);
    }
}
