# mundos-ia

Programa de consola que genera bocetos visuales de mundos imaginarios.
Recibe una situación, un mundo y 5 colores, los guarda en un JSON, pide a un
modelo de texto la descripción de una imagen y luego pide al modelo de
imágenes que la dibuje.

## Configuración

1. `npm install`
2. Copia `.env.example` a `.env`: `cp .env.example .env`
3. Pon tus claves en `.env` (nunca las subas a Git).

## Uso

```bash
npm start -- "Una tormenta eléctrica amenaza la ciudad flotante" "Aerópolis, un archipiélago de islas que flotan sobre las nubes" rojo azul verde dorado violeta
```

Las comillas son necesarias en la situación y en el mundo.

## Estructura

```
mundos-ia/
├── src/
│   ├── index.js    # orquesta los pasos 1 a 3
│   ├── mundo.js    # valida argumentos, crea y guarda/lee el JSON
│   ├── texto.js    # consulta al modelo de lenguaje
│   ├── imagen.js   # consulta al modelo de imágenes
│   └── errores.js  # mensajes de error en español
├── data/           # JSON de cada mundo (no va a Git)
├── descripciones/  # descripciones .txt (no va a Git)
└── imagenes/       # imágenes generadas (no va a Git)
```

## Servicios usados

- Texto: Groq (https://console.groq.com), modelo openai/gpt-oss-20b.
- Imagen: Cloudflare Workers AI, FLUX.1-schnell
  (https://developers.cloudflare.com/workers-ai/).
- Primero probé NVIDIA FLUX.1-schnell, pero no respondió (timeout), por eso
  cambié a Cloudflare.

## Experimento: publicar sin .gitignore

(Explica con tus palabras: con .gitignore npm publicó 8 archivos; sin él,
13, incluidos .env, data/, descripciones/ e imagenes/. Por qué es peligroso.)

## Preguntas de reflexión

1. ¿Por qué el id se calcula sin la fecha?
2. ¿Por qué la descripción va en inglés?
3. Diferencia entre una respuesta JSON de texto y una de bytes de imagen. ¿Qué es base64?
4. ¿Qué pasaría si guardas la imagen con 'utf-8'?
5. ¿Qué pasos consumen cuota y cómo evitaste repetirlos?
6. Si usaste IA: ¿qué fue lo más difícil de pedirle y qué corregiste tú?
## Experimento: publicar sin .gitignore

Con el `.gitignore`, `npm publish --dry-run` mostró 8 archivos y ninguno era secreto. Después renombré el archivo a `.gitignore.off` y repetí la prueba: aparecieron 13 archivos, incluidos `.env` (con mis claves), `data/`, `descripciones/` e `imagenes/` (la imagen pesaba 688.9 kB). Es peligroso porque, si hubiera publicado así, el `.env` quedaría en npm y cualquier persona podría descargarlo y usar mis claves. Después restauré el nombre del archivo.

## Respuestas de reflexión

1. **¿Por qué el id se calcula sin la fecha?**
   Porque la fecha cambia en cada ejecución. Si la incluyera, el mismo mundo tendría un id distinto cada vez y el programa nunca encontraría los archivos ya creados para reutilizarlos. Sin la fecha, los mismos datos dan siempre el mismo id.

2. **¿Por qué se le pide al modelo de texto la descripción en inglés?**
   Porque los modelos de imágenes entienden mejor el inglés, ya que se entrenaron con más ejemplos en ese idioma. No probé una descripción en español, así que no comparé las imágenes.

3. **¿Qué diferencia hay entre una respuesta JSON de texto y una con los bytes de una imagen? ¿Qué es base64?**
   Una respuesta JSON de texto trae palabras que puedo leer directamente. Una imagen es un archivo binario (bytes). Cloudflare envía esos bytes escritos como texto en base64, que es una forma de representar datos binarios usando solo letras, números y símbolos. Con `Buffer.from(texto, 'base64')` lo convierto otra vez en bytes.

4. **¿Qué pasaría si guardas la imagen con 'utf-8'?**
   El archivo quedaría dañado y no se abriría, porque 'utf-8' trata los bytes como si fueran texto y cambia o pierde los que no son caracteres válidos. Por eso los bytes se guardan tal cual, sin indicar codificación.

5. **¿Qué pasos consumen cuota gratuita y cómo evitaste repetirlos?**
   Consumen cuota la llamada al modelo de texto (paso 2) y la del modelo de imágenes (paso 3). Antes de llamar a cada uno uso `fs.existsSync`: si el `.txt` o la imagen ya existen, no llamo a la API. Así, al repetir el mismo comando no gasto cuota.

6. **Si usaste IA: ¿qué fue lo más difícil de pedirle y qué parte tuviste que corregir tú?**
   Lo más difícil fue entender los errores de las APIs (401, 400 y el timeout) y saber qué cambiar en cada caso. Tuve que corregir yo el servicio de imágenes (NVIDIA no respondió y cambié a Cloudflare), el `.gitignore` (estaba vacío y se habían subido `.env` y `node_modules`) y la URL del `.env`, que todavía apuntaba a NVIDIA.
