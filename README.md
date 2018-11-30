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

## Rutas

### Index
* GET ```/``` : Ruta principal

### Users
* GET ```/users/``` : Lista todos los usuarios (no usado)
* GET ```/users/new``` : Crea un nuevo modelo de usuario
* GET ```/users/:id/edit``` : Permite la edición de un usuario
* GET ```/users/:id``` : Obtiene la información de un usuario
* POST ```/users/``` : Crea un nuevo usuario
* PATCH ```/users/:id``` : Modifica un usuario existente

### Publications
### Items
### Requests
### Trades
### Reviews


## API

La aplicación ofrece diversas funcionalidades a través de una API. El acceso a algunas funcionalidades es restringido a usuarios, en esos casos es necesario autenticarse antes de consultar la API. Las funcionalidades son las siguientes:

### Users:

#### Descripción: Autenticar al usuario para acceder a ciertas funcionalidades de la API.
* Ruta: ```/api/users/session```
* Método: POST
* Parámetros: email, password
* Respuesta: En caso de entregar parámetros válidos se responde con un token que permite acceder a los otros métodos de la API. En otro caso, se retorna un error 401.

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

### Publications:

#### Descripción: Mostrar todas las publicaciones.
* Ruta: ```/api/publications```
* Método: GET
* Parámetros: -
* Respuesta: Se retorna un json con todas las publicaciones, mostrando los detalles más básicos.

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
* Respuesta: Se retorna un json con información básica sobre todos los items.

#### Descripción: Mostrar un item.
* Ruta: ```/api/items/:id```
* Método: GET
* Parámetros: -
* Respuesta: Se retorna un json con información detallada sobre un item en particular.

## Diagrama ER

*falta foto del diagrama*

Alguna descripción
