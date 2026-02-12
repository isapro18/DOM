// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

const messageForm = document.getElementById('messageForm');
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');
const submitBtn = document.getElementById('submitBtn');
const userNameError = document.getElementById('userNameError');
const userMessageError = document.getElementById('userMessageError');
const messagesContainer = document.getElementById('messagesContainer');
const emptyState = document.getElementById('emptyState');
const messageCount = document.getElementById('messageCount');

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
        showError(userMessageError, "El mensaje no puede estar vacío");
        userMessageInput.classList.add("error");
        isValid = false;
    } else {
        clearError(userMessageError);
        userMessageInput.classList.remove("error");
    }

    return isValid;
}

function getCurrentTimestamp() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('es-ES', options);
}

function getInitials(name) {
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
        return parts.map(p => p[0]).join("").toUpperCase();
    }
    return name.slice(0,2).toUpperCase();
}

function updateMessageCount() {
    messageCount.textContent = `${totalMessages} mensaje${totalMessages !== 1 ? "s" : ""}`;
}

function hideEmptyState() {
    emptyState.classList.add("hidden");
}

function showEmptyState() {
    emptyState.classList.remove("hidden");
}

// ============================================
// 3. CREACIÓN DE ELEMENTOS
// ============================================

function createMessageElement(userName, message) {
    const card = document.createElement("div");
    card.classList.add("message-card");
    card.innerHTML = `
        <div class="message-card__header">
            <div class="message-card__user">
                <div class="message-card__avatar">${getInitials(userName)}</div>
                <span class="message-card__username">${userName}</span>
            </div>
            <span class="message-card__timestamp">${getCurrentTimestamp()}</span>
        </div>
        <div class="message-card__content">${message}</div>
    `;
    messagesContainer.insertBefore(card, messagesContainer.firstChild);
    totalMessages++;
    updateMessageCount();
    hideEmptyState();
}

// ============================================
// 4. MANEJO DE EVENTOS
// ============================================

function handleFormSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const userName = userNameInput.value;
    const userMessage = userMessageInput.value;

    createMessageElement(userName, userMessage);

    messageForm.reset();
    clearError(userNameError);
    clearError(userMessageError);
    userNameInput.focus();
}

function handleInputChange(e) {
    if (e.target.id === "userName") clearError(userNameError);
    if (e.target.id === "userMessage") clearError(userMessageError);
}

// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================

messageForm.addEventListener("submit", handleFormSubmit);
userNameInput.addEventListener("input", handleInputChange);
userMessageInput.addEventListener("input", handleInputChange);

// ============================================
// 7. INICIALIZACIÓN (OPCIONAL)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicación de registro de mensajes iniciada');
});