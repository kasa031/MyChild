// Character Renderer - Creates custom SVG illustrations for characters
class CharacterRenderer {
    constructor() {
        this.emojiFallback = true;
    }
    
    renderCharacter(character, emotion = 'neutral') {
        // Create SVG illustration based on character customization
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 200 200');
        svg.setAttribute('width', '200');
        svg.setAttribute('height', '200');
        svg.style.width = '100%';
        svg.style.height = '100%';
        
        // Background circle
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bg.setAttribute('cx', '100');
        bg.setAttribute('cy', '100');
        bg.setAttribute('r', '95');
        bg.setAttribute('fill', this.getSkinColor(character));
        bg.setAttribute('stroke', '#ddd');
        bg.setAttribute('stroke-width', '2');
        svg.appendChild(bg);
        
        // Face features based on emotion
        this.addFaceFeatures(svg, character, emotion);
        
        // Hair based on customization
        this.addHair(svg, character);
        
        // Accessories (caps, etc.)
        if (character.style === 'cap') {
            this.addCap(svg, character);
        }
        
        return svg;
    }
    
    getSkinColor(character) {
        // Default skin tones - can be customized
        const tones = {
            light: '#fdbcb4',
            medium: '#e0a080',
            dark: '#c68642'
        };
        return tones.light; // Default, can be expanded
    }
    
    addFaceFeatures(svg, character, emotion) {
        const cx = 100;
        const cy = 100;
        
        // Eyes
        const eyeY = emotion === 'sad' ? cy - 15 : cy - 20;
        const eyeSize = emotion === 'surprised' ? 8 : 6;
        
        // Left eye
        const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        leftEye.setAttribute('cx', cx - 15);
        leftEye.setAttribute('cy', eyeY);
        leftEye.setAttribute('r', eyeSize);
        leftEye.setAttribute('fill', this.getEyeColor(character.eyeColor));
        svg.appendChild(leftEye);
        
        // Right eye
        const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        rightEye.setAttribute('cx', cx + 15);
        rightEye.setAttribute('cy', eyeY);
        rightEye.setAttribute('r', eyeSize);
        rightEye.setAttribute('fill', this.getEyeColor(character.eyeColor));
        svg.appendChild(rightEye);
        
        // Eye highlights
        const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        highlight.setAttribute('cx', cx - 12);
        highlight.setAttribute('cy', eyeY - 2);
        highlight.setAttribute('r', '2');
        highlight.setAttribute('fill', '#fff');
        svg.appendChild(highlight);
        
        const highlight2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        highlight2.setAttribute('cx', cx + 18);
        highlight2.setAttribute('cy', eyeY - 2);
        highlight2.setAttribute('r', '2');
        highlight2.setAttribute('fill', '#fff');
        svg.appendChild(highlight2);
        
        // Mouth based on emotion
        this.addMouth(svg, cx, cy + 15, emotion);
        
        // Eyebrows
        const eyebrowY = eyeY - 12;
        if (emotion === 'angry') {
            // Angry eyebrows
            const leftBrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leftBrow.setAttribute('d', `M ${cx - 25} ${eyebrowY} L ${cx - 10} ${eyebrowY - 5}`);
            leftBrow.setAttribute('stroke', '#333');
            leftBrow.setAttribute('stroke-width', '3');
            leftBrow.setAttribute('fill', 'none');
            leftBrow.setAttribute('stroke-linecap', 'round');
            svg.appendChild(leftBrow);
            
            const rightBrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            rightBrow.setAttribute('d', `M ${cx + 10} ${eyebrowY - 5} L ${cx + 25} ${eyebrowY}`);
            rightBrow.setAttribute('stroke', '#333');
            rightBrow.setAttribute('stroke-width', '3');
            rightBrow.setAttribute('fill', 'none');
            rightBrow.setAttribute('stroke-linecap', 'round');
            svg.appendChild(rightBrow);
        } else if (emotion === 'sad') {
            // Sad eyebrows
            const leftBrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leftBrow.setAttribute('d', `M ${cx - 25} ${eyebrowY - 3} L ${cx - 10} ${eyebrowY}`);
            leftBrow.setAttribute('stroke', '#333');
            leftBrow.setAttribute('stroke-width', '3');
            leftBrow.setAttribute('fill', 'none');
            leftBrow.setAttribute('stroke-linecap', 'round');
            svg.appendChild(leftBrow);
            
            const rightBrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            rightBrow.setAttribute('d', `M ${cx + 10} ${eyebrowY} L ${cx + 25} ${eyebrowY - 3}`);
            rightBrow.setAttribute('stroke', '#333');
            rightBrow.setAttribute('stroke-width', '3');
            rightBrow.setAttribute('fill', 'none');
            rightBrow.setAttribute('stroke-linecap', 'round');
            svg.appendChild(rightBrow);
        } else {
            // Normal eyebrows
            const leftBrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leftBrow.setAttribute('d', `M ${cx - 25} ${eyebrowY} L ${cx - 10} ${eyebrowY}`);
            leftBrow.setAttribute('stroke', '#333');
            leftBrow.setAttribute('stroke-width', '3');
            leftBrow.setAttribute('fill', 'none');
            leftBrow.setAttribute('stroke-linecap', 'round');
            svg.appendChild(leftBrow);
            
            const rightBrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            rightBrow.setAttribute('d', `M ${cx + 10} ${eyebrowY} L ${cx + 25} ${eyebrowY}`);
            rightBrow.setAttribute('stroke', '#333');
            rightBrow.setAttribute('stroke-width', '3');
            rightBrow.setAttribute('fill', 'none');
            rightBrow.setAttribute('stroke-linecap', 'round');
            svg.appendChild(rightBrow);
        }
        
        // Blush for embarrassed or happy
        if (emotion === 'embarrassed' || emotion === 'happy') {
            const blush1 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            blush1.setAttribute('cx', cx - 25);
            blush1.setAttribute('cy', cy + 5);
            blush1.setAttribute('rx', '8');
            blush1.setAttribute('ry', '5');
            blush1.setAttribute('fill', '#ffb3d9');
            blush1.setAttribute('opacity', '0.6');
            svg.appendChild(blush1);
            
            const blush2 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            blush2.setAttribute('cx', cx + 25);
            blush2.setAttribute('cy', cy + 5);
            blush2.setAttribute('rx', '8');
            blush2.setAttribute('ry', '5');
            blush2.setAttribute('fill', '#ffb3d9');
            blush2.setAttribute('opacity', '0.6');
            svg.appendChild(blush2);
        }
    }
    
