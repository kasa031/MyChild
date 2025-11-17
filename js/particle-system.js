// Particle System for Visual Effects
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.initialized = false;
    }
    
    // Initialize particle canvas
    init(containerElement) {
        if (!containerElement) {
            return false;
        }
        
        try {
            // Create canvas for particles (overlay)
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '1000';
            this.canvas.style.borderRadius = '50%';
            
            // Set canvas size
            const rect = containerElement.getBoundingClientRect();
            this.canvas.width = rect.width || 200;
            this.canvas.height = rect.height || 200;
            
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                return false;
            }
            
            // Append to container
            containerElement.style.position = 'relative';
            containerElement.appendChild(this.canvas);
            
            this.initialized = true;
            return true;
        } catch (e) {
            console.warn('Particle system initialization failed:', e);
            return false;
        }
    }
    
    // Create particles for different effects
    createEffect(type, count = 20) {
        if (!this.initialized) return;
        
        const colors = {
            happy: ['#FFD700', '#FFA500', '#FF6B6B', '#FFE66D'],
            sad: ['#87CEEB', '#B0C4DE', '#708090'],
            excited: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF1493'],
            achievement: ['#FFD700', '#FFA500', '#FF6B6B'],
            statIncrease: ['#4CAF50', '#8BC34A', '#CDDC39'],
            statDecrease: ['#F44336', '#E91E63', '#9C27B0']
        };
        
        const effectColors = colors[type] || colors.happy;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2, // Slight upward bias
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                size: 3 + Math.random() * 4,
                color: effectColors[Math.floor(Math.random() * effectColors.length)],
                type: type
            });
        }
        
        this.animate();
    }
    
    // Create heart particles (for happy emotions)
    createHearts(count = 15) {
        if (!this.initialized) return;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 3 - 1,
                life: 1.0,
                decay: 0.015 + Math.random() * 0.01,
                size: 4 + Math.random() * 3,
                color: '#FF69B4',
                type: 'heart',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });
        }
        
        this.animate();
    }
    
    // Create sparkle effect (for achievements)
    createSparkles(count = 30) {
        if (!this.initialized) return;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1.0,
                decay: 0.01 + Math.random() * 0.01,
                size: 2 + Math.random() * 3,
                color: '#FFD700',
                type: 'sparkle',
                twinkle: Math.random() * Math.PI * 2
            });
        }
        
        this.animate();
    }
    
    // Create stat change effect
    createStatEffect(statType, isPositive) {
        if (!this.initialized) return;
        
        const colors = isPositive 
            ? ['#4CAF50', '#8BC34A', '#CDDC39']
            : ['#F44336', '#E91E63', '#9C27B0'];
        
        const count = isPositive ? 15 : 10;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 2 - 1,
                life: 1.0,
                decay: 0.02,
                size: 2 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'stat',
                symbol: isPositive ? '+' : '-'
            });
        }
        
        this.animate();
    }
    
    // Animate particles
    animate() {
        if (this.animationId) return; // Already animating
        
        const animate = () => {
            if (this.particles.length === 0) {
                this.animationId = null;
                return;
            }
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and draw particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                
                // Apply gravity for some particles
                if (p.type !== 'heart') {
                    p.vy += 0.1;
                }
                
                // Update life
                p.life -= p.decay;
                
                // Update rotation for hearts
                if (p.rotation !== undefined) {
                    p.rotation += p.rotationSpeed || 0;
                }
                
                // Update twinkle for sparkles
                if (p.twinkle !== undefined) {
                    p.twinkle += 0.2;
                }
                
                // Draw particle
                this.ctx.save();
                this.ctx.globalAlpha = p.life;
                
                if (p.type === 'heart') {
                    this.drawHeart(p.x, p.y, p.size, p.color, p.rotation);
                } else if (p.type === 'sparkle') {
                    this.drawSparkle(p.x, p.y, p.size, p.color, p.twinkle);
                } else if (p.type === 'stat' && p.symbol) {
                    this.drawSymbol(p.x, p.y, p.size, p.color, p.symbol);
                } else {
                    // Regular circle particle
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = p.color;
                    this.ctx.fill();
                }
                
                this.ctx.restore();
                
                // Remove dead particles
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
            
            if (this.particles.length > 0) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.animationId = null;
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    // Draw heart shape
    drawHeart(x, y, size, color, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.scale(size / 10, size / 10);
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-5, -5, -10, -5, -10, 0);
        this.ctx.bezierCurveTo(-10, 5, -5, 10, 0, 15);
        this.ctx.bezierCurveTo(5, 10, 10, 5, 10, 0);
        this.ctx.bezierCurveTo(10, -5, 5, -5, 0, 0);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    // Draw sparkle
    drawSparkle(x, y, size, color, twinkle) {
        const brightness = 0.5 + Math.sin(twinkle) * 0.5;
        this.ctx.save();
        this.ctx.globalAlpha *= brightness;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        
        // Draw cross
        this.ctx.beginPath();
        this.ctx.moveTo(x - size, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
        this.ctx.stroke();
        
        // Draw diagonal lines
        this.ctx.beginPath();
        this.ctx.moveTo(x - size * 0.7, y - size * 0.7);
        this.ctx.lineTo(x + size * 0.7, y + size * 0.7);
        this.ctx.moveTo(x - size * 0.7, y + size * 0.7);
        this.ctx.lineTo(x + size * 0.7, y - size * 0.7);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    // Draw symbol (+ or -)
    drawSymbol(x, y, size, color, symbol) {
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${size * 3}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(symbol, x, y);
    }
    
    // Clean up
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.initialized = false;
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.ParticleSystem = ParticleSystem;
}

