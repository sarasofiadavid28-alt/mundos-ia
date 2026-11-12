const fs = require('fs');
const path = require('path');
const { errorDeRespuesta } = require('./errores');

const CARPETA_IMAGENES = path.join(__dirname, '..', 'imagenes');

// Ruta de la imagen de un mundo
function rutaImagen(id) {
  return path.join(CARPETA_IMAGENES, `mundo_${id}.jpg`);
}

// Paso 3: enviar la descripción al modelo de imágenes y devolver los bytes
async function generarImagen(descripcion) {
  const respuesta = await fetch(process.env.IMAGEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.IMAGEN_API_KEY}`,
    },
    body: JSON.stringify({ prompt: descripcion, steps: 4 }),
    signal: AbortSignal.timeout(60000),
  });

   if (!respuesta.ok) {
    throw errorDeRespuesta(respuesta, 'imágenes');
  }

  const datos = await respuesta.json();
  const textoBase64 = datos.result?.image;

  if (!textoBase64) {
    throw new Error('El servicio de imágenes no devolvió ninguna imagen.');
  }

  // La imagen llega como texto base64: se convierte en bytes
  const bytes = Buffer.from(textoBase64, 'base64');
  if (bytes.length === 0) {
    throw new Error('La imagen llegó vacía.');
  }

  return bytes;
}

// Guardar los bytes tal cual, SIN 'utf-8'
function guardarImagen(id, bytes) {
  fs.mkdirSync(CARPETA_IMAGENES, { recursive: true });
  const ruta = rutaImagen(id);
  fs.writeFileSync(ruta, bytes);
  return ruta;
}

module.exports = { generarImagen, guardarImagen, rutaImagen };
