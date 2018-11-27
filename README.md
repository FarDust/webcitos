

# Webcitos

Found us [here!](https://webcitos.herokuapp.com)

## Prerequisites:

  ### Docker build
  * [Docker](https://www.docker.com/get-started)

  #### Project Setup
  * Clone repository
  * Create container:
    * `docker-compose build`

  #### Run migrations
  ```sh
  docker-compose exec web sequelize db:migrate
  ```

  #### Run the app!

  ```sh
  docker-compose up web
  ```

  ### Standard build
  * [PostgreSQL](https://github.com/IIC2513-2017-2/syllabus/wiki/Getting-Started#postgresql)
    * you will need a database with name and user/password as configured in `src/config/database.js`
  * [Node.js v8.4.0](https://github.com/IIC2513-2017-2/syllabus/wiki/Node.js) or above
  * [Yarn](https://yarnpkg.com)

  #### Project Setup

  * Clone repository
  * Install dependencies:
    * `yarn install`

  #### Database Setup (development)

  ##### Install postgresql
  * On Mac OS X using Homebrew: `brew install postgresql`
    * Start service: check [LaunchRocket](https://github.com/jimbojsb/launchrocket) or [lunchy](https://www.moncefbelyamani.com/how-to-install-postgresql-on-a-mac-with-homebrew-and-lunchy/) for postgresql service management
  * [Other platforms](https://www.postgresql.org/download/)
  * [More details](https://github.com/IIC2513-2017-2/syllabus/wiki/Getting-Started#postgresql)

  ##### Create development database

  ```sh
  createdb webcitos_dev
  ```

  #### Run migrations
```sh
./node_modules/.bin/sequelize db:migrate
```

  #### Run the app!

  ```sh
  yarn start
  ```

  or directly

  ```sh
  node index.js
  ```

  or, if you want automatic restart after any change in your files

  ```sh
  ./node_modules/.bin/nodemon
  ```

  Now go to http://localhost:3000 and start browsing :)

## Rutas

### INDEX
* GET ```/``` : Ruta principal

### USUARIOS
* GET ```/users/``` : Lista todos los usuarios (no usado)
* GET ```/users/new``` : Crea un nuevo modelo de usuario
* GET ```/users/:id/edit``` : Permite la edición de un usuario
* GET ```/users/:id``` : Obtiene la información de un usuario
* POST ```/users/``` : Crea un nuevo usuario
* PATCH ```/users/:id``` : Modifica un usuario existente

## API

La aplicación ofrece diversas funcionalidades a través de una API. Las funcionalidades son las siguientes:

### PUBLICACIONES:

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


### ITEMS:

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
