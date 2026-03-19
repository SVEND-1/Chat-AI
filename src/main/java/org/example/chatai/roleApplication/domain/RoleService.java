package org.example.chatai.roleApplication.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.roleApplication.api.dto.request.RoleCreateRequest;
import org.example.chatai.roleApplication.api.dto.response.RoleResponse;
import org.example.chatai.roleApplication.db.RoleApplicationEntity;
import org.example.chatai.roleApplication.db.RoleRepository;
import org.example.chatai.roleApplication.db.StatusRole;
import org.example.chatai.users.db.Role;
import org.example.chatai.users.db.UserEntity;
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
    //Никита
    //Найти все для пользователя
    //Создать заявку
    //Валидация создания заявки
    //Богдан
    //Найти все заявки с фильтром
    //Ответить на заявку

    public List<RoleResponse> findAllByUser() {
        List<RoleApplicationEntity> roles = roleRepository.findAllByUser(userService.getCurrentUser());
        return roleMapper.convertEntityListToDTO(roles);
    }

    public String save(RoleCreateRequest request) {
        try {
            UserEntity user = userService.getCurrentUser();
            if(!isValid(user)){
                log.warn("Пользователь является сотрудником или у него есть уже активная заявка");
                throw new RuntimeException();//TODO написать своё исключение
            }
            RoleApplicationEntity roleApplication =  RoleApplicationEntity.builder()
                    .messageUser(request.message())
                    .statusRole(StatusRole.WAITING)
                    .createdTime(LocalDateTime.now())
                    .user(user)
                    .build();
            roleRepository.save(roleApplication);
            return "Успешно";
        }catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    private boolean isValid(UserEntity user) {
        long count = findAllByUser().stream()
                .filter(el -> el.statusRole().equals(StatusRole.WAITING))
                .count();
        if(count != 0){
            return false;
        }
        if(user.getRole().equals(Role.SUPPORT) || user.getRole().equals(Role.ADMIN)){
            return false;
        }

        return true;
    }

}
