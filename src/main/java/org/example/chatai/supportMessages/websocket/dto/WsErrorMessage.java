package org.example.chatai.supportMessages.websocket.dto;

/**
 * Сообщение об ошибке, отправляемое клиенту по WebSocket.
 * Тип: "ERROR" — клиент может отобразить его пользователю.
 */
public record WsErrorMessage(String type, String message) {
    public static WsErrorMessage of(String message) {
        return new WsErrorMessage("ERROR", message);
    }
}
