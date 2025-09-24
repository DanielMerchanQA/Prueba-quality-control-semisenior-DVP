# Reporte de Pruebas de Carga - Escenario 1 150 Usuarios - 2 minutos.

## Objetivo
Evaluar el rendimiento de la API Fake Store bajo carga de 150 usuarios concurrentes durante 2 minutos.
## Entorno de Prueba
Herramienta utilizada: Apache JMeter 5.6
Entorno: API Fake Store pública (https://fakestoreapi.com)

## Configuración de Prueba
- **Usuarios concurrentes:** 150
- **Duración:** 120 segundos
- **Ramp-up:** 0 segundos
- **Endpoints probados:**
  - `GET /products` (Listar productos)
  - `POST /products` (Crear producto)

## Métricas Obtenidas

### Resultados Globales
| Métrica | Valor | Evaluación |
|---------|-------|------------|
| **Total Requests** | 91476 | Cumple|
| **Throughput** | 759.72 req/seg | Cumple |
| **Error Rate** | 0.00% | Cumple |
| **Avg Response Time** | 393.43 ms | Cumple |
| **Max Response Time** | 3568 ms | No Cumple |

##Análisis de hallazgos

#Comportamiento Bajo Carga
**Estabilidad del Sistema:
- La API mantuvo disponibilidad del 100% durante los 2 minutos de prueba
-  Throughput consistente (~393 req/seg) demostrando buena capacidad de procesamiento
-  Cero errores HTTP indica robustez en el manejo de requests concurrentes

#Patrones Identificados
**Degradación Gradual:
- Los tiempos de respuesta mostraron aumento progresivo durante la prueba
- Posible acumulación de procesos o consumo de recursos
**Problemas en Ambos Endpoints:
- Al inicio de la prueba el endpoint GET presento latencia de 610 ms y el POST de 540 ms a partir del minuto 1 Tanto GET como POST presentaron latencia de mas o menos 596 ms
**Ausencia de Errores:
- A pesar de alta latencia, el sistema no generó timeouts o errores

##Anexos
Todas las evidencias técnicas se encuentran disponibles en el repositorio GIT del proyecto.
**Enlace
https://github.com/DanielMerchanQA/Prueba-quality-control-semisenior-DVP

# Reporte de Pruebas de Carga - Escenario 2 –  Escalado de 100 a 1000 usuarios en intervalos de 150.

## Objetivo
Evaluar el rendimiento, estabilidad y escalabilidad de los endpoints de la API Fake Store bajo carga de 100 usuarios escalándose hasta los 1000 usuarios en intervalos de 150 usuarios. El objetivo es identificar tiempos de respuesta, tasa de errores y posibles cuellos de botella en los endpoints GET /products (consulta) y POST /products (creación).
## Entorno de Prueba
Herramienta utilizada: Apache JMeter 5.6
Entorno: API Fake Store pública (https://fakestoreapi.com)

## Configuración de Prueba
- **Usuarios concurrentes:** 150
- **Duración:** 480 segundos
- **Ramp-up:** 0 segundos
- **Endpoints probados:**
  - `GET /products` (Listar productos)
  - `POST /products` (Crear producto)

## Métricas Obtenidas

### Resultados Globales
| Métrica | Valor | Evaluación |
|---------|-------|------------|
| **Total Requests** | 329813 | Cumple|
| **Throughput** | 666.73 req/seg | Cumple |
| **Error Rate** | 33.63% | No Cumple |
| **Avg Response Time** | 1364 ms | No Cumple |
| **Max Response Time** | 136046 ms | No Cumple |

##Análisis de hallazgos

#Comportamiento Bajo Carga
**Estabilidad del Sistema:
- La API mantuvo disponibilidad del 100% durante los 8 minutos de prueba
- Throughput consistente (~666 req/seg) demostrando buena capacidad de procesamiento
- Se presentó una tasa de errores del 33.63% lo que indica que la API no tiene capacidad para responder todas las peticiones exitosamente.

**Problemas de Latencia:
-  Latencia promedio de ~1364 ms está muy por encima de estándares industry
-  Picos extremos  afectarían seriamente la experiencia de usuario
-  Percentil 95 en 15 segundos indica que 5% de usuarios sufriría delays críticos

#Patrones Identificados
**Degradación Gradual:
- Los tiempos de respuesta mostraron aumento progresivo durante la prueba
- Posible acumulación de procesos o consumo de recursos
- De acuerdo a la grafica 2 (Transactions per Second) se evidencia que cuando transcurre el minuto 2 se comienzan a evidenciar peticiones con respuestas fallidas, teniendo un pico en el minuto 4 con aproximadamente 410 peticiones fallidas, y un nuevo pico en el minuto 8 con aproximadamente 460 peticiones fallidas.
**Problemas en Ambos Endpoints:
- Al inicio de la prueba el endpoint GET presento latencia de 3293ms y el POST de 539ms.
**Errores:
- El porcentaje de peticiones fallidas es superior al 30% lo que indica que el usuario no tendrá una experiencia optima al interactuar con la API.

##Anexos
Todas las evidencias técnicas se encuentran disponibles en el repositorio GIT del proyecto.
**Enlace
https://github.com/DanielMerchanQA/Prueba-quality-control-semisenior-DVP
