# MyChild - 2000s Edition

Et livssimulasjonsspill inspirert av "Mitt barn, livets børn" men med mindre fokus på mobbing og handlingen satt på 2000-tallet.

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

1. Åpne `index.html` i en nettleser
2. Klikk på ulike aktiviteter for å ta vare på barnet ditt
3. Trykk "Next Day →" for å gå videre til neste dag
4. Se barnet ditt vokse opp gjennom 2000-tallet!

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

## Spesielle funksjoner (likt originalen)

### Daglig omsorg (som originalen)
- **Feed**: Fôr barnet for å redusere hunger
- **Bathe**: Bad barnet for hygiene og glede
- **Play**: Lek sammen for å styrke båndet
- **Read**: Les sammen for læring og nærhet

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

## Legge til bilder

Spillet støtter nå bilder for scener! For å legge til bilder:

1. **Legg bildene i `images`-mappen:**
   - `images/home.jpg` - Bilde av hjemmet
   - `images/school.jpg` - Bilde av skolen  
   - `images/playground.jpg` - Bilde av lekegrind
   - `images/friend.jpg` - Bilde av venners hus

2. **Aktiver bildene på en av disse måtene:**

   **Alternativ 1: Via nettleserens konsoll (F12)**
   ```javascript
   game.setSceneImage('home', 'images/home.jpg');
   game.setSceneImage('school', 'images/school.jpg');
   game.setSceneImage('playground', 'images/playground.jpg');
   game.setSceneImage('friend', 'images/friend.jpg');
   ```

   **Alternativ 2: Rediger game.js direkte**
   I `locations`-objektet (linje ~20), endre:
   ```javascript
   home: { name: "Home", emoji: "🏠", color: "#ffb3ba", image: "images/home.jpg" },
   ```

**Bildestørrelse:** Anbefalt 800x600px eller større for best kvalitet.

**Format:** JPG, PNG eller andre nettleser-støttede formater.

