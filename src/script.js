/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
<<<<<<< dev
 * * Objetivo: Aplicar conceptos del DOM para seleccionar elementos,
 * responder a eventos y crear nuevos elementos dinámicamente.
 * * Autor: Andrés Santiago Calvete Lesmes, Ana Isabella Garcia Rozo, Fernando Andrés Rodríguez Salamanca
 * ============================================
 */

// ============================================
// 1. IMPORTACIONES GLOBALES
// ============================================

import { isValidInput, showError, clearError } from './utils/domHelpers.js';
import { procesarBusqueda, procesarNuevaTarea, procesarEliminacion, procesarActualizacion, ordenarTareas } from './services/tareasService.js';
import { createUserCard, renderTaskForm, createErrorCard } from './ui/tareasView.js';
import { showSuccessToast, showErrorToast, showInfoToast } from './ui/components/toast.js';
import { showConfirmModal, showCustomModal } from './ui/components/modal.js';

// ============================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
=======
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
>>>>>>> release
// ============================================

const searchForm = document.getElementById('searchForm');
const documentoInput = document.getElementById('documento');
const documentoError = document.getElementById('documentoError');
const resultadoUsuario = document.getElementById('resultadoUsuario');

<<<<<<< dev
// NUEVA VARIABLE GLOBAL PARA RECORDAR EL ORDEN ELEGIDO
let criterioGlobal = "fecha"; 

// ============================================
// 3. FUNCIONES DE RENDERIZADO Y LÓGICA
// ============================================

// Función central: Se encarga de pintar todo y asignar qué hace cada botón
function actualizarPantalla(usuario, tareasSinOrdenar) {
    resultadoUsuario.innerHTML = "";

    // Aplicamos el ordenamiento antes de pintar la tarjeta
    const tareasOrdenadas = ordenarTareas(tareasSinOrdenar, criterioGlobal);

    // Usamos el código de Isa y le inyectamos nuestra lógica en los callbacks
    const card = createUserCard(
        usuario,
        tareasOrdenadas, // Pasamos las tareas ya ordenadas
        criterioGlobal,  // Le decimos a la vista qué opción del select dejar marcada
        
        // 1. Lógica para el botón "Crear Tarea"
        (usuarioActual) => {
            resultadoUsuario.innerHTML = ""; // Limpiamos para mostrar el formulario
            
            const form = renderTaskForm(
                usuarioActual,
                // Acción de Guardar
                async (datos) => {
                    try {
                        const nuevasTareas = await procesarNuevaTarea(usuarioActual.id, datos.title, datos.body);
                        actualizarPantalla(usuarioActual, nuevasTareas);
                        showSuccessToast("Tarea creada correctamente"); 
                    } catch (error) {
                        showErrorToast("Error al crear la tarea");
                    }
                },
                // Acción de Cancelar
                () => {
                    actualizarPantalla(usuario, tareasSinOrdenar); // Volvemos a la lista normal
                }
            );
            resultadoUsuario.appendChild(form);
        },
        
        // 2. Lógica para el botón "Editar" (Usando el modal de Isa corregido)
        async (tarea) => {
            const formEdit = document.createElement('div');
            formEdit.innerHTML = `
                <div class="form__group">
                    <label class="form__label">Título</label>
                    <input type="text" id="editTitle" class="form__input" value="${tarea.title}">
                </div>
                <div class="form__group" style="margin-top: 15px;">
                    <label class="form__label">Descripción</label>
                    <textarea id="editBody" class="form__input form__textarea">${tarea.body || ''}</textarea>
                </div>
            `;
            
            const confirmado = await showCustomModal("Editar Tarea", formEdit, true);
            
            if (confirmado) {
                // Buscamos dentro de 'formEdit' en memoria, no en el 'document'
                const nuevoTitulo = formEdit.querySelector('#editTitle').value.trim();
                const nuevoBody = formEdit.querySelector('#editBody').value.trim();
                
                if (!nuevoTitulo) return showErrorToast("El título no puede estar vacío");
                
                try {
                    const tareasActualizadas = await procesarActualizacion(tarea.id, usuario.id, { 
                        title: nuevoTitulo, 
                        body: nuevoBody 
                    });
                    actualizarPantalla(usuario, tareasActualizadas);
                    showSuccessToast("Tarea actualizada correctamente");
                } catch (error) {
                    showErrorToast("Error al editar la tarea");
                }
            }
        },
        
        // 3. Lógica para el botón de "Cambiar Estado" (Completar/En progreso)
        async (tarea) => {
            const nuevoEstado = tarea.status === "pendiente" ? "completada" : "pendiente";
            try {
                const tareasActualizadas = await procesarActualizacion(tarea.id, usuario.id, { 
                    status: nuevoEstado 
                });
                actualizarPantalla(usuario, tareasActualizadas);
                showInfoToast(`Tarea en estado: ${nuevoEstado}`);
            } catch (error) {
                showErrorToast("Error al cambiar el estado");
            }
        },
        
        // 4. Lógica para el botón "Eliminar"
        async (tarea) => {
            const confirmado = await showConfirmModal("Eliminar Tarea", `¿Seguro que deseas borrar "${tarea.title}"?`);
            if (confirmado) {
                try {
                    const nuevasTareas = await procesarEliminacion(tarea.id, usuario.id);
                    actualizarPantalla(usuario, nuevasTareas);
                    showSuccessToast("Tarea eliminada correctamente");
                } catch (error) {
                    showErrorToast("Error al eliminar la tarea");
                }
            }
        },

        // 5. NUEVO: Lógica de Ordenamiento
        (nuevoCriterio) => {
            criterioGlobal = nuevoCriterio;
            actualizarPantalla(usuario, tareasSinOrdenar); // Repintamos la pantalla con el nuevo orden
        }
    );

    resultadoUsuario.appendChild(card);
=======
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
    const documento = documentoInput.value;
    let isValid = true;

    if (!isValidInput(documento)) {
        showError(documentoError, "El documento es obligatorio");
        documentoInput.classList.add("error");
        isValid = false;
    } else {
        clearError(documentoError);
        documentoInput.classList.remove("error");
    }

    return isValid;
}

