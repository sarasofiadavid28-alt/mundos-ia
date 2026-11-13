# PROMPT.md

## A. Declaración
Usé IA: sí

## B. Herramienta y modelo
Claude (Anthropic), en claude.ai. Modelo: Claude Sonnet 5.5 (versión que muestra la app).

## C. Prompt inicial completo
Adjunté el enunciado completo del taller "mundos-ia" (situación, reglas, guía de servicios, Partes 1 a 8, rúbrica y errores frecuentes) y mi mensaje literal fue:

> dime que hacer

Forma de trabajo: la IA propuso avanzar parte por parte. En cada paso yo ejecutaba los comandos en mi terminal y le pegaba el resultado o el error, y ella ajustaba la siguiente instrucción. Hicimos así las Partes 1 a 7 juntas, en orden.

## D. Prompts siguientes
1. Prompt: "como abro el archivo" | Respuesta de la IA: me explicó tres formas de abrir archivos (VS Code, xed y nano) y cómo ver los archivos ocultos con Ctrl+H | Qué hice: usé `xed` para abrir y editar los archivos.
2. Prompt: pegué el error `npm error Missing script: "start"` y mi `package.json` | Respuesta de la IA: me dijo que faltaba el script `start`, que `main` debía apuntar a `src/index.js` y que mi comando tenía un color de más | Qué hice: completé el `package.json` y volví a ejecutar con los 7 argumentos.
3. Prompt: "no me aparece la clave completa, como la veo" | Respuesta de la IA: me explicó que la clave solo se muestra una vez al crearla y que debía crear una nueva y copiarla con el botón Copy | Qué hice: creé una clave nueva en Groq y la pegué en el `.env` sin comillas.
4. Prompt: pegué el timeout de NVIDIA y el resultado del `curl` (estado 000) | Respuesta de la IA: me dijo que el servicio no respondía y me recomendó cambiar a Cloudflare Workers AI (opción B del taller) | Qué hice: creé la cuenta, el token y el Account ID de Cloudflare y cambié la URL y el código de `imagen.js`.
5. Prompt: pegué el error 400 de Cloudflare | Respuesta de la IA: me explicó que Cloudflare no acepta `width`, `height` ni `seed` y me dio la versión de `imagen.js` para Cloudflare | Qué hice: reemplacé el archivo y la imagen se generó bien.

## E. Cambios que hice yo
1. Cambié el servicio de imágenes de NVIDIA a Cloudflare porque NVIDIA no respondió (timeout de 60 s y `curl` con estado 000). Creé la cuenta, el token y puse el Account ID en la URL del `.env`.
2. Corregí el `.gitignore` (estaba vacío al hacer el primer commit) y saqué `.env` y `node_modules` del repositorio con `git rm -r --cached`, porque `git ls-files` mostró que se habían subido.
3. Revisé el error 401 que daba la imagen y descubrí que el `.env` todavía tenía la URL de NVIDIA con el token de Cloudflare; cambié la URL con el Account ID correcto.
4. Provoqué tres errores a propósito (clave inválida, URL mal escrita y timeout), tomé capturas y dejé todo restaurado. 

## F. Una línea de código que no entendía
Línea: `const textoBase64 = datos.result?.image;`

Explicación con mis palabras:  Cloudflare devuelve un JSON con una parte llamada `result`, y dentro está la imagen en base64. El `?.` sirve para que, si `result` no existe (por ejemplo, por un error), el programa no se caiga con un error técnico, sino que `textoBase64` quede vacío y yo pueda mostrar un mensaje claro.

## G. Un error y cómo lo resolví
Mensaje de error: `Additional or unevaluated properties '/width, /height, /seed' at '/' not allowed` (estado 400 de Cloudflare).

Solución: mi `imagen.js` todavía enviaba el cuerpo del formato de NVIDIA. Cloudflare solo acepta `prompt` y `steps`, así que dejé el cuerpo como `{ prompt: descripcion, steps: 4 }`, quité la cabecera `Accept` y leí la imagen desde `datos.result.image`.