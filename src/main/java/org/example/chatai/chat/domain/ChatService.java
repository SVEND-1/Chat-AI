package org.example.chatai.chat.domain;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.text.StrBuilder;
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

@Repository
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserService userService;
    private final AIManager aiManager;

    public List<ChatEntity> findAll() {
        return chatRepository.findAll();
    }

    public List<String> findAllByUser() {
        return chatRepository.findByUserId(userService.getCurrentUser().getId())
                .stream()
                .map(ChatEntity::getTitle)
                .toList();
    }

    public ChatEntity findChat(Long chatId) {
        return chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));
    }

    public Map<String,String> findChatMessages(Long chatId) {
        ChatEntity chatEntity = findChat(chatId);

        StrBuilder strBuilder = new StrBuilder();
        for (String message : aiManager.findMessagesChat(String.valueOf(chatId))){
            strBuilder.append(message);
        }

        Map<String,String> result = new HashMap<>();
        result.put("chat",chatEntity.getTitle());
        result.put("content",strBuilder.toString());
        return result;
    }

    public String save(String title) {
        try {
            ChatEntity chatEntity = new ChatEntity();
            chatEntity.setTitle(title);
            chatEntity.setUser(userService.getCurrentUser());
            chatRepository.save(chatEntity);
            return "Успешно";
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
            chatRepository.deleteById(chatId);
            return "Успешно";
        }
        catch (Exception e){
            return e.getMessage();
        }
    }


}
