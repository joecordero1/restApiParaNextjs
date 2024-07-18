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