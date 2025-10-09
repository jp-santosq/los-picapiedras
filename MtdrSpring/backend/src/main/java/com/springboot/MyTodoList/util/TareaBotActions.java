package com.springboot.MyTodoList.util;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.EstadoTarea;
import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.model.HistoriaUsuario;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.service.TareaService;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles Telegram actions for the Tarea bot (TelegramBots 6.6 compatible)
 */
public class TareaBotActions {

    private static final Logger logger = LoggerFactory.getLogger(TareaBotActions.class);

    private String requestText;
    private long chatId;
    private final TelegramLongPollingBot bot;
    private final TareaService tareaService;
    private boolean exit = false;

    public TareaBotActions(TelegramLongPollingBot bot, TareaService tareaService) {
        this.bot = bot;
        this.tareaService = tareaService;
    }

    public void setRequestText(String text) { this.requestText = text; }
    public void setChatId(long chatId) { this.chatId = chatId; }

    // -------------------------------------------------------------------
    // Helper: send messages
    // -------------------------------------------------------------------
    private void sendMessage(String text) {
        try {
            bot.execute(new SendMessage(String.valueOf(chatId), text));
        } catch (Exception e) {
            logger.error("Error sending message", e);
        }
    }

    private void sendMessage(String text, ReplyKeyboardMarkup keyboard) {
        try {
            SendMessage msg = new SendMessage(String.valueOf(chatId), text);
            msg.setReplyMarkup(keyboard);
            bot.execute(msg);
        } catch (Exception e) {
            logger.error("Error sending message with keyboard", e);
        }
    }

    // -------------------------------------------------------------------
    // Commands
    // -------------------------------------------------------------------
    public void fnStart() {
        if (!(requestText.equals(BotCommands.START_COMMAND.getCommand())
                || requestText.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) || exit)
            return;

        // Build keyboard manually with KeyboardButton objects
        ReplyKeyboardMarkup keyboard = new ReplyKeyboardMarkup();
        keyboard.setResizeKeyboard(true);

        List<KeyboardRow> rows = new ArrayList<>();

        KeyboardRow row1 = new KeyboardRow();
        row1.add(new KeyboardButton(BotLabels.LIST_ALL_ITEMS.getLabel()));
        row1.add(new KeyboardButton(BotLabels.ADD_NEW_ITEM.getLabel()));
        rows.add(row1);

        KeyboardRow row2 = new KeyboardRow();
        row2.add(new KeyboardButton(BotLabels.SHOW_MAIN_SCREEN.getLabel()));
        row2.add(new KeyboardButton(BotLabels.HIDE_MAIN_SCREEN.getLabel()));
        rows.add(row2);

        keyboard.setKeyboard(rows);

        sendMessage(BotMessages.HELLO_MYTODO_BOT.getMessage(), keyboard);
        exit = true;
    }

    public void fnListAll() {
        if (!(requestText.equals(BotCommands.TODO_LIST.getCommand())
                || requestText.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
                || requestText.equals(BotLabels.MY_TODO_LIST.getLabel())) || exit)
            return;

        List<Tarea> tareas = tareaService.getTarea();

        if (tareas.isEmpty()) {
            sendMessage("Your task list is empty.");
            exit = true;
            return;
        }

        ReplyKeyboardMarkup keyboard = new ReplyKeyboardMarkup();
        keyboard.setResizeKeyboard(true);
        List<KeyboardRow> rows = new ArrayList<>();

        // Title row
        KeyboardRow titleRow = new KeyboardRow();
        titleRow.add(new KeyboardButton(BotLabels.MY_TODO_LIST.getLabel()));
        rows.add(titleRow);

        for (Tarea tarea : tareas) {
            KeyboardRow row = new KeyboardRow();
            row.add(new KeyboardButton(tarea.getDescripcion()));
            row.add(new KeyboardButton(tarea.getId() + BotLabels.DASH.getLabel() + BotLabels.DONE.getLabel()));
            row.add(new KeyboardButton(tarea.getId() + BotLabels.DASH.getLabel() + BotLabels.DELETE.getLabel()));
            rows.add(row);
        }

        // Footer row
        KeyboardRow footer = new KeyboardRow();
        footer.add(new KeyboardButton(BotLabels.SHOW_MAIN_SCREEN.getLabel()));
        footer.add(new KeyboardButton(BotLabels.ADD_NEW_ITEM.getLabel()));
        rows.add(footer);

        keyboard.setKeyboard(rows);
        sendMessage("Your task list:", keyboard);
        exit = true;
    }

