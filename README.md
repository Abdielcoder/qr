# 🔗 Generador de Códigos QR

Un generador de códigos QR moderno y elegante que permite crear códigos QR a partir de enlaces y texto de manera rápida y sencilla.

## ✨ Características

- **Generación instantánea**: Crea códigos QR al instante usando la API de QR Server
- **Personalización**: Elige entre diferentes tamaños y colores
- **Descarga directa**: Descarga los códigos QR como imágenes PNG
- **Historial**: Guarda automáticamente los últimos 10 códigos QR generados
- **Reutilización**: Reutiliza códigos QR del historial con un clic
- **Copia de enlaces**: Copia el enlace del código QR al portapapeles
- **Diseño responsivo**: Funciona perfectamente en dispositivos móviles y escritorio
- **Interfaz moderna**: Diseño atractivo con animaciones y efectos visuales

## 🚀 Cómo usar

1. **Abrir la aplicación**: Abre el archivo `index.html` en tu navegador web
2. **Introducir contenido**: Escribe el enlace o texto que quieres convertir en QR
3. **Personalizar** (opcional): 
   - Selecciona el tamaño del código QR
   - Elige el color que prefieras
4. **Generar**: Haz clic en "Generar Código QR" o presiona Enter
5. **Descargar o copiar**: Una vez generado, puedes:
   - Descargar la imagen del código QR
   - Copiar el enlace del código QR
   - Reutilizar códigos del historial

## 📱 Tipos de contenido soportados

El generador puede crear códigos QR para:

- **URLs**: `https://ejemplo.com`
- **Correos electrónicos**: `mailto:usuario@ejemplo.com`
- **Números de teléfono**: `tel:+1234567890`
- **Texto simple**: Cualquier texto que quieras compartir
- **WiFi**: `WIFI:T:WPA;S:NombreRed;P:contraseña;;`
- **SMS**: `sms:+1234567890:Mensaje`

## 🎨 Opciones de personalización

### Tamaños disponibles:
- **Pequeño**: 150x150 píxeles
- **Mediano**: 200x200 píxeles (predeterminado)
- **Grande**: 300x300 píxeles
- **Extra Grande**: 400x400 píxeles

### Colores disponibles:
- Negro (predeterminado)
- Azul
- Rojo
- Verde
- Morado

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura semántica y moderna
- **CSS3**: Diseño responsivo con gradientes y animaciones
- **JavaScript (ES6+)**: Lógica de la aplicación con programación orientada a objetos
- **Bootstrap 5**: Framework CSS para diseño responsivo
- **API QR Server**: Servicio gratuito para generar códigos QR
- **LocalStorage**: Almacenamiento local para el historial

## 📁 Estructura del proyecto

```
qr/
├── index.html      # Página principal
├── script.js       # Lógica de la aplicación
├── styles.css      # Estilos personalizados
└── README.md       # Documentación
```

## 🌐 API utilizada

Este proyecto utiliza la API gratuita de [QR Server](https://goqr.me/api/) para generar los códigos QR:

```
https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TuTextoAqui
```

### Parámetros soportados:
- `size`: Tamaño en píxeles (ej: 200x200)
- `data`: Contenido del código QR (codificado URL)
- `color`: Color del código QR en hexadecimal

## 🔧 Instalación y ejecución

1. **Clonar o descargar** este repositorio
2. **Abrir** el archivo `index.html` en cualquier navegador web moderno
3. **¡Listo!** No se requiere instalación adicional

### Requisitos:
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para cargar Bootstrap y generar QR)

## 🎯 Características técnicas

### Funcionalidades de JavaScript:
- **Clases ES6**: Código organizado y mantenible
- **Async/Await**: Manejo moderno de operaciones asíncronas
- **LocalStorage**: Persistencia de datos en el navegador
- **Event Listeners**: Manejo eficiente de eventos
- **Error Handling**: Manejo robusto de errores

### Características de CSS:
- **Flexbox y Grid**: Layout moderno y flexible
- **Animaciones CSS**: Transiciones y efectos suaves
- **Media Queries**: Diseño totalmente responsivo
- **Custom Properties**: Variables CSS para mantenimiento fácil

## 📧 Soporte

Si encuentras algún problema o tienes sugerencias, puedes:

1. Verificar que tienes conexión a internet
2. Asegurarte de usar un navegador moderno
3. Revisar la consola del navegador para errores

## 🔄 Actualizaciones futuras

Posibles mejoras planificadas:
- Soporte para más formatos de descarga (SVG, PDF)
- Códigos QR con logos personalizados
- Generación offline
- Más opciones de personalización
- Compartir en redes sociales

## 📄 Licencia

Este proyecto es de uso libre. Puedes modificarlo y distribuirlo según tus necesidades.

---

¡Disfruta generando códigos QR de manera fácil y elegante! 🎉 