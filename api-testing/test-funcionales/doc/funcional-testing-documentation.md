# Documentacion de Pruebas Funcionales

## Informacion del Proyecto
- **API**: Fake Store API
- **Base URL**: `https://fakestoreapi.com`
- **Tester**: Daniel Felipe Merchan  Godoy
- **Fecha**: 23/09/2025
- **Herramientas**: Postman v11.0

## Caso 1: API Disponible (Health Check)
### Request
- **Metodo**: GET
- **URL**: `https://fakestoreapi.com/products`
- **Headers**: `Content-Type: application/json`

# Response Esperada
- **Status Code**: 200
- **Body**: Array de productos en JSON

# Tests 
`javascript`
// Verificar que el status code es 200
pm.test("API Disponible", function() {
    pm.response.to.have.status(200);
});

// Verificar que la respuesta es un array JSON
pm.test("Respuesta es un array JSON", function() {
    pm.response.to.be.json;
    pm.response.to.have.jsonBody();
});

// Verificar que el body no esta vacio
pm.test("Respuesta no Vacia", function() {
    pm.expect(pm.response.json().length).to.be.greaterThan(0);
});

#Resultado:
**Status:** 200 OK
**Response Time**: 1090 ms
**Response Size**: 4.95 KB
**Resultado**: PASO- Todos los tests exitosos

#Evidencia:
**Response:** Array con 20 productos

## Caso 2: Listar productos de electronica

# Request
- **Metodo**: GET
- **URL**: `https://fakestoreapi.com/products/category/electronics`
- **Headers**: `Content-Type: application/json`

# Response Esperada
- **Status Code**: 200
- **Body**: Array de productos en JSON
# Tests Automatizados
`javascript`
// Verificar API Disponible
pm.test("API Disponible", function() {
    pm.response.to.have.status(200);
});

// Verificar que todos los productos son de categoria electronics
pm.test("Productos de Electronica", function() {
    const products = pm.response.json();
    products.forEach(product => {
        pm.expect(product.category).to.eql("electronics");
    });
});

#Resultado:
**Status:** 200 OK
**Response Time**: 351 ms
**Response Size**: 2.32 KB
**Resultado**: PASO - Todos los tests exitosos

#Evidencia:
**Response:** Array con 6 productos de la categoria "electronics".

## Caso 3: Obtener producto por ID

# Request
- **Metodo**: GET
- **URL**: `https://fakestoreapi.com/products/5
- **Headers**: `Content-Type: application/json`

# Response Esperada
- **Status Code**: 200
- **Body**: Array de producto con ID = 5 en JSON
# Tests Automatizados
`javascript`
// Verificar status code 200
pm.test("API Disponible", function() {
    pm.response.to.have.status(200);
});// Verificar que el ID coincide con el solicitado
pm.test("Filtro por ID", function() {
    const product = pm.response.json();
    pm.expect(product.id).to.eql(5);
});

#Resultado:
**Status:** 200 OK
**Response Time**: 201 ms
**Response Size**: 1009 B
**Resultado**: PASO - Todos los tests exitosos

#Evidencia:
**Response:** Array con 1 productos cuyo ID = 5.

## Caso 4: Crear nuevo producto

# Request
- **Metodo**: POST
- **URL**: `https://fakestoreapi.com/products/
- **Headers**: `Content-Type: application/json`

# Response Esperada
- **Status Code**: 201
- **Body**: {
    "title": "PC Portatil DANIEL",
    "price": 1500.99,
    "description": "Producto creado por Daniel Merchan para la prueba tecnica de DVP",
    "category": "electronics",
    "image": "https://ibb.co/Kck36QM2"
}
# Tests Automatizados
`javascript`
// Verificar API Disponible y codigo 201 para producto nuevo
pm.test("API Disponible", function() {
    pm.response.to.have.status(201);
});
// Verificar que se crea el producto y retorna un ID
pm.test("ID Nuevo producto", function() {
    const response = pm.response.json();
    pm.expect(response).to.have.property('id');
    pm.expect(response.id).to.be.a('number');
});
// Guardar ID del producto
pm.test("Guardar ID", function() {
    const response = pm.response.json();
    pm.collectionVariables.set("createdProductId", response.id);
    console.log("Nuevo producto creado con ID:", response.id);
});

