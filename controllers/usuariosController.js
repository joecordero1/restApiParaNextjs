const Usuarios = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async (req, res) => {
    const usuario = new Usuarios(req.body);
    usuario.password = await bcrypt.hash(req.body.password, 12);
    try {
        await usuario.save();
        res.json({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error' });
    }
};

exports.autenticarUsuario = async (req, res, next) => {
    const { email, password } = req.body;
    const usuario = await Usuarios.findOne({ email });

    if (!usuario) {
        return res.status(401).json({ mensaje: 'Ese usuario no existe' });
    } else {
        if (!bcrypt.compareSync(password, usuario.password)) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        } else {
            const token = jwt.sign(
                { email: usuario.email, nombre: usuario.nombre },
                'LLAVESECRETA',
                { expiresIn: '3h' }
            );
            res.json({ token }); 
        }
    }
};

exports.buscarUsuario = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuarios.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Ese usuario no existe' });
        }
        // Devolver la información del usuario (ID en este caso)
        res.status(200).json({ userId: usuario._id });
    } catch (error) {
        next(error); // Manejo de errores
    }
};

exports.mostrarUsuarios = async (req, res, next) => {
    // Instanciar un objeto Usuario con los datos de req.body
    try {
        const usuarios = await Usuarios.find({});
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.send(error);
        next();
    }
}