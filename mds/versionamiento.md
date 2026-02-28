# Registro de Versiones — Gestión de Tareas

**Proyecto:** DOM + API | SENA
**Autor:** Fernando Andrés Rodríguez Salamanca
**Rama:** feature/api-fer

---

## v2.0 — Migración a Vite + RF04 Exportación JSON

**Fecha:** 28/02/2026
**Tipo de cambio:** Mayor (cambio de entorno de ejecución)

### ¿Qué representa esta versión?

Esta versión marca el cierre del segundo sprint del proyecto.
Se realizaron dos grandes cambios respecto a v1.0:

**1. Integración de Vite como empaquetador**
El proyecto pasó de ejecutarse directamente con Live Server
a gestionarse con un entorno profesional de desarrollo y build.
Esto permite separar claramente el entorno de desarrollo
(npm run dev) del entorno de producción (npm run build),
gestionar dependencias con npm y obtener código optimizado
para despliegue.

**2. Implementación de RF04 — Exportación de tareas en JSON**
Se añadió la funcionalidad para que el usuario pueda descargar
las tareas visibles en pantalla como un archivo .json.
La implementación respeta la separación de responsabilidades:
la lógica de datos en tareasApi.js y la manipulación del DOM
en exportUI.js, coordinadas desde script.js.

### Archivos clave de esta versión

- package.json — gestión de dependencias y scripts
- vite.config.js — configuración del empaquetador
- src/api/tareasApi.js — prepararExportacion() RF04
- src/ui/exportUI.js — descargarJSON() y crearBotonExportar()
- src/script.js — integración del callback de exportación
- .gitignore — exclusión de node_modules y dist

### Scripts disponibles desde esta versión

| Script          | Descripción                          |
| --------------- | ------------------------------------- |
| npm run dev     | Servidor de desarrollo en puerto 5173 |
| npm run build   | Build optimizado en carpeta dist/     |
| npm run preview | Vista previa del build en puerto 4173 |

### Tabla de evolución del proyecto

| Versión | Descripción                  | Estado    |
| -------- | ----------------------------- | --------- |
| v1.0     | Proyecto base con ES Modules  | Archivada |
| v2.0     | Vite + RF04 Exportación JSON | ✅ Actual |

---

## Ciclo de vida de un Tag

```
Desarrollo  →  Commit  →  Push  →  Tag  →  PR  →  Merge
    ↑                              ↑
 (diario)              (hito formal del sprint)
```

Un tag NO reemplaza los commits diarios. Los commits
registran el proceso; el tag registra el logro.
