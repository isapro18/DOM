import { API_URL, fetchTasksByUserId, showToast } from './utils.js';
import { createUserCard } from './listar.js';

export function renderTaskForm(usuario) {
    const formContainer = document.createElement("div");
    formContainer.style.marginTop = "15px";
    formContainer.classList.add("fade-in");

    const form = document.createElement("form");
    form.classList.add("form", "form-tarea");
    form.style.border = "2px solid var(--color-primary-light)";
    form.style.padding = "15px";
    form.style.borderRadius = "var(--radius-md)";
    form.style.backgroundColor = "var(--color-surface)";

    form.innerHTML = `
        <h5 style="margin-bottom:10px; color: var(--color-primary);">Nueva Tarea</h5>
        <div class="form__group">
            <input type="text" id="tTitle" class="form__input" placeholder="Título" required>
        </div>
        <div class="form__group">
            <textarea id="tBody" class="form__input" placeholder="Descripción..." required></textarea>
        </div>
        <div style="display:flex; gap:10px;">
            <button type="submit" class="btn btn--primary btn--sm">Guardar</button>
            <button type="button" id="btnCancel" class="btn btn--secondary btn--sm" style="background:var(--color-gray-500)">Cancelar</button>
        </div>
    `;

    formContainer.appendChild(form);
    
    const card = document.querySelector(".user-card");
    const container = document.querySelector(".tasks-container");
    if(card && container) {
        card.insertBefore(formContainer, container);
    }

    form.querySelector("#btnCancel").addEventListener("click", () => formContainer.remove());

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = form.querySelector("#tTitle").value.trim();
        const body = form.querySelector("#tBody").value.trim();

        if (!title || !body) {
            showToast("Ambos campos son obligatorios", "warning");
            return;
        }

        try {
            await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: usuario.id,
                    title,
                    body,
                    status: "pendiente"
                })
            });

            const updatedTasks = await fetchTasksByUserId(usuario.id);
            createUserCard(usuario, updatedTasks);
            
            showToast("Tarea creada exitosamente", "success");

        } catch (error) {
            showToast("Error de conexión al guardar la tarea.", "error");
            console.error(error);
        }
    });
}