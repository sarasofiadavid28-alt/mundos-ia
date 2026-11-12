const fs = require('fs');
const path = require('path');
const { errorDeRespuesta } = require('./errores');

const CARPETA_DESCRIPCIONES = path.join(__dirname, '..', 'descripciones');

// Mensaje de sistema: es borrador, ajústalo con tus palabras
const MENSAJE_SISTEMA = `Eres un asistente que escribe descripciones de imágenes para un generador de imágenes.
Recibirás un JSON con una situación, un mundo imaginario y 5 colores.
Responde con UN solo párrafo en inglés, de entre 80 y 120 palabras.
Describe una imagen: la escena, los elementos, la iluminación, la composición y el estilo artístico. No cuentes una historia.
Menciona los 5 colores (puedes traducirlos al inglés).
No uses títulos, ni formato markdown, ni texto escrito dentro de la imagen.`;

// Ruta del .txt de un mundo
function rutaDescripcion(id) {
  return path.join(CARPETA_DESCRIPCIONES, `mundo_${id}.txt`);
}

// Paso 2: consultar al modelo de lenguaje
async function describirMundo(mundo) {
  const respuesta = await fetch(process.env.TEXTO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TEXTO_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.TEXTO_MODELO,
      messages: [
        { role: 'system', content: MENSAJE_SISTEMA },
        { role: 'user', content: JSON.stringify(mundo) },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  });

    if (!respuesta.ok) {
    throw errorDeRespuesta(respuesta, 'texto');
  }
  
  const datos = await respuesta.json();
  let texto = (datos.choices?.[0]?.message?.content ?? '').trim();

  if (texto === '') {
    throw new Error('El modelo de texto devolvió una respuesta vacía.');
  }

  // Cloudflare acepta máximo 2048 caracteres
  if (texto.length > 1500) {
    texto = texto.slice(0, 1500);
    console.log('Aviso: la descripción era muy larga y se recortó a 1500 caracteres.');
  }

  return texto;
}

// Guardar la descripción en descripciones/mundo_<id>.txt
function guardarDescripcion(id, texto) {
  fs.mkdirSync(CARPETA_DESCRIPCIONES, { recursive: true });
  const ruta = rutaDescripcion(id);
  fs.writeFileSync(ruta, texto, 'utf-8');
  return ruta;
}

module.exports = { describirMundo, guardarDescripcion, rutaDescripcion };