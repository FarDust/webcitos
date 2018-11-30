# Documentación TradeAway

## Página en Heroku
Para acceder a la página del proyecto, ir al siguiente link: https://webcitos.herokuapp.com

## Prerequisitos

### Docker build
  * [Docker](https://www.docker.com/get-started)

### Standard Build
* [PostgreSQL](https://github.com/IIC2513-2018-2/syllabus/wiki/Getting-Started#postgresql)
  * Se necesita una base de datos con nombre y usuario/contraseña como están configurados en `src/config/database.js`
* [Node.js v10.9.0](https://github.com/IIC2513-2018-2/syllabus/wiki/Node.js) o superior
* [Yarn](https://yarnpkg.com)

## Configuración del proyecto

### Docker build
  * Clonar el repositorio
  * Crear contenedor:
    * `docker-compose build`

### Standard build
* Clonar repositorio
* Instalar dependencias:
  * `yarn install`
* Configurar la base de datos

## Configuración de la base de datos (development)

### Docker build
  ```sh
  docker-compose exec web sequelize db:migrate
  ```

### Standard build
* Crear la base de datos
  ```sh
  ./node_modules/.bin/sequelize db:create webcitos_dev
  ``` 
* Correr las migraciones
  ```sh
  ./node_modules/.bin/sequelize db:migrate
  ``` 
 * Correr las seeds
    ```sh
   ./node_modules/.bin/sequelize db:seed:all
    ``` 
  
## Correr la aplicación

### Docker build

  ```sh
  docker-compose up web
  ```
  
### Standard build
```sh
yarn start
```

o

```sh
node index.js
```

o

```sh
./node_modules/.bin/nodemon
```

Luego ir a http://localhost:3000

## Librerías relevantes

A continuación se tienen algunas líbrerías relevantes que fueron utilizadas en el proyecto:

- Librería pkgcloud: utilizada para usar Google Cloud Storage para subir y descargar las imágenes de items, usuarios y algunas imágenes de vistas. Para usarla se necesitan credenciales que están en las variables de entorno.
- Librería lodash: utilizada para desarrollar la API de TradeAway.
- Librería jsonwebtoken: utilizada para autenticar usuarios a través de tokens en la API de TradeAway. Para usarla se necesitan credenciales que están en las variables de entorno.
- Google Cloud Vision API: utilizada para identificar imágenes de items a subir por los usuarios para filtrar su ingreso a la página (solo se acepta tecnología portátil) e identificar atributos como su modelo y categoría. Para usarla se necesitan credenciales que están en las variables de entorno.

## Diagrama de Clases

A continuación se tiene el diagrama de clases de la base de datos creada para la aplicación junto con algunos detalles:

![Diagrama de clases de TradeAway](Diagrama_de_Clases.png)

* El state de Publication puede ser exchange o gift y el state de Trade puede ser not_concreted o concreted. En cambio el state de Item se refiere al estado del item (nuevo, viejo, qué tan viejo, lo describe el usuario).
* El usuario que hace una request a una publicación (identificada por publication_id) es el dueño del userID del modelo de Request, además el item_offered_id es opcional ya que depende de si la publicación es para exchange o gift, si es exchange se pide, si no se deja como null.
* Los atributos quality_offered, puntuality y fullfillment_offer de Review son notas que pueden ir del 0 al 5.

## Rutas

### Index
* GET ```/``` : Ruta principal

### Users
* GET ```/users/``` : Lista todos los usuarios (no utilizado)
* GET ```/users/new``` : Crea un nuevo modelo de usuario
* GET ```/users/:id/edit``` : Permite la edición de un usuario
* GET ```/users/:id``` : Obtiene la información de un usuario
* GET ```/users/:id/trades``` : Obtiene los trades de un usuario (no utilizado)
* GET ```/users/:id/image```: Obtiene la imagen del usuario pedido
* POST ```/users/``` : Crea un nuevo usuario
* PATCH ```/users/:id``` : Modifica un usuario existente
* DELETE ```/users/:id``` : Elimina un usuario existente

### Publications
* GET ```/publications/``` : Lista todas las publicaciones
* GET ```/publications/new``` : Crea un nuevo modelo de publicación
* GET ```/publications/:id``` : Obtiene la información de una publicación
* GET ```/publications/:id/edit``` : Permite la edición de una publicación
* POST ```/publications/``` : Crea una nueva publicación
* PATCH ```/publications/:id``` : Modifica una publicación existente
* DELETE ```/publications/:id``` : Elimina una publicación existente

### Items
* GET ```/items/```: Lista todos los items
* GET ```/items/new/:pid```: Crea un nuevo modelo de item (no utilizado)
* GET ```/items/:id```: Obtiene la información de un item
* GET ```/items/:id/image```: Obtiene la imagen del item pedido
* GET ```/items/:id/edit```: Permite la edición de un item
* POST ```/items/```: Crea un nuevo item (no utilizado)
* PATCH ```/items/:id```: Modifica un item existente
* DELETE ```/items/:id```: Elimina un item existente

### Requests
* GET ```/requests/actualUser```: Da la información de cuántas ofertas ha hecho el usuario de la sesión actual
* GET ```/requests/publications/:pid```: Muestra las ofertas hechas a dicha publicación
* GET ```/requests/publications/:pid/new```: Crea un nuevo modelo de request a una publicación específica
* GET ```/requests/:id```: Obtiene la información de un request (no utilizado)
* GET ```/requests/:id/edit```: Permite la edición de un request (no utilizado)
* POST ```/requests/```: Crea un nuevo request
* PATCH ```/requests/:id```: Modifica un request ya existente (no utilizado)
* DELETE ```/requests/:id```: Elimina un request existente

### Trades
* GET ```/trades/```: Lista todos los trades (utilizado sólo para debugging)
* GET ```/trades/new```: Crea un nuevo modelo de trade
* GET ```/trades/:tid```: Obtiene la información de un trade
* GET ```/trades/:id/edit```: Permite la edición de un trade (no utilizado)
* POST ```/trades/:id_request/:state```: Crea un nuevo trade con los datos suministrados
* PATCH ```/trades/:id```: Modifica un trade ya existente
* DELETE ```/trades/:id```: Elimina un trade existente

### Reviews
* GET ```/reviews/```: Lista todos los reviews (utilizado para debugging)
* GET ```/reviews/trades/new/:tid```: Permite la creación de un modelo review nuevo
* GET ```/reviews/:id```: Obtiene la información de un review
* GET ```/reviews/:id/edit```: Permite la edición de un review (no utilizado)
* POST ```/reviews/```: Crea un nuevo review
* PATCH ```/reviews/:id```: Modifica el review según lo que el usuario puede ingresar
* DELETE ```/reviews/:id```: Elimina un review ya existente (no utilizado)


## API

La aplicación ofrece diversas funcionalidades a través de una API. El acceso a algunas funcionalidades es restringido a usuarios, en esos casos es necesario autenticarse antes de consultar la API. Las funcionalidades son las siguientes:

### Users:

#### Descripción: Autenticar al usuario para acceder a ciertas funcionalidades de la API.
* Ruta: ```/api/users/session```
* Método: POST
* Parámetros: email, password
* Respuesta: En caso de entregar parámetros válidos se responde con un json que contiene un token que permite acceder a los otros métodos de la API. En otro caso, se retorna un error 401.

Ejemplo:

```sh
curl http://localhost:3000/api/users/session -X PUT -d '{"email": "Ivan.Wolf@gmail.com", "password": "123web"}' -H 'Content-Type: application/json'
```

#### Descripción: Autenticar al usuario para acceder a ciertas funcionalidades de la API.
* Ruta: ```/api/users/me```
* Método: GET
* Parámetros: -
* Header: 'Authorization: Bearer <TOKEN>'
* Respuesta: En caso de entregar un token válido se responde con un json que contiene la información del usario al que pertenece el token. En otro caso, se retorna un error 401.

Ejemplo:

```sh
curl http://localhost:3000/api/users/me -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTU0MzAxOTc1NX0.p0SV3cXlbHwoLDyFAewuN-IhUyy6LmBh3HZoXYDww-I'
```

#### Descripción: Mostrar todas las publicaciones de un usuario.
* Ruta: ```/api/users/my-publications```
* Método: GET
* Parámetros: -
* Header: 'Authorization: Bearer <TOKEN>'
* Respuesta: En caso de entregar un token válido se retorna una lista con todas las publicaciones del usario al que pertenece el token, cada una siendo un json que muestra los detalles más básicos de la publicación. En otro caso, se retorna un error 401.

### Publications:

#### Descripción: Mostrar todas las publicaciones.
* Ruta: ```/api/publications```
* Método: GET
* Parámetros: -
* Respuesta: Se retorna una lista con todas las publicaciones, cada una siendo un json que muestra los detalles más básicos de la publicación.

#### Descripción: Mostrar una publicación.
* Ruta: ```/api/publications/:id```
* Método: GET
* Parámetros: -
* Respuesta: Se retorna un json con información detallada sobre una publicación en particular.


### Items:

#### Descripción: Mostrar todos los items.
* Ruta: ```/api/items```
* Método: GET
* Parámetros: -
* Respuesta: Se retorna una lista con todos los items, cada uno siendo un json que muestra los detalles más básicos del item.

#### Descripción: Mostrar un item.
* Ruta: ```/api/items/:id```
* Método: GET
* Parámetros: -
* Respuesta: Se retorna un json con información detallada sobre un item en particular.


### Requests:

#### Descripción: Crear una nueva oferta por una publicación.
* Ruta: ```/api/requests/new```
* Método: POST
* Parámetros: publicationId, message, itemOfferedId (opcional, depende de si la publicación es para exchange o gift)
* Header: 'Authorization: Bearer <TOKEN>', 'Content-Type: application/json'
* Respuesta: Retorna un json con la respuesta, si es negativa será 400 con una descripción breve del error. En caso de ser positiva se avisará con un mensaje de "Request created!".

Ejemplo:

```sh
curl http://localhost:3000/api/requests/new -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQTU0MzU1MTg1Nn0.zkijYE1lt0ORtsu_mvIR-beSEZ9p6ngSCpkgNB1QLGU' -H 'Content-Type: application/json' --data '{"publicationId": "5", "itemOfferedId": "8", "message": "exchange with me! c:"}'
```