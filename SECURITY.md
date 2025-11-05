# Sikkerhetsregler for MyChild Prosjektet

## ⚠️ KRITISK: Ikke Committ Sensitiv Informasjon

### Hva skal ALDRI committes til Git:

1. **API-nøkler og tokens**
   - OpenRouter API keys (`sk-or-v1-*`)
   - OpenAI API keys
   - Alle andre API-nøkler
   - Access tokens
   - OAuth secrets

2. **Passord og autentisering**
   - Passord (selv i hash)
   - Session tokens
   - Private keys
   - Certifikater

3. **Personlig informasjon**
   - Email-adresser
   - Telefonnummer
   - Adresser
   - Personnummer

4. **Konfigurasjonsfiler med nøkler**
   - `api-config.js` (hvis den inneholder nøkler)
   - `.env` filer
   - `config.json` med credentials
   - Alle filer som inneholder `apiKey`, `password`, `secret`, `token`

## Sikker praksis:

### ✅ GØR DETTE:
- Bruk `api-config.local.js` for lokale nøkler (denne er i .gitignore)
- Bruk miljøvariabler for produksjon
- Legg til nye filer med nøkler i `.gitignore` FØR du committer
- Bruk `api-config.example.js` som mal (uten nøkler)
- Sjekk at filer er i `.gitignore` før du committer

### ❌ IKKE GJØR DETTE:
- Committ filer med API-nøkler hardkodet
- Legg nøkler direkte i kode
- Del nøkler i commit-meldinger eller issues
- Ignorer .gitignore advarsler

## Hvis du har committet en nøkkel ved feil:

1. **Fjern nøkkelen fra koden umiddelbart**
2. **Rotér nøkkelen** hos API-leverandøren (generer ny)
3. **Slett nøkkelen fra git-historien** (hvis repository er public):
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch api-config.js" \
     --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push** (kun hvis repository er privat og du har tillatelse)
5. **Varsle teammedlemmer** om at nøkkelen er kompromittert

## Filstruktur for API-nøkler:

```
api-config.example.js    ✅ Kan committes (mal uten nøkler)
api-config.local.js       ❌ IKKE committ (din lokale nøkkel)
api-config.js            ❌ IKKE committ hvis den inneholder nøkler
.env                      ❌ IKKE committ
```

## Automatisk sjekk:

Før hver commit, sjekk:
- [ ] Har jeg lagt til nye filer med nøkler i `.gitignore`?
- [ ] Har jeg fjernet nøkler fra kode før commit?
- [ ] Er `api-config.js` i `.gitignore`?
- [ ] Har jeg brukt `api-config.local.js` for lokale nøkler?

## Kontakt:

Hvis du har spørsmål om sikkerhet eller oppdager en eksponert nøkkel, kontakt prosjektlederen umiddelbart.

