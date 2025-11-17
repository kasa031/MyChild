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
- ✅ Arbeidssystem er implementert (work() funksjon finnes)
- ✅ Forskjellige jobber basert på alder og studie-nivå
- ✅ Jobb koster energi og tid (1 handling)
- ✅ Tjener penger basert på jobbtype og karriere
- ✅ Karriere-lønn gir høyere inntekt

### Matlaging med ingredienser
- ✅ Matlaging med ingredienser er implementert
- ✅ Ingredienser koster penger (verifisert: trekker penger)
- ✅ Sjekk om spilleren har nok penger før matlaging
- ✅ Vis pris for hver ingrediens
- ✅ Reelle norske oppskrifter med steg-for-steg instruksjoner

### Tidssystem
- ✅ Begrenset antall handlinger per dag (4 handlinger, maxActionsPerDay = 4)
- ✅ År-basert fremgang (ikke dag-basert)

### Mobbing-hendelser
- ✅ Mobbing-hendelser er implementert (triggerBullyingEvent)
- ✅ Mobbing tracking og konsekvenser finnes

### Valg-system
- ✅ Valg-system er implementert med minner (memory array)
- ✅ Valg har konsekvenser
- ✅ Varige konsekvenser implementert (applyLastingChoiceEffects(), trustLevel)
- ✅ Problemstillinger med valg og konsekvenser (søskenkonflikt, mobbing, lekser, hjelp eldre)

### Ressurshåndtering
- ✅ Penger-system er implementert
- ✅ Penger brukes til å kjøpe ingredienser, mat, kjæledyr, ekteskap, adopsjon
- ✅ Foreldre-jobbsystem for babyer (0-3 år)

### Barnets følelser
- ✅ Følelser er implementert (emotionalState objekt)
- ✅ Følelser påvirkes av handlinger

### Daglig rutine
- ✅ Daglige rutiner er implementert (feed, bathe, play, read)
- ✅ Tracking av siste gang rutiner ble gjort (lastFed, lastBathed, etc.)
- ✅ Middagsvalg med ulike alternativer og konsekvenser

### Stat-system
- ✅ Alle stats finnes (happiness, energy, social, learning, hunger)
- ✅ Død-mekanikk når alle stats når null

### Grafikk
- ✅ SVG-basert karakterrenderer implementert
- ✅ Forbedrede API-prompter med hand-drawn stil
- ✅ CSS-animasjoner for personlighet
- ✅ API-prompter oppdatert for scener
- ✅ Hover-effekter på scener
- ✅ Fallback-system med SVG-placeholders
- ✅ Dynamiske karakterbilder basert på alder, kjønn, helse, rikdom
- ✅ Aktivitetsspesifikke bilder (babybottle, sykkel, cd, telefon, etc.)

### Dagbok-system
- ✅ Dagbok-system er fullt implementert
- ✅ Karakteren kan skrive i dagbok (addManualDiaryEntry)
- ✅ Auto-genererte minner basert på hendelser (addAutoDiaryEntry)
- ✅ Dagbok-fane i menyen
- ✅ Sortering og visning av dagbok-innlegg

### Vennsystem
- ✅ Vennsystem er fullt implementert
- ✅ Alma Vilje og Celia Rose som venner
- ✅ Sosiale aktiviteter: spendTimeWithFriend, getFriendSupport
- ✅ Vennskap-nivå og støtte-system

### Karriere-voksing
- ✅ Karriere-system er fullt implementert
- ✅ Yrkesvalg: Når karakteren blir 16+, kan hen velge karriere interaktivt
- ✅ 8 forskjellige karrierer med studie-krav, lønn og stat-effekter
- ✅ Fremgang: Viser hvordan karakteren vokser fra mobbeoffer til suksess
- ✅ Karriere-lønn gir høyere inntekt i work()

### Minispill
- ✅ Minispill er fullt implementert
- ✅ Tall-spill (playNumberGame)
- ✅ Hukommelsesspill (playMemoryGame)
- ✅ Gjetespill (playGuessGame)
- ✅ Belønninger: Spill minispill for å få ekstra stats

### Læringsaktiviteter
- ✅ Pottetrening (1-2 år)
- ✅ Staveøvelser (2-4 år) - Interaktivt stavespill
- ✅ Sykkel-læring (6-7 år) - Med progress-tracking
- ✅ Svømme-læring (5+ år) - Med progress-tracking
- ✅ Sosiale ferdigheter: Lær å dele, respektere forskjeller
- ✅ Tålmodighet-øvelser - Interaktiv venting-øvelse
- ✅ Selvdisiplin-øvelser - Steg-for-steg oppgaver
- ✅ Planlegging-øvelser (6+ år) - Interaktiv planlegging

