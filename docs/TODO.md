# 📋 TODO-liste for MyChild

---

## ✅ FULLFØRT

### Fargepalett og design
- ✅ Analyser farger i bildene i images-mappen og generer ny fargepalett
- ✅ Oppdater style.css med ny fargepalett basert på bildene

### Tilgjengelighet
- ✅ Forbedre tilgjengelighet: ARIA-labels, keyboard navigation, kontrast

### Ytelse
- ✅ Optimaliser ytelse: lazy loading av bilder, debounce events, cache

### Feilhåndtering
- ✅ Forbedre feilhåndtering: try-catch blokker, bedre feilmeldinger

### Kodeorganisering
- ✅ Organiser kode: splitt game.js i moduler, bedre kommentarer

### Responsivt design
- ✅ Forbedre responsivt design: test på flere enheter, forbedre touch-oppførsel

### Univers-innhold
- ✅ Fullfør interaktivt innhold for alle universer (skole, lekegrind, matlaging)
- ✅ Legg til interaktivt innhold for resterende aktiviteter (bad, les, tegne)

### Lagre-indikator
- ✅ Forbedre lagre-indikator: vis tydelig når spillet lagres, feilhåndtering

### Hjelpesystem
- ✅ Forbedre hjelpesystem: mer detaljert hjelp, tutorials, tooltips

### Lokalisering
- ✅ Sjekk at alle tekster er oversatt (norsk og engelsk)

### Bildoptimalisering
- ✅ Optimaliser bilder: komprimer, konverter til WebP, lazy loading

### Browser-kompatibilitet
- ✅ Test og fiks kompatibilitet på tvers av nettlesere (Chrome, Firefox, Safari, Edge)

### Mobil-UX
- ✅ Forbedre mobil-opplevelse: større touch-targets, swipe-gestures, bedre layout

### Arbeidssystem
- ✅ Arbeidssystem er implementert (work() funksjon finnes, linje 3674)
- ✅ Forskjellige jobber basert på alder
- ✅ Jobb koster energi og tid (1 handling)
- ✅ Tjener penger basert på jobbtype

### Matlaging med ingredienser
- ✅ Matlaging med ingredienser er implementert
- ✅ Ingredienser koster penger (verifisert: linje 6984 trekker penger)
- ✅ Sjekk om spilleren har nok penger før matlaging
- ✅ Vis pris for hver ingrediens

### Tidssystem (grunnleggende)
- ✅ Begrenset antall handlinger per dag (5 handlinger, maxActionsPerDay = 5)

### Mobbing-hendelser (grunnleggende)
- ✅ Mobbing-hendelser er implementert (triggerBullyingEvent, linje 4488)
- ✅ Mobbing tracking og konsekvenser finnes

### Valg-system (grunnleggende)
- ✅ Valg-system er implementert med minner (memory array)
- ✅ Valg har konsekvenser
- ✅ Varige konsekvenser implementert (applyLastingChoiceEffects(), trustLevel)

### Ressurshåndtering (grunnleggende)
- ✅ Penger-system er implementert (32 treff i kode)
- ✅ Penger brukes til å kjøpe ingredienser

### Barnets følelser (grunnleggende)
- ✅ Følelser er implementert (emotionalState objekt)
- ✅ Følelser påvirkes av handlinger

### Daglig rutine (grunnleggende)
- ✅ Daglige rutiner er implementert (feed, bathe, play, read)
- ✅ Tracking av siste gang rutiner ble gjort (lastFed, lastBathed, etc.)

### Stat-system (grunnleggende)
- ✅ Alle stats finnes (happiness, energy, social, learning, hunger)

### Grafikk (grunnleggende)
- ✅ SVG-basert karakterrenderer implementert
- ✅ Forbedrede API-prompter med hand-drawn stil
- ✅ CSS-animasjoner for personlighet
- ✅ API-prompter oppdatert for scener
- ✅ Hover-effekter på scener
- ✅ Fallback-system med SVG-placeholders

---

## ⚠️ GJENSTÅENDE OPPGAVER

### 🔴 HØY PRIORITET

#### 1. ⏰ Visning av handlinger igjen
**Status:** ✅ FULLFØRT
**Gjort:**
- ✅ Forbedret visuell indikator med større tekst, farger og animasjoner
- ✅ Legg til pulserende animasjon når handlinger er oppbrukt eller nær oppbrukt
- ✅ Konsekvenser implementert: Energi og lykke reduseres når alle handlinger er brukt
- ✅ Mer prominent visning med større tekst og tydelige farger
- ✅ Fjernet duplikat i time-control området

#### 2. 😢 Forbedre mobbing-hendelser (sentralt tema)
**Status:** ✅ FORBEDRET
**Gjort:**
- ✅ Økt sannsynlighet for mobbing betydelig (85% ved skole for lav resilience, 65% for høy)
- ✅ Økt multiplikator for eldre barn (2.0x for 7+, 1.3x ekstra for 10+)
- ✅ Styrket trauma-effekt (25% økning per nylig hendelse, opp fra 20%)
- ✅ Lagt til ekstra sannsynlighet for lav resilience (40% ekstra)
- ✅ Lagt til nye mobbing-scenarier: Sosial eksklusjon og digital mobbing
- ✅ Gjort konsekvensene mer alvorlige i flere scenarier
- ✅ Valg rundt mobbing påvirker allerede fremtidige hendelser (trustLevel, lastingEffect)