#Resultado:
**Status:** 201 Created
**Response Time**: 873 ms
**Response Size**: 857 B
**Resultado**: PASO - Todos los tests exitosos

#Evidencia:
**Response:** Se creo el nuevo producto exitosamente.
**BUG Asociado:** BUG-001 "Persistencia de datos inexistente en productos creados via POST" Relacionado en el documento (QUALITY CONTROL ENGINEER PRUEBA TECNICA - Registro de Bugs - Daniel Felipe Merchan.docx)

## Caso 5: Consultar el producto creado

# Request
- **Metodo**: GET
- **URL**: `https://fakestoreapi.com/products/21
- **Headers**: `Content-Type: application/json`

# Response Esperada
- **Status Code**: 200
- **Body**: Array de producto con I ID = 21 en JSON

# Tests Automatizados
`javascript`
// Verificacion de existencia de datos
pm.test("Response con Datos", function() {
    pm.expect(pm.response.text().length).to.be.greaterThan(0);
});

#Resultado:
**Status:** 200 OK
**Response Time**: 211 ms
**Response Size**: 638 B
**Resultado**: Fallo - Test Fallido

#Evidencia:
**Response:** Se recibio la respuesta "AssertionError: expected +0 to be above +0", lo que indica que el producto creado no persiste en la base de datos.
**BUG Asociado:** BUG-001 "Persistencia de datos inexistente en productos creados via POST" Relacionado en el documento (QUALITY CONTROL ENGINEER PRUEBA TECNICA - Registro de Bugs - Daniel Felipe Merchan.docx)

## Caso 6: Actualizar imagen del producto creado

**Requerimiento original**: 
"Actualiza la imagen del producto creado"

**Limitacion tecnica**: 
Debido al BUG-001 (persistencia inexistente), el producto creado en el Caso 4 no existe realmente para operaciones posteriores.

**Solucion implementada**:
Para demostrar la funcionalidad de actualizacion, se utiliza el producto existente ID 1, verificando que:
- El endpoint PUT /products/1 funciona correctamente
- La actualizacion de imagen se realiza exitosamente
- Los datos persisten despues de la actualizacion

# Request
- **Metodo**: PUT
- **URL**: `https://fakestoreapi.com/products/1
- **Headers**: `Content-Type: application/json`

# Response Esperada
- **Status Code**: 200
- **Body**: {
"image": "https://ibb.co/Kck36QM2
}
# Tests Automatizados
`javascript`
// Test basico de estado
pm.test("Estado", function() {
    pm.response.to.have.status(200);
});

// Test de estructura de response
pm.test("JSON valido", function() {
    pm.response.to.be.json;
});

#Resultado:
**Status:** 200 OK
**Response Time**: 216 ms
**Response Size**: 731 B
**Resultado**: Pass - Test Exitoso

#Validacion de correcta actualizacion de la imagen en el producto ID=1

# Request
- **Metodo**: GET
- **URL**: `https://fakestoreapi.com/products/1
- **Headers**: `Content-Type: application/json`

# Tests Automatizados
// Verificar API Disponible
pm.test("API Disponible", function() {
    pm.response.to.have.status(200);
});// Verificar que el ID coincide con el solicitado
pm.test("Filtro por ID", function() {
    const product = pm.response.json();
    pm.expect(product.id).to.eql(1);
});

# RESULTADOS OBTENIDOS:
**Status**: 200 OK
**Response Time**: 216 ms
**Tamaño Response**: 731 B
**Tests Ejecutados**: 2/2 passed 
**Resultado Final**: FALLIDO - Al enviar la peticion para realizar la actualizacion de la imagen se recibe respuesta exitosa, pero al validar nuevamente si la URL se actualizo, la URL no se actualiza, 
por lo tanto se presenta la incidencia reportada en el BUG-002.
**Bug Asociado**: 002

#Evidencia:
**Response:** Array con el producto ID = 1
**BUG Asociado:** BUG-002 "Persistencia de datos inexistente en productos actualizados via PUT" Relacionado en el documento (QUALITY CONTROL ENGINEER PRUEBA TECNICA - Registro de Bugs - Daniel Felipe Merchan.docx)

