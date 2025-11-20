# Estimación de Proyecto: Mockup → FullStack T3
## Grifols Pharma International - Biopharma BU

**Fecha de estimación**: Diciembre 2024  
**Deadline objetivo**: Abril 2026  
**Alcance**: 135 países, 43 productos, 126 empresas, 7 años de datos históricos

---

## Contexto del Desarrollo

### Desarrollo con Cursor/LLMs

**Ventajas**:
- **Aceleración 2-3x** en tareas repetitivas (componentes, CRUD, validaciones)
- **Generación automática** de código boilerplate (Prisma schemas, tRPC routers)
- **Refactoring eficiente** de componentes React → Next.js
- **Documentación automática** de código

**Limitaciones**:
- **No elimina complejidad** de lógica de negocio
- **Requiere validación humana** de código generado
- **Iteración necesaria** cuando especificaciones son vagas
- **Testing manual** sigue siendo crítico

**Factor de eficiencia estimado**: 1.5-2x en desarrollo puro, pero **no aplica** a:
- Análisis de requisitos
- Diseño de arquitectura
- Testing y QA
- Gestión de cambios
- Rollout por países

---

## Análisis de Riesgos y Mitigación

### 1. Change Management y Alcance de 134 Países

**Impacto**: ALTO  
**Probabilidad**: ALTA

**Desafíos**:
- Diferencias en procesos por país
- Resistencia al cambio de usuarios
- Capacitación masiva
- Soporte multi-idioma
- Rollout gradual necesario

**Mitigación**:
- Fase piloto con 5-10 países (Semana 20-24)
- Documentación multi-idioma desde inicio
- Portal de capacitación con videos
- Soporte dedicado por región
- Rollout en waves (10-15 países por wave)

**Tiempo adicional estimado**: +8-12 semanas

---

### 2. Bajo Detalle en Especificaciones

**Impacto**: MEDIO-ALTO  
**Probabilidad**: ALTA

**Desafíos**:
- ~100 features de alta prioridad sin detalle
- Requisitos ambiguos
- Cambios de alcance durante desarrollo
- Iteración constante con stakeholders

**Mitigación**:
- Sesiones de refinamiento semanales (2-3 horas)
- Prototipos rápidos para validación
- Documentación incremental (PR.md mejorado)
- Priorización continua con business

**Tiempo adicional estimado**: +6-8 semanas (distribuidas)

---

### 3. Diferencias por País (Product Naming, Competitors)

**Impacto**: ALTO  
**Probabilidad**: ALTA

**Desafíos**:
- 135 países con diferentes:
  - Nombres de productos (aliases)
  - Competidores locales
  - Monedas y tipos de cambio
  - Estructuras de datos
- Normalización compleja
- Validaciones específicas por país

**Mitigación**:
- Sistema de configuración por país (Country Setup)
- Tablas de mapeo (ProductAlias, CompanyAlias)
- Reglas de validación configurables
- Proceso de onboarding por país

**Tiempo adicional estimado**: +4-6 semanas (configuración inicial)

---

### 4. Rollout Complejo

**Impacto**: ALTO  
**Probabilidad**: ALTA

**Desafíos**:
- Migración de datos históricos por país
- Testing por país
- Capacitación escalonada
- Soporte durante transición
- Rollback plan por país

**Mitigación**:
- Herramientas de migración automatizadas
- Testing automatizado por país
- Portal de soporte con FAQs
- Equipo de rollout dedicado

**Tiempo adicional estimado**: +10-14 semanas (rollout completo)

---

### 5. Dependencias de Terceros (IQVIA)

**Impacto**: MEDIO  
**Probabilidad**: MEDIA

**Desafíos**:
- APIs externas no controladas
- Cambios en APIs sin aviso
- Latencia y disponibilidad
- Integración compleja

**Mitigación**:
- Abstraction layer para integraciones
- Caching de datos externos
- Fallback mechanisms
- Monitoreo de APIs

**Tiempo adicional estimado**: +2-3 semanas

