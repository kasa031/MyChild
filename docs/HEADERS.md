# HTTP Headers Konfigurasjon

## Problem
GitHub Pages støtter ikke custom HTTP headers direkte. Dette dokumentet forklarer løsningene.

## Løsninger

### 1. Service Worker (Allerede implementert)
Service Worker (`sw.js`) legger nå til headers programmatisk:
- `Cache-Control: public, max-age=180`
- `X-Content-Type-Options: nosniff`

### 2. For full header-støtte, vurder:

#### Alternativ A: Cloudflare Pages
1. Deploy til Cloudflare Pages
2. Opprett `_headers` fil i root (allerede opprettet)
3. Headers settes automatisk

#### Alternativ B: Netlify
1. Deploy til Netlify
2. `_headers` fil fungerer automatisk
3. Full kontroll over alle headers

#### Alternativ C: Cloudflare CDN (med GitHub Pages)
1. Legg til ditt domene til Cloudflare
2. Bruk Cloudflare Page Rules for å legge til headers:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Cache-Control: public, max-age=180`

### 3. Cache Busting
Service Worker bruker nå versjonering (`CACHE_VERSION`). 
Oppdater `CACHE_VERSION` i `sw.js` når du vil tvinge cache-refresh.

## Nåværende Status
✅ Service Worker legger til headers programmatisk
✅ Cache busting via versjonering
⚠️ Full header-støtte krever ekstern tjeneste (Cloudflare/Netlify)

