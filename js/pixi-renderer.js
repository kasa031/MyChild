// Pixi.js Character Renderer - Enhanced 2D graphics with hardware acceleration
class PixiCharacterRenderer {
    constructor() {
        this.app = null;
        this.container = null;
        this.characterSprite = null;
        this.initialized = false;
    }
    
    // Initialize Pixi.js application
    init(containerElement) {
        if (!window.PIXI) {
            console.warn('Pixi.js not loaded, falling back to SVG renderer');
            return false;
        }
        
        if (!containerElement) {
            console.warn('No container element provided for Pixi.js');
            return false;
        }
        
        try {
            // Clear container first
            containerElement.innerHTML = '';
            
            // Create Pixi application
            this.app = new PIXI.Application({
                width: 200,
                height: 200,
                backgroundColor: 0xf5f5f5,
                antialias: true,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                transparent: false
            });
            
            // Append canvas to container
            containerElement.appendChild(this.app.view);
            this.app.view.style.width = '100%';
            this.app.view.style.height = '100%';
            this.app.view.style.borderRadius = '50%';
            this.app.view.style.display = 'block';
            
            this.container = new PIXI.Container();
            this.app.stage.addChild(this.container);
            
            this.initialized = true;
            return true;
        } catch (e) {
            console.warn('Pixi.js initialization failed:', e);
            return false;
        }
    }
    
    // Render character with Pixi.js
    renderCharacter(character, emotion = 'neutral') {
        if (!this.initialized || !this.app) {
            return null;
        }
        
        try {
            // Clear previous character
            this.container.removeChildren();
            
            // Create character graphics
            const graphics = new PIXI.Graphics();
            
            // Draw face circle with gradient effect
            const faceColor = this.getSkinColor(character);
            // Create gradient-like effect using multiple circles
            graphics.beginFill(this.lightenColor(faceColor, 0.15));
            graphics.drawCircle(100, 100, 95);
            graphics.endFill();
            
            // Add highlight for 3D effect
            graphics.beginFill(0xffffff, 0.3);
            graphics.drawCircle(85, 85, 25);
            graphics.endFill();
            
            // Base face color
            graphics.beginFill(faceColor);
            graphics.drawCircle(100, 100, 95);
            graphics.endFill();
            
            // Draw hair
            this.drawHair(graphics, character);
            
            // Draw face features
            this.drawFaceFeatures(graphics, character, emotion);
            
            // Add graphics to container
            this.container.addChild(graphics);
            
            // Apply filters based on emotion
            this.applyEmotionFilters(emotion);
            
            return this.app.view;
        } catch (e) {
            console.warn('Pixi.js rendering failed:', e);
            return null;
        }
    }
    
    drawHair(graphics, character) {
        const hairColor = this.getHairColor(character.hairColor);
        graphics.beginFill(hairColor);
        
        if (character.gender === 'girl') {
            // Long hair for girls
            graphics.drawEllipse(100, 100, 35, 50);
        } else {
            // Short hair for boys
            graphics.drawEllipse(100, 80, 30, 20);
        }
        
        graphics.endFill();
    }
    
    drawFaceFeatures(graphics, character, emotion) {
        const cx = 100;
        const cy = 100;
        
        // Eyes
        const eyeY = emotion === 'sad' ? cy - 15 : cy - 20;
        const eyeColor = this.getEyeColor(character.eyeColor);
        
        graphics.beginFill(eyeColor);
        graphics.drawCircle(cx - 15, eyeY, 6);
        graphics.drawCircle(cx + 15, eyeY, 6);
        graphics.endFill();
        
        // Eye highlights
        graphics.beginFill(0xffffff);
        graphics.drawCircle(cx - 12, eyeY - 2, 2);
        graphics.drawCircle(cx + 18, eyeY - 2, 2);
        graphics.endFill();
        
        // Mouth
        this.drawMouth(graphics, cx, cy + 15, emotion);
        
        // Eyebrows
        this.drawEyebrows(graphics, cx, eyeY - 12, emotion);
        
        // Blush for certain emotions
        if (emotion === 'embarrassed' || emotion === 'happy') {
            graphics.beginFill(0xffb3d9, 0.6);
            graphics.drawEllipse(cx - 25, cy + 5, 8, 5);
            graphics.drawEllipse(cx + 25, cy + 5, 8, 5);
            graphics.endFill();
        }
    }
    
