# 📱 App de Pictogramas ARASAAC

Aplicación web progresiva (PWA) de comunicación aumentativa y alternativa (CAA) diseñada para personas con trastorno del espectro autista (TEA) y otras necesidades comunicativas.

## ✨ Características

- 🎨 **5 categorías personalizadas**: Activitats, Lloc, Menjar, Higiene y Lugares
- 🖼️ **Pictogramas ARASAAC**: Uso de pictogramas de código abierto de alta calidad
- 🔊 **Grabación de audio personalizada**: Graba tu propia voz para cada pictograma
- 💬 **Construcción de frases**: Combina hasta 3 pictogramas para formar oraciones
- 🎤 **Síntesis de voz**: Reproducción automática si no hay audio grabado
- 📲 **Instalable**: Funciona como app nativa en Android e iOS
- 🔌 **Funciona sin internet**: Una vez cargada, no requiere conexión
- 💾 **Almacenamiento local**: Los audios se guardan en el dispositivo

## 🚀 Instalación

### Opción 1: Usar directamente desde la web

Visita: **https://ramsacdavid.github.io/Pictograms-App/**

### Opción 2: Instalar como aplicación en Android

1. Abre la URL en **Google Chrome** (móvil)
2. Toca el menú (⋮) en la esquina superior derecha
3. Selecciona **"Añadir a pantalla de inicio"** o **"Instalar app"**
4. Confirma y ¡listo! Aparecerá un icono en tu pantalla de inicio

### Opción 3: Instalar en iOS (iPhone/iPad)

1. Abre la URL en **Safari**
2. Toca el botón de compartir (cuadrado con flecha hacia arriba)
3. Desplázate y selecciona **"Añadir a la pantalla de inicio"**
4. Confirma el nombre y toca **"Añadir"**

## 📖 Guía de uso

### 🎯 Navegación básica

1. **Selecciona una categoría** tocando cualquiera de los botones principales
2. **Elige pictogramas** tocando sobre ellos (se añaden a la tira de frase)
3. **Reproduce la frase** tocando el botón "Hablar"
4. **Limpia la frase** con el botón "Limpiar"
5. **Vuelve atrás** con el botón "Volver"

### 🎤 Grabar audio personalizado

1. **Mantén pulsado** un pictograma durante 1 segundo
2. Se abrirá el modal de grabación
3. **Mantén pulsado** el botón "Mantén para Grabar"
4. **Habla** mientras mantienes el botón presionado
5. **Suelta** para terminar la grabación
6. Puedes reproducir o borrar el audio grabado

> 💡 **Consejo**: Los pictogramas con audio grabado muestran un icono 🎤

### 💬 Crear frases

- Toca **hasta 3 pictogramas** en el orden deseado
- Los pictogramas aparecerán en la **tira de frase** (parte superior)
- Toca **"Hablar"** para reproducir toda la frase
- Si un pictograma tiene audio grabado, se reproducirá ese audio
- Si no tiene audio, se usará la **síntesis de voz automática**

## 🛠️ Personalización

### Añadir más pictogramas

