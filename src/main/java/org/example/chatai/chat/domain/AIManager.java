package org.example.chatai.chat.domain;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.chat.api.dto.response.ChatAIMessage;
import org.example.chatai.chat.db.ChatEntity;
import org.example.chatai.chat.db.ChatRepository;
import org.example.chatai.subscriptions.db.Status;
import org.example.chatai.subscriptions.db.SubscriptionEntity;
import org.example.chatai.subscriptions.domain.SubscriptionService;
import org.example.chatai.users.domain.UserService;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.model.Content;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Component
@RequiredArgsConstructor
public class AIManager {

    private final OllamaChatModel chatModel;
    private final ChatMemory chatMemory;
    private final SubscriptionService subscriptionService;
    private final UserService userService;
    private final ChatRepository chatRepository;

    private final ConcurrentHashMap<String, AtomicInteger> counters = new ConcurrentHashMap<>(); //В конструкторе инициализировать

    private final int MAX_MESSAGES = 50;


    @PostConstruct
    public void init(){
        for (ChatEntity chatEntity : chatRepository.findAll()){
            String chatIdStr = String.valueOf(chatEntity.getId());
            int count = chatMemory.get(chatIdStr, MAX_MESSAGES).size();
            counters.put(chatIdStr, new AtomicInteger(count));
        }
        log.info("Chat Memory:{}", counters.get("1"));
    }

    public List<ChatAIMessage> findMessagesChat(String chatIdStr){
        return chatMemory.get(chatIdStr,MAX_MESSAGES)
                .stream()
                .map(el -> new ChatAIMessage(
                        el.getText(),
                        el.getMessageType()
                ))
                .toList();
    }

    @Transactional
    public Flux<String> sendMessageToAI(Long chatId, String question) {
        String chatIdStr = String.valueOf(chatId);

        try {
            if (!isValid(chatIdStr)) {
                return Flux.empty();
            }

            UserMessage userMessage = new UserMessage(question);
            chatMemory.add(String.valueOf(chatIdStr),userMessage);
            addMessageCount(chatIdStr);

            Prompt prompt = new Prompt(chatMemory.get(String.valueOf(chatIdStr),MAX_MESSAGES));//Оптимизировать


            Flux<String> response = chatModel.stream(prompt)
                    .map(chuck -> chuck.getResult().getOutput().getText());

            response.collectList().subscribe(fullResponse -> {
                AssistantMessage assistantMessage = new AssistantMessage(String.join("", fullResponse));
                chatMemory.add(String.valueOf(chatIdStr),assistantMessage);
                addMessageCount(chatIdStr);
            });

            return response;
        }catch (Exception e){
            log.error(e.getMessage());
            return Flux.empty();
        }
    }

    private boolean isValid(String chatId) {
        SubscriptionEntity subscription = subscriptionService.findByUserEmail(userService.getCurrentUser().getEmail());
        int countMessageToChat = getMessageCount(chatId);

        if(countMessageToChat >= MAX_MESSAGES){
            return false;
        }

        if(subscription == null || subscription.getActive().equals(Status.BLOCKED)){
            if(countMessageToChat > 10){
                log.warn("Привышен лимит сообщений в чате без подписки");
                return false;
            }
        }

        return true;
    }


    public int getMessageCount(String chatId) {
        return counters.getOrDefault(chatId, new AtomicInteger(0)).get();
    }

    private void addMessageCount(String chatId) {
        counters.computeIfAbsent(chatId, k -> new AtomicInteger(0)).incrementAndGet();
    }

}