    public void fnAddItem() {
        if (!(requestText.contains(BotCommands.ADD_ITEM.getCommand())
                || requestText.contains(BotLabels.ADD_NEW_ITEM.getLabel())) || exit)
            return;

        sendMessage(BotMessages.TYPE_NEW_TODO_ITEM.getMessage());
        exit = true;
    }

    public void fnDone() {
        if (!(requestText.contains(BotLabels.DONE.getLabel())) || exit)
            return;

        try {
            Long id = Long.parseLong(requestText.split(BotLabels.DASH.getLabel())[0]);
            List<Tarea> tareas = tareaService.getTarea();
            Tarea tarea = tareas.stream().filter(t -> t.getId().equals(id)).findFirst().orElse(null);

            if (tarea != null) {
                EstadoTarea estado = new EstadoTarea();
                estado.setId(4L); // Completed
                tarea.setEstadoTarea(estado);
                tareaService.addTarea(tarea);
                sendMessage(BotMessages.ITEM_DONE.getMessage());
            } else sendMessage("Task not found.");

        } catch (Exception e) {
            logger.error("Error marking tarea as done", e);
        }
        exit = true;
    }

    public void fnUndo() {
        if (!(requestText.contains(BotLabels.UNDO.getLabel())) || exit)
            return;

        try {
            Long id = Long.parseLong(requestText.split(BotLabels.DASH.getLabel())[0]);
            List<Tarea> tareas = tareaService.getTarea();
            Tarea tarea = tareas.stream().filter(t -> t.getId().equals(id)).findFirst().orElse(null);

            if (tarea != null) {
                EstadoTarea estado = new EstadoTarea();
                estado.setId(1L); // Pending
                tarea.setEstadoTarea(estado);
                tareaService.addTarea(tarea);
                sendMessage(BotMessages.ITEM_UNDONE.getMessage());
            } else sendMessage("Task not found.");

        } catch (Exception e) {
            logger.error("Error undoing tarea", e);
        }
        exit = true;
    }

    public void fnDelete() {
        if (!(requestText.contains(BotLabels.DELETE.getLabel())) || exit)
            return;

        try {
            Long id = Long.parseLong(requestText.split(BotLabels.DASH.getLabel())[0]);
            List<Tarea> tareas = tareaService.getTarea();
            boolean found = tareas.removeIf(t -> t.getId().equals(id));

            if (found) sendMessage(BotMessages.ITEM_DELETED.getMessage());
            else sendMessage("Task not found.");

        } catch (Exception e) {
            logger.error("Error deleting tarea", e);
        }
        exit = true;
    }

    public void fnHide() {
        if ((requestText.equals(BotCommands.HIDE_COMMAND.getCommand())
                || requestText.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel())) && !exit) {
            sendMessage(BotMessages.BYE.getMessage());
            exit = true;
        }
    }

    public void fnElse() {
        if (exit)
            return;

        try {
            Tarea newTarea = new Tarea();
            newTarea.setDescripcion(requestText);
            newTarea.setTitulo(requestText.length() > 20 ? requestText.substring(0, 20) : requestText);
            newTarea.setFechaInicio(LocalDate.now());
            newTarea.setFechaFinEstimada(LocalDate.now().plusDays(1));
            newTarea.setPrioridad(1);

            EstadoTarea estado = new EstadoTarea();
            estado.setId(1L);
            newTarea.setEstadoTarea(estado);

            Proyecto proyecto = new Proyecto();
            proyecto.setId(1L);
            newTarea.setProyecto(proyecto);

            HistoriaUsuario historia = new HistoriaUsuario();
            historia.setId(1L);
            newTarea.setHistoriaUsuario(historia);

	    Usuario usuario = new Usuario();
	    usuario.setId(3L);
	    newTarea.setDesarrollador(usuario);

            tareaService.addTarea(newTarea);
            sendMessage(BotMessages.NEW_ITEM_ADDED.getMessage());

        } catch (Exception e) {
            logger.error("Error creating new tarea", e);
        }
    }
}


