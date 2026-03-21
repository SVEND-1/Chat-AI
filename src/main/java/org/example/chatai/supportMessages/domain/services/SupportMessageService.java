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
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.domain.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportMessageService {
    private final SupportMessageRepository supportMessageRepository;
    private final SupportMessageMapper supportMessageMapper;

    private final SupportTicketRepository supportTicketRepository;
    private final SupportTicketService supportTicketService;

    private final UserService userService;

    //====================================CONTROLLER METHODS=======================================================

    public SupportMessageResponse createMessage(
            Long supportTicketId,
            SupportMessageCreateRequest request
    ) {
        log.debug("Attempting to create support message");
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );
        log.debug("Found support ticket for method: createMessage");

        if (ticketEntity.getStatus() == SupportStatus.CLOSED) {
            throw new SupportMessageException("Ticket has been closed");
        }

        SupportMessageEntity messageEntity = SupportMessageEntity.builder()
                .supportTicket(ticketEntity)
                .sender(currentUser)
                .senderType(currentUser.getRole())
                .message(request.message())
                .build();

        SupportMessageEntity savedEntity = supportMessageRepository.save(messageEntity);
        log.debug("Created support message");
        return supportMessageMapper.convertEntityToResponse(savedEntity);
    }

    public List<SupportMessageResponse> getAllMessagesFromTicket(Long supportTicketId) {
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );
        log.debug("Found support ticket for method: getAllMessagesFromTicket");

        List<SupportMessageEntity> messagesFromTicket = supportMessageRepository.findAllBySupportTicket(ticketEntity);
        log.debug("Found messages from support ticket: {}", messagesFromTicket.size());

        return supportMessageMapper.convertEntityListToResponseList(messagesFromTicket);
    }

    public SupportMessageResponse getLastMessageFromTicket(Long supportTicketId) {
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );
        log.debug("Found support ticket for method: getLastMessageFromTicket");

        SupportMessageEntity lastMessage =
                supportMessageRepository.findLastMessageBySupportTicket(ticketEntity);
        log.debug("Found last message from support ticket");

        return supportMessageMapper.convertEntityToResponse(lastMessage);
    }

    public List<SupportMessageResponse> getAllUserMessagesFromTicket(Long supportTicketId) {
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );
        log.debug("Found support ticket for method: getAllUserMessagesFromTicket");

        List<SupportMessageEntity> userMessages =
                supportMessageRepository.findAllBySupportTicketAndSenderType(ticketEntity, Role.USER);
        log.debug("Found user messages from support ticket: {}", userMessages.size());

        return supportMessageMapper.convertEntityListToResponseList(userMessages);
    }

    public List<SupportMessageResponse> getAllSupportMessagesFromTicket(Long supportTicketId) {
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );
        log.debug("Found support ticket for method: getAllSupportMessagesFromTicket");


        List<SupportMessageEntity> supportMessages =
                supportMessageRepository.findAllBySupportTicketAndSenderType(ticketEntity, Role.SUPPORT);
        log.debug("Found support messages from support ticket: {}", supportMessages.size());

        return supportMessageMapper.convertEntityListToResponseList(supportMessages);
    }

    //====================================SERVICE METHODS=======================================================

}