---

### 6. Carga de Datos Históricos (Fragmentados y Desordenados)

**Impacto**: ALTO  
**Probabilidad**: ALTA

**Desafíos**:
- 7 años de datos en múltiples formatos
- Datos inconsistentes
- Duplicados y errores
- Normalización masiva
- Validación exhaustiva

**Mitigación**:
- Scripts de ETL automatizados
- Proceso de limpieza iterativo
- Validación por lotes
- Dashboard de calidad de datos
- Proceso de corrección asistido

**Tiempo adicional estimado**: +8-10 semanas (carga inicial)

---

## Estimación Detallada por Fase

### FASE 0: Preparación y Documentación (Semanas 1-3)

**Objetivo**: Preparar documentación y planificación para desarrollo eficiente con LLMs

**Tareas**:
- Crear `SCHEMA_PRISMA.md` con modelo de datos completo
- Crear `MIGRATION_ROADMAP.md` detallado
- Mejorar `PR.md` con Migration Notes por módulo
- Crear `API_SPECIFICATIONS.md` con contratos tRPC
- Crear `DATA_MODEL_MAPPING.md` (mockup → DB)
- Refinar especificaciones con stakeholders (10 features críticas)

**Dedicación**:
- **Desarrollador Senior**: 15 días
- **Business Analyst**: 10 días
- **Total**: 25 días persona

**Con LLMs**: 18-20 días (aceleración en generación de documentación)

---

### FASE 1: Setup T3 Stack y Infraestructura (Semanas 4-6)

**Objetivo**: Configurar proyecto T3, Azure SQL, EntraID, y estructura base

**Tareas**:
- Crear proyecto T3 con `create-t3-app`
- Configurar Azure SQL (desarrollo, staging, producción)
- Configurar EntraID authentication
- Setup Prisma con schema inicial
- Configurar CI/CD básico
- Setup de entornos (dev, staging, prod)

**Dedicación**:
- **DevOps/Backend**: 12 días
- **Desarrollador FullStack**: 8 días
- **Total**: 20 días persona

**Con LLMs**: 15-16 días (aceleración en configuración)

---

### FASE 2: Migración de Componentes UI (Semanas 7-10)

**Objetivo**: Migrar componentes del mockup a Next.js

**Tareas**:
- Migrar componentes base (button, SelectionButton, etc.)
- Migrar componentes comunes (ExchangeRateTable, PriceTypeSelector, etc.)
- Migrar `Nextcell` (componente crítico)
- Migrar `PowerBIEmbed`
- Migrar layout components (LeftPanel, CenterPanel)
- Adaptar estilos Tailwind
- Testing de componentes

**Dedicación**:
- **Frontend Developer**: 20 días
- **QA**: 5 días
- **Total**: 25 días persona

**Con LLMs**: 18-20 días (aceleración significativa en migración de componentes)

---

### FASE 3: Backend - Modelos de Datos y CRUD (Semanas 11-15)

**Objetivo**: Implementar modelos Prisma y routers tRPC básicos

**Tareas**:
- Completar Prisma schema (Country, Product, SalesData, PatientsData, MarketInsight, User, etc.)
- Generar migrations
- Seed database con datos de prueba
- Crear tRPC routers básicos (CRUD):
  - `countriesRouter`
  - `productsRouter`
  - `salesDataRouter`
  - `patientsDataRouter`
  - `marketInsightsRouter`
  - `usersRouter`
- Implementar validaciones Zod
- Testing de APIs

**Dedicación**:
- **Backend Developer**: 25 días
- **QA**: 8 días
- **Total**: 33 días persona

**Con LLMs**: 22-25 días (aceleración en generación de schemas y routers)

---

### FASE 4: Backend - Lógica de Negocio (Semanas 16-20)

**Objetivo**: Implementar cálculos, validaciones y procesos de negocio

