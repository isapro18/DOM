/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
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
// ============================================

const searchForm = document.getElementById('searchForm');
const documentoInput = document.getElementById('documento');
const documentoError = document.getElementById('documentoError');
const resultadoUsuario = document.getElementById('resultadoUsuario');

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
}

// ============================================
// 4. MANEJO DE EVENTOS
// ============================================

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