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
