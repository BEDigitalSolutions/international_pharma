
**El panel de menú de la extrema izquierda tiene que tener un Background Light, crear un resaltado de Background en la posición de menú seleccionada**



**Generar un nuevo punto de menú**

    # Reports

    ## Sales Trends
    ** Behavior**:

- Crear un iframe que emplee el informe : https://app.powerbi.com/groups/bb2b36c4-8e79-48c3-8e0e-beeffcbcd6bc/reports/374c879d-18c6-4eb8-96e8-5b1ad102369d/ReportSection6d07f950286975e21292?experience=power-bi

    # Reports

    ## Sales Analysis
    ** Behavior**:

- Crear un iframe que emplee el informe : https://app.powerbi.com/groups/ca1ac1fe-67ba-4206-835d-c1eca37a3e53/reports/703b9b8b-737c-4969-bade-6679da8c6e82/ReportSection3202ee6d4de9c00a3480?experience=power-bi

**No puedo modificar el ancho de los paneles mediante los bordes de los paneles.**

**Cambiar la distribución de los paneles; el panel izquierdo debe ser más estrecho**

**En Sales Data** 

- Los GrupXX deben estar  justificado a la izquierda, NO centrados
- Para todas las columnas de "Turnover" generar un cálculo de "Vol." multiplicado por "Price" si no hay valor en "Vol." OR "Price" no calcular.
- En caso que el valor de Vol. de un mes sea un 100% superior al del mes anterior, situar el fondo en naranja.

**Eliminar el punto de menú "Excel Demo"** 

**En Users: Asignar los siguientes valores:**

| Groups              | Cumulative Selected Functions                                      |
| ------------------- | ------------------------------------------------------------------ |
| Data Entry Managers | Reports<br />Data Entry                                            |
| Country Users       | Reports<br />Data Entry<br />MasterData                            |
| Supervisors         | Reports<br />Data Entry<br />MasterData<br />Users<br />Supervisor |
| Read-Only Users     | Reports                                                            |


**En Users: Asignar los siguientes valores:**

crear en el lado izquierdo del nombre del país un radio button con un diseño que permite seleccionar 

Crear los datos en PR_3.md con una asignación aletoria de de países para los usuarios.

**En User: Eliminar de la card de usuarios el perfil "Data Entry Managers, Country Users, Supervisors, Read-Only Users":**

Por Ejemplo, dejar exclusivamente:

    John Smith
	john.smith@grifols.com
