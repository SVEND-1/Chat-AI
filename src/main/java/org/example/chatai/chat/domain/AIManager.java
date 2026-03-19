package org.example.chatai.chat.domain;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.chat.api.dto.response.ChatAIMessage;
import org.example.chatai.chat.api.dto.response.GlobalStats;
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
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

import java.io.File;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Component
@RequiredArgsConstructor
public class AIManager {

    private final OllamaChatModel chatModel;
    private final ChatMemory chatMemory;
    private final SubscriptionService subscriptionService;
    private final UserService userService;
    private final ChatRepository chatRepository;

    private final ConcurrentHashMap<String, AtomicInteger> counters = new ConcurrentHashMap<>();

    private final AtomicLong globalResponseTimeSum = new AtomicLong(0);
    private final AtomicInteger globalResponseCount = new AtomicInteger(0);

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final int MAX_MESSAGES = 50;
    private static final String GLOBAL_STATS_FILE = "chat-stats.json";


    @PostConstruct
    public void init(){
        for (ChatEntity chatEntity : chatRepository.findAll()){
            String chatIdStr = String.valueOf(chatEntity.getId());
            int count = chatMemory.get(chatIdStr, MAX_MESSAGES).size();
            counters.put(chatIdStr, new AtomicInteger(count));
        }

        loadGlobalStats();
    }

    @PreDestroy
    public void shutdown() {
        saveGlobalStats();
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


            Long start = System.currentTimeMillis();
            Flux<String> response = chatModel.stream(prompt)
                    .map(chuck -> chuck.getResult().getOutput().getText());
            Long end = System.currentTimeMillis();

            stat(start,end);

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


    public void deleted(String chatIdStr){
        try {
            chatMemory.clear(chatIdStr);
        }catch (Exception e){
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    private void stat(Long start,Long end){
        long durationMs = end - start;

        globalResponseTimeSum.addAndGet(durationMs);
        globalResponseCount.incrementAndGet();

        double globalAvg = (double) globalResponseTimeSum.get() / globalResponseCount.get();
        log.info("{} ms | GLOBAL avg: {} ms ({} responses)",
                 durationMs, globalAvg, globalResponseCount.get());
    }

    private void saveGlobalStats() {
        try {
            GlobalStats dto = new GlobalStats(
                    globalResponseTimeSum.get(),
                    globalResponseCount.get()
            );

            objectMapper.writeValue(new File(GLOBAL_STATS_FILE), dto);
        } catch (Exception e) {
            log.error("Failed to save global stats", e);
        }
    }

    private void loadGlobalStats() {
        try {
            File file = new File(GLOBAL_STATS_FILE);
            if (file.exists()) {
                GlobalStats dto = objectMapper.readValue(file, GlobalStats.class);
                globalResponseTimeSum.set(dto.responseTimeSum());
                globalResponseCount.set(dto.responseCount());
            }
        } catch (Exception e) {
            log.error("Failed to load global stats", e);
        }
    }

    private boolean isValid(String chatId) {
        SubscriptionEntity subscription = subscriptionService.findByUserEmail(
                userService.getCurrentUser().getEmail());
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

    public double getAvgResponseTime() {
        return (double) globalResponseTimeSum.get() / globalResponseCount.get();
    }

    public int getMessageCount(String chatId) {
        return counters.getOrDefault(chatId, new AtomicInteger(0)).get();
    }

    private void addMessageCount(String chatId) {
        counters.computeIfAbsent(chatId, k -> new AtomicInteger(0)).incrementAndGet();
    }

}