    addMouth(svg, cx, cy, emotion) {
        const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let mouthPath = '';
        
        if (emotion === 'happy') {
            // Smile
            mouthPath = `M ${cx - 15} ${cy} Q ${cx} ${cy + 10} ${cx + 15} ${cy}`;
            mouth.setAttribute('stroke', '#333');
            mouth.setAttribute('stroke-width', '3');
            mouth.setAttribute('fill', 'none');
            mouth.setAttribute('stroke-linecap', 'round');
        } else if (emotion === 'sad') {
            // Frown
            mouthPath = `M ${cx - 15} ${cy} Q ${cx} ${cy - 10} ${cx + 15} ${cy}`;
            mouth.setAttribute('stroke', '#333');
            mouth.setAttribute('stroke-width', '3');
            mouth.setAttribute('fill', 'none');
            mouth.setAttribute('stroke-linecap', 'round');
        } else if (emotion === 'surprised') {
            // Open mouth (circle)
            const openMouth = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            openMouth.setAttribute('cx', cx);
            openMouth.setAttribute('cy', cy + 5);
            openMouth.setAttribute('rx', '8');
            openMouth.setAttribute('ry', '10');
            openMouth.setAttribute('fill', '#333');
            svg.appendChild(openMouth);
            return;
        } else if (emotion === 'angry') {
            // Angry mouth (straight line)
            mouthPath = `M ${cx - 12} ${cy} L ${cx + 12} ${cy}`;
            mouth.setAttribute('stroke', '#333');
            mouth.setAttribute('stroke-width', '3');
            mouth.setAttribute('fill', 'none');
        } else {
            // Neutral
            mouthPath = `M ${cx - 12} ${cy} L ${cx + 12} ${cy}`;
            mouth.setAttribute('stroke', '#333');
            mouth.setAttribute('stroke-width', '2');
            mouth.setAttribute('fill', 'none');
        }
        
        if (mouthPath) {
            mouth.setAttribute('d', mouthPath);
            svg.appendChild(mouth);
        }
    }
    
    addHair(svg, character) {
        const hairColor = this.getHairColor(character.hairColor);
        const cx = 100;
        const cy = 100;
        
        // Different hair styles based on customization
        if (character.style === 'cap') {
            return; // Don't draw hair if wearing cap
        }
        
        // Simple hair style - can be expanded
        const hair = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        if (character.gender === 'girl') {
            // Long hair for girls
            hair.setAttribute('d', `M ${cx - 30} ${cy - 40} 
                Q ${cx - 40} ${cy - 20} ${cx - 35} ${cy + 10}
                Q ${cx - 30} ${cy + 30} ${cx - 20} ${cy + 40}
                L ${cx + 20} ${cy + 40}
                Q ${cx + 30} ${cy + 30} ${cx + 35} ${cy + 10}
                Q ${cx + 40} ${cy - 20} ${cx + 30} ${cy - 40}
                Q ${cx} ${cy - 50} ${cx - 30} ${cy - 40} Z`);
        } else {
            // Short hair for boys
            hair.setAttribute('d', `M ${cx - 30} ${cy - 40} 
                Q ${cx - 35} ${cy - 30} ${cx - 30} ${cy - 20}
                L ${cx - 30} ${cy - 10}
                L ${cx + 30} ${cy - 10}
                L ${cx + 30} ${cy - 20}
                Q ${cx + 35} ${cy - 30} ${cx + 30} ${cy - 40}
                Q ${cx} ${cy - 50} ${cx - 30} ${cy - 40} Z`);
        }
        
        hair.setAttribute('fill', hairColor);
        hair.setAttribute('stroke', '#333');
        hair.setAttribute('stroke-width', '1');
        svg.appendChild(hair);
    }
    
    addCap(svg, character) {
        const cx = 100;
        const cy = 100;
        
        // Cap/hat
        const cap = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cap.setAttribute('d', `M ${cx - 35} ${cy - 35} 
            Q ${cx} ${cy - 50} ${cx + 35} ${cy - 35}
            L ${cx + 35} ${cy - 25}
            L ${cx - 35} ${cy - 25} Z`);
        cap.setAttribute('fill', '#4a90e2');
        cap.setAttribute('stroke', '#333');
        cap.setAttribute('stroke-width', '2');
        svg.appendChild(cap);
        
        // Cap brim
        const brim = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        brim.setAttribute('cx', cx);
        brim.setAttribute('cy', cy - 25);
        brim.setAttribute('rx', '40');
        brim.setAttribute('ry', '5');
        brim.setAttribute('fill', '#2d5aa0');
        brim.setAttribute('stroke', '#333');
        brim.setAttribute('stroke-width', '2');
        svg.appendChild(brim);
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
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.CharacterRenderer = CharacterRenderer;
}

