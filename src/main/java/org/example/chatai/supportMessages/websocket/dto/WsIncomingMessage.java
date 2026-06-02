package org.example.chatai.supportMessages.websocket.dto;

/**
 * Входящее сообщение от клиента по WebSocket.
 * Клиент шлёт простой JSON: {"message": "текст"}
 */
public record WsIncomingMessage(String message) {
}
