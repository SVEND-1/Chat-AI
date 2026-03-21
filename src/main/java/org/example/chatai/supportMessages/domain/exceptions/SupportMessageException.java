package org.example.chatai.supportMessages.domain.exceptions;

public class SupportMessageException extends RuntimeException {
    public SupportMessageException(String message) {
        super(message);
    }

    public SupportMessageException(String message, Throwable cause) {
        super(message, cause);
    }
}
