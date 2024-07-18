# Proyecto CRUD y funcionalidad con Node.js, Express.js y Next.js #
Por: Joe Cordero

Link deployments:
- Frontend: [https://cliente-next-funcionalidad.vercel.app](https://cliente-next-funcionalidad.vercel.app/) (Cliente de next js)
## Descripción del Proyecto ##
Este proyecto es una aplicación web que implementa el patrón de arquitectura MVC (Modelo-Vista-Controlador) utilizando Node.js y Express.js para el backend y Next js para el frontend. La aplicación permite la administracion de animales, así como la generación de analisis de animales segun su raza y sector en el que se encuentran.
## Tecnologías Utilizadas ##
- Backend: Node.js, Express.js, MongoDB
- Frontend: Next.js, Axios
- Otros: Mongoose para la conexión y manejo de la base de datos MongoDB, CORS para la comunicación entre el frontend y el backend, y Nodemon para la actualización automática del servidor durante el desarrollo.
## Instalación y Configuración ##
Prerrequisitos
- Node.js: Asegúrate de tener Node.js instalado en tu máquina. Puedes descargarlo desde [aquí](https://nodejs.org/en/).
- MongoDB: Debes tener MongoDB Community Server instalado y en funcionamiento en tu máquina local. Puedes descargarlo desde [aquí](https://www.mongodb.com/try/download/community). Algunas instrucciones especificas para la instalación de mongo se encuentran en el link del curso de Udemy adjuntado al final.
## Paso a Paso para Configurar el Proyecto ##
### Backend: ###
```bash
git clone https://github.com/joecordero1/clienteNext_funcionalidad.git
cd clienteNext_funcionalidad
```
#### Instalar las dependencias: ####
```bash
npm install
```
#### Configurar MongoDB: ###
Asegúrate de que MongoDB esté en funcionamiento en mongodb en el puerto correcto. Puedes modificar esta URL en el archivo index.js si tu configuración es diferente. Esta base de datos se creará por defecto una vez que hayamos corrido el servidor por primera vez, por lo que no es necesario ejecutar ningún script.
#### Iniciar el servidor: ####
```bash
npm start
```
El servidor debería estar corriendo en http://localhost:5000.

### Frontend ###
```bash
git clone https://github.com/joecordero1/restApiParaNextjs.git
cd restApiParaNextjs
```
#### Instalar las dependencias: ####
```bash
npm install
```
#### Iniciar la aplicación Next.js: ####
```bash
npm run dev
```
La aplicación debería estar corriendo en http://localhost:3000.

## Entendiendo el Proyecto ##
### Arquitectura MVC ###
Este proyecto sigue el patrón de diseño MVC, que divide la aplicación en tres componentes principales:
- Modelo (Model): Define la estructura de los datos y las reglas de negocio. En este proyecto, los modelos están definidos usando Mongoose y representan las entidades Empleado, Proyecto y Tarea.
- Vista (View): Representa la interfaz de usuario. En este proyecto, las vistas están implementadas usando Next.js y proporcionan una interfaz interactiva para gestionar empleados, proyectos y tareas.
- Controlador (Controller): Maneja la lógica de la aplicación, responde a las entradas del usuario y realiza interacciones con los modelos. Los controladores en este proyecto están definidos en el backend y manejan las solicitudes HTTP, realizando operaciones CRUD sobre las entidades.

## Estructura del Proyecto ##
#### Configuración del Servidor backend ####
El archivo index.js configura el servidor Express y establece la conexión con MongoDB
```javascript
const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//importar cors para cambiar los recursos entre el Next.js y el server de extress
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/restMiniCore') //Aqui debes modificar en caso de que tu puerto sea distinto
    .then(() => console.log("MongoDB Conectado"))
    .catch(err => console.log("MongoDB error de conexión:", err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//habilitar cors
app.use(cors());


// Usa las rutas definidas en la carpeta routes.
app.use('/', routes());

// Inicia el servidor en puerto 5000, se puede cambiar al puerto que tu desees.
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidro corriendo en puerto ${port}`);
});

