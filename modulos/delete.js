import { API_URL, fetchTasksByUserId, showToast } from './utils.js';
import { createUserCard } from './listar.js';

export async function deleteTask(tarea, usuario) {
    const mensaje = `¿Estás seguro de ELIMINAR la tarea:\n"${tarea.title}"\n\nDe: ${usuario.name}?`;
    
    if (confirm(mensaje)) {
        try {
            await fetch(`${API_URL}/tasks/${tarea.id}`, { method: "DELETE" });
            
            const updatedTasks = await fetchTasksByUserId(usuario.id);
            createUserCard(usuario, updatedTasks); 
            
            showToast("Tarea eliminada de la base de datos", "success");
            
        } catch (error) {
            showToast("Error de servidor. No se pudo eliminar.", "error");
            console.error(error);
        }
    }
}