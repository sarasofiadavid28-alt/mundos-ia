const fs = require('fs');
const path = require('path');

// Cargar las variables del .env
process.loadEnvFile(path.join(__dirname, '..', '.env'));

const { crearMundo, guardarMundo, leerMundo } = require('./mundo');
const { describirMundo, guardarDescripcion, rutaDescripcion } = require('./texto');

async function main() {
  try {
    // Paso 1: crear y guardar el mundo
    const args = process.argv.slice(2);
    const mundoNuevo = crearMundo(args);
    const rutaJson = guardarMundo(mundoNuevo);
    console.log(`Paso 1: mundo guardado en data/mundo_${mundoNuevo.id}.json`);

    // Volver a leer el JSON desde el archivo (no usar el objeto en memoria)
    const mundo = leerMundo(rutaJson);

    // Paso 2: descripción con el modelo de texto
    const rutaTxt = rutaDescripcion(mundo.id);
    if (fs.existsSync(rutaTxt)) {
      console.log('Paso 2: la descripción ya existía, no se llamó al modelo de texto.');
    } else {
      const descripcion = await describirMundo(mundo);
      guardarDescripcion(mundo.id, descripcion);
      console.log(`Paso 2: descripción guardada en descripciones/mundo_${mundo.id}.txt`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();