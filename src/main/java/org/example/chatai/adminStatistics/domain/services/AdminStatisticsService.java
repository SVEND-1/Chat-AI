package org.example.chatai.adminStatistics.domain.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.adminStatistics.api.dto.requests.AdminStatsAllUsersFilter;
import org.example.chatai.adminStatistics.api.dto.responses.SubscriptionsPercentResponse;
import org.example.chatai.adminStatistics.api.dto.responses.UsersAmountResponse;
import org.example.chatai.adminStatistics.domain.exceptions.AdminStatisticsException;
import org.example.chatai.users.api.dto.users.response.UserDefaultResponse;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.db.UserRepository;
import org.example.chatai.users.domain.UserService;
import org.example.chatai.users.domain.mapper.UserMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminStatisticsService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    //====================================CONTROLLER METHODS=======================================================

    public UsersAmountResponse getUsersAmountByFilter(Role role) {
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        Long usersAmount = userRepository.countUserEntitiesByRole(role);
        log.debug("Found users amount: {}", usersAmount);

        return new UsersAmountResponse(usersAmount);
    }

    public List<UserDefaultResponse> getAllUsersByFilter(AdminStatsAllUsersFilter filter) {
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        Pageable pageable = assemblePageable(
                filter.pageSize(),
                filter.pageNumber()
        );

        List<UserEntity> users = userRepository.findAllByRole(filter.role(), pageable);
        log.debug("Found users: {}", users.size());

        return userMapper.convertEntitiesToUserDefaultResponses(users);
    }

    public UserDefaultResponse getSupportByEmail(String email) {
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email " + email + " not found"));
        log.debug("Found support by email");
        checkIsSupport(user);

        return userMapper.convertEntityToUserDefaultResponse(user);
    }

    public SubscriptionsPercentResponse getSubscriptionsPercent() {
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        Long usersAmount = userRepository.countUserEntitiesByRole(Role.USER);
        log.debug("Found users with role USER: {}", usersAmount);
        if (usersAmount == 0) {
            log.debug("No users with role USER");
            return new SubscriptionsPercentResponse(0L);
        }

        Long subscriptionsAmount = userRepository.countUsersByRoleWithActivePayment();
        log.debug("Found users with role USER with active payment: {}", subscriptionsAmount);
        Long subscriptionPercent = (subscriptionsAmount * 100) / usersAmount;
        log.debug("Found subscription percent {}", subscriptionPercent);

        return new SubscriptionsPercentResponse(subscriptionPercent);
    }

    //====================================SERVICE METHODS=======================================================

    private void checkIsAdmin(UserEntity user) {
        log.debug("Checking user is admin");
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new AdminStatisticsException("You are not admin!");
        }
    }

    private Pageable assemblePageable(Integer pageSize, Integer pageNumber) {
        int pageSizeForPageable = pageSize == null ? 5 : pageSize;
        int pageNumForPageable = pageNumber == null ? 0 : pageNumber;

        return Pageable
                .ofSize(pageSizeForPageable)
                .withPage(pageNumForPageable);
    }

    private void checkIsSupport(UserEntity user) {
        log.debug("Checking user is support");
        if (!user.getRole().equals(Role.SUPPORT)) {
            throw new AdminStatisticsException("This user is not support");
        }
    }
}
