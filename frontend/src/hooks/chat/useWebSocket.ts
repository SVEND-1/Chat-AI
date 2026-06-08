import { useRef, useCallback, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SupportMessage } from "../../types/chat/support.types";
import axios from "axios";

interface UseWebSocketOptions {
    onMessage: (msg: SupportMessage) => void;
    onConnect: () => void;
    onDisconnect: () => void;
    onError: (msg: string) => void;
}

async function fetchWsToken(): Promise<string> {
    try {
        const res = await axios.get("/api/auth/token", {
            withCredentials: true,
        });
        return res.data.token ?? "";
    } catch {
        return "";
    }
}

export function useWebSocket({ onMessage, onConnect, onDisconnect, onError }: UseWebSocketOptions) {
    const clientRef = useRef<Client | null>(null);
    const currentTicketIdRef = useRef<number | null>(null);

    const disconnect = useCallback((_intentional = false) => {
        if (clientRef.current?.active) {
            clientRef.current.deactivate();
        }
        clientRef.current = null;
    }, []);

    const connect = useCallback(async (ticketId: number) => {
        disconnect();
        currentTicketIdRef.current = ticketId;

        const token = await fetchWsToken();
        if (!token) {
            onError("Не удалось получить токен для WebSocket");
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS("/ws/support"),
            connectHeaders: { token },
            reconnectDelay: 3000,
            onConnect: () => {
                onConnect();
                client.subscribe(`/topic/support/${ticketId}`, (frame) => {
                    try {
                        const data = JSON.parse(frame.body);
                        if (data.type === "ERROR") { onError(data.message); return; }
                        const msg: SupportMessage = {
                            id: data.id,
                            senderId: data.senderId,
                            senderEmail: data.senderEmail,
                            senderType: data.senderType,
                            message: data.message,
                            createdAt: data.createdAt,
                        };
                        onMessage(msg);
                    } catch (e) {
                        console.error("WS parse error", e);
                    }
                });
            },
            onDisconnect: () => onDisconnect(),
            onStompError: (frame) => onError(frame.headers["message"] ?? "WS error"),
        });

        client.activate();
        clientRef.current = client;
    }, [disconnect, onConnect, onDisconnect, onError, onMessage]);

    const send = useCallback((payload: object) => {
        if (clientRef.current?.active && currentTicketIdRef.current) {
            clientRef.current.publish({
                destination: `/app/support/${currentTicketIdRef.current}/send`,
                body: JSON.stringify(payload),
            });
        }
    }, []);

    useEffect(() => {
        return () => disconnect(true);
    }, [disconnect]);

    return { connect, disconnect, send, currentTicketIdRef };
}