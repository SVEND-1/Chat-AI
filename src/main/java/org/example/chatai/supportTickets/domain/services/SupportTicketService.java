package org.example.chatai.supportTickets.domain.services;

import lombok.RequiredArgsConstructor;
import org.example.chatai.supportTickets.api.dto.requests.SupportTicketCreateRequest;
import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.supportTickets.db.repositories.SupportTicketRepository;
import org.example.chatai.supportTickets.domain.mappers.SupportTicketMapper;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.domain.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SupportTicketService {
    private final SupportTicketRepository supportTicketRepository;
    private final SupportTicketMapper supportTicketMapper;
    private final UserService userService;

    //====================================CONTROLLER METHODS=======================================================

    public List<SupportTicketResponse> getAllTickets() {
        List<SupportTicketEntity> supportTicketEntities = supportTicketRepository.findAll();

        return supportTicketEntities.stream()
                .map(supportTicketMapper::convertEntityToResponse)
                .toList();
    }

    public SupportTicketResponse createTicket(SupportTicketCreateRequest request) {
        UserEntity user = userService.getCurrentUser();

        checkRightUser(user);

        List<UserEntity> supports = supportTicketRepository.getMinimumCountOfOpenTicketsBySupportId();

        if (supports.isEmpty()) {
            throw new RuntimeException("HOOOOOOW??? I think you haven't any users with role SUPPORT");
        }

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

    //====================================SERVICE METHODS=======================================================

    private UserEntity getRandomSupportByMinimumTickets(List<UserEntity> supports) {
        if (supports.size() == 1) {
            return supports.getFirst();
        }

        Random random = new Random();
        int randomSupport = random.nextInt(supports.size());

        return supports.get(randomSupport);
    }

    private void checkRightUser(UserEntity user) {
        if (user.getRole() != Role.USER) {
            throw new RuntimeException("Only users can create a support ticket");
        }

        if (supportTicketRepository.existsByUserIdAndStatus(user.getId(), SupportStatus.OPEN)) {
            throw new RuntimeException("User's support ticket already open");
        }

    }
}
