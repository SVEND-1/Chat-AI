package org.example.chatai.roleApplication.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.roleApplication.api.dto.request.AdminAnswerRequest;
import org.example.chatai.roleApplication.api.dto.request.RoleCreateRequest;
import org.example.chatai.roleApplication.api.dto.response.RoleResponse;
import org.example.chatai.roleApplication.api.exception.InvalidUserStatusException;
import org.example.chatai.roleApplication.db.RoleApplicationEntity;
import org.example.chatai.roleApplication.db.RoleRepository;
import org.example.chatai.roleApplication.db.StatusRole;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.db.UserRepository;
import org.example.chatai.users.domain.UserService;
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

    //Найти все заявки с фильтром

    //Ответить на заявку
    public RoleResponse getAdminAnswer(Long id, AdminAnswerRequest request) {
        UserEntity currentUser = userService.getCurrentUser();
        checkIsAdmin(currentUser);

        RoleApplicationEntity roleApplicationEntity =
                roleRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Request support not found"));

        checkRequestSupportIsWaiting(roleApplicationEntity);

        Role role = getRoleByAdminDecision(request.statusRole());
        if (role.equals(Role.SUPPORT)) {
            UserEntity user = roleApplicationEntity.getUser();
            user.setRole(role);
            userRepository.save(user);
        }

        roleApplicationEntity.setAnswerAdmin(request.answerAdmin());
        roleApplicationEntity.setStatusRole(request.statusRole());
        roleApplicationEntity.setAnsweredAt(LocalDateTime.now());

        return roleMapper.convertEntityToDTO(
                roleRepository.save(roleApplicationEntity)
        );
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
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You are not admin!");
        }
    }

    private void checkRequestSupportIsWaiting(RoleApplicationEntity roleApplicationEntity) {
        if (!roleApplicationEntity.getStatusRole().equals(StatusRole.WAITING)) {
            throw new RuntimeException("Your request has already been processed");
        }
    }

    private Role getRoleByAdminDecision(StatusRole statusRole) {
        if (statusRole.equals(StatusRole.WAITING)) {
            throw new RuntimeException("You can't set status WAITING!");
        }

        return statusRole.equals(StatusRole.APPROVED) ?
                Role.SUPPORT : Role.USER;
    }

}
