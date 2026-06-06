package org.example.chatai.globalException;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.chat.api.exception.ChatOwnershipException;
import org.example.chatai.payments.api.exception.PaymentOwnershipException;
import org.example.chatai.roleApplication.api.exception.InvalidUserStatusException;
import org.example.chatai.subscriptions.api.exception.SubscriptionOwnershipException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidUserStatusException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUserStatusException(InvalidUserStatusException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                "Вы являетесь сотрудником или у вас уже есть активная заявка",
                e.getMessage(),
                LocalDateTime.now()
        );

        return  ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(errorResponse);
    }

    @ExceptionHandler({
            PaymentOwnershipException.class,
            ChatOwnershipException.class,
            SubscriptionOwnershipException.class
    })
    public ResponseEntity<ErrorResponse> handlePaymentOwnershipException(PaymentOwnershipException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                "Не достаточно доступа к этм данным",
                e.getMessage(),
                LocalDateTime.now()
        );

        return  ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(errorResponse);
    }


    @ExceptionHandler({
            EntityNotFoundException.class,
            NoSuchElementException.class
    })
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException e) {
        ErrorResponse errorResponse = new ErrorResponse(
                "Не получилось найти данные",
                e.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(errorResponse);
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            IllegalStateException.class,
            MethodArgumentNotValidException.class,
    })
    public ResponseEntity<ErrorResponse> handleBadRequest(Exception e) {
        ErrorResponse errorResponse = new ErrorResponse(
                "Не правильно переданные данные",
                e.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errorResponse);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        ErrorResponse errorResponse = new ErrorResponse(
                "Ошибка сервера,попробуй ещё раз",
                e.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorResponse);
    }
}
