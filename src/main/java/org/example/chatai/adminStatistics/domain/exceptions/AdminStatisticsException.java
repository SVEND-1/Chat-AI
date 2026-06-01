package org.example.chatai.adminStatistics.domain.exceptions;

public class AdminStatisticsException extends RuntimeException{
    public AdminStatisticsException(String message) {
        super(message);
    }
    public AdminStatisticsException(String message, Throwable cause) {
        super(message, cause);
    }
}
