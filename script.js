class QRGenerator {
    constructor() {
        this.storageAvailable = true;
        try {
            this.history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
        } catch (error) {
            console.warn('LocalStorage no disponible o inaccesible:', error);
            this.storageAvailable = false;
            this.history = [];
        }
        this.initializeEventListeners();
        this.loadHistory();
    }

    initializeEventListeners() {
        const form = document.getElementById('qrForm');
        const downloadBtn = document.getElementById('downloadBtn');
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        const neoModeBtn = document.getElementById('neoModeBtn');
        const logoScale = document.getElementById('logoScale');
        const logoScaleValue = document.getElementById('logoScaleValue');
        const borderSize = document.getElementById('borderSize');
        const borderSizeValue = document.getElementById('borderSizeValue');
        const logoInput = document.getElementById('logoInput');
        const logoRounded = document.getElementById('logoRounded');
        const logoBorder = document.getElementById('logoBorder');
        const useDefaultLogo = document.getElementById('useDefaultLogo');

        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadQR());
        }
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => this.copyLink());
        }
        if (neoModeBtn) {
            neoModeBtn.addEventListener('click', () => this.resetAllFields());
        }

        // Controles del logo: reflejar valores y re-renderizar
        const reRender = () => {
            if (this.lastQrData) this.renderCanvas(this.lastQrData);
        };
        if (logoScale && logoScaleValue) {
            logoScale.addEventListener('input', (e) => {
                logoScaleValue.textContent = `${e.target.value}%`;
                reRender();
            });
        }
        if (borderSize && borderSizeValue) {
            borderSize.addEventListener('input', (e) => {
                borderSizeValue.textContent = `${e.target.value} px`;
                reRender();
            });
        }
        if (logoInput) logoInput.addEventListener('change', reRender);
        if (logoRounded) logoRounded.addEventListener('change', reRender);
        if (logoBorder) logoBorder.addEventListener('change', reRender);
        if (useDefaultLogo) useDefaultLogo.addEventListener('change', reRender);
    }

    resetAllFields() {
        // Quitar cualquier modo previo y estado del botón
        document.body.classList.remove('neo-mode');
        const neoModeBtn = document.getElementById('neoModeBtn');
        if (neoModeBtn) neoModeBtn.classList.remove('active');

        // Reset de formulario y controles
        const form = document.getElementById('qrForm');
        if (form) form.reset();

        const urlInput = document.getElementById('urlInput');
        if (urlInput) urlInput.placeholder = 'https://ejemplo.com';

        const logoInput = document.getElementById('logoInput');
        if (logoInput) logoInput.value = '';

        const useDefaultLogo = document.getElementById('useDefaultLogo');
        if (useDefaultLogo) useDefaultLogo.checked = true;

        const logoRounded = document.getElementById('logoRounded');
        if (logoRounded) logoRounded.checked = true;

        const logoBorder = document.getElementById('logoBorder');
        if (logoBorder) logoBorder.checked = true;

        const logoScale = document.getElementById('logoScale');
        const logoScaleValue = document.getElementById('logoScaleValue');
        if (logoScale) logoScale.value = '22';
        if (logoScaleValue) logoScaleValue.textContent = '22%';

        const borderSize = document.getElementById('borderSize');
        const borderSizeValue = document.getElementById('borderSizeValue');
        if (borderSize) borderSize.value = '6';
        if (borderSizeValue) borderSizeValue.textContent = '6 px';

        // Ocultar resultado y limpiar canvas/imagen
        const resultSection = document.getElementById('resultSection');
        if (resultSection) resultSection.classList.add('d-none');

        const qrCanvas = document.getElementById('qrCanvas');
        if (qrCanvas) {
            const ctx = qrCanvas.getContext('2d');
            ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
        }
        const qrImage = document.getElementById('qrImage');
        if (qrImage) {
            qrImage.src = '';
            if (qrImage.dataset) {
                delete qrImage.dataset.text;
                delete qrImage.dataset.qrUrl;
            }
        }
        this.lastQrData = null;

        // Feedback y foco
        this.showToast('Todos los campos han sido restablecidos', 'success');
        if (urlInput) urlInput.focus();
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const urlInput = document.getElementById('urlInput');
        const sizeSelect = document.getElementById('sizeSelect');
        const colorSelect = document.getElementById('colorSelect');
        const spinner = document.getElementById('spinner');
        const submitBtn = e.target.querySelector('button[type="submit"]');

        const url = urlInput.value.trim();
        const size = sizeSelect.value;
        const color = colorSelect.value;

        if (!url) {
            this.showToast('Por favor ingresa un enlace o texto válido', 'error');
            return;
        }

        // Mostrar spinner
        spinner.classList.remove('d-none');
        submitBtn.disabled = true;

        try {
            await this.generateQR(url, size, color);
            this.showToast('¡Código QR generado exitosamente!', 'success');
        } catch (error) {
            console.error('Error:', error);
            this.showToast('Error al generar el código QR. Intenta nuevamente.', 'error');
        } finally {
            // Ocultar spinner
            spinner.classList.add('d-none');
            submitBtn.disabled = false;
        }
    }

    async generateQR(text, size, color) {
        // Usar la API gratuita de QR Server
        const encodedText = encodeURIComponent(text);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=${color}&data=${encodedText}`;

        // Verificar que la imagen se carga correctamente
        await this.loadImage(qrUrl);

        const qrData = {
            text: text,
            url: qrUrl,
            size: size,
            color: color,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };

        // Mostrar el resultado
        this.displayQR(qrData);
        
        // Guardar en historial
        this.saveToHistory(qrData);
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // Intentar evitar CORS-taint del canvas
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
            img.src = url;
        });
    }

    displayQR(qrData) {
        const resultSection = document.getElementById('resultSection');
        const qrImage = document.getElementById('qrImage');
        const qrCanvas = document.getElementById('qrCanvas');

        if (!qrImage) {
            this.showToast('No se encontró el contenedor del QR en la página.', 'error');
            return;
        }
        qrImage.src = qrData.url;
        qrImage.dataset.text = qrData.text;
        qrImage.dataset.qrUrl = qrData.url;

        if (resultSection) {
            resultSection.classList.remove('d-none');
        }
        
        // Scroll suave al resultado
        if (resultSection && resultSection.scrollIntoView) {
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }

        this.lastQrData = qrData;
        if (qrCanvas) {
            this.renderCanvas(qrData);
        }
    }

    async renderCanvas(qrData) {
        const qrCanvas = document.getElementById('qrCanvas');
        if (!qrCanvas) return;
        const ctx = qrCanvas.getContext('2d');
        const qrImg = await this.loadImage(qrData.url);
        const size = qrImg.width; // cuadrado
        qrCanvas.width = size;
        qrCanvas.height = size;

        // Fondo blanco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        // Dibuja QR
        ctx.drawImage(qrImg, 0, 0, size, size);

        // Preparar logo si corresponde
        const logoImg = await this.getSelectedLogoImage();
        if (!logoImg) return; // sin logo

        const logoScaleEl = document.getElementById('logoScale');
        const logoRoundedEl = document.getElementById('logoRounded');
        const logoBorderEl = document.getElementById('logoBorder');
        const borderSizeEl = document.getElementById('borderSize');

        const pct = logoScaleEl ? Number(logoScaleEl.value) : 22;
        const logoSize = Math.round((pct / 100) * size);
        const x = Math.round((size - logoSize) / 2);
        const y = Math.round((size - logoSize) / 2);
        const border = logoBorderEl && logoBorderEl.checked ? (Number(borderSizeEl?.value || 0)) : 0;
        const radius = (logoRoundedEl && logoRoundedEl.checked) ? Math.max(6, Math.round(logoSize * 0.18)) : 0;

        // Marco blanco (fondo)
        if (border > 0) {
            this.drawRoundedRect(ctx, x - border, y - border, logoSize + border * 2, logoSize + border * 2, Math.max(0, radius + border / 2));
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }

        // Logo con recorte redondeado
        if (radius > 0) {
            ctx.save();
            this.drawRoundedRect(ctx, x, y, logoSize, logoSize, radius);
            ctx.clip();
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
            ctx.restore();
        } else {
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
        }
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
    }

    async getSelectedLogoImage() {
        const useDefault = document.getElementById('useDefaultLogo');
        const fileInput = document.getElementById('logoInput');
        let src = null;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            src = URL.createObjectURL(fileInput.files[0]);
        } else if (useDefault && useDefault.checked) {
            src = 'Rino-risk-logo.png';
        }
        if (!src) return null;
        return await this.loadImage(src);
    }

    async downloadQR() {
        const qrCanvas = document.getElementById('qrCanvas');
        const qrImage = document.getElementById('qrImage');
        if (!qrCanvas || qrCanvas.width === 0) {
            this.showToast('Primero genera un código QR.', 'error');
            return;
        }
        try {
            const dataUrl = qrCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `qr-code-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showToast('Código QR descargado exitosamente', 'success');
        } catch (error) {
            // Fallback: intentar descargar la imagen base
            try {
                if (qrImage && qrImage.dataset && qrImage.dataset.qrUrl) {
                    const response = await fetch(qrImage.dataset.qrUrl);
                    const blob = await response.blob();
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `qr-code-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    this.showToast('Código QR descargado (sin composición por CORS)', 'info');
                    return;
                }
            } catch {}
            this.showToast('Error al descargar el código QR', 'error');
        }
    }

    async copyLink() {
        const qrImage = document.getElementById('qrImage');
        if (!qrImage || !qrImage.dataset || !qrImage.dataset.qrUrl) {
            this.showToast('Primero genera un código QR.', 'error');
            return;
        }
        const qrUrl = qrImage.dataset.qrUrl;

        try {
            await navigator.clipboard.writeText(qrUrl);
            this.showToast('Enlace copiado al portapapeles', 'success');
        } catch (error) {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = qrUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Enlace copiado al portapapeles', 'success');
        }
    }

    saveToHistory(qrData) {
        this.history.unshift(qrData);
        
        // Mantener solo los últimos 10 QR
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        if (this.storageAvailable) {
            try {
                localStorage.setItem('qrHistory', JSON.stringify(this.history));
            } catch (error) {
                console.warn('No se pudo guardar el historial en localStorage:', error);
                this.storageAvailable = false;
            }
        }
        this.loadHistory();
    }

    loadHistory() {
        const historySection = document.getElementById('historySection');
        const historyList = document.getElementById('historyList');

        if (this.history.length === 0) {
            historySection.classList.add('d-none');
            return;
        }

        historySection.classList.remove('d-none');
        historyList.innerHTML = '';

        this.history.forEach((qrData, index) => {
            const historyItem = this.createHistoryItem(qrData, index);
            historyList.appendChild(historyItem);
        });
    }

    createHistoryItem(qrData, index) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-3';

        const date = new Date(qrData.timestamp).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body text-center">
                    <img src="${qrData.url}" alt="QR ${index + 1}" class="img-fluid mb-2" style="max-width: 100px;">
                    <h6 class="card-title">${this.truncateText(qrData.text, 30)}</h6>
                    <small class="text-muted">${date}</small>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="qrGenerator.reuseQR(${index})">
                            🔄 Reutilizar
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="qrGenerator.deleteFromHistory(${index})">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    reuseQR(index) {
        const qrData = this.history[index];
        
        // Llenar el formulario con los datos del QR
        document.getElementById('urlInput').value = qrData.text;
        document.getElementById('sizeSelect').value = qrData.size;
        document.getElementById('colorSelect').value = qrData.color;
        
        // Mostrar el QR
        this.displayQR(qrData);
        
        // Scroll al formulario
        document.getElementById('qrForm').scrollIntoView({ behavior: 'smooth' });
        
        this.showToast('QR reutilizado exitosamente', 'success');
    }

    deleteFromHistory(index) {
        this.history.splice(index, 1);
        if (this.storageAvailable) {
            try {
                localStorage.setItem('qrHistory', JSON.stringify(this.history));
            } catch (error) {
                console.warn('No se pudo actualizar el historial en localStorage:', error);
                this.storageAvailable = false;
            }
        }
        this.loadHistory();
        this.showToast('QR eliminado del historial', 'success');
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        try {
            if (toast && toastMessage && window.bootstrap && bootstrap.Toast) {
                const toastElement = new bootstrap.Toast(toast);
                // Cambiar color según el tipo
                toast.className = 'toast';
                if (type === 'success') {
                    toast.classList.add('bg-success', 'text-white');
                } else if (type === 'error') {
                    toast.classList.add('bg-danger', 'text-white');
                } else {
                    toast.classList.add('bg-info', 'text-white');
                }
                toastMessage.textContent = message;
                toastElement.show();
            } else {
                alert(message);
            }
        } catch (error) {
            alert(message);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.qrGenerator = new QRGenerator();
});

// Funciones adicionales para características extra
document.addEventListener('DOMContentLoaded', () => {
    // Auto-completar URLs comunes
    const urlInput = document.getElementById('urlInput');
    urlInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        
        // Sugerir protocolo si no está presente
        if (value && !value.startsWith('http') && !value.startsWith('mailto:') && !value.startsWith('tel:')) {
            if (value.includes('.com') || value.includes('.org') || value.includes('.net') || value.includes('.es')) {
                // No auto-completar automáticamente, solo mostrar sugerencia en placeholder
                e.target.placeholder = `https://${value}`;
            }
        }
    });

    // Permitir generar QR con Enter
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('qrForm').dispatchEvent(new Event('submit'));
        }
    });
}); 