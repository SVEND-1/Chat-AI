package org.example.chatai.supportTickets.domain.exceptions;

public class SupportTicketException extends RuntimeException{
    public SupportTicketException(String message) {
        super(message);
    }

    public SupportTicketException(String message, Throwable cause) {
        super(message, cause);
    }
}