// ============================================
// 3. CREACIÓN DE ELEMENTOS
// ============================================

function createUserCard(usuario, tareas) {
    const total = tareas.length;
    const pendientes = tareas.filter(t => t.status === "pendiente").length;
    const completadas = tareas.filter(t => t.status === "completada").length;

    const card = document.createElement("div");
    card.classList.add("user-card");

    // Datos del usuario
    const h3 = document.createElement("h3");
    h3.textContent = usuario.name;

    const docP = document.createElement("p");
    docP.innerHTML = `<strong>Documento:</strong> ${usuario.document}`;

    const emailP = document.createElement("p");
    emailP.innerHTML = `<strong>Correo:</strong> ${usuario.email}`;

    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>Total tareas:</strong> ${total}`;

    const pendientesP = document.createElement("p");
    pendientesP.innerHTML = `<strong>Pendientes:</strong> ${pendientes}`;

    const completadasP = document.createElement("p");
    completadasP.innerHTML = `<strong>Completadas:</strong> ${completadas}`;

    const crearTareaBtn = document.createElement("button");
    crearTareaBtn.classList.add("btn", "btn--secondary");
    crearTareaBtn.textContent = "Crear tarea";
    crearTareaBtn.addEventListener("click", () => renderTaskForm(usuario));

    // Contenedor de tareas
    const tareasContainer = document.createElement("div");
    tareasContainer.classList.add("tasks-container");

    const tareasTitle = document.createElement("h4");
    tareasTitle.textContent = "Listado de tareas";
    tareasContainer.appendChild(tareasTitle);

    if (tareas.length === 0) {
        const noTask = document.createElement("p");
        noTask.textContent = "No hay tareas registradas.";
        tareasContainer.appendChild(noTask);
    } else {
        tareas.forEach(t => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");

            const taskText = document.createElement("p");
            taskText.innerHTML = `<strong>${t.title}</strong> - ${t.status}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("btn", "btn--danger");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.addEventListener("click", () => deleteTask(t.id, usuario.id));

            taskItem.appendChild(taskText);
            taskItem.appendChild(deleteBtn);
            tareasContainer.appendChild(taskItem);
        });
    }

    // Ensamblar card
    card.appendChild(h3);
    card.appendChild(docP);
    card.appendChild(emailP);
    card.appendChild(totalP);
    card.appendChild(pendientesP);
    card.appendChild(completadasP);
    card.appendChild(crearTareaBtn);
    card.appendChild(tareasContainer);

    resultadoUsuario.innerHTML = "";
    resultadoUsuario.appendChild(card);
}

/**
 * Renderiza un formulario dinámico para crear una nueva tarea
 * @param {Object} usuario - Datos del usuario
 */
