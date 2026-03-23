# AsesorRenta 2025

Chatbot conversacional sobre el IRPF 2025, desplegable en Netlify.

## Estructura

```
irpf-chatbot/
├── public/
│   └── index.html          ← Frontend (HTML/CSS/JS puro)
├── netlify/
│   └── functions/
│       └── chat.js         ← Serverless function → llama a Claude API
├── netlify.toml            ← Configuración de Netlify
└── README.md
```

## Despliegue en Netlify

### Opción A: Desde GitHub (recomendado)

1. Sube este proyecto a un repositorio de GitHub
2. Ve a [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
3. Conecta tu GitHub y selecciona el repositorio
4. Netlify detectará `netlify.toml` automáticamente
5. En **Site configuration → Environment variables**, añade:
   ```
   OPENAI_API_KEY = sk-xxxxxxxxxxxxxxxx
   ```
6. Haz **Deploy site** → ¡listo!

### Opción B: Drag & Drop (más rápido para probar)

1. Ve a [app.netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**
2. Arrastra la carpeta `irpf-chatbot` completa
3. Después añade la variable de entorno `OPENAI_API_KEY` en:
   **Site settings → Environment variables**
4. Haz un nuevo deploy para que coja la variable

## Conseguir la API Key de OpenAI

1. Ve a [platform.openai.com](https://platform.openai.com)
2. En **API Keys** → **Create new secret key**
3. Copia la clave (empieza por `sk-...`) y pégala en Netlify como `OPENAI_API_KEY`

## Cómo funciona

```
Usuario escribe
     ↓
index.html (frontend)
     ↓  POST /api/chat
Netlify Function (chat.js)
     ↓  POST https://api.openai.com/v1/chat/completions
     ↓  modelo gpt-4o-mini + system prompt del IRPF 2025
OpenAI API
     ↓  respuesta
index.html → renderiza la respuesta
```

La API key **nunca sale al frontend** — solo vive en el servidor de Netlify.

## Personalización

- **System prompt**: edita el `SYSTEM_PROMPT` en `netlify/functions/chat.js`
- **Chips de sugerencia**: edita los `.chip` en `public/index.html`
- **Colores**: edita las variables CSS `:root` en `public/index.html`
- **Modelo**: cambia `claude-sonnet-4-5` por otro modelo si lo deseas

## Costes estimados

Con gpt-4o-mini (~$0,15/millón tokens entrada, ~$0,60/millón salida):
- Una conversación media de 10 mensajes ≈ 0,003€
- 1.000 usuarios/mes con 3 preguntas cada uno ≈ ~1€/mes
