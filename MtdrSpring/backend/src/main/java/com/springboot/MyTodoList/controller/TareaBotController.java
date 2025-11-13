package com.springboot.MyTodoList.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.springframework.beans.factory.annotation.Autowired;
import org.telegram.telegrambots.meta.api.objects.Update;

import com.springboot.MyTodoList.service.TareaService;
import com.springboot.MyTodoList.service.UsuarioService;
import com.springboot.MyTodoList.service.ProyectoService;
import com.springboot.MyTodoList.util.TareaBotActions;

@Component
public class TareaBotController extends TelegramLongPollingBot {

    private static final Logger logger = LoggerFactory.getLogger(TareaBotController.class);

    private final TareaService tareaService;
    private final UsuarioService usuarioService;
    private final ProyectoService proyectoService;

    @Value("${telegram.bot.name}")
    private String botUsername;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Autowired
    public TareaBotController(
            @Value("${telegram.bot.name}") String botUsername,
            @Value("${telegram.bot.token}") String botToken,
            TareaService tareaService,
            UsuarioService usuarioService,
            ProyectoService proyectoService) {
        this.botUsername = botUsername;
        this.botToken = botToken;
        this.tareaService = tareaService;
        this.usuarioService = usuarioService;
        this.proyectoService = proyectoService;
    }

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    /**
     * Called whenever the bot receives an update (a message, command, etc.)
     */
    @Override
    public void onUpdateReceived(Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) {
            return;
        }

        String text = update.getMessage().getText();
        long chatId = update.getMessage().getChatId();

        logger.info("Received message: '{}' from chatId {}", text, chatId);

        // Create the bot actions handler with all required services
        TareaBotActions actions = new TareaBotActions(this, tareaService, usuarioService, proyectoService);
        actions.setRequestText(text);
        actions.setChatId(chatId);

        // Execute bot actions in priority order
        actions.fnStart();
        actions.fnListAll();
        actions.fnAddItem();
        actions.fnDone();
        actions.fnUndo();
        actions.fnDelete();
        actions.fnHide();
        
        // Handle conversational flow (must be before fnElse)
        actions.fnConversational();
        
        // Handle unrecognized commands
        actions.fnElse();
    }

    /**
     * Called when the bot successfully connects and starts.
     */
    @Override
    public void onRegister() {
        logger.info("✅ TareaBotController successfully registered.");
        logger.info("Bot username = {}", getBotUsername());
        logger.info("Bot token (first 10 chars) = {}", getBotToken().substring(0, 10));
    }
}