# Clínica Áurea · Guía rápida

## 1. Cómo verla en tu computador (Visual Studio Code)
1. Abre la carpeta `clinica-aurea` en VS Code (Archivo → Abrir carpeta).
2. Instala la extensión gratis **Live Server** (icono de cuadritos → busca "Live Server" → Install).
3. Clic derecho en `index.html` → **Open with Live Server**. Para ver PC + móvil juntos: clic derecho en `preview.html` → Open with Live Server.
   ⚠️ No funciona con doble clic en el archivo: el 360° necesita un servidor (Live Server o tu hosting).

## 2. Qué archivo cambiar para cada cosa
| Quiero cambiar… | Dónde |
|---|---|
| Número de WhatsApp y mensajes | `js/config.js` → `whatsapp`, `mensajes` |
| Link de Google Maps | `js/config.js` → `mapaUrl` |
| Instagram / TikTok | `js/config.js` → `redes` |
| Fotos 360 y botones flotantes | `js/config.js` → `hero.escenas` |
| Video de intro del header | `js/config.js` → `hero.video` |
| Tarjetas de servicios e imágenes PNG | `js/config.js` → `servicios` |
| Videos antes/después y "Conócenos" | `js/config.js` → `videos`, `presentacion` |
| Colores | `css/styles.css` → sección 1 (arriba) |
| Tipografía | `index.html` (link de Google Fonts) + `css/styles.css` sección 2 |
| Logo | `index.html` → comentario "LOGO" |
| Foto del equipo | reemplaza `assets/img/equipo.jpg` |

## 3. Recorrido 360°
- Usa fotos **equirectangulares 2:1** (4096x2048 ideal, JPG < 1.5 MB). Sirven las de cámaras 360 o el modo "Panorama / Photo Sphere" de Google Street View / el celular.
- Para ubicar los botones flotantes: abre la página con `?editar` al final (ej. `http://127.0.0.1:5500/?editar`), entra al recorrido, toca donde quieres el botón y verás `yaw` y `pitch`. Cópialos en `config.js`.
- **Foto o video 360:** recomiendo FOTOS. Pesan 10–20 veces menos, cargan rápido en celular, funcionan en cualquier equipo y tus clientes ya te las envían así. El video 360 es pesado y se traba en celulares medios.
- **Deslizar con el dedo o mover el celular:** la base es el deslizamiento táctil (funciona en el 100% de dispositivos, sin permisos). El giroscopio queda como botón opcional en móvil (en iPhone pide un permiso y requiere https). Texto usado en la web: "Recorrido 360° · Desliza tus dedos". Si no quieres el botón: `botonGiroscopio: false`.

## 4. Buscador conectado a Google Sheets (gratis, sin IA)
1. Crea una hoja en Google Sheets con una pestaña **servicios** y estas columnas en la fila 1:
   `nombre | disponible | palabras_clave | descripcion | respuesta`
   (disponible: SI o NO · respuesta: opcional, si la llenas sale ese texto exacto).
2. Otra pestaña **preguntas**: `pregunta | palabras_clave | respuesta`.
3. Archivo → Compartir → **Publicar en la web** → elige la pestaña → formato **CSV** → Publicar → copia el link.
4. Pega cada link en `js/config.js` (`sheetServicios`, `sheetPreguntas`).
5. Listo: el dueño cambia SI/NO en la hoja y la web se actualiza (Google puede tardar ~5 min). Si la hoja falla, la web usa la lista local de `config.js`.

## 5. Videos
- Lo más fácil y gratis: videos **.mp4 verticales** (9:16, ≤ 15 s, < 6 MB) en `assets/video/` y poster en `assets/img/`. Comprime gratis en handbrake.fr o en CapCut.
- También puedes usar `tipo: "iframe"` con un link embed de YouTube Shorts (autoplay funciona). Instagram/TikTok no permiten autoplay ni deslizar bien dentro de la página, por eso no los recomiendo para el visor.
- Los videos de muestra (`assets/video/*.mp4`) y fotos (`poster-*.jpg`, `pano-*.jpg`, `equipo.jpg`) son de prueba: reemplázalos con los tuyos conservando el nombre o cambiando la ruta en `config.js`.

## 6. Publicar gratis con un link
Sube la carpeta completa a **Netlify Drop** (app.netlify.com/drop), **Cloudflare Pages** o **GitHub Pages**. Te dan un link https para compartir. Para un link propio (.com) solo pagas el dominio.

---

# GUÍA V2 · Probar en el celular, capturar el 360° y la hoja de Google

## A. Probar en tu celular (gratis)
1. **Deslizar con el dedo (rápido, sin internet):** en VS Code abre `index.html` con *Open with Live Server*. Conecta el celular al **mismo Wi‑Fi**, abre en su navegador `http://IP-DE-TU-PC:5500` (la IP se ve con `ipconfig` en Windows o `ifconfig` en Mac). Sirve para probar diseño, deslizar el 360° y las tarjetas.
2. **Giroscopio (necesita https):** los celulares solo dan el giroscopio en páginas seguras. Sube la carpeta a **https://app.netlify.com/drop** (arrastras la carpeta, te da un link https en segundos, gratis) y abre ese link en tu celular. En iPhone el botón "Giroscopio" pide un permiso: acéptalo.
3. Cada vez que cambies algo, vuelve a arrastrar la carpeta (o crea una cuenta gratis para mantener siempre el mismo link).

## B. Cómo conseguir las fotos 360° (gratis)
- **Mejor opción:** que el cliente (o tú) use la app gratuita **Google Street View** (Android / iPhone) → cámara → *Foto 360°*, y siga los puntos en pantalla. Al terminar, **guárdala en el teléfono (no la publiques en Google Maps)** y envíala por WhatsApp como *documento* (para que no la comprima).
- **Más simple:** el modo *Panorámica* de la cámara. Funciona, pero cubre solo parte del espacio: en `config.js` agrega `angulo: 180` (ver comentario en la escena) y la web no dejará mirar fuera de la foto.
- **Tips para quien tome la foto:** limpiar el lente, luz pareja, celular a la altura del pecho, no mover los pies, que no haya personas, y mantener el mismo punto central en cada ambiente.
- **Peso:** si el archivo pesa más de 1,5 MB conviértelo a JPG en https://squoosh.app (gratis, en el navegador; calidad 80–85, ancho 4096 px).

## C. Convertir fotos normales a 360° con IA (con cuidado)
- Hay dos caminos gratis: **coser varias fotos reales** con el programa gratuito **Hugin** (hugin.sourceforge.io), o **generar** un panorama con IA (por ejemplo Skybox AI de Blockade Labs, que tiene plan gratis; revisa sus límites actuales antes de usarlo).
- La IA **inventa** el espacio: el resultado no es el local real. Úsala solo para rellenar, nunca para mostrarle a un paciente un consultorio que no existe. Para una clínica real, usa siempre fotos reales.

## D. Hoja de Google (ya conectada)
- Acepta tus encabezados tal cual: servicios → `Nombre del servicio | Disponibilidad` (Si / No). Opcionales: `Descripcion`, `Palabras clave`, `Respuesta`. Preguntas → `Pregunta | Respuesta`.
- Los servicios de la hoja mandan sobre los de `config.js`; los que no estén en la hoja siguen usando `config.js`. Si escribes mal un nombre (ej. "Pedriatría") igual lo reconoce.
- Google tarda unos minutos en reflejar los cambios (la hoja debe estar *Publicada en la web* en formato CSV).