**Tareas**:
- Migrar funciones de cálculo (business-logic.ts)
- Implementar cálculos en backend (Turnover, MarketShare, Volume)
- Crear procedures para Excel import/export
- Implementar Power BI embed token generation
- Validaciones de negocio complejas
- Sistema de aliases y normalización
- Testing de lógica de negocio

**Dedicación**:
- **Backend Developer**: 20 días
- **QA**: 10 días
- **Total**: 30 días persona

**Con LLMs**: 18-20 días (aceleración en implementación de funciones)

---

### FASE 5: Integración Frontend-Backend (Semanas 21-24)

**Objetivo**: Conectar componentes con tRPC y implementar flujos completos

**Tareas**:
- Conectar componentes a tRPC queries
- Implementar mutations para data entry
- Agregar loading states y error handling
- Implementar autosave (debounced mutations)
- Optimizar queries (N+1, caching)
- Testing end-to-end de módulos

**Dedicación**:
- **FullStack Developer**: 18 días
- **QA**: 12 días
- **Total**: 30 días persona

**Con LLMs**: 22-24 días (menos aceleración, más testing manual)

---

### FASE 6: Autenticación y Permisos (Semanas 25-27)

**Objetivo**: Implementar seguridad y control de acceso

**Tareas**:
- Configurar EntraID middleware completo
- Implementar row-level security (RLS)
- Crear sistema de permisos por función
- Filtrar datos por país asignado al usuario
- Testing de seguridad
- Auditoría y logging

**Dedicación**:
- **Backend/Security Developer**: 15 días
- **QA**: 6 días
- **Total**: 21 días persona

**Con LLMs**: 16-18 días

---

### FASE 7: Carga de Datos Históricos (Semanas 28-35)

**Objetivo**: Cargar y normalizar 7 años de datos históricos

**Tareas**:
- Analizar datos históricos (formatos, inconsistencias)
- Crear scripts ETL para cada fuente
- Proceso de normalización (productos, países, empresas)
- Validación masiva de datos
- Dashboard de calidad de datos
- Proceso de corrección asistido
- Carga incremental por país

**Dedicación**:
- **Data Engineer**: 35 días
- **Backend Developer**: 15 días
- **QA/Data Analyst**: 20 días
- **Total**: 70 días persona

**Con LLMs**: 55-60 días (aceleración en scripts ETL, pero validación manual)

**Nota**: Esta fase puede ejecutarse en paralelo con otras fases

---

### FASE 8: Integraciones Externas (Semanas 36-38)

**Objetivo**: Integrar con IQVIA y otras fuentes externas

**Tareas**:
- Integración con IQVIA API
- Abstraction layer para APIs externas
- Caching y fallback mechanisms
- Monitoreo de integraciones
- Testing de integraciones

**Dedicación**:
- **Backend Developer**: 12 días
- **QA**: 5 días
- **Total**: 17 días persona

**Con LLMs**: 12-14 días

---

### FASE 9: Features Avanzadas (Semanas 39-45)

**Objetivo**: Implementar features de alta prioridad del assessment

**Tareas prioritarias**:
- Forecasting y predictive analytics
- What-if analysis
- Data quality dashboard
- Anomaly detection
- Audit trail completo
- Approval workflows
- Multi-language support

**Dedicación**:
- **FullStack Developer**: 35 días
- **Data Scientist** (forecasting): 15 días
- **QA**: 20 días
- **Total**: 70 días persona

**Con LLMs**: 55-60 días

---

### FASE 10: Testing y Optimización (Semanas 46-50)

**Objetivo**: Testing exhaustivo y optimización de rendimiento

**Tareas**:
- Tests unitarios completos
- Tests de integración
- Tests de carga (135 países, 7 años de datos)
- Optimización de queries Prisma
- Optimización de frontend (bundle size, lazy loading)
- Performance testing
- Security audit

**Dedicación**:
- **QA**: 25 días
- **FullStack Developer**: 15 días
- **DevOps**: 8 días
- **Total**: 48 días persona

**Con LLMs**: 40-42 días (menos aceleración, testing manual crítico)

---

### FASE 11: Fase Piloto (Semanas 51-54)

