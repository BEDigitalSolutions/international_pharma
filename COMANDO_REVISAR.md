# Comando "revisar" - Documentación

## Descripción

El comando "revisar" permite revisar documentos con mejoras e instrucciones, identificando cada mejora marcada con **bold** y generando preguntas secuenciales para resolver dudas.

## Uso

En el chat de Cursor, escribe:

```
/revisar @nombre_del_documento.md
```

**Importante:** Usa el prefijo `/` antes del nombre del comando.

Por ejemplo:
```
/revisar @notas.md
```

Al escribir `/` en el chat, Cursor mostrará automáticamente una lista de comandos disponibles, incluyendo "revisar".

## Funcionamiento

1. **Lee el documento** especificado como parámetro
2. **Identifica mejoras** buscando texto marcado con **bold** (inicio/fin de cada mejora)
3. **Extrae cada mejora** como un elemento separado
4. **Genera preguntas secuenciales** para resolver dudas una por una
5. **Presenta preguntas una a la vez** y espera tu respuesta antes de continuar

## Formato de las Preguntas

- Numeradas (ej: "Pregunta 1/10")
- Específicas y claras
- Opciones múltiples cuando aplique (A, B, C, etc.)
- Espera tu respuesta antes de la siguiente pregunta
- Después de todas las respuestas, procede con la implementación

## Ejemplo

**Usuario:** `revisar @notas.md`

**Asistente:**
- Lee notas.md
- Identifica todas las mejoras entre marcadores **bold**
- Genera preguntas para cada mejora
- Presenta preguntas secuencialmente

## Estructura de Respuestas

El asistente usará:
- Estructura indentada para cada punto
- Muestra acciones o mejoras aplicables
- No cita implementación ni workarounds si no aplican al punto tratado

## Archivos de Configuración

- `.cursorrules` - Contiene las reglas para el comando
- `.cursor/commands.json` - Definición del comando (si es soportado)

