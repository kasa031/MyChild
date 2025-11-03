# API Setup Guide

## Hvordan sette opp API for profesjonelle tegninger og animasjoner

### Steg 1: Velg API-provider

Spillet støtter flere API-providers:
- **OpenAI DALL-E** - For profesjonelle illustrasjoner
- **Stable Diffusion** - For kunstige tegninger
- **Lottie** - For animasjoner
- **Custom API** - Din egen API

### Steg 2: Konfigurer API

Åpne `api-config.js` og fyll ut:

```javascript
imageAPI: {
    enabled: true, // Sett til true
    provider: 'dalle', // eller 'stable-diffusion', 'custom', etc.
    apiKey: 'din-api-nøkkel-her',
    baseURL: 'https://api.provider.com', // Hvis nødvendig
    // ...
}
```

### Steg 3: Implementer API-kall

I `api-config.js`, implementer funksjonene basert på din API:

#### For DALL-E (OpenAI):
```javascript
callDALLE: async function(prompt) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: '1024x1024'
        })
    });
    const data = await response.json();
    return data.data[0].url;
}
```

#### For Custom API:
```javascript
callCustomAPI: async function(prompt, location) {
    const response = await fetch(`${this.baseURL}/generate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            prompt: prompt, 
            location: location,
            style: 'professional illustration'
        })
    });
    const data = await response.json();
    return data.imageUrl;
}
```

### Steg 4: Aktiver animasjoner (valgfritt)

For animasjoner, konfigurer `animationAPI`:

```javascript
animationAPI: {
    enabled: true,
    provider: 'lottie', // eller 'custom'
    apiKey: 'din-api-nøkkel',
    // ...
}
```

### Eksempel på komplette API-konfigurasjoner

#### OpenAI DALL-E:
```javascript
imageAPI: {
    enabled: true,
    provider: 'dalle',
    apiKey: 'sk-...',
    baseURL: 'https://api.openai.com/v1',
    style: 'professional watercolor illustration, warm colors, 2000s aesthetic',
    callDALLE: async function(prompt) {
        const response = await fetch(`${this.baseURL}/images/generations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: `${prompt}, ${this.style}`,
                n: 1,
                size: '1024x1024'
            })
        });
        const data = await response.json();
        return data.data[0].url;
    }
}
```

#### Stable Diffusion API:
```javascript
imageAPI: {
    enabled: true,
    provider: 'stable-diffusion',
    apiKey: 'din-api-nøkkel',
    baseURL: 'https://api.stable-diffusion.com',
    callStableDiffusion: async function(prompt) {
        const response = await fetch(`${this.baseURL}/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: `${prompt}, ${this.style}`,
                negative_prompt: 'cartoon, anime, low quality',
                steps: 30,
                width: 1024,
                height: 768
            })
        });
        const data = await response.json();
        return data.output[0];
    }
}
```

## Sikkerhet

⚠️ **VIKTIG**: Ikke legg `api-config.js` med API-nøkler i GitHub hvis repositoryet er public!

1. Legg til `api-config.js` i `.gitignore`
2. Opprett `api-config.example.js` som mal
3. Bruk miljøvariabler eller server-side proxy for produksjon

## Testing

Etter konfigurasjon, test API-et:

1. Åpne nettleserens konsoll (F12)
2. Sjekk at `APIConfig.imageAPI.enabled === true`
3. Spillet vil automatisk bruke API for bilder

## Hjelp

Hvis du har spørsmål om din spesifikke API, gi meg:
- API-navn/provider
- API-dokumentasjon URL
- Din API-nøkkel (hvis du vil ha hjelp med implementasjon)

