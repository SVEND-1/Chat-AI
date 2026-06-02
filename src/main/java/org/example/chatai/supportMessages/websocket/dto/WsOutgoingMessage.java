package org.example.chatai.supportMessages.websocket.dto;

import org.example.chatai.users.db.Role;

import java.time.LocalDateTime;

/**
 * Исходящее сообщение от сервера по WebSocket.
 * Отправляется всем участникам тикета после сохранения нового сообщения.
 */
public record WsOutgoingMessage(
        Long id,
        Long ticketId,
        Long senderId,
        String senderEmail,
        Role senderType,
        String message,
        LocalDateTime createdAt
) {
}
