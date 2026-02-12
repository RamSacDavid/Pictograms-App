// Base de datos de pictogramas por categoría
const pictogramasDB = {
    necesidades: [
        { id: 'agua', nombre: 'Agua', arasaac: 2248 },
        { id: 'comida', nombre: 'Comida', arasaac: 5606 },
        { id: 'baño', nombre: 'Baño', arasaac: 2814 },
        { id: 'dormir', nombre: 'Dormir', arasaac: 7392 },
        { id: 'ayuda', nombre: 'Ayuda', arasaac: 2801 },
        { id: 'dolor', nombre: 'Dolor', arasaac: 7334 }
    ],
    personas: [
        { id: 'mama', nombre: 'Mamá', arasaac: 2398 },
        { id: 'papa', nombre: 'Papá', arasaac: 2397 },
        { id: 'hermano', nombre: 'Hermano', arasaac: 12231 },
        { id: 'hermana', nombre: 'Hermana', arasaac: 12230 },
        { id: 'abuelo', nombre: 'Abuelo', arasaac: 8857 },
        { id: 'abuela', nombre: 'Abuela', arasaac: 8856 }
    ],
    acciones: [
        { id: 'jugar', nombre: 'Jugar', arasaac: 2385 },
        { id: 'ver_tv', nombre: 'Ver TV', arasaac: 10542 },
        { id: 'salir', nombre: 'Salir', arasaac: 2518 },
        { id: 'leer', nombre: 'Leer', arasaac: 2379 },
        { id: 'escuchar', nombre: 'Escuchar música', arasaac: 7434 },
        { id: 'caminar', nombre: 'Caminar', arasaac: 11869 }
    ],
    emociones: [
        { id: 'contento', nombre: 'Contento', arasaac: 5808 },
        { id: 'triste', nombre: 'Triste', arasaac: 5809 },
        { id: 'enfadado', nombre: 'Enfadado', arasaac: 11002 },
        { id: 'cansado', nombre: 'Cansado', arasaac: 8967 },
        { id: 'miedo', nombre: 'Miedo', arasaac: 11003 },
        { id: 'sorprendido', nombre: 'Sorprendido', arasaac: 11006 }
    ],
    lugares: [
        { id: 'casa', nombre: 'Casa', arasaac: 2348 },
        { id: 'colegio', nombre: 'Colegio', arasaac: 2351 },
        { id: 'parque', nombre: 'Parque', arasaac: 11926 },
        { id: 'hospital', nombre: 'Hospital', arasaac: 2371 },
        { id: 'tienda', nombre: 'Tienda', arasaac: 2527 },
        { id: 'playa', nombre: 'Playa', arasaac: 11929 }
    ]
};

// Estado de la aplicación
let categoriaActual = null;
let fraseActual = [];
let pictogramaGrabando = null;
let mediaRecorder = null;
let audioChunks = [];

// Elementos del DOM
const categoriasScreen = document.getElementById('categorias-screen');
const pictogramasScreen = document.getElementById('pictogramas-screen');
const categoriaTitulo = document.getElementById('categoria-titulo');
const pictogramasGrid = document.getElementById('pictogramas-grid');
const frasePictos = document.getElementById('frase-pictos');
const btnVolver = document.getElementById('btn-volver');
const btnHablar = document.getElementById('btn-hablar');
const btnLimpiar = document.getElementById('btn-limpiar');
const grabacionModal = document.getElementById('grabacion-modal');
const pictoNombre = document.getElementById('picto-nombre');
const btnGrabar = document.getElementById('btn-grabar');
const btnReproducir = document.getElementById('btn-reproducir');
const btnBorrarAudio = document.getElementById('btn-borrar-audio');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

function inicializarApp() {
    // Event listeners para botones de categorías
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.dataset.categoria;
            mostrarPictogramas(categoria);
        });
    });

    // Botón volver
    btnVolver.addEventListener('click', volverACategorias);

    // Botón hablar
    btnHablar.addEventListener('click', hablarFrase);

    // Botón limpiar
    btnLimpiar.addEventListener('click', limpiarFrase);

    // Modal de grabación
    btnCerrarModal.addEventListener('click', cerrarModal);

    // Botón grabar (mantener pulsado)
    btnGrabar.addEventListener('mousedown', iniciarGrabacion);
    btnGrabar.addEventListener('touchstart', (e) => {
        e.preventDefault();
        iniciarGrabacion();
    });
    btnGrabar.addEventListener('mouseup', detenerGrabacion);
    btnGrabar.addEventListener('touchend', (e) => {
        e.preventDefault();
        detenerGrabacion();
    });
    btnGrabar.addEventListener('mouseleave', detenerGrabacion);

    // Botón reproducir
    btnReproducir.addEventListener('click', reproducirAudio);

    // Botón borrar audio
    btnBorrarAudio.addEventListener('click', borrarAudio);

    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker error:', err);
        });
    }
}

function mostrarPictogramas(categoria) {
    categoriaActual = categoria;
    categoriaTitulo.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    
    // Limpiar grid
    pictogramasGrid.innerHTML = '';
    
    // Cargar pictogramas de la categoría
    const pictos = pictogramasDB[categoria] || [];
    pictos.forEach(picto => {
        const card = crearPictogramaCard(picto);
        pictogramasGrid.appendChild(card);
    });
    
    // Cambiar de pantalla
    categoriasScreen.classList.remove('active');
    pictogramasScreen.classList.add('active');
}

