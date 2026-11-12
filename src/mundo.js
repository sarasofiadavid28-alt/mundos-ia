const fs = require('fs');
const path = require('path');
const hash = require('object-hash');

// Ruta de data/ a partir de la ubicación de este archivo
const CARPETA_DATA = path.join(__dirname, '..', 'data');

const EJEMPLO = 'npm start -- "<situación>" "<mundo>" <color1> <color2> <color3> <color4> <color5>';

// Paso 1: validar los argumentos y crear el objeto
function crearMundo(args) {
  if (args.length !== 7) {
    throw new Error(`Deben llegar exactamente 7 argumentos (llegaron ${args.length}).\nEjemplo de uso:\n${EJEMPLO}`);
  }

  // Ningún argumento puede estar vacío o tener solo espacios
  const limpios = args.map((a) => a.trim());
  if (limpios.some((a) => a === '')) {
    throw new Error(`Ningún argumento puede estar vacío.\nEjemplo de uso:\n${EJEMPLO}`);
  }

  const [situacion, mundo, ...colores] = limpios;

  // Los 5 colores deben ser distintos (sin distinguir mayúsculas)
  const distintos = new Set(colores.map((c) => c.toLowerCase()));
  if (distintos.size !== 5) {
    throw new Error(`Los 5 colores deben ser distintos.\nEjemplo de uso:\n${EJEMPLO}`);
  }

  // El id se calcula SIN creadoEn, para que los mismos datos den el mismo id
  const id = hash({ situacion, mundo, colores }).slice(0, 8);

  return { id, situacion, mundo, colores, creadoEn: new Date().toISOString() };
}

// Guardar el objeto en data/mundo_<id>.json
function guardarMundo(mundo) {
  fs.mkdirSync(CARPETA_DATA, { recursive: true });
  const ruta = path.join(CARPETA_DATA, `mundo_${mundo.id}.json`);
  fs.writeFileSync(ruta, JSON.stringify(mundo, null, 2), 'utf-8');
  return ruta;
}

// Leer el JSON guardado
function leerMundo(ruta) {
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
}

module.exports = { crearMundo, guardarMundo, leerMundo };