# Revisar

Revisa las mejoras e instrucciones en el documento indicado como parámetro. Los textos marcados con **bold** indican inicio/final de cada mejora. Indícame dudas y preguntas en una secuencia de preguntas para resolverlas una a una.

## Instrucciones

1. **Lee el documento** especificado como parámetro en la petición
2. **Identifica mejoras** buscando texto marcado con **bold** - estos indican el inicio/fin de cada mejora
3. **Extrae cada mejora** como un elemento separado
4. **Genera una secuencia de preguntas** para resolver dudas una por una. Formula las preguntas más relevante, sin repetir y las mínimos imprescindibles.
5. **Presenta preguntas una a la vez** y espera la respuesta del usuario antes de continuar con la siguiente pregunta
6. **Usa una estructura indentada** para cada punto mostrando las acciones o mejoras aplicables
7. **No cites implementación ni workarounds** si no aplican al punto tratado
8. Una vez resueltas de preguntas, actulizar el documento inicial con las respuestas y conclusiones,

## Formato de Preguntas

- Numera cada pregunta (ej: "Pregunta 1/n")
- Sé específico y claro
- Proporciona opciones múltiples cuando aplique (A, B, C, etc.)
- Espera la respuesta del usuario antes de hacer la siguiente pregunta
- Después de todas las respuestas, procede con la implementación

## Ejemplo de Uso

Usuario: `/revisar @notas.md`

- Lee notas.md
- Identifica todas las mejoras entre marcadores **bold**
- Genera preguntas para cada mejora
- Presenta preguntas secuencialmente
