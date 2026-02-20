/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM (MODULARIZADO)
 * ============================================
 */

// ¡Asegúrate de importar showToast aquí!
import { API_URL, resultadoUsuario, showError, clearError, fetchTasksByUserId, showToast } from './modulos/utils.js';
import { createUserCard } from './modulos/listar.js';

// Selección de elementos
const searchForm = document.getElementById('searchForm');
const documentoInput = document.getElementById('documento');
const documentoError = document.getElementById('documentoError');

// Manejo del evento Submit del formulario principal
async function handleFormSubmit(event) {
    event.preventDefault();
    const documento = documentoInput.value.trim();

    if (!documento) {
        showError(documentoError, "El documento es obligatorio");
        showToast("Por favor, ingresa un documento válido", "warning"); // Toast de advertencia
        return;
    } else {
        clearError(documentoError);
    }

    try {
        resultadoUsuario.innerHTML = `<p style="text-align:center; color: var(--color-primary);">Buscando usuario...</p>`;

        // 1. Obtener todos los usuarios
        const response = await fetch(`${API_URL}/users`);
        const usuarios = await response.json();

        // 2. Buscar coincidencia
        const usuarioEncontrado = usuarios.find(u => u.document == documento);

        if (!usuarioEncontrado) {
            resultadoUsuario.innerHTML = `
                <div class="error-card">
                    No se encontró ningún usuario con el documento "<strong>${documento}</strong>".
                </div>`;
            showToast("Usuario no encontrado", "error"); // Toast de error
            return;
        }

        // 3. Obtener tareas y renderizar
        const tareas = await fetchTasksByUserId(usuarioEncontrado.id);
        createUserCard(usuarioEncontrado, tareas);

        // ¡EL NUEVO TOAST DE ÉXITO AL BUSCAR!
        showToast(`Datos de ${usuarioEncontrado.name} cargados`, "success");

    } catch (error) {
        console.error(error);
        resultadoUsuario.innerHTML = `
            <div class="error-card">
                Error de conexión. Asegúrate de ejecutar: <code>npx json-server db.json</code>
            </div>`;
        showToast("Error de conexión con la base de datos", "error");
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (searchForm) {
        searchForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (documentoInput) {
        documentoInput.addEventListener('input', () => clearError(documentoError));
    }

    console.log('Aplicación modularizada iniciada correctamente.');
});