#### 3. 💬 Forsterk valg-system
**Status:** ✅ FULLFØRT - applyLastingChoiceEffects() og trustLevel implementert
**Må gjøres (valgfritt - kan forsterkes videre):**
- ✅ Konsekvenser varer over flere dager (implementert - opptil 7 dager)
- ✅ Valg påvirker fremtidige hendelser (trustLevel implementert)
- Gjør valg mer vanskelige (ingen perfekte løsninger) - kan forbedres
- Gjør valg mer betydelige for historien - kan forbedres

#### 4. 📖 Historisk setting (post-WW2) ⚠️
**Status:** Mangler - Spillet er satt til 2000-tallet, ikke post-WW2
**Må gjøres:**
- Endre setting til post-WW2 Norge (1945-1950)
- Legg til historiske referanser
- Endre dialogene til å reflektere tidsperioden
- Legg til historisk kontekst i hendelser
- **MERK:** Dette er en stor endring som kan påvirke hele spillet

---

### 🟡 MEDIUM PRIORITET

#### 5. 💰 Forbedre ressurshåndtering
**Status:** Delvis implementert
**Må gjøres:**
- Gjør penger viktigere (må ha penger for mat - delvis implementert)
- Gjør tid viktigere (ikke nok tid til alt)
- Valg mellom å jobbe eller tilbringe tid med barnet (jobbsystem finnes, men valget kan være tydeligere)
- Gjør det vanskeligere å ha nok ressurser
- Balanser penger, mat og tid bedre

#### 6. 😊 Gjør følelser mer synlige i UI
**Status:** ✅ FORBEDRET
**Gjort:**
- ✅ Gjort følelser mer synlige i UI med større tekst, tydeligere farger og animasjoner
- ✅ Lagt til intensitetsindikator (Sterkt/Moderat)
- ✅ Lagt til animasjoner basert på følelser (glow for glad, pulse for trist, shake for sint, fade for trøtt)
- ✅ Avatar endrer filter basert på følelser (brightness, saturation)
- ✅ Gradient-bakgrunn og box-shadow basert på følelse og intensitet
- ✅ Lavere terskel for visning (20 i stedet for 30) for mer synlighet
- ✅ Størrelse og padding skalerer med intensitet
- ✅ Lagt til flere følelser (tired, lonely)

#### 7. 🎯 Gjør daglige rutiner mer kritiske
**Status:** ✅ FORBEDRET
**Gjort:**
- ✅ Gjort konsekvenser mer alvorlige (økt negative effekter betydelig)
- ✅ Konsekvenser starter tidligere (f.eks. mat etter 1 dag i stedet for 2)
- ✅ Lagt til kritiske advarsler når rutiner mangler lenge
- ✅ Lagt til visuell feedback på rutine-knapper (rød/oransje når rutiner mangler)
- ✅ Lagt til konsekvenser for å hoppe over lesing
- ✅ Gjort rutiner mer obligatoriske med sterkere konsekvenser
- ✅ Lagt til flere følelser når rutiner mangler (scared, embarrassed, lonely)

#### 8. 📊 Gjør stats mer kritiske
**Status:** ✅ FORBEDRET
**Gjort:**
- ✅ Gjort konsekvenser for lave stats mye mer alvorlige
- ✅ Lagt til konsekvenser for alle stats (hunger, happiness, energy, social, learning)
- ✅ Stats synker raskere naturlig (økt fra -8 til -10 for energy, -12 til -15 for hunger)
- ✅ Lagt til "snowball effect" - stats synker ekstra når de allerede er lave
- ✅ Visuell feedback på stat-bars (rød/oransje/gul basert på nivå)
- ✅ Pulserende animasjon for kritiske stats (< 15)
- ✅ Fargepalett endres basert på karakterens følelser (container filter)
- ✅ Kritiske advarsler og dialoger når stats er veldig lave

---

### 🟢 LAV PRIORITET

#### 9. 🎨 Grafikk-forbedringer (videreutvikling)
**Status:** Grunnleggende grafikk er implementert
**Må gjøres:**
- Lag flere SVG-hårstiler (krøll, langt, kort, etc.)
- Legg til flere ansiktsuttrykk i SVG
- Forbedre scene-SVG-er med mer detaljer
- Integrer flere API-stiler (vannfarge, akvarell, etc.)
- Lag custom illustrasjoner for hver hendelse
- Smoothe overganger mellom scener

#### 10. 📔 Dagbok-system (ny funksjon)
**Status:** Ikke implementert
**Må gjøres:**
- Karakterens dagbok: Karakteren kan skrive i dagbok
- Auto-genererte minner basert på hendelser
- Dagboksillustrasjoner for viktige hendelser