**Objetivo**: Rollout piloto con 5-10 países

**Tareas**:
- Selección de países piloto
- Migración de datos por país
- Capacitación de usuarios piloto
- Soporte dedicado
- Recopilación de feedback
- Ajustes basados en feedback

**Dedicación**:
- **Project Manager**: 10 días
- **Business Analyst**: 12 días
- **FullStack Developer**: 8 días
- **QA**: 6 días
- **Soporte**: 15 días
- **Total**: 51 días persona

**Con LLMs**: 45-48 días

---

### FASE 12: Rollout Gradual (Semanas 55-70)

**Objetivo**: Rollout completo a 135 países en waves

**Estructura**:
- **Wave 1**: 10 países (Semanas 55-57)
- **Wave 2**: 15 países (Semanas 58-60)
- **Wave 3**: 20 países (Semanas 61-63)
- **Wave 4**: 25 países (Semanas 64-66)
- **Wave 5**: 30 países (Semanas 67-69)
- **Wave 6**: 35 países (Semana 70)

**Tareas por wave**:
- Migración de datos
- Testing por país
- Capacitación
- Go-live
- Soporte post-lanzamiento

**Dedicación**:
- **Project Manager**: 30 días
- **Business Analyst**: 40 días
- **FullStack Developer**: 20 días
- **QA**: 25 días
- **Soporte**: 60 días
- **Total**: 175 días persona

**Con LLMs**: 160-170 días (menos aceleración, más gestión)

---

### FASE 13: Documentación y Capacitación (Paralela, Semanas 20-70)

**Objetivo**: Documentación completa y materiales de capacitación

**Tareas**:
- User manuals (multi-idioma)
- Technical documentation
- Video tutorials
- Training materials
- API documentation
- Runbooks operativos

**Dedicación**:
- **Technical Writer**: 40 días
- **Business Analyst**: 20 días
- **Total**: 60 días persona

**Con LLMs**: 35-40 días (aceleración en generación de documentación)

---

## Resumen de Estimación

### Tiempo Total (Semanas)

| Escenario | Semanas | Meses |
|-----------|--------|-------|
| **Óptimo (con LLMs, sin retrasos)** | 60-65 | 14-15 |
| **Realista (con LLMs, con contingencias)** | 70-75 | 16-17 |
| **Pesimista (sin LLMs, con retrasos)** | 85-95 | 19-22 |

### Dedicación Total (Días Persona)

| Fase | Días Persona (Sin LLMs) | Días Persona (Con LLMs) |
|------|-------------------------|-------------------------|
| Fase 0: Preparación | 25 | 18-20 |
| Fase 1: Setup T3 | 20 | 15-16 |
| Fase 2: Componentes UI | 25 | 18-20 |
| Fase 3: Backend CRUD | 33 | 22-25 |
| Fase 4: Lógica Negocio | 30 | 18-20 |
| Fase 5: Integración FE-BE | 30 | 22-24 |
| Fase 6: Autenticación | 21 | 16-18 |
| Fase 7: Datos Históricos | 70 | 55-60 |
| Fase 8: Integraciones | 17 | 12-14 |
| Fase 9: Features Avanzadas | 70 | 55-60 |
| Fase 10: Testing | 48 | 40-42 |
| Fase 11: Piloto | 51 | 45-48 |
| Fase 12: Rollout | 175 | 160-170 |
| Fase 13: Documentación | 60 | 35-40 |
| **TOTAL** | **675** | **560-600** |

### Equipo Recomendado

**Core Team** (Semanas 1-50):
- 1x Project Manager (tiempo completo)
- 2x FullStack Developers (tiempo completo)
- 1x Backend Developer (tiempo completo)
- 1x Frontend Developer (tiempo completo)
- 1x QA Engineer (tiempo completo)
- 1x Data Engineer (tiempo completo, semanas 28-35)
- 1x Business Analyst (tiempo parcial, 50%)

