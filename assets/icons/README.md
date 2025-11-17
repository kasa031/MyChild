# Ikoner for PWA

Dette mappen skal inneholde PNG-ikoner i forskjellige størrelser for Progressive Web App (PWA) støtte.

## Nødvendige ikoner

For full PWA-støtte, trenger vi følgende PNG-ikoner:

- `icon-72x72.png` (72x72 piksler)
- `icon-96x96.png` (96x96 piksler)
- `icon-128x128.png` (128x128 piksler)
- `icon-144x144.png` (144x144 piksler)
- `icon-152x152.png` (152x152 piksler)
- `icon-192x192.png` (192x192 piksler) - **Viktigst for Android/Chrome**
- `icon-384x384.png` (384x384 piksler)
- `icon-512x512.png` (512x512 piksler) - **Viktigst for Android/Chrome**

## Hvordan generere ikoner

### Metode 1: Bruk online verktøy
1. Gå til https://realfavicongenerator.net/ eller https://www.pwabuilder.com/imageGenerator
2. Last opp `assets/favicon.svg`
3. Generer alle størrelser
4. Last ned og legg filene i denne mappen

### Metode 2: Bruk ImageMagick (kommandolinje)
```bash
# Konverter SVG til PNG i forskjellige størrelser
convert assets/favicon.svg -resize 72x72 assets/icons/icon-72x72.png
convert assets/favicon.svg -resize 96x96 assets/icons/icon-96x96.png
convert assets/favicon.svg -resize 128x128 assets/icons/icon-128x128.png
convert assets/favicon.svg -resize 144x144 assets/icons/icon-144x144.png
convert assets/favicon.svg -resize 152x152 assets/icons/icon-152x152.png
convert assets/favicon.svg -resize 192x192 assets/icons/icon-192x192.png
convert assets/favicon.svg -resize 384x384 assets/icons/icon-384x384.png
convert assets/favicon.svg -resize 512x512 assets/icons/icon-512x512.png
```

### Metode 3: Bruk icon-generator.html
Åpne `assets/icons/icon-generator.html` i nettleseren og følg instruksjonene.

## Viktig

- Ikonene må være PNG-filer (ikke SVG for disse størrelsene)
- Ikonene bør ha transparent bakgrunn
- De viktigste størrelsene er 192x192 og 512x512 for Android/Chrome
- For iOS/Safari, brukes 152x152, 192x192 og 512x512

## Midlertidig løsning

Hvis ikonene ikke er generert ennå, vil nettleseren bruke SVG-filen som fallback. Dette fungerer, men PNG-ikoner gir bedre kompatibilitet og ytelse.