function renderTaskForm(usuario) {
    const form = document.createElement("form");
    form.classList.add("form");

    const groupTitle = document.createElement("div");
    groupTitle.classList.add("form__group");
    const labelTitle = document.createElement("label");
    labelTitle.setAttribute("for", "taskTitle");
    labelTitle.classList.add("form__label");
    labelTitle.textContent = "Título de la tarea";
    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.id = "taskTitle";
    inputTitle.classList.add("form__input");
    inputTitle.placeholder = "Ingresa el título";
    groupTitle.appendChild(labelTitle);
    groupTitle.appendChild(inputTitle);

    const groupBody = document.createElement("div");
    groupBody.classList.add("form__group");
    const labelBody = document.createElement("label");
    labelBody.setAttribute("for", "taskBody");
    labelBody.classList.add("form__label");
    labelBody.textContent = "Descripción";
    const textareaBody = document.createElement("textarea");
    textareaBody.id = "taskBody";
    textareaBody.classList.add("form__input", "form__textarea");
    textareaBody.placeholder = "Ingresa la descripción";
    groupBody.appendChild(labelBody);
    groupBody.appendChild(textareaBody);

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.classList.add("btn", "btn--primary");
    saveBtn.textContent = "Guardar tarea";

    form.appendChild(groupTitle);
    form.appendChild(groupBody);
    form.appendChild(saveBtn);

    resultadoUsuario.appendChild(form);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = inputTitle.value.trim();
        const body = textareaBody.value.trim();

        if (!title || !body) {
            alert("Todos los campos son obligatorios");
            return;
        }

        try {
            await fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: usuario.id,
                    title,
                    body,
                    status: "pendiente"
                })
            });

            const responseTasks = await fetch(`http://localhost:3000/tasks?userId=${usuario.id}`);
            const tareas = await responseTasks.json();
            createUserCard(usuario, tareas);

        } catch (error) {
            const errorCard = document.createElement("div");
            errorCard.classList.add("error-card");
            errorCard.textContent = "Error al crear la tarea.";
            resultadoUsuario.appendChild(errorCard);
        }
    });
}

/**
 * Elimina una tarea existente
 * @param {number} taskId - ID de la tarea
 * @param {number} userId - ID del usuario
 */
async function deleteTask(taskId, userId) {
    try {
        await fetch(`http://localhost:3000/tasks/${taskId}`, { method: "DELETE" });

        const responseTasks = await fetch(`http://localhost:3000/tasks?userId=${userId}`);
        const tareas = await responseTasks.json();

        const responseUser = await fetch(`http://localhost:3000/users/${userId}`);
        const usuario = await responseUser.json();

        createUserCard(usuario, tareas);
    } catch (error) {
        const errorCard = document.createElement("div");
        errorCard.classList.add("error-card");
        errorCard.textContent = "Error al eliminar la tarea.";
        resultadoUsuario.appendChild(errorCard);
    }
>>>>>>> release
}

// ============================================
// 4. MANEJO DE EVENTOS
// ============================================

<<<<<<< dev
// Evento Principal de Búsqueda
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const documento = documentoInput.value.trim();

    if (!isValidInput(documento)) {
        showError(documentoError, "El documento es obligatorio");
        documentoInput.classList.add("error");
        return;
    }

    try {
        const { usuario, tareas } = await procesarBusqueda(documento);
        actualizarPantalla(usuario, tareas);
        showSuccessToast(`¡Hola, ${usuario.name}!`);
    } catch (error) {
        resultadoUsuario.innerHTML = "";
        resultadoUsuario.appendChild(createErrorCard(error.message));
        showErrorToast("Error en la búsqueda");
    }
});

// Limpiar errores al escribir
documentoInput.addEventListener('input', () => {
    clearError(documentoError);
    documentoInput.classList.remove("error");
});
=======
async function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const documento = documentoInput.value.trim();

    try {
        const response = await fetch(`http://localhost:3000/users?document=${documento}`);
        const usuarios = await response.json();

        if (usuarios.length === 0) {
            const errorCard = document.createElement("div");
            errorCard.classList.add("error-card");
            errorCard.textContent = `No se encontró ningún usuario con el documento "${documento}".`;
            resultadoUsuario.innerHTML = "";
            resultadoUsuario.appendChild(errorCard);
            return;
        }

        const usuario = usuarios[0];
        const responseTasks = await fetch(`http://localhost:3000/tasks?userId=${usuario.id}`);
        const tareas = await responseTasks.json();

        createUserCard(usuario, tareas);

    } catch (error) {
        const errorCard = document.createElement("div");
        errorCard.classList.add("error-card");
        errorCard.textContent = "Error al consultar el servidor.";
        resultadoUsuario.innerHTML = "";
        resultadoUsuario.appendChild(errorCard);
    }
}

// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================

searchForm.addEventListener('submit', handleFormSubmit);
documentoInput.addEventListener('input', () => clearError(documentoError));

// ============================================
// 7. INICIALIZACIÓN (OPCIONAL)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicación de registro de mensajes iniciada');
});
