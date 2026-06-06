package org.example.chatai.chat.domain;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.chat.api.dto.response.ChatAIResponse;
import org.example.chatai.chat.api.dto.response.ListChatAI;
import org.example.chatai.chat.api.exception.ChatOwnershipException;
import org.example.chatai.chat.db.ChatEntity;
import org.example.chatai.chat.db.ChatRepository;
import org.example.chatai.users.domain.UserService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserService userService;
    private final AIManager aiManager;

    public List<ListChatAI> findAllByUser() {
        return chatRepository.findByUserId(userService.getCurrentUser().getId())
                .stream()
                .map(el -> new ListChatAI(
                        el.getId(),
                        el.getTitle()
                ))
                .toList();
    }

    public ChatEntity findChat(Long chatId) {
        isValid(chatId);
        return chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Чат не найден"));
    }

    public ChatAIResponse findChatMessages(Long chatId) {
        isValid(chatId);
        return new ChatAIResponse(
                findChat(chatId).getTitle(),
                aiManager.findMessagesChat(String.valueOf(chatId))
        );
    }

    public String save(String title) {
        try {
            ChatEntity chatEntity = new ChatEntity();
            chatEntity.setTitle(title);
            chatEntity.setUser(userService.getCurrentUser());
            chatRepository.save(chatEntity);
            return title;
        } catch (Exception e) {
            log.error("Не удалось сохранить чат");
            return e.getMessage();
        }
    }

    public Flux<String> sendMessageToAI(Long chatId, String question) {
        return aiManager.sendMessageToAI(chatId, question);
    }

    @Transactional
    public String delete(Long chatId) {
        isValid(chatId);
        try {
            aiManager.deleted(String.valueOf(chatId));
            chatRepository.deleteById(chatId);
            return "Успешно";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    private void isValid(Long chatId) {
        ChatEntity chatEntity = chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Чат не найден"));
        if (!chatEntity.getUser().getId().equals(userService.getCurrentUser().getId())) {
            log.warn("Пользователь не является владельцем чата");
            throw new ChatOwnershipException("Пользователь не является владельцем чата");
        }
    }

}
