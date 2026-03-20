package org.example.chatai.adminStatistics.domain.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.adminStatistics.api.dto.requests.AdminStatsAllUsersFilter;
import org.example.chatai.adminStatistics.api.dto.responses.SubscriptionsPercentResponse;
import org.example.chatai.adminStatistics.api.dto.responses.UsersAmountResponse;
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

        return userMapper.convertEntitiesToUserDefaultResponses(users);
    }

    public UserDefaultResponse getSupportByEmail(String email) {
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));
        checkIsSupport(user);

        return userMapper.convertEntityToUserDefaultResponse(user);
    }

    public SubscriptionsPercentResponse getSubscriptionsPercent() {
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        Long usersAmount = userRepository.countUserEntitiesByRole(Role.USER);
        if (usersAmount == 0) {
            return new SubscriptionsPercentResponse(0L);
        }

        Long subscriptionsAmount = userRepository.countUsersByRoleWithActivePayment();
        Long subscriptionPercent = (subscriptionsAmount * 100) / usersAmount;

        return new SubscriptionsPercentResponse(subscriptionPercent);
    }

    //====================================SERVICE METHODS=======================================================

    private void checkIsAdmin(UserEntity user) {
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You are not admin!");
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
        if (!user.getRole().equals(Role.SUPPORT)) {
            throw new RuntimeException("This user is not support");
        }
    }
}
