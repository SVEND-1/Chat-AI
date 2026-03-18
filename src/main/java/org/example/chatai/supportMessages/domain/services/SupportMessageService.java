package org.example.chatai.supportMessages.domain.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportMessages.api.dto.requests.SupportMessageCreateRequest;
import org.example.chatai.supportMessages.api.dto.responses.SupportMessageResponse;
import org.example.chatai.supportMessages.db.entities.SupportMessageEntity;
import org.example.chatai.supportMessages.db.repositories.SupportMessageRepository;
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
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );

        if (ticketEntity.getStatus() == SupportStatus.CLOSED) {
            throw new RuntimeException("Ticket has been closed");
        }

        SupportMessageEntity messageEntity = SupportMessageEntity.builder()
                .supportTicket(ticketEntity)
                .sender(currentUser)
                .senderType(currentUser.getRole())
                .message(request.message())
                .build();

        return supportMessageMapper.convertEntityToResponse(
                supportMessageRepository.save(messageEntity)
        );
    }

    public List<SupportMessageResponse> getAllMessagesFromTicket(Long supportTicketId) {
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );

        List<SupportMessageEntity> messagesFromTicket = supportMessageRepository.findAllBySupportTicket(ticketEntity);

        return messagesFromTicket.stream()
                .map(supportMessageMapper::convertEntityToResponse)
                .toList();
    }

    public SupportMessageResponse getLastMessageFromTicket(Long supportTicketId) {
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );

        SupportMessageEntity lastMessage =
                supportMessageRepository.findLastMessageBySupportTicket(ticketEntity);

        return supportMessageMapper.convertEntityToResponse(lastMessage);
    }

    public List<SupportMessageResponse> getAllUserMessagesFromTicket(Long supportTicketId) {
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );

        List<SupportMessageEntity> userMessages =
                supportMessageRepository.findAllBySupportTicketAndSenderType(ticketEntity, Role.USER);

        return userMessages.stream()
                .map(supportMessageMapper::convertEntityToResponse)
                .toList();
    }

    public List<SupportMessageResponse> getAllSupportMessagesFromTicket(Long supportTicketId) {
        UserEntity currentUser = userService.getCurrentUser();
        SupportTicketEntity ticketEntity =
                supportTicketService.getSupportTicketByIdWithCheckUser(
                        supportTicketId,
                        currentUser
                );

        List<SupportMessageEntity> userMessages =
                supportMessageRepository.findAllBySupportTicketAndSenderType(ticketEntity, Role.SUPPORT);

        return userMessages.stream()
                .map(supportMessageMapper::convertEntityToResponse)
                .toList();
    }

    //====================================SERVICE METHODS=======================================================

}
