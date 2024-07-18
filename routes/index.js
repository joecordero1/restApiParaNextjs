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
