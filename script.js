/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
 * 
 * Objetivo: Aplicar conceptos del DOM para seleccionar elementos,
 * responder a eventos y crear nuevos elementos dinámicamente.
 * 
 * Autor: Andrés Santiago Calvete Lesmes, Ana Isabella Garcia Rozo
 * Fecha: 11/02/26
 * ============================================
 */

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos únicos.
 */

// Formulario
const messageForm = document.getElementById('messageForm');

// Campos de entrada
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');

// Botón de envío
const submitBtn = document.getElementById('submitBtn');

// Elementos para mostrar errores
const userNameError = document.getElementById('userNameError');
const userMessageError = document.getElementById('userMessageError');

// Contenedor donde se mostrarán los mensajes
const messagesContainer = document.getElementById('messagesContainer');

// Estado vacío (mensaje que se muestra cuando no hay mensajes)
const emptyState = document.getElementById('emptyState');

// Contador de mensajes
const messageCount = document.getElementById('messageCount');

// Variable para llevar el conteo de mensajes
let totalMessages = 0;


// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

function isValidInput(value) {
    return value.trim().length > 0;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
}

function clearError(errorElement) {
    errorElement.textContent = "";
}

function validateForm() {
    const userName = userNameInput.value;
    const userMessage = userMessageInput.value;
    let isValid = true;

    if (!isValidInput(userName)) {
        showError(userNameError, "El nombre es obligatorio");
        userNameInput.classList.add("error");
        isValid = false;
    } else {
        clearError(userNameError);
        userNameInput.classList.remove("error");
    }

    if (!isValidInput(userMessage)) {
        showError(userMessageError, "El mensaje es obligatorio");
        userMessageInput.classList.add("error");
        isValid = false;
    } else {
        clearError(userMessageError);
        userMessageInput.classList.remove("error");
    }

    return isValid;
}


// ============================================
// 4. MANEJO DE EVENTOS
// ============================================

/**
 * Maneja el evento de envío del formulario
 * @param {Event} event - Evento del formulario
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    // Validar formulario
    if (!validateForm()) {
        return;
    }

    // Obtener valores
    const userName = userNameInput.value.trim();
    const userMessage = userMessageInput.value.trim();

    try {
        // Buscar usuario en db.json
        const response = await fetch(`http://localhost:3000/users?name=${userName}`);
        const usuarios = await response.json();

        if (usuarios.length === 0) {
            messagesContainer.innerHTML = `
                <div class="error-card">
                    <p>No se encontró ningún usuario con el nombre "${userName}".</p>
                </div>
            `;
            return;
        }

        // Si existe el usuario, por ahora solo mostramos un log
        console.log("Usuario encontrado:", usuarios[0]);
        console.log("Mensaje ingresado:", userMessage);

    } catch (error) {
        messagesContainer.innerHTML = `
            <div class="error-card">
                <p>Error al consultar el servidor.</p>
            </div>
        `;
    }
}


// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================

messageForm.addEventListener('submit', handleFormSubmit);

userNameInput.addEventListener('input', () => clearError(userNameError));
userMessageInput.addEventListener('input', () => clearError(userMessageError));


// ============================================
// 7. INICIALIZACIÓN (OPCIONAL)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicación de registro de mensajes iniciada');
});
