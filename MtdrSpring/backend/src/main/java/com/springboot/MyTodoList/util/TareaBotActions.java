package com.springboot.MyTodoList.util;

import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.service.TareaService;
import com.springboot.MyTodoList.service.UsuarioService;
import com.springboot.MyTodoList.service.ProyectoService;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles Telegram actions for the Tarea bot with conversational flow
 */
public class TareaBotActions {

    private static final Logger logger = LoggerFactory.getLogger(TareaBotActions.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private String requestText;
    private long chatId;
    private final TelegramLongPollingBot bot;
    private final TareaService tareaService;
    private final UsuarioService usuarioService;
    private final ProyectoService proyectoService;
    private boolean exit = false;

    public TareaBotActions(TelegramLongPollingBot bot, TareaService tareaService, 
                          UsuarioService usuarioService, ProyectoService proyectoService) {
        this.bot = bot;
        this.tareaService = tareaService;
        this.usuarioService = usuarioService;
        this.proyectoService = proyectoService;
    }

    public void setRequestText(String text) { this.requestText = text; }
    public void setChatId(long chatId) { this.chatId = chatId; }

    // -------------------------------------------------------------------
    // Helper: send messages
    // -------------------------------------------------------------------
    private void sendMessage(String text) {
        try {
            SendMessage msg = new SendMessage(String.valueOf(chatId), text);
            msg.setParseMode("Markdown");
            bot.execute(msg);
        } catch (Exception e) {
            logger.error("Error sending message", e);
        }
    }

    private void sendMessage(String text, ReplyKeyboardMarkup keyboard) {
        try {
            SendMessage msg = new SendMessage(String.valueOf(chatId), text);
            msg.setParseMode("Markdown");
            msg.setReplyMarkup(keyboard);
            bot.execute(msg);
        } catch (Exception e) {
            logger.error("Error sending message with keyboard", e);
        }
    }

    private void sendMessageWithRemoveKeyboard(String text) {
        try {
            SendMessage msg = new SendMessage(String.valueOf(chatId), text);
            msg.setParseMode("Markdown");
            msg.setReplyMarkup(new ReplyKeyboardRemove(true));
            bot.execute(msg);
        } catch (Exception e) {
            logger.error("Error sending message", e);
        }
    }

    // -------------------------------------------------------------------
    // Commands
    // -------------------------------------------------------------------
    public void fnStart() {
        if (!(requestText.equals(BotCommands.START_COMMAND.getCommand())
                || requestText.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) || exit)
            return;

        // Cancelar cualquier conversación activa
        ConversationManager.clearConversation(chatId);

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
            sendMessage("📭 Tu lista de tareas está vacía.");
            exit = true;
            return;
        }

        ReplyKeyboardMarkup keyboard = new ReplyKeyboardMarkup();
        keyboard.setResizeKeyboard(true);
        List<KeyboardRow> rows = new ArrayList<>();

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

        KeyboardRow footer = new KeyboardRow();
        footer.add(new KeyboardButton(BotLabels.SHOW_MAIN_SCREEN.getLabel()));
        footer.add(new KeyboardButton(BotLabels.ADD_NEW_ITEM.getLabel()));
        rows.add(footer);

        keyboard.setKeyboard(rows);
        sendMessage("📋 *Tu lista de tareas:*", keyboard);
        exit = true;
    }

