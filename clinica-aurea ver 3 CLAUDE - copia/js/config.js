/* =====================================================================
   CONFIG.JS  ·  AQUÍ CAMBIAS TODO EL CONTENIDO SIN TOCAR EL RESTO DEL CÓDIGO
   ---------------------------------------------------------------------
   Reglas simples para editar:
   - Todo texto va entre comillas "así".
   - No borres las comas (,) al final de cada línea.
   - Para cambiar una imagen: pon la ruta de tu archivo nuevo
     (ej: "assets/img/mi-foto.jpg") o un link completo https://...
   ===================================================================== */

window.CLINICA = {

  /* ── 1. DATOS GENERALES ───────────────────────────────────────────── */

  nombre: "Clínica Áurea",

  // 👉 NÚMERO DE WHATSAPP: código de país + número, SIN "+" NI espacios.
  //    Ejemplo Venezuela: 584121234567   ·   Colombia: 573001234567
  whatsapp: "584267932485",

  // 👉 LINK DE GOOGLE MAPS:
  //    En Google Maps busca tu local → botón "Compartir" → "Copiar vínculo" → pégalo aquí.
  mapaUrl: "https://maps.app.goo.gl/d5DAbar5s47EyeXeA",

  // 👉 REDES SOCIALES (pon el link a tu perfil)
  redes: {
    instagram: "https://www.instagram.com/disenadorgrafico.pr/",
    tiktok: "https://www.linkedin.com/in/daniela-mijares-037746214/"
  },

  /* ── 2. MENSAJES PREDETERMINADOS DE WHATSAPP ──────────────────────── */
  // Es lo que le aparece escrito a la persona cuando se abre tu WhatsApp.
  mensajes: {
    catalogo: "Hola Clínica Áurea 👋 Me gustaría ver el catálogo de servicios.",
    cita: "Hola Clínica Áurea 👋 Quisiera agendar una cita.",
    general: "Hola Clínica Áurea 👋 Quisiera recibir orientación.",
    // Cuando la persona eligió servicios con el carrito (se agrega la lista debajo):
    conServicios: "Hola Clínica Áurea 👋 Me interesa consultar por estos servicios:",
    // Botón de una tarjeta (se reemplaza {servicio} por el nombre):
    servicio: "Hola Clínica Áurea 👋 Quisiera información sobre {servicio}."
  },

  /* ── 3. HEADER PANORÁMICO 360° ────────────────────────────────────── */
  hero: {
    // 👉 VIDEO DE INTRO (opcional). Déjalo en "" si no quieres video:
    //    entonces se ve la foto 360 girando suavemente de fondo.
    //    Ideal: mp4 corto (5–10 s), sin sonido, menos de 4 MB.
    video: "",
    videoPoster: "",

    // 👉 LAS 4 ESCENAS. Reemplaza "imagen" por tu foto panorámica equirectangular
    //    (formato 2:1, ej: 4096x2048, las que hacen las cámaras 360 o el modo
    //    "Panorama/Photo Sphere" del celular).
    //
    //    "puntos" son los botones flotantes. yaw = giro horizontal (-180 a 180),
    //    pitch = arriba/abajo (-90 a 90). Para encontrar los valores fácil:
    //    abre tu página con  ?editar  al final (ej: http://127.0.0.1:5500/?editar),
    //    entra al recorrido, toca/clic donde quieres el botón y verás los números.
    //
    //    FOTOS PANORÁMICAS DEL CELULAR (no 360 completas): agrega en la escena  angulo: 180
    //    (cuántos grados abarca la foto; iPhone ~200-240, Android ~120-180). Si es una foto 360
    //    completa (proporción 2:1) NO pongas nada: se detecta sola.
    escenaInicial: "recepcion",
    escenas: [
      {
        id: "recepcion",
        nombre: "Recepción",
        imagen: "assets/img/Recepción.png",
        mirarYaw: 0, mirarPitch: 0,
        puntos: [
          { a: "consultorio",  texto: "Consultorio",  yaw: 62,   pitch: -2 },
          { a: "Sala de espera",    texto: "Sala de espera",    yaw: -70,  pitch: -4 },
          { a: "tratamientos", texto: "Tratamientos", yaw: 150,   pitch: 0 }
        ]
      },
      {
        id: "consultorio",
        nombre: "Consultorio",
        imagen: "assets/img/Consultorio.png",
        mirarYaw: 0, mirarPitch: 0,
        puntos: [
          { a: "recepcion",    texto: "Recepción",    yaw: 180,  pitch: -2 },
          { a: "tratamientos", texto: "Tratamientos", yaw: 70,   pitch: -3 },
          { a: "Sala de espera",    texto: "Sala de espera",    yaw: -75,  pitch: -3 }
        ]
      },
      {
        id: "Sala de espera",
        nombre: "Sala de espera",
        imagen: "assets/img/Sala de espera.png",
        mirarYaw: 0, mirarPitch: 0,
        puntos: [
          { a: "recepcion",    texto: "Recepción",    yaw: 110,  pitch: -2 },
          { a: "consultorio",  texto: "Consultorio",  yaw: -60,  pitch: -3 },
          { a: "tratamientos", texto: "Tratamientos", yaw: 180,  pitch: 0 }
        ]
      },
      {
        id: "tratamientos",
        nombre: "Tratamientos",
        imagen: "assets/img/Tratamiento.png",
        mirarYaw: 0, mirarPitch: 0,
        puntos: [
          { a: "consultorio",  texto: "Consultorio",  yaw: -110, pitch: -2 },
          { a: "recepcion",    texto: "Recepción",    yaw: 70,   pitch: -3 },
          { a: "Sala de espera",    texto: "Sala de espera",    yaw: 180,  pitch: 0 }
        ]
      }
    ],

    // Botón del giroscopio (mover el celular para mirar alrededor).
    // true = se muestra un botoncito opcional en móvil · false = se oculta.
    botonGiroscopio: true
  },

  /* ── 4. SERVICIOS ESTRELLA (las 3 tarjetas) ───────────────────────── */
  // 👉 "imagen": tu PNG con fondo transparente (termómetro, estetoscopio…)
  servicios: [
    {
      nombre: "Pediatría",
      etiqueta: "Crecer con cuidado",
      descripcion: "Cuidado cercano para su crecimiento, de la mano contigo.",
      imagen: "assets/img/instrumento-pediatria.svg"
    },
    {
      nombre: "Ginecología",
      etiqueta: "Salud de la mujer",
      descripcion: "Escucha y acompañamiento en cada etapa de tu vida.",
      imagen: "assets/img/instrumento-ginecologia.svg"
    },
    {
      nombre: "Medicina General",
      etiqueta: "Bienestar para todos",
      descripcion: "Salud para toda la familia.",
      imagen: "assets/img/instrumento-medicina.svg"
    }
  ],

  /* ── 5. BUSCADOR (respuestas predeterminadas, NO es una IA) ──────── */

  // 👉 GOOGLE SHEETS (gratis). Si pegas aquí los links CSV (ver LEEME.md, paso a paso),
  //    el dueño cambia la disponibilidad en la hoja y la web se actualiza sola.
  //    Si los dejas en "", se usa la lista local de más abajo.
  sheetServicios: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzmnvGnya_-yhhH-TGDca0h35X4tWsDmYLB_e5618IjHnMdd2kw8IXGFyUk2AnDLrixWeEhawm_nb1/pub?gid=0&single=true&output=csv",   // hoja "servicios"  → link CSV publicado
  sheetPreguntas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzmnvGnya_-yhhH-TGDca0h35X4tWsDmYLB_e5618IjHnMdd2kw8IXGFyUk2AnDLrixWeEhawm_nb1/pub?gid=1875437506&single=true&output=csv",   // hoja "preguntas"  → link CSV publicado

  // Chips de sugerencias que aparecen bajo el buscador:
  sugerencias: ["Chequeos", "Primera consulta", "Ginecología", "¿Cómo agendar?"],

  // Cuando no se encuentra nada:
  sinResultado: "Disculpa, no ofrecemos ese tipo de servicios, pero tenemos otras opciones. Haz clic en el botón de abajo para que veas los servicios que tenemos.",

  // Lista LOCAL de respaldo (misma estructura que la hoja de Google Sheets).
  // disponible: true = lo ofrecemos · false = por ahora no.
  // palabrasClave: palabras que la persona podría escribir, separadas por coma.
  catalogoLocal: [
    { nombre: "Pediatría", disponible: true, palabrasClave: "niños, bebé, bebe, hijo, infantil, pediatra",
      descripcion: "Control del crecimiento, vacunas y consulta para niños y adolescentes.", respuesta: "" },
    { nombre: "Ginecología", disponible: true, palabrasClave: "mujer, embarazo, papanicolau, citologia, ginecologa, menstruacion",
      descripcion: "Control ginecológico, citología y acompañamiento en cada etapa.", respuesta: "" },
    { nombre: "Medicina General", disponible: true, palabrasClave: "general, familia, gripe, malestar, consulta, doctor",
      descripcion: "Atención para toda la familia y orientación a especialistas.", respuesta: "" },
    { nombre: "Chequeos", disponible: true, palabrasClave: "chequeo, check up, examen, laboratorio, revision, preventivo",
      descripcion: "Chequeos preventivos completos con orientación personalizada.", respuesta: "" },
    { nombre: "Nutrición", disponible: true, palabrasClave: "nutricion, dieta, peso, alimentacion, nutricionista",
      descripcion: "Plan de alimentación acompañado por nutricionista.", respuesta: "" },
    { nombre: "Cirugía plástica", disponible: false, palabrasClave: "cirugia, cirugia plastica, operacion, quirurgico",
      descripcion: "", respuesta: "Disculpa, no ofrecemos ese tipo de servicios, pero tenemos retoques no invasivos. Haz clic en el botón de abajo para que veas los servicios que tenemos." }
  ],

  // Preguntas frecuentes LOCALES (respaldo)
  preguntasLocal: [
    { pregunta: "Primera consulta", palabrasClave: "primera, primera vez, nueva, nuevo, consulta inicial",
      respuesta: "Tu primera consulta es un espacio para escucharte con calma: revisamos tu historial, tus dudas y definimos juntos el siguiente paso. Escríbenos por WhatsApp y coordinamos tu horario." },
    { pregunta: "¿Cómo agendar?", palabrasClave: "agendar, cita, reservar, turno, horario, como agendo",
      respuesta: "Agendar es muy fácil: toca el botón de abajo y te atendemos por WhatsApp para elegir el servicio, el día y la hora que mejor te quede." },
    { pregunta: "Ubicación", palabrasClave: "donde, direccion, ubicacion, mapa, llegar",
      respuesta: "Puedes ver cómo llegar con el botón «Ubicación (Google Maps)» al final de la página." }
  ],

  /* ── 6. ANTES Y DESPUÉS / TESTIMONIOS (videos) ────────────────────── */
  // 👉 tipo "mp4"   = video alojado por ti (lo más recomendado, ver LEEME.md)
  //    tipo "iframe" = link para incrustar de YouTube Shorts / Instagram / TikTok
  //                    (ej: "https://www.youtube.com/embed/ID_DEL_VIDEO")
  // 👉 "poster" = la foto que se ve antes de darle play.
  videos: [
   { titulo: "Testimonio 1", tipo: "iframe", src: "https://www.youtube.com/embed/kpWcG9ZPr9I?autoplay=1&mute=1&loop=1&playlist=kpWcG9ZPr9I&controls=0&modestbranding=1&rel=0", poster: "assets/img/testimonio 1.png" },
    { titulo: "Testimonio 2", tipo: "iframe", src: "https://www.youtube.com/embed/0ae9E-SbE4E?autoplay=1&mute=1&loop=1&playlist=0ae9E-SbE4E&controls=0&modestbranding=1&rel=0", poster: "assets/img/testimonio 2.png" },
    { titulo: "Testimonio 3", tipo: "iframe", src: "https://www.youtube.com/embed/-YmGwJ9eli8?autoplay=1&mute=1&loop=1&playlist=-YmGwJ9eli8&controls=0&modestbranding=1&rel=0", poster: "assets/img/testimonio 3.png" }
  ],

  /* ── 7. VIDEO "CONÓCENOS ANTES DE VENIR" ──────────────────────────── */
  presentacion: {
   tipo: "iframe",
  src: "https://www.youtube.com/embed/pTFYwG1r1g0?autoplay=1&mute=1&loop=1&playlist=pTFYwG1r1g0&controls=0&modestbranding=1&rel=0",
  poster: "assets/img/videofinal.png"
  }


};
