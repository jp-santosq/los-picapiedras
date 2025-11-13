package com.springboot.MyTodoList.util;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Maneja el estado de conversación de cada usuario/chat
 * 
 * Esta clase utiliza dos mapas estáticos para mantener:
 * 1. El estado actual de cada conversación (IDLE, AWAITING_TITLE, etc.)
 * 2. El builder que va acumulando los datos de la tarea
 * 
 * Ejemplo de uso:
 * - Usuario inicia creación: ConversationManager.setState(chatId, AWAITING_TITLE)
 * - Usuario envía título: ConversationManager.getBuilder(chatId).setTitulo(texto)
 * - Usuario cancela: ConversationManager.clearConversation(chatId)
 */
public class ConversationManager {
    
    // Mapa que guarda el estado actual de cada chat
    // Key: chatId del usuario, Value: estado de la conversación
    private static final Map<Long, ConversationState> chatStates = new ConcurrentHashMap<>();
    
    // Mapa que guarda el builder (datos acumulados) de cada chat
    // Key: chatId del usuario, Value: TareaBuilder con los datos parciales
    private static final Map<Long, TareaBuilder> chatBuilders = new ConcurrentHashMap<>();

    /**
     * Obtiene el estado actual de la conversación para un chat
     * Si no existe, retorna IDLE (sin conversación activa)
     * 
     * @param chatId ID del chat/usuario
     * @return Estado actual de la conversación
     */
    public static ConversationState getState(Long chatId) {
        return chatStates.getOrDefault(chatId, ConversationState.IDLE);
    }

    /**
     * Establece el estado de conversación para un chat
     * 
     * @param chatId ID del chat/usuario
     * @param state Nuevo estado (AWAITING_TITLE, AWAITING_DESCRIPTION, etc.)
     */
    public static void setState(Long chatId, ConversationState state) {
        chatStates.put(chatId, state);
    }

    /**
     * Obtiene el builder de tarea para un chat
     * Si no existe, crea uno nuevo automáticamente
     * 
     * @param chatId ID del chat/usuario
     * @return TareaBuilder con los datos acumulados
     */
    public static TareaBuilder getBuilder(Long chatId) {
        return chatBuilders.computeIfAbsent(chatId, k -> new TareaBuilder());
    }

    /**
     * Limpia el estado y el builder de un chat
     * Se usa cuando se completa o cancela la creación de una tarea
     * 
     * @param chatId ID del chat/usuario
     */
    public static void clearConversation(Long chatId) {
        chatStates.remove(chatId);
        TareaBuilder builder = chatBuilders.get(chatId);
        if (builder != null) {
            builder.reset();
        }
        chatBuilders.remove(chatId);
    }

    /**
     * Verifica si hay una conversación activa para un chat
     * 
     * @param chatId ID del chat/usuario
     * @return true si hay una conversación en curso, false si está IDLE
     */
    public static boolean isConversationActive(Long chatId) {
        return getState(chatId) != ConversationState.IDLE;
    }
}