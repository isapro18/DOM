import { API_URL, fetchTasksByUserId, showToast } from './utils.js';
import { createUserCard } from './listar.js';

export async function toggleTaskStatus(tarea, usuario) {
    const nuevoEstado = (tarea.status === "pendiente") ? "completada" : "pendiente";

    try {
        await fetch(`${API_URL}/tasks/${tarea.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: nuevoEstado })
        });

        const updatedTasks = await fetchTasksByUserId(usuario.id);
        createUserCard(usuario, updatedTasks); 

        showToast(`Tarea marcada como ${nuevoEstado}`, "success");

    } catch (error) {
        showToast("Error al cambiar el estado.", "error");
        console.error(error);
    }
}

// NUEVA VERSIÓN: Modal HTML en lugar de Prompts feos
export async function updateTaskContent(tarea, usuario) {
    // 1. Creamos el fondo oscuro y la ventana
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Le inyectamos el HTML del formulario, pre-llenando los inputs con la info actual (tarea.title y tarea.body)
    overlay.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-header">Editar Tarea</h3>
            
            <div class="form__group">
                <label class="form__label">Título</label>
                <input type="text" id="editTitle" class="form__input" value="${tarea.title}">
            </div>
            
            <div class="form__group">
                <label class="form__label">Descripción</label>
                <textarea id="editBody" class="form__input form__textarea">${tarea.body ? tarea.body : ''}</textarea>
            </div>
            
            <div class="modal-actions">
                <button id="btnCancelEdit" class="btn btn--secondary btn--sm" style="background:var(--color-gray-500)">Cancelar</button>
                <button id="btnSaveEdit" class="btn btn--primary btn--sm">Guardar Cambios</button>
            </div>
        </div>
    `;
    
    // Lo mostramos en pantalla
    document.body.appendChild(overlay);

    // 2. Evento para Cancelar (simplemente borramos el modal)
    document.getElementById('btnCancelEdit').addEventListener('click', () => {
        overlay.remove();
    });

    // 3. Evento para Guardar
    document.getElementById('btnSaveEdit').addEventListener('click', async () => {
        const newTitle = document.getElementById('editTitle').value.trim();
        const newBody = document.getElementById('editBody').value.trim();

        if (!newTitle) {
            showToast("El título no puede quedar vacío.", "warning");
            return;
        }

        // Si el usuario le dio guardar sin cambiar nada, no hacemos petición al servidor
        if (newTitle === tarea.title && newBody === (tarea.body ? tarea.body : '')) {
            showToast("No se hicieron cambios", "info");
            overlay.remove();
            return;
        }

        // Cambiamos el modal a estado de "cargando" para que no dé doble clic
        overlay.innerHTML = `
            <div class="modal-content" style="text-align:center;">
                <h3 class="modal-header">Guardando cambios...</h3>
            </div>
        `;

        try {
            await fetch(`${API_URL}/tasks/${tarea.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, body: newBody })
            });

            // Refrescamos la lista de tareas
            const updatedTasks = await fetchTasksByUserId(usuario.id);
            createUserCard(usuario, updatedTasks); 

            showToast("Tarea actualizada exitosamente", "success");
            overlay.remove(); // Destruimos el modal

        } catch (error) {
            showToast("Error de conexión al actualizar.", "error");
            console.error(error);
            overlay.remove();
        }
    });
}