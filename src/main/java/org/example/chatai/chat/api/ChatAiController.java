package org.example.chatai.chat.api;

import io.swagger.v3.oas.annotations.Operation;
import org.example.chatai.chat.api.dto.response.ChatAIResponse;
import org.example.chatai.chat.api.dto.response.ListChatAI;
import org.example.chatai.chat.domain.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatAiController {

    private final ChatService chatService;

    public ChatAiController(ChatService chatService) {
        this.chatService = chatService;
    }

    @Operation(summary = "Получить все чаты пользователя")
    @GetMapping
    public ResponseEntity<List<ListChatAI>> getChats() {
        return ResponseEntity.ok(chatService.findAllByUser());
    }

    @Operation(summary = "Получить чат по id")
    @GetMapping("/{chatId}")
    public ResponseEntity<ChatAIResponse> getChat(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.findChatMessages(chatId));
    }

    @Operation(summary = "Создать чат")
    @PostMapping
    public ResponseEntity<String> createChat(@RequestParam String title) {
        return ResponseEntity.ok(chatService.save(title));
    }

    @Operation(summary = "Отправить вопрос нейронке")
    @PostMapping("/{chatId}")
    public ResponseEntity<Flux<String>> sendMessage(
            @PathVariable Long chatId,
            @RequestParam String question
    ) {
        return ResponseEntity.ok(chatService.sendMessageToAI(chatId,question));
    }

    @Operation(summary = "Удалить чат")
    @DeleteMapping("/{chatId}")
    public ResponseEntity<String> deleteChat(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.delete(chatId));
    }
}
