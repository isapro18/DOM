import { resultadoUsuario } from './utils.js';
import { renderTaskForm } from './crear.js';
import { deleteTask } from './delete.js';
// Asegúrate de importar la nueva función aquí:
import { toggleTaskStatus, updateTaskContent } from './actualizar.js';

export function createUserCard(usuario, tareas) {
    resultadoUsuario.innerHTML = "";

    const total = tareas.length;
    const completadas = tareas.filter(t => t.status === "completada").length;
    const pendientes = total - completadas;

    const card = document.createElement("div");
    card.classList.add("user-card");

    // --- Header del Usuario ---
    card.innerHTML = `
        <h3>${usuario.name}</h3>
        <p><strong>Documento:</strong> ${usuario.document}</p>
        <p><strong>Correo:</strong> ${usuario.email}</p>
        
        <div class="stats-bar">
            <div class="stat-item">
                <span class="stat-value">${total}</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" style="color: var(--color-warning);">${pendientes}</span>
                <span class="stat-label">Pendientes</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" style="color: var(--color-success);">${completadas}</span>
                <span class="stat-label">Completadas</span>
            </div>
        </div>
    `;

    // --- Botón Crear ---
    const crearBtn = document.createElement("button");
    crearBtn.classList.add("btn", "btn--primary");
    crearBtn.textContent = "Crear nueva tarea";
    crearBtn.addEventListener("click", () => {
        if (!document.querySelector('.form-tarea')) {
            renderTaskForm(usuario);
        }
    });
    card.appendChild(crearBtn);

    // --- Contenedor Tareas ---
    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add("tasks-container");
    tasksContainer.innerHTML = "<h4>Listado de tareas</h4>";

    if (tareas.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "No hay tareas registradas.";
        emptyMsg.style.color = "var(--color-text-secondary)";
        emptyMsg.style.fontStyle = "italic";
        tasksContainer.appendChild(emptyMsg);
    } else {
        tareas.forEach(t => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");
            
            if (t.status === "completada") {
                taskItem.classList.add("completed");
            }

            // Info de la tarea
            const taskInfo = document.createElement("div");
            taskInfo.classList.add("task-info");
            taskInfo.innerHTML = `<h5>${t.title}</h5><p>${t.body}</p>`;

            // Acciones
            const actionsDiv = document.createElement("div");
            actionsDiv.classList.add("task-actions");

            // NUEVO: Botón Editar
            const editBtn = document.createElement("button");
            editBtn.classList.add("btn", "btn--sm", "btn--primary");
            editBtn.textContent = "Editar";
            editBtn.addEventListener("click", () => updateTaskContent(t, usuario));

            // Botón Status (Reabrir / Completar)
            const statusBtn = document.createElement("button");
            statusBtn.classList.add("btn", "btn--sm");
            
            if (t.status === "completada") {
                statusBtn.textContent = "Reabrir";
                statusBtn.classList.add("btn--warning");
            } else {
                statusBtn.textContent = "Completar";
                statusBtn.classList.add("btn--success");
            }
            statusBtn.addEventListener("click", () => toggleTaskStatus(t, usuario));

            // Botón Eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("btn", "btn--danger", "btn--sm");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.addEventListener("click", () => deleteTask(t, usuario));

            // Agregamos los botones en orden: Editar, Estado, Eliminar
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(statusBtn);
            actionsDiv.appendChild(deleteBtn);

            taskItem.appendChild(taskInfo);
            taskItem.appendChild(actionsDiv);
            tasksContainer.appendChild(taskItem);
        });
    }

    card.appendChild(tasksContainer);
    resultadoUsuario.appendChild(card);
}