#### 11. 👥 Vennsystem (ny funksjon)
**Status:** Ikke implementert
**Må gjøres:**
- Alma og Ole Jacob: De kan være venner i spillet
- Sosiale aktiviteter: Spill sammen med vennen
- Støtte: Vennene støtter hverandre gjennom utfordringer

#### 12. 💼 Karriere-voksing (ny funksjon)
**Status:** Delvis implementert (careerProgress finnes)
**Må gjøres:**
- Yrkesvalg: Når karakteren blir eldre, kan hen velge karriere
- Fremgang: Viser hvordan karakteren vokser fra mobbeoffer til suksess
- Motivasjon: Inspirerende historier om fremgang

#### 13. 🎮 Minispill (ny funksjon)
**Status:** Ikke implementert
**Må gjøres:**
- Lekespill: Enkle minispill fra 2000-tallet (eller post-WW2 hvis setting endres)
- Belønninger: Spill minispill for å få ekstra stats
- Nostalgi: Klassiske spill fra perioden

#### 14. 🔒 Sikkerhetssjekkliste (kontinuerlig)
**Status:** Sjekkliste finnes i SECURITY.md
**Må gjøres (kontinuerlig):**
- Verifiser at api-config.js er i .gitignore
- Sjekk at api-config.local.js brukes for lokale nøkler
- Sjekk før hver commit at ingen nøkler er eksponert

---

## 📝 Notater og status

### Kodegjennomgang (sist oppdatert: nå)
- ✅ Alle funksjoner som kalles er definert og implementert
- ✅ Ingen tomme funksjoner eller placeholder-kode funnet
- ✅ Alle univers-funksjoner (skole, lekegrind, matlaging, bad, les, tegne) er fullt implementert
- ✅ Alle hjelpefunksjoner (updateEmotionalState, checkForEvents, showFinalSuccessMessage) er implementert
- ✅ Ingen manglende implementasjoner funnet

### Fullførte systemer
- **Arbeidssystem**: ✅ FULLFØRT - `work()` funksjonen er implementert med aldersbaserte jobber
- **Matlaging**: ✅ FULLFØRT - Ingredienser koster penger og penger trekkes ved matlaging
- **Grafikk (grunnleggende)**: ✅ FULLFØRT - SVG-renderer, API-prompter, animasjoner
- **Valg-system med varige konsekvenser**: ✅ FULLFØRT - applyLastingChoiceEffects() og trustLevel implementert

### Delvis implementerte systemer
- **Tidssystem**: ✅ DELVIS - Handlinger er begrenset, visning i UI finnes (actionInfoText) men kan gjøres mer prominent
- **Mobbing**: ✅ DELVIS - Systemet finnes, men kan gjøres hyppigere og mer alvorlig
- **Valg-system**: ✅ FULLFØRT - Varige konsekvenser og trustLevel implementert (kan forsterkes videre)
- **Ressurshåndtering**: ✅ DELVIS - Penger finnes, men balanse kan forbedres
- **Følelser**: ✅ DELVIS - Systemet finnes, men UI-visning kan forbedres
- **Rutiner**: ✅ DELVIS - Tracking finnes, men konsekvenser kan legges til
- **Stats**: ✅ DELVIS - Stats finnes, men kan gjøres mer kritiske

### Ikke implementerte systemer
- **Historisk setting (post-WW2)**: ❌ MANGLER - Spillet er satt til 2000-tallet
- **Dagbok-system**: ❌ MANGLER
- **Vennsystem**: ❌ MANGLER
- **Minispill**: ❌ MANGLER

---

## 🎯 Anbefalt rekkefølge

### Fase 1: Kritiske forbedringer (høy prioritet)
1. **Visning av handlinger igjen** (raskt å implementere, stor påvirkning)
2. **Forbedre mobbing-hendelser** (viktig for spillets tema)
3. **Forsterk valg-system** (gjør spillet mer engasjerende)
4. **Historisk setting** (stor endring - vurder om dette skal gjøres)

### Fase 2: Forbedringer (medium prioritet)
5. **Forbedre ressurshåndtering** (balanse)
6. **Gjør følelser mer synlige** (visuell forbedring)
7. **Gjør rutiner mer kritiske** (spillmekanikk)
8. **Gjør stats mer kritiske** (spillmekanikk)

### Fase 3: Nye funksjoner (lav prioritet)
9. **Grafikk-forbedringer** (visuell polish)
10. **Dagbok-system** (ny funksjon)
11. **Vennsystem** (ny funksjon)
12. **Karriere-voksing** (ny funksjon)
13. **Minispill** (ny funksjon)

---

## 📊 Oppsummering

- **Total fullført:** 32+ oppgaver
- **Gjenstående (høy prioritet):** 3 oppgaver (valg-system er nå fullført)
- **Gjenstående (medium prioritet):** 4 oppgaver
- **Gjenstående (lav prioritet):** 6 oppgaver
- **Total gjenstående:** 13 oppgaver

**Fokusområde:** Høy prioritet-oppgavene er kritiske for å gjøre spillet mer likt originalen "Mitt barn: Lebensborn".

