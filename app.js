// Base de datos de pictogramas por categoria
const pictogramasDB = {
    activitats: [
        { id: 'ludoteca', nombre: 'Ludoteca', arasaac: 4689 },
        { id: 'patio', nombre: 'Pati', arasaac: 6204 },
        { id: 'piscina', nombre: 'Piscina', arasaac: 3142 },
        { id: 'festival', nombre: 'Festival', arasaac: 25103 },
        { id: 'refresco', nombre: 'Fer el toc', arasaac: 4732 },
        { id: 'fiesta', nombre: 'Festa', arasaac: 16649 },
        { id: 'obra_de_teatro', nombre: 'Teatre', arasaac: 11319 },
        { id: 'orquesta', nombre: 'Auditori', arasaac: 38296 },
        { id: 'ir_de_excursion', nombre: 'Excursio', arasaac: 4671 }
    ],
    lloc: [
        { id: 'subir_al_autobus', nombre: 'Agafar l\'autobus', arasaac: 36595 },
        { id: 'parque', nombre: 'Parc', arasaac: 2859 },
        { id: 'bar', nombre: 'Bar', arasaac: 4573 },
        { id: 'supermercado', nombre: 'Supermercat', arasaac: 3389 },
        { id: 'escuela', nombre: 'Escola', arasaac: 6454 },
        { id: 'casa', nombre: 'Casa', arasaac: 2317 },
        { id: 'piscina', nombre: 'Piscina', arasaac: 3142 },
        { id: 'playa', nombre: 'Platja', arasaac: 2826 }
    ],
    menjar: [
        { id: 'desayuno', nombre: 'Esmorzar', arasaac: 4626 },
        { id: 'comida', nombre: 'Dinar', arasaac: 4611 },
        { id: 'yo', nombre: 'Jo vull', arasaac: 2617 },
        { id: 'merienda', nombre: 'Berenar', arasaac: 4695 },
        { id: 'cena', nombre: 'Sopar', arasaac: 4592 }
    ],
    higiene: [
        { id: 'lavar_la_cara', nombre: 'Rentar la cara', arasaac: 34777 },
        { id: 'lavar_los_dientes', nombre: 'Rentar les dents', arasaac: 6971 },
        { id: 'lavar_las_manos', nombre: 'Rentar les mans', arasaac: 8975 },
        { id: 'lavar_el_pelo', nombre: 'Rentar el cabell', arasaac: 8616 },
        { id: 'banar', nombre: 'Banyar-se', arasaac: 6058 },
        { id: 'vestir', nombre: 'Vestir-se', arasaac: 2781 },
        { id: 'desvestir', nombre: 'Desvestir-se', arasaac: 11233 },
        { id: 'cortar_el_pelo', nombre: 'Tallar els cabells', arasaac: 27695 },
        { id: 'cortar_las_unas', nombre: 'Tallar les ungles', arasaac: 10152 },
        { id: 'peinar', nombre: 'Pentinar-se', arasaac: 26947 }
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

// Estado de la aplicacion
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

// Inicializacion
document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

function inicializarApp() {
    // Event listeners para botones de categorias
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.dataset.categoria;
            mostrarPictogramas(categoria);
        });
    });

    // Boton volver
    btnVolver.addEventListener('click', volverACategorias);

    // Boton hablar
    btnHablar.addEventListener('click', hablarFrase);

    // Boton limpiar
    btnLimpiar.addEventListener('click', limpiarFrase);

    // Modal de grabacion
    btnCerrarModal.addEventListener('click', cerrarModal);

    // Boton grabar (mantener pulsado)
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

    // Boton reproducir
    btnReproducir.addEventListener('click', reproducirAudio);

    // Boton borrar audio
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
    
    // Cargar pictogramas de la categoria
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
    
    // Click normal: anadir a frase
    card.addEventListener('click', () => {
        agregarAFrase(picto);
    });
    
    // Mantener pulsado: abrir modal de grabacion
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
            // Si no hay audio grabado, usar sintesis de voz
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

// Funciones de grabacion
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
        btnGrabar.textContent = 'Grabando...';
    } catch (error) {
        alert('No se pudo acceder al microfono');
    }
}

function detenerGrabacion() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        btnGrabar.classList.remove('grabando');
        btnGrabar.textContent = 'Manten para Grabar';
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
    if (pictogramaGrabando && confirm('Borrar el audio grabado?')) {
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