function crearPictogramaCard(picto) {
    const card = document.createElement('div');
    card.className = 'picto-card';
    
    // Verificar si tiene audio guardado
    if (tieneAudioGuardado(picto.id)) {
        card.classList.add('has-audio');
    }
    
    // Imagen del pictograma (ARASAAC)
    const img = document.createElement('img');
    img.src = `https://static.arasaac.org/pictograms/${picto.arasaac}/${picto.arasaac}_500.png`;
    img.alt = picto.nombre;
    
    // Nombre
    const nombre = document.createElement('span');
    nombre.textContent = picto.nombre;
    
    card.appendChild(img);
    card.appendChild(nombre);
    
    // Click normal: añadir a frase
    card.addEventListener('click', () => {
        agregarAFrase(picto);
    });
    
    // Mantener pulsado: abrir modal de grabación
    let pressTimer;
    card.addEventListener('mousedown', () => {
        pressTimer = setTimeout(() => {
            abrirModalGrabacion(picto);
        }, 500);
    });
    card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        pressTimer = setTimeout(() => {
            abrirModalGrabacion(picto);
        }, 500);
    });
    card.addEventListener('mouseup', () => clearTimeout(pressTimer));
    card.addEventListener('touchend', () => clearTimeout(pressTimer));
    card.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    
    return card;
}

function agregarAFrase(picto) {
    if (fraseActual.length < 3) {
        fraseActual.push(picto);
        actualizarFrase();
    }
}

function actualizarFrase() {
    const slots = frasePictos.querySelectorAll('.picto-slot');
    
    slots.forEach((slot, index) => {
        if (index < fraseActual.length) {
            const picto = fraseActual[index];
            slot.classList.remove('empty');
            slot.classList.add('filled');
            slot.innerHTML = `<img src="https://static.arasaac.org/pictograms/${picto.arasaac}/${picto.arasaac}_500.png" alt="${picto.nombre}">`;
        } else {
            slot.classList.remove('filled');
            slot.classList.add('empty');
            slot.textContent = index + 1;
        }
    });
    
    btnHablar.disabled = fraseActual.length === 0;
}

function limpiarFrase() {
    fraseActual = [];
    actualizarFrase();
}

async function hablarFrase() {
    if (fraseActual.length === 0) return;
    
    for (const picto of fraseActual) {
        const audio = obtenerAudio(picto.id);
        if (audio) {
            await reproducirAudioBlob(audio);
            await esperar(300); // Pausa entre palabras
        } else {
            // Si no hay audio grabado, usar síntesis de voz
            await hablarTexto(picto.nombre);
            await esperar(300);
        }
    }
}

function hablarTexto(texto) {
    return new Promise((resolve) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = 'es-ES';
            utterance.rate = 0.9;
            utterance.onend = resolve;
            window.speechSynthesis.speak(utterance);
        } else {
            resolve();
        }
    });
}

function reproducirAudioBlob(audioBlob) {
    return new Promise((resolve) => {
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.onended = resolve;
        audio.play().catch(() => resolve());
    });
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function volverACategorias() {
    pictogramasScreen.classList.remove('active');
    categoriasScreen.classList.add('active');
    limpiarFrase();
}

// Funciones de grabación
function abrirModalGrabacion(picto) {
    pictogramaGrabando = picto;
    pictoNombre.textContent = picto.nombre;
    
    // Verificar si ya tiene audio
    if (tieneAudioGuardado(picto.id)) {
        btnReproducir.style.display = 'block';
        btnBorrarAudio.style.display = 'block';
    } else {
        btnReproducir.style.display = 'none';
        btnBorrarAudio.style.display = 'none';
    }
    
    grabacionModal.classList.add('active');
}

function cerrarModal() {
    grabacionModal.classList.remove('active');
    pictogramaGrabando = null;
    
    // Actualizar las tarjetas para mostrar el icono de audio
    if (categoriaActual) {
        mostrarPictogramas(categoriaActual);
    }
}

async function iniciarGrabacion() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            guardarAudio(pictogramaGrabando.id, audioBlob);
            btnReproducir.style.display = 'block';
            btnBorrarAudio.style.display = 'block';
            
            // Detener el stream
            stream.getTracks().forEach(track => track.stop());
        });
        
        mediaRecorder.start();
        btnGrabar.classList.add('grabando');
        btnGrabar.textContent = '🔴 Grabando...';
    } catch (error) {
        alert('No se pudo acceder al micrófono');
    }
}

function detenerGrabacion() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        btnGrabar.classList.remove('grabando');
        btnGrabar.textContent = '🎤 Mantén para Grabar';
    }
}

function reproducirAudio() {
    if (pictogramaGrabando) {
        const audioBlob = obtenerAudio(pictogramaGrabando.id);
        if (audioBlob) {
            reproducirAudioBlob(audioBlob);
        }
    }
}

function borrarAudio() {
    if (pictogramaGrabando && confirm('¿Borrar el audio grabado?')) {
        eliminarAudio(pictogramaGrabando.id);
        btnReproducir.style.display = 'none';
        btnBorrarAudio.style.display = 'none';
    }
}

// Funciones de almacenamiento local
function guardarAudio(pictoId, audioBlob) {
    const reader = new FileReader();
    reader.onloadend = () => {
        localStorage.setItem(`audio_${pictoId}`, reader.result);
    };
    reader.readAsDataURL(audioBlob);
}

function obtenerAudio(pictoId) {
    const audioData = localStorage.getItem(`audio_${pictoId}`);
    if (audioData) {
        return dataURLtoBlob(audioData);
    }
    return null;
}

function tieneAudioGuardado(pictoId) {
    return localStorage.getItem(`audio_${pictoId}`) !== null;
}

function eliminarAudio(pictoId) {
    localStorage.removeItem(`audio_${pictoId}`);
}

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
