package org.example.chatai.roleApplication.domain.exceptions;

public class RoleApplicationException extends RuntimeException {
    public RoleApplicationException(String message) {
        super(message);
    }

    public RoleApplicationException(String message, Throwable cause) {
        super(message, cause);
    }
}