### Familie og forhold
- ✅ Kjæledyr-system (5+ år) - Hund, katt, fugl, hamster, kanin, robot-dyr
- ✅ Foreldre-jobbsystem (0-3 år) - Send forelder på jobb for å tjene penger
- ✅ Forhold/partner-system (18+ år) - Finn partner (alle kjønn og orienteringer)
- ✅ Ekteskap (18+ år) - Gifte seg med partner
- ✅ Adopsjon - Adoptere barn (alle par, inkludert homofile)
- ✅ Familie-omsorg - Ta vare på partner og adopterte barn

### Verden-valg
- ✅ To verdener: 2000-tallet (hyggelig) og 2085 Dystopia
- ✅ Forskjellige bakgrunnsbilder, hendelser og utfordringer per verden
- ✅ Dynamisk tittel og header basert på valgt verden

### Bilder
- ✅ Alle bilder integrert: kjæledyr, familie, studie, karakterer, aktiviteter
- ✅ Happy/sad bilder basert på stats
- ✅ Familie-bilder (bryllup, adopsjon, middag)
- ✅ Studie-bilder (gutt/jente som studerer)
- ✅ Aktivitetsspesifikke bilder

---

## ⚠️ GJENSTÅENDE OPPGAVER

### 🟡 MEDIUM PRIORITET

#### 1. 💰 Forbedre ressurshåndtering (valgfritt)
**Status:** Delvis implementert
**Må gjøres (valgfritt):**
- Gjør tid viktigere (ikke nok tid til alt) - delvis implementert med action limits
- Valg mellom å jobbe eller tilbringe tid med barnet - implementert med trade-off meldinger
- Gjør det vanskeligere å ha nok ressurser - delvis implementert
- Balanser penger, mat og tid bedre - kan forbedres

#### 2. 🎨 Grafikk-forbedringer (valgfritt)
**Status:** Grunnleggende grafikk er implementert
**Må gjøres (valgfritt):**
- Lag flere SVG-hårstiler (krøll, langt, kort, etc.)
- Legg til flere ansiktsuttrykk i SVG
- Forbedre scene-SVG-er med mer detaljer
- Integrer flere API-stiler (vannfarge, akvarell, etc.)
- Lag custom illustrasjoner for hver hendelse
- Smoothe overganger mellom scener

---

## 📝 Notater og status

### Kodegjennomgang (sist oppdatert: nå)
- ✅ Alle funksjoner som kalles er definert og implementert
- ✅ Ingen tomme funksjoner eller placeholder-kode funnet
- ✅ Alle univers-funksjoner (skole, lekegrind, matlaging, bad, les, tegne) er fullt implementert
- ✅ Alle hjelpefunksjoner er implementert
- ✅ Ingen manglende implementasjoner funnet

### Fullførte systemer
- **Arbeidssystem**: ✅ FULLFØRT - `work()` funksjonen er implementert med aldersbaserte jobber og karriere-lønn
- **Matlaging**: ✅ FULLFØRT - Reelle norske oppskrifter med ingredienser, priser og steg-for-steg instruksjoner
- **Grafikk (grunnleggende)**: ✅ FULLFØRT - SVG-renderer, API-prompter, animasjoner, dynamiske bilder
- **Valg-system med varige konsekvenser**: ✅ FULLFØRT - applyLastingChoiceEffects() og trustLevel implementert
- **Dagbok-system**: ✅ FULLFØRT - Manuell og auto-genererte innlegg
- **Vennsystem**: ✅ FULLFØRT - Alma Vilje og Celia Rose med vennskap-nivå
- **Karriere-system**: ✅ FULLFØRT - Interaktivt karriere-valg (16+ år) med 8 karrierer
- **Minispill**: ✅ FULLFØRT - Tall-spill, hukommelsesspill, gjetespill
- **Læringsaktiviteter**: ✅ FULLFØRT - Pottetrening, stave, sykkel, svømme, sosiale ferdigheter, tålmodighet, selvdisiplin, planlegging
- **Familie-system**: ✅ FULLFØRT - Kjæledyr, foreldre-jobbsystem, forhold, ekteskap, adopsjon, familie-omsorg
- **Verden-valg**: ✅ FULLFØRT - 2000-tallet og 2085 Dystopia med forskjellige utfordringer

---

## 📊 Oppsummering

- **Total fullført:** 50+ oppgaver
- **Gjenstående (medium prioritet):** 2 oppgaver (valgfritt)
- **Gjenstående (lav prioritet):** 0 oppgaver

**Status:** Spillet er nå fullt funksjonelt med alle hovedfunksjoner implementert! De gjenstående oppgavene er valgfrie forbedringer.
