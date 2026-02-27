# TimeWeaver - Licensieringssystem

## Översikt

TimeWeaver använder ett klient-baserat licensieringssystem med tre licenstyper:

### Licenstyper

1. **Testversion (Trial)** - 30 dagar gratis
   - Startar automatiskt vid första användningen
   - Full funktionalitet under testperioden
   
2. **Årslicens (Annual)** - 365 dagar
   - Giltig i ett år från aktiveringsdatum
   - Kan förnyas efter utgång
   
3. **Evighetslicens (Lifetime)** - Ingen utgång
   - Gäller för alltid
   - Engångsköp

## Funktionalitet

### Utan giltig licens:
- ❌ Kan INTE placera projekt på tidslinjen
- ❌ Kan INTE placera övriga uppgifter på tidslinjen
- ✅ Kan se befintliga data
- ✅ Kan exportera/importera data

### Med giltig licens:
- ✅ Full tillgång till alla funktioner
- ✅ Placera projekt och uppgifter
- ✅ Alla rapporter och analyser

## För användare

### Aktivera licens:

1. Öppna TimeWeaver
2. Klicka på **☰ Meny** → **🔑 Licens**
3. Klistra in din licensnyckel
4. Klicka på **Aktivera Licens**

### Kontrollera licensstatus:

- Öppna **Meny** → **Licens** för att se:
  - Licenstyp (Test/Års/Evighets)
  - Utgångsdatum (om tillämpligt)
  - Antal dagar kvar

## För administratörer

### Generera licensnycklar:

1. Öppna filen `license-generator.html` i en webbläsare
2. Välj licenstyp:
   - **Testversion** - 30 dagar (eller anpassat antal dagar)
   - **Årslicens** - 365 dagar (eller anpassat antal dagar)  
   - **Evighetslicens** - Utgår aldrig
3. (Valfritt) Ange Kund-ID för spårning
4. Klicka på **🔐 Generera Licensnyckel**
5. Kopiera licensnyckeln och skicka till kunden

### Viktigt:
- **DELA ALDRIG** `license-generator.html` med slutanvändare
- Spara genererade licensnycklar tillsammans med kund-ID för support
- Licensnycklar genereras lokalt och skickas INTE till någon server

## Teknisk information

### Säkerhet:

- **Klient-baserad validering** - Kräver ingen server
- **XOR-kryptering** med checksumma för att förhindra enkel manipulation
- **Kan kringgås** av tekniskt kunniga användare (detta är en medvetenhet)
- För högre säkerhet, överväg server-baserad validering

### Licensnyckelformat:

```
TYPE|EXPIRY_TIMESTAMP|CUSTOMER_ID|CHECKSUM
```

Krypterat med XOR och Base64-kodat.

### Lagring:

- Licensdata sparas i `localStorage` (nyckel: `timeweaver_license`)
- Testperiod startar automatiskt vid första användningen
- Spåras med `timeweaver_first_run` nyckel

## Frågor & Svar

**Q: Vad händer när testperioden går ut?**  
A: Användaren kan inte längre placera projekt/uppgifter förrän en licens aktiveras.

**Q: Kan man förlänga en testperiod?**  
A: Ja, genom att rensa `localStorage` eller generera en ny testlicens med custom antal dagar.

**Q: Kan licensnycklar återkallas?**  
A: Nej, inte med detta klient-baserade system. En server-baserad lösning krävs för det.

**Q: Fungerar applikationen offline?**  
A: Ja, licensvalidering sker lokalt så ingen internet-anslutning krävs.

**Q: Kan användare kopiera licensnycklar?**  
A: Ja, licensnycklar är inte bundna till specifik dator/användare i detta system.

## Support

För tekniska frågor eller licensproblem, kontakta din systemadministratör.
