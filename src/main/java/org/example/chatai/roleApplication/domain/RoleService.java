package org.example.chatai.roleApplication.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.roleApplication.api.dto.request.AdminAnswerRequest;
import org.example.chatai.roleApplication.api.dto.request.RoleApplicationSearchFilter;
import org.example.chatai.roleApplication.api.dto.request.RoleCreateRequest;
import org.example.chatai.roleApplication.api.dto.response.RoleResponse;
import org.example.chatai.roleApplication.api.exception.InvalidUserStatusException;
import org.example.chatai.roleApplication.db.RoleApplicationEntity;
import org.example.chatai.roleApplication.db.RoleRepository;
import org.example.chatai.roleApplication.db.StatusRole;
import org.example.chatai.roleApplication.domain.exceptions.RoleApplicationException;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.db.UserRepository;
import org.example.chatai.users.domain.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserService userService;
    private final RoleMapper roleMapper;
    private final UserRepository userRepository;

    //====================================CONTROLLER METHODS=======================================================

    // Никита

    // Найти все заявки пользователя
    public List<RoleResponse> findAllByUser() {
        List<RoleApplicationEntity> roles = roleRepository.findAllByUser(userService.getCurrentUser());
        return roleMapper.convertEntityListToDTO(roles);
    }

    // Создать заявку
    public String save(RoleCreateRequest request) {
        try {
            UserEntity user = userService.getCurrentUser();

            if (!isValid(user)) {
                log.warn("Пользователь является сотрудником или у него есть уже активная заявка");
                throw new InvalidUserStatusException("Пользователь является сотрудником или у него есть уже активная заявка");
            }

            RoleApplicationEntity roleApplication = RoleApplicationEntity.builder()
                    .messageUser(request.message())
                    .statusRole(StatusRole.WAITING)
                    .user(user)
                    .build();
            roleRepository.save(roleApplication);
            return "Успешно";
        } catch (Exception e) {
            log.error("Не удалось сохранить заявкау на роль,ex={}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    // Богдан

    //Ответить на заявку
    public RoleResponse getAdminAnswer(Long id, AdminAnswerRequest request) {
        log.debug("Attempting to get admin answer");
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        RoleApplicationEntity roleApplicationEntity =
                roleRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Request support not found"));
        log.debug("Found role application");

        checkRequestSupportIsWaiting(roleApplicationEntity);

        Role role = getRoleByAdminDecision(request.statusRole());
        if (role.equals(Role.SUPPORT)) {
            UserEntity user = roleApplicationEntity.getUser();
            user.setRole(role);
            userRepository.save(user);
            log.debug("User's role changed successfully");
        }

        roleApplicationEntity.setAnswerAdmin(request.answerAdmin());
        roleApplicationEntity.setStatusRole(request.statusRole());
        roleApplicationEntity.setAnsweredAt(LocalDateTime.now());

        RoleApplicationEntity savedEntity = roleRepository.save(roleApplicationEntity);
        log.debug("Role application saved successfully");
        return roleMapper.convertEntityToDTO(savedEntity);
    }

    //Найти все заявки с фильтром
    public List<RoleResponse> getAllRoleApplicationsWithFilter(RoleApplicationSearchFilter filter) {
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        Pageable pageable = assemblePageable(
                filter.pageSize(),
                filter.pageNumber()
        );

        List<RoleApplicationEntity> roleApplicationEntities =
                roleRepository.findAllByFilter(filter.statusRole(), pageable);
        log.debug("Found role applications with filter");

        return roleMapper.convertEntityListToDTO(roleApplicationEntities);
    }

    //====================================SERVICE METHODS=======================================================

    // Никита

    // Валидация создания заявки
    private boolean isValid(UserEntity user) {
        long count = findAllByUser().stream()
                .filter(el -> el.statusRole().equals(StatusRole.WAITING))
                .count();
        if (count != 0) {
            return false;
        }
        if (user.getRole().equals(Role.SUPPORT) || user.getRole().equals(Role.ADMIN)) {
            return false;
        }

        return true;
    }

    // Богдан

    private void checkIsAdmin(UserEntity user) {
        log.debug("Checking user is admin");
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new RoleApplicationException("You are not admin!");
        }
    }

    private void checkRequestSupportIsWaiting(RoleApplicationEntity roleApplicationEntity) {
        log.debug("Checking request support is waiting");
        if (!roleApplicationEntity.getStatusRole().equals(StatusRole.WAITING)) {
            throw new RoleApplicationException("Your request has already been processed");
        }
    }

    private Role getRoleByAdminDecision(StatusRole statusRole) {
        log.debug("Getting role by admin decision");
        if (statusRole.equals(StatusRole.WAITING)) {
            throw new RoleApplicationException("You can't set status WAITING!");
        }

        return statusRole.equals(StatusRole.APPROVED) ?
                Role.SUPPORT : Role.USER;
    }

    private Pageable assemblePageable(Integer pageSize, Integer pageNumber) {
        int pageSizeForPageable = pageSize == null ? 5 : pageSize;
        int pageNumForPageable = pageNumber == null ? 0 : pageNumber;

        return Pageable
                .ofSize(pageSizeForPageable)
                .withPage(pageNumForPageable);
    }
}
