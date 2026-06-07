import { useRef, useCallback, useEffect } from "react";
import { SupportMessage } from "../../types/chat/support.types";
import { WS_BASE, getTokenFromCookie } from "../../api/supportApi";

interface UseWebSocketOptions {
    onMessage: (msg: SupportMessage) => void;
    onConnect: () => void;
    onDisconnect: () => void;
    onError: (msg: string) => void;
}

export function useWebSocket({ onMessage, onConnect, onDisconnect, onError }: UseWebSocketOptions) {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentTicketIdRef = useRef<number | null>(null);

    const disconnect = useCallback((intentional = false) => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (wsRef.current) {
            if (intentional) wsRef.current.close(1000);
            else wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    const connect = useCallback((ticketId: number) => {
        disconnect();
        currentTicketIdRef.current = ticketId;

        const token = getTokenFromCookie();
        const url = token
            ? `${WS_BASE}/${ticketId}?token=${encodeURIComponent(token)}`
            : `${WS_BASE}/${ticketId}`;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            onConnect();
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "ERROR") {
                    onError(data.message);
                    return;
                }
                const newMsg: SupportMessage = {
                    id: data.id,
                    senderId: data.senderId,
                    senderEmail: data.senderEmail,
                    senderType: data.senderType,
                    message: data.message,
                    createdAt: data.createdAt,
                };
                onMessage(newMsg);
            } catch (e) {
                console.error("WS parse error", e);
            }
        };

        ws.onclose = (event) => {
            onDisconnect();
            // Переподключаемся если закрытие не намеренное и тикет тот же
            if (event.code !== 1000 && currentTicketIdRef.current === ticketId) {
                reconnectTimerRef.current = setTimeout(() => {
                    if (currentTicketIdRef.current === ticketId) {
                        connect(ticketId);
                    }
                }, 3000);
            }
        };

        ws.onerror = () => {
            onDisconnect();
        };
    }, [disconnect, onConnect, onDisconnect, onError, onMessage]);

    const send = useCallback((payload: object) => {
        wsRef.current?.send(JSON.stringify(payload));
    }, []);

    // Очищаем при размонтировании
    useEffect(() => {
        return () => disconnect(true);
    }, [disconnect]);

    return { connect, disconnect, send, currentTicketIdRef };
}
