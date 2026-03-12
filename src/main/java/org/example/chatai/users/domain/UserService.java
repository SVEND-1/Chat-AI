package org.example.chatai.users.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.users.api.dto.users.request.UserCreateRequest;
import org.example.chatai.users.api.dto.users.response.UserDTO;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.db.UserRepository;
import org.example.chatai.users.domain.mapper.UserMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserEntity getCurrentUser() {
        UserDTO dto = (UserDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findByEmailEqualsIgnoreCase(dto.email());
        notFoundUser(user);
        return user;
    }


    public UserDTO findUserByEmail(String email) {
        if (email == null) {
            log.debug("Пустой email,поиск пользователя не возможен");
            throw new IllegalArgumentException("Пустой email пользователя");
        }

        UserEntity user = userRepository.findByEmailEqualsIgnoreCase(email);
        return userMapper.convertEntityToDto(user);
    }

    public UserDTO save(UserCreateRequest request) {
        try {
            log.info("Сохранения пользователя с email={}", request.email());
            UserEntity savedUser = UserEntity.builder()
                    .email(request.email())
                    .name(request.name())
                    .password(request.password())
                    .role(request.role())
                    .build();
            UserEntity saved = userRepository.save(savedUser);
            return userMapper.convertEntityToDto(saved);
        } catch (Exception e) {
            log.info("Не удалось сохранить пользователя,ex={}", e.getMessage());
            throw new RuntimeException("Не удалось сохранить пользователя,ex=" + e.getMessage());
        }
    }

    @Transactional
    public UserDTO update(Long id, UserEntity userToUpdate) {
        try {
            log.info("Обновление пользователя с id={}", id);
            UserEntity user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));

            UserEntity updatedUser = UserEntity.builder()
                    .id(user.getId())
                    .name(userToUpdate.getName())
                    .email(userToUpdate.getEmail())
                    .password(user.getPassword())
                    .build();

            UserEntity savedUser = userRepository.save(updatedUser);
            log.info("Пользователь обновлен с id={}", savedUser.getId());
            return userMapper.convertEntityToDto(savedUser);
        } catch (DataIntegrityViolationException e) {
            log.error("Ошибка обновление пользователя id={}, ex={}", id, e.getMessage());
            throw new RuntimeException("Ошибка обновление пользователя", e);
        }
    }


    @Transactional
    public UserDTO changePassword(Long id, String newPassword) {
        try {
            log.info("Обновление пароля у пользователя с id={}", id);
            UserEntity user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));

            user.setPassword(newPassword);

            UserEntity savedUser = userRepository.save(user);
            log.info("Пароль пользователя обновлен с id={}", savedUser.getId());
            return userMapper.convertEntityToDto(savedUser);
        } catch (Exception e) {
            log.error("Ошибка смена пароля пользователя id={}, ex={}", id, e.getMessage());
            throw new RuntimeException(
                    "Не удалось изменить пароль, ex=" + e.getMessage()
            );
        }
    }

    public void delete(Long id) {
        try {
            userRepository.deleteById(id);
            log.info("Пользователб с id={} удален", id);
        } catch (Exception e) {
            log.error("Не удалось удалить пользователя с id={}, ex={}", id, e.getMessage());
            throw new RuntimeException();
        }
    }

    private static void notFoundUser(UserEntity user) {
        if (user == null) {
            log.error("Авторизованный пользователь не найдет");
            throw new IllegalArgumentException("Не найден пользователь");
        }
    }

}
