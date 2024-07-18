const Animal = require('../models/Animal');

// Definición de sectores (simplificada por cuadrantes)
const sectores = {
    'Centro Histórico': { latMin: 0, latMax: 10, lonMin: 0, lonMax: 10 },
    'La Mariscal': { latMin: 10, latMax: 20, lonMin: 5, lonMax: 15 },
    'La Floresta': { latMin: 5, latMax: 15, lonMin: 15, lonMax: 25 },
    'Guápulo': { latMin: 15, latMax: 25, lonMin: 20, lonMax: 30 },
    'González Suárez': { latMin: 20, latMax: 25, lonMin: 0, lonMax: 10 },
    'Cumbayá y Tumbaco': { latMin: 40, latMax: 50, lonMin: 26, lonMax: 40 },
    'El Batán': { latMin: 30, latMax: 39, lonMin: 27, lonMax: 37 },
    'El Inca': { latMin: 30, latMax: 40, lonMin: 0, lonMax: 10 },
    'La Carolina': { latMin: 41, latMax: 50, lonMin: 10, lonMax: 20 },
    'La Concepción': { latMin: 50, latMax: 60, lonMin: 0, lonMax: 10 },
    'Carcelén': { latMin: 61, latMax: 81, lonMin: 10, lonMax: 20 },
    'Quito Norte': { latMin: 61, latMax: 81, lonMin: -30, lonMax: -1 },
    'Quito Sur': { latMin: -23, latMax: -50, lonMin: -10, lonMax: 10 },
    'Chillogallo': { latMin: -11, latMax: -22, lonMin: -5, lonMax: 5 },
    'San Juan': { latMin: -1, latMax: -10, lonMin: -11, lonMax: -1 }
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