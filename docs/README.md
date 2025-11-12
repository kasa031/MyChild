# MyChild - 2000s Edition

Et livssimulasjonsspill inspirert av "Mitt barn, livets børn" men med mindre fokus på mobbing og handlingen satt på 2000-tallet.

## 📁 Prosjektstruktur

```
MyChild/
├── index.html              # Hovedspillside
├── login.html              # Innloggingsside
├── css/
│   └── style.css           # Hovedstilark
├── js/
│   ├── game.js             # Hovedspilllogikk
│   ├── character-renderer.js # Karakterrendering
│   ├── translations.js     # Oversettelsessystem
│   └── utils.js            # Hjelpefunksjoner og polyfills
├── assets/
│   ├── images/             # Spillbilder
│   ├── audio/              # Lydfiler
│   ├── animations/         # Animasjoner (GIF)
│   ├── favicon.ico         # Favicon
│   └── favicon.svg         # Favicon (SVG)
├── config/
│   ├── api-config.example.js  # API-konfigurasjonsmal
│   ├── api-config.js       # API-konfigurasjon (ikke i git)
│   └── api-config.local.js # Lokal API-konfigurasjon (ikke i git)
└── docs/
    ├── README.md           # Denne filen
    ├── SETUP.md            # Oppsettsguide (API + GitHub Pages)
    ├── SECURITY.md         # Sikkerhetsregler
    └── TODO.md             # Oppgaveliste
```

## 🌐 Spill spillet online

**Spill nå:** https://kasa031.github.io/MyChild/

*(Hvis lenken ikke fungerer, aktiver GitHub Pages i repository settings)*

## Funksjoner

- **2000-talls setting**: Spillet utspiller seg i 2000-tallet med autentiske referanser til teknologi, kultur og miljø
- **Positive sosiale interaksjoner**: Fokus på bygging av vennskap og positive relasjoner
- **Daglig rutine**: Ta vare på barnet ditt gjennom ulike aktiviteter
- **Progressjon**: Barnet vokser opp over tid gjennom 2000-tallet
- **Diverse aktiviteter**: Leik utendørs, lek med venner, se på TV, spill videospill, gjøre lekser, og mer

## Slik starter du

1. **Åpne `login.html` i en nettleser** (Dette er startfilen!)
2. **Velg eller opprett bruker**: Skriv inn et brukernavn
3. **Tilpass karakteren**: Velg kjønn, navn, emoji og utseende
4. **Start spillet**: Klikk "Start Spill"
5. Ta vare på barnet ditt gjennom ulike aktiviteter
6. Spillet lagres automatisk - du kan alltid komme tilbake!

## Aktiviteter

- **Play Outside**: Lek utendørs med venner (+Energy, +Social, +Happiness)
- **Do Homework**: Gjør lekser og lær nye ting (+Learning, -Energy)
- **Watch TV**: Se på TV-show fra 2000-tallet (+Happiness, -Energy)
- **Play Games**: Spill videospill på Game Boy eller PlayStation 2 (+Happiness, -Energy)
- **Hang with Friends**: Tilbring tid med venner (+Social, +Happiness)
- **Eat Meal**: Spis et måltid (+Energy, +Happiness)
- **Go to School**: Gå på skole og lær (+Learning, +Social, -Energy)
- **Sleep**: Hvile og få energi (+Energy, +Happiness)

## Teknologi

- Ren HTML, CSS og JavaScript
- Ingen eksterne avhengigheter
- Fungerer i alle moderne nettlesere

## 🔒 Sikkerhet

**VIKTIG:** Dette prosjektet bruker API-nøkler. For å beskytte dine nøkler:

1. **Aldri committ `config/api-config.js`** - Denne filen er i `.gitignore`
2. **Bruk `config/api-config.local.js`** for lokale nøkler (også i .gitignore)
3. **Se `docs/SECURITY.md`** for detaljerte sikkerhetsregler
4. **Hvis du har committet en nøkkel ved feil:** Rotér nøkkelen umiddelbart hos API-leverandøren

Les mer i [docs/SECURITY.md](SECURITY.md)