```
#### Rutas ####
Las rutas están definidas en routes/index.js y gestionan las operaciones CRUD para empleados, proyectos y tareas, así como la generación de reportes de tareas atrasadas:
```javascript
const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const usuariosController = require('../controllers/usuariosController');
const analisisController = require('../controllers/analisisController'); // analisis controlador

// Middleware para proteger las rutas
const auth = require('../middleware/auth');

// Aquí defines las rutas de tu API.
module.exports = function() {
    // Rutas para animales
    router.post('/animales', auth, animalController.nuevoAnimal);
    router.get('/animales', animalController.mostrarAnimales);
    router.get('/animales/:_id', animalController.mostrarAnimalPorId);
    router.put('/animales/:_id', auth, animalController.actualizarAnimal);
    router.delete('/animales/:_id', auth, animalController.eliminarAnimal);

    // Rutas para usuarios
    router.post('/crear-cuenta', usuariosController.registrarUsuario);
    router.post('/iniciar-sesion', usuariosController.autenticarUsuario);
    router.get('/usuarios', usuariosController.mostrarUsuarios);

    // Rutas para contar animales por sector y raza
    router.get('/analisis/contar/:sector/:raza', analisisController.contarAnimalesPorSectorYRaza);


    return router;
}
```
#### Modelos ####
Los modelos definen la estructura de los datos
```javascript
//models/Animal.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animalSchema = new Schema({
    tipoAnimal: {
        type: String,
        enum: ['Perro', 'Gato'],
        required: true
    },
    raza: {
        type: String,
        enum: ['Golden', 'Poodle', 'Labrador', 'Mestizo', 'Galgo'],
        required: true
    },
    ubicacion: {
        type: {
            type: String,
            enum: ['Point'], // Solo permitir tipo 'Point' para coordenadas
            required: true
        },
        coordinates: {
            type: [Number], // [Longitud, Latitud]
            required: true
        }
    },
    edad: {
        type: Number,
        required: true
    },
    sexo: {
        type: String,
        enum: ['Macho', 'Hembra', 'No identificado'],
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

// Índice geoespacial para búsqueda rápida por ubicación
animalSchema.index({ ubicacion: '2dsphere' });

module.exports = mongoose.model('Animal', animalSchema);
```
```javascript
//models/Usuario.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    nombre: {
        type: String,
        required: 'Agrega tu nombre'
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Usuarios', usuariosSchema);
```

#### Controladores ####
Los controladores manejan la lógica de negocio, en este caso, manejan el CRUD y tambien los reportes.
```javascript
//controllers/animalessController.js
const Animal = require('../models/Animal');

exports.nuevoAnimal = async (req, res, next) => {
    // Instanciar un objeto Animal con los datos de req.body
    const animal = new Animal(req.body);

    try {
        // Guardar el animal en la base de datos
        await animal.save();
        res.json({ mensaje: 'Se agregó un nuevo animal' });
    } catch (error) {
        console.log(error);
        res.send(error);
        next();
    }
}

exports.mostrarAnimales = async (req, res, next) => {
    // Obtener todos los animales de la base de datos
    try {
        const animales = await Animal.find({});
        res.json(animales);
    } catch (error) {
        console.log(error);
        res.send(error);
        next();
    }
}

exports.mostrarAnimalPorId = async (req, res, next) => {
    // Obtener un animal por su ID
    try {
        const animal = await Animal.findById(req.params._id);
        if (!animal) {
            res.json({ mensaje: 'No existe ese animal' });
            return next();
        }
        res.json(animal);
    } catch (error) {
        console.log(error);
        res.status(400).json({ mensaje: 'ID inválido' });
        next();
    }
}

exports.actualizarAnimal = async (req, res, next) => {
    // Actualizar un animal por su ID
    try {
        const animal = await Animal.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true });
        res.json(animal);
    } catch (error) {
        console.log(error);
        res.send(error);
        next();
    }
}

