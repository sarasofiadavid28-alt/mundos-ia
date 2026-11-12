// Convierte una respuesta HTTP con error en un Error con mensaje en español
function errorDeRespuesta(respuesta, servicio) {
  const estado = respuesta.status;

  if (estado === 401 || estado === 403) {
    return new Error(`La API key del servicio de ${servicio} no es válida. Revisa tu archivo .env.`);
  }

  if (estado === 402 || estado === 429) {
    const espera = respuesta.headers.get('retry-after');
    const extra = espera ? ` Intenta de nuevo en ${espera} segundos.` : '';
    return new Error(`Superaste el límite gratuito del servicio de ${servicio}. Espera un momento.${extra}`);
  }

  if (estado === 404 || estado === 410) {
    return new Error(`El modelo o la URL del servicio de ${servicio} no existen. Revisa tu configuración.`);
  }

  return new Error(`El servicio de ${servicio} respondió con el estado ${estado}.`);
}

// Convierte cualquier error capturado en un mensaje claro en español
function explicarError(error) {
  if (error.name === 'TimeoutError') {
    return 'El servicio tardó demasiado en responder.';
  }
  if (error instanceof TypeError) {
    return 'No se pudo conectar. Revisa tu internet o la URL.';
  }
  return error.message;
}

module.exports = { errorDeRespuesta, explicarError };
