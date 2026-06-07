import { useState, useEffect, useRef, useCallback } from "react";
import { SupportTicket, SupportMessage } from "../../types/chat/support.types";
import {
    fetchCurrentUser,
    fetchTickets,
    createTicket,
    closeTicketApi,
    fetchMessages,
} from "../../api/supportApi";
import { useWebSocket } from "./useWebSocket";

export function useSupport() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMsgLoading, setIsMsgLoading] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const [wsError, setWsError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const onMessage = useCallback((msg: SupportMessage) => {
        setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
        });
    }, []);

    const { connect, disconnect, send, currentTicketIdRef } = useWebSocket({
        onMessage,
        onConnect:    () => { setWsConnected(true); setWsError(null); },
        onDisconnect: () => setWsConnected(false),
        onError:      (msg) => setWsError(msg),
    });

    // Загрузка при монтировании
    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchCurrentUser(), fetchTickets()])
            .then(([user, data]) => {
                if (user) setCurrentUserId(user.id);
                setTickets(data);
                if (data.length > 0) selectTicket(data[0], user?.id ?? null);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const selectTicket = async (ticket: SupportTicket, knownUserId?: number | null) => {
        setCurrentTicket(ticket);
        setMessages([]);
        setWsError(null);
        setWsConnected(false);
        currentTicketIdRef.current = ticket.id;

        // Закрываем старый WS
        disconnect(true);

        setIsMsgLoading(true);
        try {
            const msgs = await fetchMessages(ticket.id);
            setMessages(msgs);

            if (knownUserId !== undefined && knownUserId !== null) {
                setCurrentUserId(knownUserId);
            } else {
                const userMsg = msgs.find((m) => m.senderType === "USER");
                if (userMsg) setCurrentUserId(userMsg.senderId);
                else if (ticket.user?.id) setCurrentUserId(ticket.user.id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsMsgLoading(false);
        }

        if (ticket.status !== "CLOSED" && ticket.support != null) {
            connect(ticket.id);
        }
    };

    const handleSend = (input: string) => {
        if (!input.trim() || !currentTicket || !wsConnected) return;
        if (currentTicket.status === "CLOSED") return;
        send({ message: input.trim() });
    };

    const handleCreateTicket = async (title: string) => {
        const ticket = await createTicket(title.trim());
        setTickets((prev) => [ticket, ...prev]);
        selectTicket(ticket, currentUserId);
        return ticket;
    };

    const handleCloseTicket = async () => {
        if (!currentTicket) return;
        const updated = await closeTicketApi(currentTicket.id);
        setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setCurrentTicket(updated);
        currentTicketIdRef.current = null;
        disconnect(true);
        setWsConnected(false);
    };

    return {
        tickets,
        currentTicket,
        messages,
        isLoading,
        isMsgLoading,
        wsConnected,
        wsError,
        currentUserId,
        selectTicket,
        handleSend,
        handleCreateTicket,
        handleCloseTicket,
    };
}