exports.eliminarAnimal = async (req, res, next) => {
    // Eliminar un animal por su ID
    try {
        await Animal.findOneAndDelete({ _id: req.params._id });
        res.json({ mensaje: 'Animal eliminado' });
    } catch (error) {
        console.log(error);
        res.send(error);
        next();
    }
}


```
```javascript
const Animal = require('../models/Animal');

// Definición de sectores (simplificada por cuadrantes)
const sectores = {
    'Centro Histórico': { latMin: 0, latMax: 10, lonMin: 0, lonMax: 10 },
    'La Mariscal': { latMin: 10, latMax: 20, lonMin: 5, lonMax: 15 },
    'La Floresta': { latMin: 5, latMax: 15, lonMin: 15, lonMax: 25 },
    //Otros sectores
};

function determinarSector(coordinates) {
    for (const [sector, limites] of Object.entries(sectores)) {
        const [lon, lat] = coordinates;
        if (
            lat >= limites.latMin &&
            lat < limites.latMax &&
            lon >= limites.lonMin &&
            lon < limites.lonMax
        ) {
            return sector;
        }
    }
    return 'Sector Desconocido';
}

// Método modificado para contar animales por sector y raza
async function contarAnimalesPorSectorYRaza(req, res) {
    const { sector, raza } = req.params;

    try {
        // Primero verifica que el sector sea válido para evitar procesar innecesariamente
        if (!sectores[sector]) {
            return res.status(400).json({ error: 'Sector no válido' });
        }

        // Obtiene todos los animales de la raza especificada
        const animales = await Animal.find({ raza: raza });  // Asegúrate de que el campo se llama 'raza' y no 'Id_Raza'

        // Filtra los animales que efectivamente están en el sector especificado
        const animalesEnSector = animales.filter(animal => {
            return determinarSector(animal.ubicacion.coordinates) === sector;
        });

        const conteo = animalesEnSector.length;

        return res.status(200).json({ sector, raza, conteo });
    } catch (error) {
        console.error('Error contando animales por sector y raza:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    contarAnimalesPorSectorYRaza
};
```

## Configuración de la aplicación Next.js ##
El frontend está desarrollado en Next.js y utiliza Axios para realizar solicitudes HTTP al backend. La estructura de los componentes de Next.js está organizada de la siguiente manera
#### Configuración de Axios ####
```javascript
import axios from 'axios';

const clienteAxios = axios.create({
  baseURL: 'http://localhost:5000
});

export default clienteAxios;

```
#### Componente App ####
El componente principal define las rutas de las carpetas que estará utilizando la aplicación de Next.js
```javascript
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
      <h2>
            Ejercicio funcionalidad con Next.js <span>-&gt;</span>
          </h2>
          <p>Por: Joe Cordero y Ariel Raura.</p>
        
      </div>
    </main>
  );
}


```

### Componentes ###
#### Vistas para manejar metodos CRUD de las entidades: ####
Los componentes dentro de la carpeta "components" contienen las vistas necesarias para realizar el CRUD del objeto Animal. (Revisar código)
#### Vistas para mostrar analisis de animales por sector y raza: ####
El componente Analisis permite al usuario ingresar un sector especifico y una raza especifica. (Revisar código)

### Conclusiones ###
Este proyecto de aplicación web demuestra una implementación robusta y eficiente del patrón de arquitectura MVC, combinando Node.js y Express.js en el backend con Next.js en el frontend. Utilizando MongoDB como base de datos, la aplicación permite gestionar eficientemente animales. Además, incorpora una funcionalidad de generación de reportes para identificar la cantidad de animales de una raza específica dentro de un sector específico, lo cual es crucial para la gestión y seguimiento de animales.
