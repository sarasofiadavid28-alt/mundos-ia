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