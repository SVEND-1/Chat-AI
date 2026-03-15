package org.example.chatai.chat.api;

import org.example.chatai.chat.db.ChatEntity;
import org.example.chatai.chat.domain.ChatService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.Map;

@RestController
@RequestMapping("/api/chats")
public class ChatAiController {

    private final ChatService chatService;

    public ChatAiController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/{chatId}")
    public Map<String,String> getChat(@PathVariable Long chatId) {
        return chatService.findChatMessages(chatId);
    }

    @PostMapping
    public String createChat(@RequestParam String title) {
        return chatService.save(title);
    }

    @PostMapping("/{chatId}")
    public Flux<String> sendMessage(
            @PathVariable Long chatId,
            @RequestParam String question
    ) {
        return chatService.sendMessageToAI(chatId,question);
    }
}
