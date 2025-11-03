// API Configuration Example
// Copy this file to api-config.js and fill in your API details

const APIConfig = {
    // Image/Illustration API settings
    imageAPI: {
        enabled: false, // Set to true when configured
        provider: null, // 'dalle', 'midjourney', 'stable-diffusion', 'custom', etc.
        apiKey: '', // Your API key here
        baseURL: '', // API endpoint URL
        
        // Professional illustration style
        style: 'professional watercolor illustration, warm colors, 2000s aesthetic, detailed, artistic',
        
        // Function to generate image URL
        generateImage: async function(prompt, location) {
            const fullPrompt = `${prompt}, ${this.style}, high quality illustration`;
            
            if (this.provider === 'dalle') {
                return await this.callDALLE(fullPrompt);
            } else if (this.provider === 'stable-diffusion') {
                return await this.callStableDiffusion(fullPrompt);
            } else if (this.provider === 'custom') {
                return await this.callCustomAPI(fullPrompt, location);
            }
            
            return null;
        },
        
        // Example: OpenAI DALL-E implementation
        callDALLE: async function(prompt) {
            try {
                const response = await fetch('https://api.openai.com/v1/images/generations', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'dall-e-3',
                        prompt: prompt,
                        n: 1,
                        size: '1024x1024',
                        quality: 'standard',
                        style: 'natural'
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const data = await response.json();
                return data.data[0].url;
            } catch (error) {
                console.error('DALL-E API error:', error);
                return null;
            }
        },
        
        // Example: Stable Diffusion implementation
        callStableDiffusion: async function(prompt) {
            try {
                const response = await fetch(`${this.baseURL || 'https://api.stability.ai'}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text_prompts: [
                            { text: prompt, weight: 1 },
                            { text: 'cartoon, low quality, blurry', weight: -1 }
                        ],
                        cfg_scale: 7,
                        height: 768,
                        width: 1024,
                        steps: 30,
                        samples: 1
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const data = await response.json();
                return data.artifacts[0].base64 ? 
                    `data:image/png;base64,${data.artifacts[0].base64}` : 
                    data.artifacts[0].url;
            } catch (error) {
                console.error('Stable Diffusion API error:', error);
                return null;
            }
        },
        
        // Custom API implementation
        callCustomAPI: async function(prompt, location) {
            try {
                const response = await fetch(`${this.baseURL}/generate`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        prompt: prompt, 
                        location: location,
                        style: 'professional illustration',
                        quality: 'high'
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const data = await response.json();
                return data.imageUrl || data.url || data.image;
            } catch (error) {
                console.error('Custom API error:', error);
                return null;
            }
        }
    },
    
    // Animation API settings (for character animations)
    animationAPI: {
        enabled: false,
        provider: null, // 'lottie', 'rive', 'custom', etc.
        apiKey: '',
        baseURL: '',
        
        getAnimation: async function(emotion, age) {
            if (this.provider === 'lottie') {
                return await this.getLottieAnimation(emotion, age);
            } else if (this.provider === 'custom') {
                return await this.getCustomAnimation(emotion, age);
            }
            return null;
        },
        
        getLottieAnimation: async function(emotion, age) {
            // Lottie animation URLs or JSON
            const animations = {
                happy: 'https://lottie.host/embed/...',
                sad: 'https://lottie.host/embed/...',
                neutral: 'https://lottie.host/embed/...'
            };
            return animations[emotion] || null;
        },
        
        getCustomAnimation: async function(emotion, age) {
            try {
                const response = await fetch(`${this.baseURL}/animation`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        emotion: emotion,
                        age: age,
                        style: 'professional illustration'
                    })
                });
                
                const data = await response.json();
                return data.animationUrl || data.url;
            } catch (error) {
                console.error('Animation API error:', error);
                return null;
            }
        }
    },
    
    // Scene image prompts for different locations
    scenePrompts: {
        home: 'A cozy home interior from the 2000s, warm lighting, family living room, professional watercolor illustration style',
        school: 'A school building from the 2000s, exterior view, friendly atmosphere, professional illustration',
        playground: 'A playground from the 2000s, children playing, colorful equipment, professional illustration style',
        friend: "A friend's house exterior from the 2000s, welcoming neighborhood, professional illustration"
    },
    
    // Character prompts for different emotions/ages
    characterPrompts: {
        happy: 'A happy child, age {age}, smiling, cheerful expression, 2000s clothing, professional watercolor illustration',
        sad: 'A thoughtful child, age {age}, calm expression, 2000s clothing, professional illustration style',
        hungry: 'A tired child, age {age}, looking slightly worried, 2000s clothing, professional illustration',
        neutral: 'A child, age {age}, calm expression, 2000s clothing, professional watercolor illustration style'
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.APIConfig = APIConfig;
}