**Rollout Team** (Semanas 51-70):
- 1x Project Manager (tiempo completo)
- 1x FullStack Developer (soporte, tiempo parcial 50%)
- 2x Business Analysts (tiempo completo)
- 2x Soporte técnico (tiempo completo)
- 1x QA Engineer (tiempo parcial, 50%)

### Estimación por Perfil (Días)

| Perfil | Días Totales | Coste Estimado (€/día) | Total (€) |
|--------|--------------|----------------------|-----------|
| Project Manager | 50 | 800 | 40,000 |
| FullStack Developer | 120 | 600 | 72,000 |
| Backend Developer | 80 | 600 | 48,000 |
| Frontend Developer | 40 | 550 | 22,000 |
| QA Engineer | 70 | 500 | 35,000 |
| Data Engineer | 60 | 650 | 39,000 |
| Business Analyst | 80 | 550 | 44,000 |
| Technical Writer | 40 | 450 | 18,000 |
| Soporte Técnico | 60 | 400 | 24,000 |
| **TOTAL** | **600** | - | **340,000** |

*Nota: Costes estimados para mercado español. Ajustar según ubicación.*

---

## Factores de Riesgo y Contingencia

### Buffer de Contingencia Recomendado

- **Técnico**: +15-20% (complejidad no prevista, bugs críticos)
- **Gestión**: +10-15% (cambios de alcance, iteraciones)
- **Rollout**: +20-25% (resistencia al cambio, problemas por país)

**Total buffer recomendado**: +45-60% sobre estimación base

### Timeline con Contingencia

| Escenario | Semanas Base | Buffer | Total |
|-----------|--------------|-------|-------|
| **Óptimo** | 60 | +10 | 70 |
| **Realista** | 70 | +15 | 85 |
| **Pesimista** | 85 | +20 | 105 |

---

## Recomendaciones Estratégicas

### 1. Priorización de Features

**MVP (Semanas 1-50)**:
- Data Entry (Sales, Patients, Market)
- Master Data (Countries, Products, Users)
- Reports básicos (Power BI)
- Autenticación y permisos

**Fase 2 (Semanas 51-70, paralelo a rollout)**:
- Forecasting avanzado
- What-if analysis
- Features de data quality avanzadas

### 2. Desarrollo Incremental

- **Sprint de 2 semanas** con demos al final
- **Validación continua** con stakeholders
- **Refinamiento semanal** de especificaciones

### 3. Uso Estratégico de LLMs

**Maximizar uso en**:
- Generación de código boilerplate
- Migración de componentes
- Generación de documentación
- Scripts ETL

**Minimizar dependencia en**:
- Testing manual
- Análisis de requisitos
- Decisiones de arquitectura
- Gestión de cambios

### 4. Mitigación de Riesgos

- **Iniciar Fase 7 (Datos Históricos) temprano** (Semana 20, en paralelo)
- **Fase piloto obligatoria** antes de rollout masivo
- **Documentación desde inicio** (no al final)
- **Testing continuo** (no solo al final)

---

## Conclusión

**Estimación Realista con LLMs**: **70-75 semanas** (16-17 meses)

**Deadline objetivo**: Abril 2026 (15-16 meses desde ahora)

**Viabilidad**: ✅ **VIABLE** con:
- Inicio inmediato
- Equipo completo desde inicio
- Uso estratégico de LLMs
- Priorización clara
- Buffer de contingencia adecuado

**Recomendación**: Proceder con el enfoque propuesto, pero:
1. Iniciar Fase 7 (datos históricos) en paralelo con desarrollo
2. Priorizar MVP para validación temprana
3. Fase piloto obligatoria antes de rollout
4. Buffer de 20% adicional para imprevistos

---

## Próximos Pasos Inmediatos

1. ✅ Aprobar estimación y timeline
2. ✅ Contratar/Asignar equipo core
3. ✅ Iniciar Fase 0 (Preparación y Documentación)
4. ✅ Sesión de refinamiento de especificaciones (10 features críticas)
5. ✅ Setup de entornos Azure (dev, staging, prod)