## Spesielle funksjoner (likt originalen)

### Daglig omsorg (som originalen)
- **Feed**: Fôr barnet for å redusere hunger
- **Bathe**: Bad barnet for hygiene og glede
- **Play**: Lek sammen for å styrke båndet
- **Read**: Les sammen for læring og nærhet

### Karaktertilpasning
- **Velg kjønn**: Gutt (Alex), Jente (Alexa), eller Non-binær
- **Tilpass navn**: Gi karakteren ditt eget navn
- **Velg emoji**: 25+ emoji-opsjoner for å representere karakteren
- **Tilpass utseende**: Hårfarge, øyenfarge, stil (normal, caps, hoodie, sporty)

### Statistikk
- **Happiness**: Barnets lykke
- **Energy**: Energinivå
- **Social**: Sosial utvikling
- **Learning**: Læring og utvikling
- **Hunger**: Sult (viktig! må fylles regelmessig)

### Narrativ struktur
- **14+ hendelser**: Spesielle situasjoner med valg
- **Valg-system**: Dine valg påvirker utviklingen
- **Dialoger**: Barnet snakker til deg
- **Emosjonell feedback**: Barnets ansikt viser følelser

### Scener og lokasjoner
- **Home**: Hjemmet - trygg base
- **School**: Skolen - læring og sosialisering
- **Playground**: Lekegrind - lek og venner
- **Friend's House**: Venners hus - sosial tid

### 2000-talls setting
- **Teknologi**: Game Boy Advance, PlayStation 2, tidlig internett
- **Kultur**: Mall, TV-show, klassiske aktiviteter
- **Tidsperiode**: 2000-2009
- **Aldersprogression**: Vokser opp gjennom tiåret

### Automatiske mekanikker
- **Hunger synker**: Hver dag (viktig å fôre!)
- **Stat-koblinger**: Lav hunger påvirker lykke
- **Kritiske tilstander**: Barnet varsler når noe er galt
- **Tidssystem**: Morgen, ettermiddag, kveld, natt

## 🎨 API-baserte profesjonelle tegninger

Spillet støtter nå **API-baserte profesjonelle tegninger** via OpenAI DALL-E! 

### Automatisk bildegenerering

Når API er konfigurert, genererer spillet automatisk:
- **Profesjonelle illustrasjoner** for scener (hjem, skole, lekegrind, etc.)
- **Portrett av barnet** basert på alder og følelser
- **Vannfarge-stil** som ligner mer på originalen

### Konfigurering

1. Filen `api-config.local.js` er allerede opprettet med dine API-nøkler
2. API er aktivert og klar til bruk
3. Spillet bruker automatisk API-genererte bilder når tilgjengelig
4. Fallback til lokale bilder hvis API ikke er tilgjengelig

### Cache-system

Genererte bilder caches automatisk for å unngå unødvendige API-kall.

## Legge til bilder (manuelt)

Spillet støtter også manuelt lagt til bilder for scener:

1. **Legg bildene i `assets/images`-mappen:**
   - `assets/images/home.jpg` - Bilde av hjemmet
   - `assets/images/school.jpg` - Bilde av skolen  
   - `assets/images/playground.jpg` - Bilde av lekegrind
   - `assets/images/friend.jpg` - Bilde av venners hus

2. **Aktiver bildene på en av disse måtene:**

   **Alternativ 1: Via nettleserens konsoll (F12)**
   ```javascript
   game.setSceneImage('home', 'assets/images/home.jpg');
   game.setSceneImage('school', 'assets/images/school.jpg');
   game.setSceneImage('playground', 'assets/images/playground.jpg');
   game.setSceneImage('friend', 'assets/images/friend.jpg');
   ```

   **Alternativ 2: Rediger game.js direkte**
   I `locations`-objektet (linje ~20), endre:
   ```javascript
   home: { name: "Home", emoji: "🏠", color: "#ffb3ba", image: "assets/images/home.jpg" },
   ```

**Bildestørrelse:** Anbefalt 800x600px eller større for best kvalitet.

**Format:** JPG, PNG eller andre nettleser-støttede formater.

