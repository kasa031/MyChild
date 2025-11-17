// Canvas API Character Renderer - High-performance 2D rendering
class CanvasCharacterRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.initialized = false;
    }
    
    // Initialize Canvas
    init(containerElement) {
        if (!containerElement) {
            console.warn('No container element provided for Canvas renderer');
            return false;
        }
        
        try {
            // Clear container first
            containerElement.innerHTML = '';
            
            // Create canvas element
            this.canvas = document.createElement('canvas');
            this.canvas.width = 200;
            this.canvas.height = 200;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.borderRadius = '50%';
            this.canvas.style.display = 'block';
            
            // Get 2D context
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                console.warn('Canvas 2D context not available');
                return false;
            }
            
            // Enable image smoothing for better quality
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            
            // Append canvas to container
            containerElement.appendChild(this.canvas);
            
            this.initialized = true;
            return true;
        } catch (e) {
            console.warn('Canvas initialization failed:', e);
            return false;
        }
    }
    
    // Render character with Canvas API
    renderCharacter(character, emotion = 'neutral') {
        if (!this.initialized || !this.ctx) {
            return null;
        }
        
        try {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw face circle
            this.drawFace(character);
            
            // Draw hair
            this.drawHair(character);
            
            // Draw face features
            this.drawFaceFeatures(character, emotion);
            
            // Apply emotion filters
            this.applyEmotionFilters(emotion);
            
            return this.canvas;
        } catch (e) {
            console.warn('Canvas rendering failed:', e);
            return null;
        }
    }
    
    drawFace(character) {
        const cx = 100;
        const cy = 100;
        const radius = 95;
        
        // Face circle with gradient
        const gradient = this.ctx.createRadialGradient(cx - 20, cy - 20, 0, cx, cy, radius);
        const skinColor = this.getSkinColor(character);
        gradient.addColorStop(0, this.lightenColor(skinColor, 0.2));
        gradient.addColorStop(1, skinColor);
        
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Add shadow for depth
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // Add highlight
        const highlightGradient = this.ctx.createRadialGradient(cx - 25, cy - 25, 0, cx - 25, cy - 25, 30);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = highlightGradient;
        this.ctx.beginPath();
        this.ctx.arc(cx - 25, cy - 25, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Border
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawHair(character) {
        const hairColor = this.getHairColor(character.hairColor);
        const cx = 100;
        const cy = 100;
        
        // Add hair highlight for depth
        const highlightColor = this.lightenColor(hairColor, 0.2);
        this.ctx.fillStyle = highlightColor;
        this.ctx.beginPath();
        
        if (character.gender === 'girl') {
            // Long hair highlight
            this.ctx.ellipse(cx - 5, cy - 5, 30, 45, 0, 0, Math.PI * 2);
        } else {
            // Short hair highlight
            this.ctx.ellipse(cx - 5, cy - 25, 25, 18, 0, 0, Math.PI * 2);
        }
        this.ctx.fill();
        
        // Main hair
        this.ctx.fillStyle = hairColor;
        this.ctx.beginPath();
        
        if (character.gender === 'girl') {
            // Long hair for girls
            this.ctx.ellipse(cx, cy, 35, 50, 0, 0, Math.PI * 2);
        } else {
            // Short hair for boys
            this.ctx.ellipse(cx, cy - 20, 30, 20, 0, 0, Math.PI * 2);
        }
        
        this.ctx.fill();
    }
    
    drawFaceFeatures(character, emotion) {
        const cx = 100;
        const cy = 100;
        
        // Eyes
        const eyeY = emotion === 'sad' ? cy - 15 : cy - 20;
        const eyeColor = this.getEyeColor(character.eyeColor);
        
        // Left eye
        this.ctx.beginPath();
        this.ctx.arc(cx - 15, eyeY, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = eyeColor;
        this.ctx.fill();
        
        // Right eye
        this.ctx.beginPath();
        this.ctx.arc(cx + 15, eyeY, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eye highlights
        this.ctx.beginPath();
        this.ctx.arc(cx - 12, eyeY - 2, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(cx + 18, eyeY - 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Mouth
        this.drawMouth(cx, cy + 15, emotion);
        
        // Eyebrows
        this.drawEyebrows(cx, eyeY - 12, emotion);
        
        // Blush for certain emotions
        if (emotion === 'embarrassed' || emotion === 'happy') {
            this.ctx.fillStyle = 'rgba(255, 179, 217, 0.6)';
            this.ctx.beginPath();
            this.ctx.ellipse(cx - 25, cy + 5, 8, 5, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.ellipse(cx + 25, cy + 5, 8, 5, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawMouth(cx, cy, emotion) {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        
        if (emotion === 'happy') {
            this.ctx.moveTo(cx - 15, cy);
            this.ctx.quadraticCurveTo(cx, cy + 10, cx + 15, cy);
        } else if (emotion === 'sad') {
            this.ctx.moveTo(cx - 15, cy);
            this.ctx.quadraticCurveTo(cx, cy - 10, cx + 15, cy);
        } else {
            this.ctx.moveTo(cx - 12, cy);
            this.ctx.lineTo(cx + 12, cy);
        }
        
        this.ctx.stroke();
    }
    
    drawEyebrows(cx, y, emotion) {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        
        if (emotion === 'angry') {
            this.ctx.moveTo(cx - 25, y);
            this.ctx.lineTo(cx - 10, y - 5);
            this.ctx.moveTo(cx + 10, y - 5);
            this.ctx.lineTo(cx + 25, y);
        } else if (emotion === 'sad') {
            this.ctx.moveTo(cx - 25, y - 3);
            this.ctx.lineTo(cx - 10, y);
            this.ctx.moveTo(cx + 10, y);
            this.ctx.lineTo(cx + 25, y - 3);
        } else {
            this.ctx.moveTo(cx - 25, y);
            this.ctx.lineTo(cx - 10, y);
            this.ctx.moveTo(cx + 10, y);
            this.ctx.lineTo(cx + 25, y);
        }
        
        this.ctx.stroke();
    }
    
    applyEmotionFilters(emotion) {
        // Canvas filters are applied via globalCompositeOperation and color adjustments
        // For more advanced effects, we can use imageData manipulation
        if (emotion === 'happy') {
            this.ctx.globalAlpha = 1.0;
            // Brighten effect
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.adjustBrightness(imageData, 1.1);
            this.adjustSaturation(imageData, 1.15);
            this.ctx.putImageData(imageData, 0, 0);
        } else if (emotion === 'sad') {
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.adjustBrightness(imageData, 0.9);
            this.adjustSaturation(imageData, 0.85);
            this.ctx.putImageData(imageData, 0, 0);
        }
    }
    
    adjustBrightness(imageData, factor) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * factor);     // R
            data[i + 1] = Math.min(255, data[i + 1] * factor); // G
            data[i + 2] = Math.min(255, data[i + 2] * factor); // B
        }
    }
    
    adjustSaturation(imageData, factor) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = r * 0.299 + g * 0.587 + b * 0.114;
            
            data[i] = Math.min(255, gray + (r - gray) * factor);
            data[i + 1] = Math.min(255, gray + (g - gray) * factor);
            data[i + 2] = Math.min(255, gray + (b - gray) * factor);
        }
    }
    
    lightenColor(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, ((num >> 16) & 0xff) + amount * 255);
        const g = Math.min(255, ((num >> 8) & 0xff) + amount * 255);
        const b = Math.min(255, (num & 0xff) + amount * 255);
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    
    getSkinColor(character) {
        const tones = {
            light: '#fdbcb4',
            medium: '#e0a080',
            dark: '#c68642'
        };
        return tones.light;
    }
    
    getHairColor(color) {
        const colors = {
            blonde: '#f4d03f',
            brown: '#8b4513',
            black: '#1a1a1a',
            red: '#a0522d',
            other: '#654321'
        };
        return colors[color] || colors.brown;
    }
    
    getEyeColor(color) {
        const colors = {
            blue: '#4a90e2',
            brown: '#8b4513',
            green: '#228b22',
            hazel: '#daa520',
            gray: '#808080'
        };
        return colors[color] || colors.brown;
    }
    
    // Clean up
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.ctx = null;
        this.initialized = false;
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.CanvasCharacterRenderer = CanvasCharacterRenderer;
}