    public void fnAddItem() {
        if (!(requestText.contains(BotCommands.ADD_ITEM.getCommand())
                || requestText.contains(BotLabels.ADD_NEW_ITEM.getLabel())) || exit)
            return;

        // Iniciar conversación
        ConversationManager.setState(chatId, ConversationState.AWAITING_TITLE);
        sendMessageWithRemoveKeyboard("📝 *Nueva Tarea*\n\n" +
                "Por favor, ingresa el *título* de la tarea:\n" +
                "(Máximo 100 caracteres)\n\n" +
                "_Escribe /cancel para cancelar_");
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
                estado.setId(4L);
                tarea.setEstadoTarea(estado);
                tareaService.addTarea(tarea);
                sendMessage("✅ " + BotMessages.ITEM_DONE.getMessage());
            } else {
                sendMessage("❌ Tarea no encontrada.");
            }
        } catch (Exception e) {
            logger.error("Error marking tarea as done", e);
            sendMessage("❌ Error al marcar la tarea como completada.");
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
                estado.setId(1L);
                tarea.setEstadoTarea(estado);
                tareaService.addTarea(tarea);
                sendMessage("↩️ " + BotMessages.ITEM_UNDONE.getMessage());
            } else {
                sendMessage("❌ Tarea no encontrada.");
            }
        } catch (Exception e) {
            logger.error("Error undoing tarea", e);
            sendMessage("❌ Error al deshacer la tarea.");
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

            if (found) {
                sendMessage("🗑️ " + BotMessages.ITEM_DELETED.getMessage());
            } else {
                sendMessage("❌ Tarea no encontrada.");
            }
        } catch (Exception e) {
            logger.error("Error deleting tarea", e);
            sendMessage("❌ Error al eliminar la tarea.");
        }
        exit = true;
    }

    public void fnHide() {
        if ((requestText.equals(BotCommands.HIDE_COMMAND.getCommand())
                || requestText.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel())) && !exit) {
            ConversationManager.clearConversation(chatId);
            sendMessage(BotMessages.BYE.getMessage());
            exit = true;
        }
    }

    // -------------------------------------------------------------------
    // Conversational Flow Handler
    // -------------------------------------------------------------------
    public void fnConversational() {
        if (exit) return;

        // Manejar cancelación
        if (requestText.equalsIgnoreCase("/cancel")) {
            handleCancel();
            return;
        }

        ConversationState state = ConversationManager.getState(chatId);

        switch (state) {
            case AWAITING_TITLE:
                handleTitle();
                break;
            case AWAITING_DESCRIPTION:
                handleDescription();
                break;
            case AWAITING_START_DATE:
                handleStartDate();
                break;
            case AWAITING_END_DATE:
                handleEndDate();
                break;
            case AWAITING_PRIORITY:
                handlePriority();
                break;
            case AWAITING_DEVELOPER:
                handleDeveloper();
                break;
            case AWAITING_PROJECT:
                handleProject();
                break;
            default:
                // No hay conversación activa, ignorar
                break;
        }
    }

    private void handleCancel() {
        if (ConversationManager.isConversationActive(chatId)) {
            ConversationManager.clearConversation(chatId);
            sendMessage("❌ Creación de tarea cancelada.\n\nSelecciona /start para volver al menú principal.");
            exit = true;
        }
    }

    private void handleTitle() {
        if (requestText.length() > 100) {
            sendMessage("⚠️ El título es demasiado largo. Por favor, ingresa un título de máximo 100 caracteres:");
            exit = true;
            return;
        }

        TareaBuilder builder = ConversationManager.getBuilder(chatId);
        builder.setTitulo(requestText);
        
        ConversationManager.setState(chatId, ConversationState.AWAITING_DESCRIPTION);
        sendMessageWithRemoveKeyboard("✅ Título guardado: *" + requestText + "*\n\n" +
                "Ahora ingresa la *descripción* de la tarea:\n" +
                "(Máximo 1000 caracteres)\n\n" +
                "_Escribe /cancel para cancelar_");
        exit = true;
    }

    private void handleDescription() {
        if (requestText.length() > 1000) {
            sendMessage("⚠️ La descripción es demasiado larga. Por favor, ingresa una descripción de máximo 1000 caracteres:");
            exit = true;
            return;
        }

        TareaBuilder builder = ConversationManager.getBuilder(chatId);
        builder.setDescripcion(requestText);
        
        ConversationManager.setState(chatId, ConversationState.AWAITING_START_DATE);
        sendMessageWithRemoveKeyboard("✅ Descripción guardada.\n\n" +
                "Ingresa la *fecha de inicio* (formato: DD/MM/YYYY):\n" +
                "Ejemplo: 15/11/2025\n\n" +
                "_Escribe /cancel para cancelar_");
        exit = true;
    }

    private void handleStartDate() {
        try {
            LocalDate startDate = LocalDate.parse(requestText, DATE_FORMATTER);
            TareaBuilder builder = ConversationManager.getBuilder(chatId);
            builder.setFechaInicio(startDate);
            
            ConversationManager.setState(chatId, ConversationState.AWAITING_END_DATE);
            sendMessageWithRemoveKeyboard("✅ Fecha de inicio guardada: *" + startDate.format(DATE_FORMATTER) + "*\n\n" +
                    "Ingresa la *fecha estimada de finalización* (formato: DD/MM/YYYY):\n" +
                    "Ejemplo: 20/11/2025\n\n" +
                    "_Escribe /cancel para cancelar_");
            exit = true;
        } catch (DateTimeParseException e) {
            sendMessage("⚠️ Formato de fecha inválido. Por favor usa el formato DD/MM/YYYY\n" +
                    "Ejemplo: 15/11/2025");
            exit = true;
        }
    }

    private void handleEndDate() {
        try {
            LocalDate endDate = LocalDate.parse(requestText, DATE_FORMATTER);
            TareaBuilder builder = ConversationManager.getBuilder(chatId);
            
            // Validar que la fecha de fin sea posterior a la de inicio
            if (endDate.isBefore(builder.getFechaInicio())) {
                sendMessage("⚠️ La fecha de finalización debe ser posterior a la fecha de inicio (" + 
                        builder.getFechaInicio().format(DATE_FORMATTER) + ").\n" +
                        "Por favor ingresa una fecha válida:");
                exit = true;
                return;
            }
            
            builder.setFechaFinEstimada(endDate);
            
            ConversationManager.setState(chatId, ConversationState.AWAITING_PRIORITY);
            sendMessageWithRemoveKeyboard("✅ Fecha de finalización guardada: *" + endDate.format(DATE_FORMATTER) + "*\n\n" +
                    "Ingresa la *prioridad* de la tarea (1-5):\n" +
                    "1 = Muy baja\n" +
                    "2 = Baja\n" +
                    "3 = Media\n" +
                    "4 = Alta\n" +
                    "5 = Muy alta\n\n" +
                    "_Escribe /cancel para cancelar_");
            exit = true;
        } catch (DateTimeParseException e) {
            sendMessage("⚠️ Formato de fecha inválido. Por favor usa el formato DD/MM/YYYY\n" +
                    "Ejemplo: 20/11/2025");
            exit = true;
        }
    }

    private void handlePriority() {
        try {
            int priority = Integer.parseInt(requestText);
            if (priority < 1 || priority > 5) {
                sendMessage("⚠️ La prioridad debe estar entre 1 y 5. Por favor ingresa un número válido:");
                exit = true;
                return;
            }

            TareaBuilder builder = ConversationManager.getBuilder(chatId);
            builder.setPrioridad(priority);
            
            ConversationManager.setState(chatId, ConversationState.AWAITING_DEVELOPER);
            
            // Mostrar lista de desarrolladores
            List<Usuario> desarrolladores = usuarioService.getUsuariosByIdRol(3L); // Rol desarrollador
            
            if (desarrolladores.isEmpty()) {
                sendMessageWithRemoveKeyboard("⚠️ No hay desarrolladores registrados.\n" +
                        "Ingresa manualmente el *ID del desarrollador*:\n\n" +
                        "_Escribe /cancel para cancelar_");
            } else {
                StringBuilder msg = new StringBuilder("✅ Prioridad guardada: *" + priority + "*\n\n");
                msg.append("Selecciona el *desarrollador* asignado (ingresa el ID):\n\n");
                for (Usuario dev : desarrolladores) {
                    msg.append("• ID: *").append(dev.getId()).append("* - ").append(dev.getNombreUsuario()).append("\n");
                }
                msg.append("\n_Escribe /cancel para cancelar_");
                sendMessageWithRemoveKeyboard(msg.toString());
            }
            exit = true;
        } catch (NumberFormatException e) {
            sendMessage("⚠️ Por favor ingresa un número válido entre 1 y 5:");
            exit = true;
        }
    }

    private void handleDeveloper() {
        try {
            Long developerId = Long.parseLong(requestText);
            TareaBuilder builder = ConversationManager.getBuilder(chatId);
            builder.setDesarrolladorId(developerId);
            
            ConversationManager.setState(chatId, ConversationState.AWAITING_PROJECT);
            
            // Mostrar lista de proyectos
            List<Proyecto> proyectos = proyectoService.getAllProyectos();
            
            if (proyectos.isEmpty()) {
                sendMessageWithRemoveKeyboard("⚠️ No hay proyectos registrados.\n" +
                        "Ingresa manualmente el *ID del proyecto*:\n\n" +
                        "_Escribe /cancel para cancelar_");
            } else {
                StringBuilder msg = new StringBuilder("✅ Desarrollador asignado: *ID " + developerId + "*\n\n");
                msg.append("Selecciona el *proyecto* (ingresa el ID):\n\n");
                for (Proyecto proyecto : proyectos) {
                    msg.append("• ID: *").append(proyecto.getId()).append("* - ").append(proyecto.getNombreProyecto()).append("\n");
                }
                msg.append("\n_Escribe /cancel para cancelar_");
                sendMessageWithRemoveKeyboard(msg.toString());
            }
            exit = true;
        } catch (NumberFormatException e) {
            sendMessage("⚠️ Por favor ingresa un ID válido:");
            exit = true;
        }
    }

    private void handleProject() {
        try {
            Long projectId = Long.parseLong(requestText);
            TareaBuilder builder = ConversationManager.getBuilder(chatId);
            builder.setProyectoId(projectId);
            
            // Crear la tarea directamente (Historia de Usuario por defecto = 1)
            Tarea newTarea = builder.build();
            tareaService.addTarea(newTarea);
            
            // Mostrar resumen
            sendMessage("✅ *¡Tarea creada exitosamente!*\n\n" + builder.getSummary() + 
                    "\n\n📋 Selecciona /todolist para ver todas tus tareas\n" +
                    "🏠 Selecciona /start para volver al menú principal");
            
            // Limpiar conversación
            ConversationManager.clearConversation(chatId);
            exit = true;
        } catch (NumberFormatException e) {
            sendMessage("⚠️ Por favor ingresa un ID válido:");
            exit = true;
        } catch (Exception e) {
            logger.error("Error creating tarea", e);
            sendMessage("❌ Error al crear la tarea. Por favor intenta de nuevo.\n\n" +
                    "Selecciona /start para volver al menú principal.");
            ConversationManager.clearConversation(chatId);
            exit = true;
        }
    }

    public void fnElse() {
        // Este método ya no se usa para crear tareas simples
        // Solo maneja mensajes no reconocidos cuando no hay conversación activa
        if (exit || ConversationManager.isConversationActive(chatId)) {
            return;
        }

        sendMessage("❓ Comando no reconocido.\n\n" +
                "Selecciona /start para ver las opciones disponibles.");
    }
}