1. Ve a [ARASAAC Pictogramas](https://arasaac.org/pictograms/search)
2. Busca el pictograma que necesitas
3. Anota el **número ID** de la URL
4. Edita el archivo `app.js` y añade el pictograma:

```javascript
{ id: 'identificador_unico', nombre: 'Nombre del picto', arasaac: ID_NUMERO }
```

**Ejemplo**:
```javascript
activitats: [
    { id: 'pelota', nombre: 'Jugar a la pelota', arasaac: 2427 },
    // ... resto de pictogramas
]
```

### Añadir nuevas categorías

**1. Editar `index.html`** - Añadir botón de categoría:

```html
<button class="categoria-btn" data-categoria="tu_categoria">
    <img src="https://static.arasaac.org/pictograms/ID/ID_500.png" 
         alt="Tu Categoria" 
         style="width: 80px; height: 80px; object-fit: contain;">
    <span>Tu Categoria</span>
</button>
```

**2. Editar `app.js`** - Añadir pictogramas de la categoría:

```javascript
const pictogramasDB = {
    // ... categorías existentes
    tu_categoria: [
        { id: 'ejemplo1', nombre: 'Ejemplo 1', arasaac: 1234 },
        { id: 'ejemplo2', nombre: 'Ejemplo 2', arasaac: 5678 }
    ]
};
```

> ⚠️ **Importante**: El nombre en `data-categoria` debe coincidir EXACTAMENTE con la clave en `pictogramasDB`

### Cambiar iconos de categorías

Busca el pictograma en ARASAAC y reemplaza el ID en la URL de la imagen:

```html
<img src="https://static.arasaac.org/pictograms/NUEVO_ID/NUEVO_ID_500.png" 
     alt="Categoria" 
     style="width: 80px; height: 80px; object-fit: contain;">
```

## 🔧 Solución de problemas

### La app no se instala

- ✅ Usa **Google Chrome** en Android o **Safari** en iOS
- ✅ Verifica que la URL use **HTTPS** (GitHub Pages lo hace automáticamente)
- ✅ Limpia la caché del navegador

### No puedo grabar audio

- ✅ **Permite el acceso al micrófono** cuando el navegador lo solicite
- ✅ Verifica que el micrófono funcione en otras aplicaciones
- ✅ En Chrome: Configuración → Permisos de sitio → Micrófono

### Los pictogramas no aparecen

- ✅ Verifica tu **conexión a internet** (primera carga)
- ✅ Una vez descargados, funcionan sin conexión
- ✅ Comprueba que el ID del pictograma sea correcto

### Las categorías no funcionan

- ✅ Verifica que `data-categoria` en HTML coincida con la clave en `app.js`
- ✅ JavaScript distingue mayúsculas: `"menjar"` ≠ `"Menjar"`
- ✅ Borra la caché del navegador: Configuración → Borrar datos

### Perdí los audios grabados

- ⚠️ Los audios se guardan en el **almacenamiento local del navegador**
- ⚠️ Si borras los datos del navegador, se perderán
- ⚠️ No desinstales la app, solo ciérrala cuando no la uses
- 💡 Solución: Vuelve a grabar los audios necesarios

### La app está desactualizada (caché)

**En Android:**
1. Menú (⋮) → Configuración → Privacidad y seguridad
2. Borrar datos de navegación → Imágenes y archivos en caché
3. O añade `?v=2` al final de la URL

**En iOS:**
1. Ajustes → Safari → Borrar historial y datos
2. O usa modo privado para verificar

## 🌐 Tecnologías utilizadas

- **HTML5 + CSS3**: Interfaz responsiva y accesible
- **JavaScript (ES6+)**: Lógica de la aplicación
- **PWA (Progressive Web App)**: Instalable y funciona offline
- **Service Worker**: Caché de recursos y funcionamiento sin conexión
- **Web Audio API**: Grabación y reproducción de audio
- **LocalStorage**: Almacenamiento persistente de audios
- **Web Speech API**: Síntesis de voz en catalán/español

## 📄 Licencia y créditos

### Pictogramas ARASAAC

Los pictogramas utilizados pertenecen a [ARASAAC](https://arasaac.org) y están sujetos a la licencia:

**Creative Commons BY-NC-SA**

- ✅ Uso personal y educativo permitido
- ✅ Modificación permitida
- ❌ Uso comercial NO permitido
- 📋 Debe atribuirse al autor original

**Autor**: Sergio Palao  
**Origen**: ARASAAC (http://www.arasaac.org)  
**Licencia**: CC BY-NC-SA  

### Código de la aplicación

El código fuente de esta aplicación es de **libre uso** para fines personales y educativos.

## 🤝 Contribuir

Si deseas mejorar esta aplicación:

1. Haz un **Fork** del repositorio
2. Crea una rama para tu mejora: `git checkout -b mejora-nueva`
3. Realiza tus cambios y haz commit: `git commit -m 'Añadir nueva función'`
4. Sube los cambios: `git push origin mejora-nueva`
5. Abre un **Pull Request**

### Ideas para contribuir

- 🌍 Añadir más idiomas
- 🎨 Nuevas categorías temáticas
- 🔊 Mejorar la calidad de audio
- ♿ Mejorar accesibilidad
- 📱 Optimización para tablets
- 🎮 Añadir modo de aprendizaje/juego

## 💬 Soporte

Para dudas, problemas o sugerencias:

- 📧 Abre un **Issue** en GitHub
- 💡 Comparte tus ideas de mejora
- 🐛 Reporta errores con capturas de pantalla

## 📚 Recursos adicionales

- [ARASAAC - Portal Aragonés de CAA](https://arasaac.org)
- [Guía de uso de pictogramas](https://arasaac.org/materials/search)
- [Comunicación Aumentativa y Alternativa (CAA)](https://www.comunicacionalternativa.com)

## 🙏 Agradecimientos

- A [ARASAAC](https://arasaac.org) por proporcionar pictogramas de alta calidad de forma gratuita
- A la comunidad de desarrolladores que contribuyen a la accesibilidad web
- A todas las familias y profesionales que trabajan con personas con TEA

---

**⭐ Si esta aplicación te resulta útil, no dudes en darle una estrella al repositorio**

Desarrollado con ❤️ para mejorar la comunicación
