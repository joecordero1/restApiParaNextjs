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