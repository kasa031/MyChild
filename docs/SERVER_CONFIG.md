# Server Configuration for Cache og Security Headers

## Problem

Noen ressurser (spesielt eksterne CDN-ressurser som Pixi.js) kan ikke ha cache headers og security headers satt via Service Worker, da de kommer fra eksterne domener.

## Løsninger

### For GitHub Pages

GitHub Pages støtter ikke direkte konfigurasjon av HTTP headers via `.htaccess` eller lignende. Men du kan:

1. **Bruk Service Worker** (allerede implementert):
   - Service Worker setter headers for ressurser den håndterer
   - Eksterne ressurser (CDN) kan ikke kontrolleres

2. **Host eksterne ressurser lokalt**:
   - Last ned Pixi.js og host den lokalt i stedet for CDN
   - Dette gir full kontroll over headers

### For andre hosting-tjenester

#### Apache (.htaccess)
```apache
# Cache headers for static resources
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
    Header set X-Content-Type-Options "nosniff"
</FilesMatch>

# Cache headers for HTML
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "public, max-age=180"
    Header set X-Content-Type-Options "nosniff"
    Header set Content-Type "text/html; charset=utf-8"
</FilesMatch>

# Remove Expires header
Header unset Expires
```

#### Nginx
```nginx
# Static resources
location ~* \.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header X-Content-Type-Options "nosniff";
}

# HTML files
location ~* \.(html|htm)$ {
    add_header Cache-Control "public, max-age=180";
    add_header X-Content-Type-Options "nosniff";
    charset utf-8;
}

# Remove Expires header
expires off;
```

#### Netlify (_headers file)
```
/*.css
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff

/*.js
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff

/*.html
  Cache-Control: public, max-age=180
  X-Content-Type-Options: nosniff
  Content-Type: text/html; charset=utf-8
```

## Nåværende Status

- ✅ Service Worker setter headers for alle ressurser den håndterer
- ⚠️ Eksterne CDN-ressurser (Pixi.js) kan ikke kontrolleres
- ⚠️ GitHub Pages har begrenset støtte for custom headers

## Anbefaling

For beste ytelse og sikkerhet, vurder å:
1. Host alle ressurser lokalt (inkludert Pixi.js)
2. Bruk en hosting-tjeneste som støtter custom headers (Netlify, Vercel, etc.)
3. Eller aksepter at eksterne ressurser ikke kan ha custom headers

