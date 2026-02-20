// modulos/utils.js

export const API_URL = "http://localhost:3000";
export const resultadoUsuario = document.getElementById('resultadoUsuario');

export function showError(element, message) {
    if(element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

export function clearError(element) {
    if(element) {
        element.textContent = "";
        element.style.display = 'none';
    }
}

export async function fetchTasksByUserId(userId) {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        const allTasks = await response.json();
        return allTasks.filter(task => task.userId == userId);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

// ============================================
// SISTEMA DE TOASTS (NUEVO)
// ============================================

function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Muestra una notificación flotante
 * @param {string} mensaje - Texto a mostrar
 * @param {string} tipo - 'success', 'error', 'warning', 'info'
 */
export function showToast(mensaje, tipo = 'info') {
    const container = getToastContainer();
    const toast = document.createElement('div');
    
    toast.className = `toast toast--${tipo}`;
    toast.textContent = mensaje;

    container.appendChild(toast);

    // Desaparece automáticamente después de 3 segundos
    setTimeout(() => {
        toast.classList.add('fade-out-toast');
        setTimeout(() => {
            toast.remove();
        }, 300); // 300ms es lo que dura la animación en CSS
    }, 3000);
}