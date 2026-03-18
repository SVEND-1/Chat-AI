package org.example.chatai.chat.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.text.StrBuilder;
import org.example.chatai.chat.api.dto.response.ChatAIResponse;
import org.example.chatai.chat.api.dto.response.ListChatAI;
import org.example.chatai.chat.db.ChatEntity;
import org.example.chatai.chat.db.ChatRepository;
import org.example.chatai.users.domain.UserService;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Repository
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
        }
        catch (Exception e){
            return e.getMessage();
        }
    }

    public Flux<String> sendMessageToAI(Long chatId,String question) {
        return aiManager.sendMessageToAI(chatId, question);
    }

    public String delete(Long chatId) {
        try {
            chatRepository.deleteById(chatId);//Добавить ещё удаление из нейронки сообщений
            return "Успешно";
        }
        catch (Exception e){
            return e.getMessage();
        }
    }

    private void isValid(Long chatId) {
        ChatEntity chatEntity = chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Чат не найден"));
        if(!chatEntity.getUser().getId().equals(userService.getCurrentUser().getId())){
            log.warn("Пользователь не является владельцем чата");
            throw new RuntimeException("Пользователь не является владельцем чата");
        }
    }

}
