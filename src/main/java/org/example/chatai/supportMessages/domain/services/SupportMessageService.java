package org.example.chatai.supportMessages.domain.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportMessages.api.dto.requests.SupportMessageCreateRequest;
import org.example.chatai.supportMessages.api.dto.responses.SupportMessageResponse;
import org.example.chatai.supportMessages.db.entities.SupportMessageEntity;
import org.example.chatai.supportMessages.db.repositories.SupportMessageRepository;
import org.example.chatai.supportMessages.domain.exceptions.SupportMessageException;
import org.example.chatai.supportMessages.domain.mappers.SupportMessageMapper;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.supportTickets.db.repositories.SupportTicketRepository;
import org.example.chatai.supportTickets.domain.services.SupportTicketService;
import org.example.chatai.users.api.dto.users.response.UserRegistrationResponse;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.db.UserRepository;
import org.example.chatai.users.domain.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportMessageService {

    private final SupportMessageRepository supportMessageRepository;
    private final SupportMessageMapper supportMessageMapper;
    private final SupportTicketService supportTicketService;
    private final UserRepository userRepository;

    // ===================== WebSocket (основной путь отправки) =====================

    /**
     * Создаёт сообщение через WebSocket.
     * Пользователь берётся из Principal, установленного WebSocketAuthChannelInterceptor при CONNECT.
     * Вызывается из SupportChatWebSocketController.
     */
    public SupportMessageResponse createMessage(
            Long supportTicketId,
            SupportMessageCreateRequest request,
            Principal principal
    ) {
        log.debug("WS: creating message in ticket {} for '{}'", supportTicketId, principal.getName());

        UserEntity currentUser = resolveUserFromPrincipal(principal);
        SupportTicketEntity ticket = supportTicketService.getSupportTicketByIdWithCheckUser(
                supportTicketId, currentUser);

        if (ticket.getStatus() == SupportStatus.CLOSED) {
            throw new SupportMessageException("Ticket has been closed");
        }

        SupportMessageEntity saved = supportMessageRepository.save(
                SupportMessageEntity.builder()
                        .supportTicket(ticket)
                        .sender(currentUser)
                        .senderType(currentUser.getRole())
                        .message(request.message())
                        .build()
        );

        log.debug("WS: message saved, id={}", saved.getId());
        return supportMessageMapper.convertEntityToResponse(saved);
    }

    // ===================== REST (только чтение истории) =====================

    /**
     * Вся история тикета — вызывается при открытии чата, чтобы загрузить прошлые сообщения.
     * В дальнейшем новые сообщения приходят по WS без дополнительных запросов.
     */
    public List<SupportMessageResponse> getAllMessagesFromTicket(Long supportTicketId) {
        log.debug("REST: getAllMessages for ticket {}", supportTicketId);
        SupportTicketEntity ticket = supportTicketService.getTicketByIdForService(supportTicketId);
        return supportMessageMapper.convertEntityListToResponseList(
                supportMessageRepository.findAllBySupportTicket(ticket));
    }

    /**
     * Последнее сообщение — удобно для превью тикета в списке.
     */
    public SupportMessageResponse getLastMessageFromTicket(Long supportTicketId) {
        log.debug("REST: getLastMessage for ticket {}", supportTicketId);
        SupportTicketEntity ticket = supportTicketService.getTicketByIdForService(supportTicketId);
        return supportMessageMapper.convertEntityToResponse(
                supportMessageRepository.findLastMessageBySupportTicket(ticket));
    }

    // ===================== Private helpers =====================

    private UserEntity resolveUserFromPrincipal(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken authToken
                && authToken.getPrincipal() instanceof UserRegistrationResponse dto) {

            UserEntity user = userRepository.findByEmailEqualsIgnoreCase(dto.email());
            if (user == null) {
                throw new SupportMessageException("User not found: " + dto.email());
            }
            return user;
        }
        throw new SupportMessageException("Cannot resolve user from WebSocket principal");
    }
}
