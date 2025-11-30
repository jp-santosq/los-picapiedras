package com.springboot.MyTodoList.util;

/**
 * Estados de conversación para la creación de tareas
 */
public enum ConversationState {
    IDLE,                    // Sin conversación activa
    AWAITING_TITLE,          // Esperando título
    AWAITING_DESCRIPTION,    // Esperando descripción
    AWAITING_START_DATE,     // Esperando fecha de inicio
    AWAITING_END_DATE,       // Esperando fecha estimada de fin
    AWAITING_PRIORITY,       // Esperando prioridad
    AWAITING_DEVELOPER,      // Esperando desarrollador
    AWAITING_PROJECT,        // Esperando proyecto
    RAG_CHAT                 // Modo chat RAG
}
