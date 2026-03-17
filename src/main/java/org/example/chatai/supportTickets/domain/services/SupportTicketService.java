package org.example.chatai.supportTickets.domain.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportTickets.api.dto.requests.SupportTicketCreateRequest;
import org.example.chatai.supportTickets.api.dto.responses.SupportStatusResponse;
import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.supportTickets.db.repositories.SupportTicketRepository;
import org.example.chatai.supportTickets.domain.mappers.SupportTicketMapper;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.db.UserRepository;
import org.example.chatai.users.domain.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportTicketService {
    private final SupportTicketRepository supportTicketRepository;
    private final SupportTicketMapper supportTicketMapper;
    private final UserService userService;
    private final UserRepository userRepository;

    //====================================CONTROLLER METHODS=======================================================

    public SupportTicketResponse createTicket(SupportTicketCreateRequest request) {
        UserEntity user = userService.getCurrentUser();
        checkForCreatingTicket(user);

        List<UserEntity> supports =
                supportTicketRepository.getMinimumCountOfOpenTicketsBySupportId().isEmpty() ?
                        userRepository.findByRole(Role.SUPPORT) :
                        supportTicketRepository.getMinimumCountOfOpenTicketsBySupportId();

        UserEntity currentSupport = getRandomSupportByMinimumTickets(supports);

        SupportTicketEntity supportTicketEntity = SupportTicketEntity.builder()
                .user(user)
                .support(currentSupport)
                .title(request.title())
                .build();

        return supportTicketMapper.convertEntityToResponse(
                supportTicketRepository.save(supportTicketEntity)
        );
    }

    public List<SupportTicketResponse> getAllTicketsByUser(
            Integer pageSize,
            Integer pageNum
    ) {
        UserEntity currentUser = userService.getCurrentUser();
        Pageable pageable = assemblePageable(pageSize, pageNum);

        List<SupportTicketEntity> supportTicketEntities =
                supportTicketRepository.findAllByUserId(currentUser.getId(), pageable);

        return supportTicketEntities.stream()
                .map(supportTicketMapper::convertEntityToResponse)
                .toList();
    }

    public SupportTicketResponse getTicketById(Long id) {
        SupportTicketEntity ticketEntity = supportTicketRepository.findByIdWithUser(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        UserEntity currentUser = userService.getCurrentUser();

        checkHavingUserTicket(ticketEntity, currentUser);

        return supportTicketMapper.convertEntityToResponse(ticketEntity);
    }

    public SupportStatusResponse getTicketStatusById(Long id) {
        SupportTicketEntity ticketEntity = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        return new SupportStatusResponse(ticketEntity.getStatus());
    }

    public SupportTicketResponse closeTicket(Long id) {
        SupportTicketEntity ticketEntity = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        UserEntity currentUser = userService.getCurrentUser();
        checkForClosingTicket(ticketEntity, currentUser);

        ticketEntity.setStatus(SupportStatus.CLOSED);
        ticketEntity.setClosedAt(LocalDateTime.now());

        return supportTicketMapper.convertEntityToResponse(
                supportTicketRepository.save(ticketEntity)
        );
    }

    //====================================SERVICE METHODS=======================================================

    private void checkForCreatingTicket(UserEntity user) {
        if (!userRepository.existsByRole(Role.SUPPORT)) {
            throw new RuntimeException("HOOOOOOW??? I think you haven't any users with role SUPPORT");
        }

        if (user.getRole() != Role.USER) {
            throw new RuntimeException("Only users can create a support ticket");
        }

        if (supportTicketRepository.existsByUserIdAndStatus(user.getId(), SupportStatus.OPEN)) {
            throw new RuntimeException("User's support ticket already open");
        }

    }

    private UserEntity getRandomSupportByMinimumTickets(List<UserEntity> supports) {
        if (supports.size() == 1) {
            return supports.getFirst();
        }

        Random random = new Random();
        int randomSupport = random.nextInt(supports.size());

        return supports.get(randomSupport);
    }

    private Pageable assemblePageable(Integer pageSize, Integer pageNum) {
        int pageSizeForPageable = pageSize == null ? 5 : pageSize;
        int pageNumForPageable = pageNum == null ? 0 : pageNum;
        return Pageable
                .ofSize(pageSizeForPageable)
                .withPage(pageNumForPageable);
    }

    private void checkHavingUserTicket(SupportTicketEntity ticketEntity, UserEntity currentUser) {
        if (!ticketEntity.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("It's not your ticket");
        }
    }

    private void checkForClosingTicket(
            SupportTicketEntity ticketEntity,
            UserEntity currentUser
    ) {
        checkForCurrentUser(ticketEntity, currentUser);

        if (hasSupportStatus(ticketEntity, SupportStatus.CLOSED)) {
            throw new RuntimeException("Ticket is already closed");
        }
    }

    private void checkForCurrentUser(
            SupportTicketEntity ticketEntity,
            UserEntity currentUser
    ) {
        log.info("Checking user's current ticket");
        if (!ticketEntity.getUser().getId().equals(currentUser.getId()) &&
                (!ticketEntity.getSupport().getId().equals(currentUser.getId()))
        ) {
            throw new RuntimeException("It's not your ticket");
        }
    }

    //====================================METHODS FOR OTHER SERVICES=======================================================
    public SupportTicketEntity getSupportTicketByIdWithCheckUser(Long id, UserEntity currentUser) {
        log.info("Getting support ticket with id {}", id);
        SupportTicketEntity ticketEntity = supportTicketRepository.findByIdWithUser(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        checkForCurrentUser(ticketEntity, currentUser);

        return ticketEntity;
    }

    public boolean hasSupportStatus(SupportTicketEntity ticketEntity, SupportStatus status) {
        return ticketEntity.getStatus() == status;
    }
}
