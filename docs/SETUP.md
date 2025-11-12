# Setup Guide for MyChild

Denne guiden dekker både API-oppsett og GitHub Pages-deployment.

## 📚 Innholdsfortegnelse

1. [GitHub Pages Deployment](#github-pages-deployment)
2. [API Setup](#api-setup)
3. [Sikkerhet](#sikkerhet)

---

## 🌐 GitHub Pages Deployment

### Aktiver GitHub Pages

1. Gå til GitHub-repositoryet: https://github.com/kasa031/MyChild
2. Klikk på **"Settings"** (øverst i repositoryet)
3. Scroll ned til **"Pages"** i venstre meny
4. Under **"Source"**, velg:
   - Branch: **main**
   - Folder: **/ (root)**
5. Klikk **"Save"**

### Spillet vil være tilgjengelig på:

**https://kasa031.github.io/MyChild/**

### Del lenken

Etter at GitHub Pages er aktivert (kan ta 1-2 minutter), kan du dele denne lenken:

**https://kasa031.github.io/MyChild/**

Spillet vil fungere direkte i nettleseren - ingen nedlasting eller installasjon nødvendig!

### Tips

- Oppdateringer pushes automatisk til GitHub Pages
- Det kan ta 1-2 minutter før endringer er synlige
- Spillet fungerer på alle enheter (PC, tablet, mobil)

---

## 🎨 API Setup

### Hvordan sette opp API for profesjonelle tegninger og animasjoner

#### Steg 1: Velg API-provider

Spillet støtter flere API-providers:
- **OpenAI DALL-E** - For profesjonelle illustrasjoner
- **Stable Diffusion** - For kunstige tegninger
- **Lottie** - For animasjoner
- **Custom API** - Din egen API

#### Steg 2: Konfigurer API

Åpne `config/api-config.js` (eller `config/api-config.local.js` for lokale nøkler) og fyll ut:

```javascript
imageAPI: {
    enabled: true, // Sett til true
    provider: 'dalle', // eller 'stable-diffusion', 'custom', etc.
    apiKey: 'din-api-nøkkel-her',
    baseURL: 'https://api.provider.com', // Hvis nødvendig
    // ...
}
```

#### Steg 3: Implementer API-kall

I `config/api-config.js`, implementer funksjonene basert på din API:

##### For DALL-E (OpenAI):
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

##### For Custom API:
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

#### Steg 4: Aktiver animasjoner (valgfritt)

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

### Testing

Etter konfigurasjon, test API-et:

1. Åpne nettleserens konsoll (F12)
2. Sjekk at `APIConfig.imageAPI.enabled === true`
3. Spillet vil automatisk bruke API for bilder

### Hjelp

Hvis du har spørsmål om din spesifikke API, gi meg:
- API-navn/provider
- API-dokumentasjon URL
- Din API-nøkkel (hvis du vil ha hjelp med implementasjon)

---

## 🔒 Sikkerhet

⚠️ **VIKTIG**: Ikke legg `config/api-config.js` med API-nøkler i GitHub hvis repositoryet er public!

1. Legg til `config/api-config.js` i `.gitignore`
2. Opprett `config/api-config.example.js` som mal
3. Bruk miljøvariabler eller server-side proxy for produksjon

Se [SECURITY.md](SECURITY.md) for detaljerte sikkerhetsregler.