    drawMouth(graphics, cx, cy, emotion) {
        graphics.lineStyle(3, 0x333333, 1);
        graphics.lineCap = 'round';
        
        if (emotion === 'happy') {
            graphics.moveTo(cx - 15, cy);
            graphics.quadraticCurveTo(cx, cy + 10, cx + 15, cy);
        } else if (emotion === 'sad') {
            graphics.moveTo(cx - 15, cy);
            graphics.quadraticCurveTo(cx, cy - 10, cx + 15, cy);
        } else {
            graphics.moveTo(cx - 12, cy);
            graphics.lineTo(cx + 12, cy);
        }
    }
    
    drawEyebrows(graphics, cx, y, emotion) {
        graphics.lineStyle(3, 0x333333);
        
        if (emotion === 'angry') {
            graphics.moveTo(cx - 25, y);
            graphics.lineTo(cx - 10, y - 5);
            graphics.moveTo(cx + 10, y - 5);
            graphics.lineTo(cx + 25, y);
        } else if (emotion === 'sad') {
            graphics.moveTo(cx - 25, y - 3);
            graphics.lineTo(cx - 10, y);
            graphics.moveTo(cx + 10, y);
            graphics.lineTo(cx + 25, y - 3);
        } else {
            graphics.moveTo(cx - 25, y);
            graphics.lineTo(cx - 10, y);
            graphics.moveTo(cx + 10, y);
            graphics.lineTo(cx + 25, y);
        }
    }
    
    applyEmotionFilters(emotion) {
        if (!this.container || !window.PIXI || !window.PIXI.filters) return;
        
        // Remove existing filters
        this.container.filters = [];
        
        try {
            // Add filters based on emotion
            if (emotion === 'happy') {
                const colorMatrix = new PIXI.filters.ColorMatrixFilter();
                colorMatrix.brightness(1.1, false);
                colorMatrix.saturate(1.15, false);
                this.container.filters = [colorMatrix];
            } else if (emotion === 'sad') {
                const colorMatrix = new PIXI.filters.ColorMatrixFilter();
                colorMatrix.brightness(0.9, false);
                colorMatrix.saturate(0.85, false);
                this.container.filters = [colorMatrix];
            } else if (emotion === 'angry') {
                const colorMatrix = new PIXI.filters.ColorMatrixFilter();
                colorMatrix.brightness(1.05, false);
                colorMatrix.saturate(1.2, false);
                colorMatrix.hue(5, false);
                this.container.filters = [colorMatrix];
            } else if (emotion === 'excited') {
                const colorMatrix = new PIXI.filters.ColorMatrixFilter();
                colorMatrix.brightness(1.15, false);
                colorMatrix.saturate(1.2, false);
                this.container.filters = [colorMatrix];
            }
        } catch (e) {
            console.warn('Failed to apply Pixi.js filters:', e);
        }
    }
    
    lightenColor(hex, amount) {
        const num = parseInt(hex.toString(16), 16);
        const r = Math.min(255, ((num >> 16) & 0xff) + amount * 255);
        const g = Math.min(255, ((num >> 8) & 0xff) + amount * 255);
        const b = Math.min(255, (num & 0xff) + amount * 255);
        return (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
    }
    
    getSkinColor(character) {
        const tones = {
            light: 0xfdbcb4,
            medium: 0xe0a080,
            dark: 0xc68642
        };
        return tones.light;
    }
    
    getHairColor(color) {
        const colors = {
            blonde: 0xf4d03f,
            brown: 0x8b4513,
            black: 0x1a1a1a,
            red: 0xa0522d,
            other: 0x654321
        };
        return colors[color] || colors.brown;
    }
    
    getEyeColor(color) {
        const colors = {
            blue: 0x4a90e2,
            brown: 0x8b4513,
            green: 0x228b22,
            hazel: 0xdaa520,
            gray: 0x808080
        };
        return colors[color] || colors.brown;
    }
    
    // Clean up
    destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true });
            this.app = null;
        }
        this.container = null;
        this.initialized = false;
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.PixiCharacterRenderer = PixiCharacterRenderer;
}

