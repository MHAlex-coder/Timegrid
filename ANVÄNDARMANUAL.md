# 📘 TimeGrid - Användarmanual

**Kapacitetsplaneringsverktyg för projekthantering**

Version 2.0 | December 2025

---

## Innehållsförteckning

1. [Introduktion](#introduktion)
2. [Komma igång](#komma-igång)
3. [Grundläggande funktioner](#grundläggande-funktioner)
4. [Arbeta med uppgifter](#arbeta-med-uppgifter)
5. [Kommentarer på block](#kommentarer-på-block)
6. [Inställningar och anpassning](#inställningar-och-anpassning)
7. [Tidslinjehantering](#tidslinjehantering)
8. [Avbrottslogg](#avbrottslogg)
9. [Kvalitetsförluster](#kvalitetsförluster)
10. [Rapporter](#rapporter)
11. [Avancerade funktioner](#avancerade-funktioner)
12. [Tips och tricks](#tips-och-tricks)
13. [Felsökning](#felsökning)

---

## Introduktion

TimeGrid är ett kraftfullt verktyg för kapacitetsplanering som hjälper dig att:

- 📊 Planera och visualisera projektuppgifter över tid
- ⏱️ Hantera arbetskapacitet per dag och vecka
- 💬 Lägga till kommentarer på uppgifter och block
- ⚙️ Anpassa uppgiftstyper, avdelningar och kontaktmetoder
- 📞 Logga och analysera avbrott
- � Spåra och analysera kvalitetsförluster
- 📈 Generera detaljerade beläggnings-, avbrotts- och kvalitetsförlustrapporter
- 🔄 Använda undo/redo för att säkert experimentera med planeringen
- 🌍 Arbeta på svenska eller engelska
- 📱 Fungerar utmärkt på både desktop och mobila enheter

### För vem är verktyget?

- Projektledare som behöver planera teamets kapacitet
- Team leads som behöver fördela arbete
- Verksamhetsanalytiker som vill förstå avbrott och kvalitetsförluster
- Kvalitetsansvariga som arbetar med kontinuerlig förbättring
- Organisationer som arbetar med Six Sigma och Lean

---

## Komma igång

### Öppna verktyget

1. Öppna filen `Index.html` i din webbläsare
2. Verktyget laddar automatiskt din senast sparade data från webbläsarens lokala lagring
3. Standard projekttid per dag är **7 timmar**
4. Tidslinjen scrollar automatiskt till dagens datum

### Första gången du använder verktyget

När du öppnar verktyget första gången ser du:

- En tidslinje för innevarande år som automatiskt visar dagens datum
- Kontrollpanel längst upp för att lägga till uppgifter
- Filmenyn (☰) för att spara/ladda data
- Inställningsknapp (⚙️) för att anpassa verktyget
- Tom avbrottslogg längst ner

### Mobil användning

TimeGrid är fullständigt responsiv och fungerar utmärkt på smartphones och surfplattor:

- Optimerad layout för små skärmar
- Touch-vänlig interface
- Alla funktioner tillgängliga på mobil
- Automatisk anpassning av text och knappar

---

## Grundläggande funktioner

### Ändra visningsår

1. Använd fältet **"Visa planering för år:"** längst upp
2. Ange önskat år (t.ex. 2025)
3. Klicka på **"Uppdatera Tidslinje"**
4. Tidslinjen uppdateras för det valda året och scrollar till dagens datum

### Navigering i tidslinjen

- **Helger** visas med grå bakgrund
- **Röda helgdagar** markeras automatiskt (svenska helgdagar)
- **Auto-scroll:** Sidan scrollar automatiskt till dagens datum när den laddas
- Varje dag visar:
  - Max arbetstid (kan justeras per dag)
  - Bokad mötestid
  - Tillgänglig projekttid
  - Allokerade uppgifter
  - Kommentarsindikator (gul triangel) om block har kommentarer

### Justera max arbetstid per dag

Varje dag har ett **max-timmar fält** (standard 7h):

1. Klicka i max-timmar fältet för en specifik dag
2. Ändra värdet (t.ex. till 8 för en dag med övertid, eller 4 för halvdag)
3. Tidslinjen räknas om automatiskt
4. Övertid (över 8h) markeras i beläggningsrapporten

**Tips:** Om du vill ändra standardvärdet för alla framtida dagar, kontakta administratör.

---

## Arbeta med uppgifter

### Lägga till en uppgift

1. **Fyll i uppgiftsformuläret:**
   - **Uppgiftsnamn:** T.ex. "P2" eller "Projekt Alpha"
   - **Timmar (Total):** Total tid för uppgiften (t.ex. 40)
   - **Uppgiftstyp:** Välj typ från rullgardinsmenyn

2. **Klicka på "Placera uppgift"**

3. **Välj startdatum:**
   - Klicka på önskad dag i tidslinjen
   - En dialogruta visas

4. **Välj allokeringsriktning:**
   - **Framåt i tiden:** Börjar på valt datum och går framåt
   - **Bakåt i tiden:** Slutar på valt datum och går bakåt
   - Klicka på önskad riktning

5. Uppgiften placeras automatiskt och fyller tillgänglig tid varje dag

### Uppgiftstyper

TimeGrid har stöd för anpassningsbara uppgiftstyper. Standard-typer inkluderar:

| Typ | Färg | Användning |
|-----|------|------------|
| **Projekt** | Blå | Ordinarie projektarbete |
| **Support** | Grön | Supportärenden |
| **Change Request** | Orange | Ändringar i befintliga system |
| **Förbättring** | Lila | Förbättringsarbete |
| **Omarbete** | Röd | Arbete som behöver göras om (kvalitetsförlust) |
| **Sent Tillägg** | Rosa | Sent inkomna uppgifter (kvalitetsförlust) |
| **Eplan underhåll** | Turkos | Underhåll av Eplan-system |

**Dynamisk färggenerering:**
- När du lägger till nya uppgiftstyper via inställningar genereras automatiskt unika färger
- Färgerna är konsistenta baserat på typens namn
- Anpassas automatiskt i både tidslinjen och rapporter

**OBS:** Uppgiftstyper markerade som "waste" räknas som **kvalitetsförlust** i rapporterna!

---

## Kommentarer på block

Du kan lägga till kommentarer på valfritt block i tidslinjen för att dokumentera viktiga detaljer.

### Lägga till en kommentar

1. Högerklicka på blocket där du vill lägga till en kommentar
2. Välj **"💬 Lägg till kommentar"** från menyn
3. Skriv din kommentar i dialogrutan
4. Klicka **OK**
5. En **gul triangel** (💛) visas i övre högra hörnet av blocket

### Visa kommentarer

- **Håll muspekaren** över den gula triangeln
- Kommentaren visas i en tooltip
- Tooltip:en ligger alltid överst (framför andra block)

### Redigera kommentarer

1. Högerklicka på blocket med kommentar
2. Välj **"✏ Redigera kommentar"**
3. Uppdatera texten
4. Klicka **OK**

### Ta bort kommentarer

1. Högerklicka på blocket
2. Välj **"🗑 Ta bort kommentar"**
3. Kommentaren raderas och den gula triangeln försvinner

### Viktigt att veta

- **Kommentarer bevaras automatiskt** när du ändrar projekttid eller omallokerar uppgifter
- Kommentarer sparas i localStorage och i JSON-filer
- Varje block kan ha sin egen kommentar
- Använd kommentarer för att dokumentera varför en uppgift är placerad på ett visst datum, special omständigheter, etc.

---

## Inställningar och anpassning

TimeGrid låter dig anpassa verktyget efter dina behov via inställningsmenyn.

### Öppna inställningar

1. Klicka på **⚙️ Inställningar** knappen längst upp till höger
2. Inställningsmenyn öppnas i en modal dialog
3. Tre flikar är tillgängliga:
   - **Uppgiftstyper**
   - **Avdelningar**
   - **Kontaktmetoder**

### Hantera uppgiftstyper

**Lägga till ny uppgiftstyp:**

1. Öppna **Uppgiftstyper**-fliken
2. Skriv namnet på den nya typen (t.ex. "Utbildning")
3. Markera **"Detta är waste (kvalitetsförlust)"** om typen ska räknas som waste
4. Klicka **"Lägg till uppgiftstyp"**
5. Den nya typen läggs till och får automatiskt en unik färg

**Markera/avmarkera som waste:**

- Klicka på **"Waste"** knappen bredvid en uppgiftstyp
- Typer markerade som waste räknas som kvalitetsförlust i rapporter
- Standard waste-typer: Omarbete, Sent Tillägg

**Ta bort uppgiftstyp:**

1. Klicka på **"Radera"** bredvid uppgiftstypen
2. Bekräfta borttagningen
3. **OBS:** Befintliga uppgifter av denna typ påverkas inte, men typen kommer inte längre finnas i dropdown-menyn

### Hantera avdelningar

Anpassa vilka avdelningar som visas i avbrottsloggen:

**Lägga till avdelning:**

1. Öppna **Avdelningar**-fliken
2. Skriv avdelningsnamn (t.ex. "HR", "IT Support")
3. Klicka **"Lägg till avdelning"**

**Ta bort avdelning:**

1. Klicka på **"Radera"** bredvid avdelningen
2. Avdelningen tas bort från dropdown-menyn

**Standard avdelningar:**
- PI
- Mail
- Annat

### Hantera kontaktmetoder

Anpassa hur avbrott kan komma in:

**Lägga till kontaktmetod:**

1. Öppna **Kontaktmetoder**-fliken
2. Skriv metod (t.ex. "Slack", "SMS")
3. Klicka **"Lägg till kontaktmetod"**

**Ta bort kontaktmetod:**

1. Klicka på **"Radera"** bredvid metoden

**Standard kontaktmetoder:**
- Mail
- Telefon
- Teams
- Personligen

### Spara och stänga inställningar

- Alla ändringar sparas automatiskt direkt
- Klicka **"Stäng"** eller klicka utanför dialogen för att stänga
- Inställningarna synkroniseras omedelbart i hela applikationen

### Flytta en uppgift

**Enkel flytt:**

1. Klicka och håll på en uppgift (blå/grön/orange block)
2. Dra till önskad dag
3. Släpp - uppgiften flyttas

**Kopiera en uppgift (Ctrl+klick):**

1. Håll ned **Ctrl**
2. Klicka och dra uppgiften
3. En kopia skapas på det nya datumet

### Ta bort en uppgift

**Enskild uppgift:**

1. Högerklicka på uppgiften
2. Välj **"Radera"** från menyn
3. Bekräfta borttagningen

**Flera uppgifter samtidigt:**

Se avsnitt [Batch-operationer](#batch-operationer)

### Dela upp en uppgift

Om en uppgift behöver delas:

1. Högerklicka på uppgiften
2. Välj **"Dela uppgift här"**
3. Uppgiften delas vid detta datum
4. Två separata uppgifter skapas

### Byta projekt

Om du vill byta ut en uppgift mot en annan:

1. Högerklicka på uppgiften att ersätta
2. Välj **"Byt projekt här"**
3. Fyll i ny uppgiftsinformation
4. Klicka "OK"
5. Den gamla uppgiften ersätts

---

## Tidslinjehantering

### Mötestid

Varje dag kan ha bokad mötestid som minskar tillgänglig projekttid:

1. Hitta **"Mötestid (h)"** fältet under varje dag
2. Ange antal timmar (t.ex. 2)
3. Tillgänglig projekttid minskas automatiskt

**Exempel:**
- Max arbetstid: 7h
- Mötestid: 2h
- Tillgänglig projekttid: 5h

### Färgkodning av dagar

Dagar markeras automatiskt baserat på beläggning:

| Färg | Beläggning | Betydelse |
|------|------------|-----------|
| 🟢 Grön | < 85% | God kapacitet, mer arbete kan läggas till |
| 🟡 Gul | 85-100% | Hög beläggning, nära maxkapacitet |
| 🔴 Röd | > 100% | Överbelastad, för mycket planerat |

### Kapacitetsinformation

Under varje dag visas:

- **Max arbetstid (h):** Justeras med input-fält
- **Mötestid (h):** Bokad tid för möten
- **Support/Change (h):** Tid för support och ändringar
- **Avbrottstid (h):** Tid från avbrottsloggen
- **Tillgänglig projekttid (h):** Kvarvarande tid för projekt

---

## Avbrottslogg

Avbrottsloggen hjälper dig att spåra och analysera avbrott i arbetet.

### Lägga till ett avbrott

1. Scrolla till **"Avbrottslogg"** längst ner på sidan
2. Hitta rätt datum i tidslinjen
3. Klicka på **"Lägg till avbrott"**
4. Fyll i avbrottsinformation:
   - **Tid (h):** Hur lång tid tog avbrottet? (0.25 = 15 min, 0.5 = 30 min, osv.)
   - **Avdelning:** Välj vilken avdelning avbrottet kom från (PI/Mail/Annat)
   - **Kontaktmetod:** Hur kom avbrottet in? (Mail/Telefon/Teams/Personligen)
   - **Beskrivning:** Beskriv vad avbrottet handlade om
5. Avbrottet sparas automatiskt

### Radera ett avbrott

1. Klicka på **"Radera"** knappen bredvid avbrottet
2. Avbrottet tas bort direkt

### Avbrottstid i tidslinjen

- Avbrottstiden syns i huvudtidslinjen under **"Avbrottstid (h)"**
- Denna tid minskar tillgänglig projekttid
- Används i beläggningsrapporten för att visa total belastning

---

## Kvalitetsförluster

Kvalitetsförlustloggen hjälper dig att spåra och analysera kvalitetsförluster i arbetet - tid som inte skapar värde men som måste utföras.

### Lägga till en kvalitetsförlust

1. Scrolla till **"Kvalitetsförluster"** längst ner på sidan
2. Hitta rätt datum i tidslinjen
3. Klicka på **"Lägg till slöseri"**
4. Fyll i kvalitetsförlustinformation:
   - **Tid (h):** Hur lång tid tog kvalitetsförlusten? (0.25 = 15 min, 0.5 = 30 min, osv.)
   - **Avdelning:** Välj vilken avdelning som är ansvarig/berörd
   - **Typ av förlust:** Välj typ (Omarbete, Sent tillägg, Buggrättning, etc.)
   - **Projekt:** Välj vilket projekt kvalitetsförlusten är kopplad till
   - **Beskrivning:** Beskriv vad kvalitetsförlusten handlade om
5. Kvalitetsförlusten sparas automatiskt

### Radera en kvalitetsförlust

1. Klicka på **"Radera"** knappen bredvid kvalitetsförlusten
2. Kvalitetsförlusten tas bort direkt

### Kvalitetsförlusttid i tidslinjen

- Kvalitetsförlusterna visas i sin egen tidslinje under huvudtidslinjen
- Används i kvalitetsförlustrapporten för att analysera mönster
- Kopplas till specifika projekt för detaljerad analys

---

## Rapporter

TimeGrid genererar två typer av rapporter:

### Beläggningsrapport

**Generera rapporten:**

1. Ange rapportnamn (valfritt) i fältet **"Rapportnamn"**
2. Klicka på **"Generera Beläggningsrapport"**

**Vad rapporten innehåller:**

#### 1. Årssammanfattning
- Antal arbetsdagar
- Tillgänglig tid och använd tid
- Total beläggning i procent
- Total övertid
- Projektandel av total tid
- Fördelning på olika uppgiftstyper
- **Kvalitetsförlust** (omarbete + sent tillägg)

#### 2. Beläggning per vecka
- Veckonummer och period
- Tillgänglig tid och använd tid
- Beläggning i procent med färgkodning
- Fördelning på projekt, support, change
- Övertid per vecka
- Kvalitetsförlust per vecka

#### 3. Daglig kapacitet
- Alla arbetsdagar listade
- Tillgänglig tid och övertid
- Beläggning per dag
- Fördelning på olika typer
- Status-indikator per dag

#### 4. Projektgenomförande
- Lista över alla projekt
- Faktiska arbetsdagar vs ideal (75% av arbetstid)
- Genomförandeeffektivitet
- Avvikelse från ideal

#### 5. Förklaringar
- Tydlig förklaring av alla begrepp
- Hjälper mottagaren förstå rapporten

**Exportera till Excel:**

1. Klicka på **"Exportera till Excel (CSV)"** i rapporten
2. En CSV-fil laddas ner
3. Öppna i Excel för vidare analys

**Viktiga mått att förstå:**

- **Beläggning:** Använd tid ÷ Tillgänglig tid × 100%
- **Projektandel:** Hur stor del av tiden som går till projekt
- **Kvalitetsförlust:** Omarbete + Sent tillägg (tid som inte skapar värde)
- **Övertid:** Tid utöver normal 8-timmars arbetsdag

### Avbrottsrapport

**Generera rapporten:**

1. Klicka på **"Generera Avbrottsrapport"**

**Vad rapporten innehåller:**

#### 1. Årssammanfattning
- Totalt antal avbrott
- Total tid förlorad (timmar och minuter)
- Snitt avbrott per dag
- Genomsnittlig tid per avbrott
- **Förbättringspotential:** Vad kan sparas om avbrott minskar

#### 2. Avbrott per avdelning
- Vilka avdelningar orsakar flest avbrott
- Antal, total tid och andel
- Genomsnittlig tid per avbrott från varje avdelning
- Visuell fördelning

#### 3. Avbrott per kontaktmetod
- Hur avbrott kommer in (mail, telefon, etc.)
- Antal och total tid per metod
- Visar vilka kanaler som är mest störande

#### 4. Avbrott per månad
- Trender över året
- Identifiera perioder med många avbrott
- Hjälper planera för framtida belastning

#### 5. Top 10 dagar
- Dagar med flest avbrott
- Hjälper identifiera mönster
- Visar detaljer för varje dag

#### 6. Insikter och förbättringsförslag
- Automatiska analyser
- Fokusområden för förbättring
- Konkreta rekommendationer

**Exportera till Excel:**

CSV-exporten innehåller:
- Årssammanfattning
- Avdelningsstatistik
- Kontaktmetodstatistik
- Månadsöversikt
- Detaljerad lista på alla avbrott

---

### Kvalitetsförlustrapport

**Generera rapporten:**

1. Klicka på **"Generera Kvalitetsförlustrapport"**

**Vad rapporten innehåller:**

#### 1. Årssammanfattning
- Total kvalitetsförlust (timmar)
- Fördelning mellan olika förlusttyper
- Trend och mönster över året

#### 2. Kvalitetsförluster per projekt
- Detaljerad uppdelning per projekt
- Vilka avdelningar som orsakar kvalitetsförluster
- Vilka typer av förluster som förekommer
- Total tid per projekt och förlusttyp
- Procentuell fördelning

#### 3. Fördelning per avdelning
- Vilka avdelningar som genererar mest kvalitetsförluster
- Total tid per avdelning
- Hjälper identifiera förbättringsområden

#### 4. Fördelning per förlusttyp
- Vilka typer av kvalitetsförluster som är vanligast
- Total tid per typ
- Visar var förbättringsinsatser behövs mest

#### 5. Detaljerad lista
- Alla registrerade kvalitetsförluster
- Datum, projekt, avdelning, typ och beskrivning
- Hjälper identifiera specifika händelser och mönster

**Exportera till CSV:**

1. Klicka på **"Exportera till CSV"** i rapporten
2. En CSV-fil laddas ner med filnamn: `kvalitetsforlust_rapport_ÅÅÅÅ.csv` (eller `quality_loss_report_YYYY.csv` på engelska)
3. CSV-filen innehåller:
   - Årssammanfattning
   - Projektuppdelning med avdelning och förlusttyp
   - Detaljerad lista på alla kvalitetsförluster

**Användningsexempel:**

Kvalitetsförlustrapporten hjälper dig att:
- Identifiera vilka projekt som har mest kvalitetsförluster
- Se vilka avdelningar som orsakar flest problem
- Förstå vilka typer av förluster som är vanligast
- Fokusera förbättringsarbete på rätt områden
- Dokumentera och kommunicera kvalitetsproblem

---

## Avancerade funktioner

### Batch-operationer

Markera och hantera flera uppgifter samtidigt:

#### Markera flera uppgifter

**Metod 1: Ctrl+klick**

1. Håll ned **Ctrl**
2. Klicka på varje uppgift du vill markera
3. Markerade uppgifter får gul ram

**Metod 2: Shift+klick (intervall)**

1. Klicka på första uppgiften
2. Håll **Shift**
3. Klicka på sista uppgiften
4. Alla uppgifter däremellan markeras

**Metod 3: Markera alla (Ctrl+A)**

1. Tryck **Ctrl+A**
2. Alla uppgifter (utom möten) markeras

#### Radera flera uppgifter

1. Markera uppgifterna (se ovan)
2. Högerklicka på någon av de markerade
3. Välj **"Radera markerade block (X st)"**
4. Bekräfta borttagningen
5. Alla markerade uppgifter tas bort

**Tips:** Informationsrutan visar antal markerade uppgifter och total tid.

### Undo & Redo

Alla ändringar kan ångras!

**Ångra senaste ändring:**
- Tryck **Ctrl+Z**
- ELLER högerklicka i tidslinjen och välj "Ångra"

**Göra om ångrad ändring:**
- Tryck **Ctrl+Y** eller **Ctrl+Shift+Z**

**Tips:** Upp till 50 ändringar sparas i historiken.

### Spara och ladda data

#### Spara till fil

1. Klicka på **☰** (filmenyn) längst upp till höger
2. Välj **"Spara till fil (JSON)"**
3. En fil laddas ner med format: `arbetsplan_YYYY-MM-DD.json`
4. Spara filen på säker plats

**Vad sparas:**
- Alla uppgifter och projekt
- Alla avbrott
- All konfiguration

#### Ladda från fil

1. Klicka på **☰** (filmenyn)
2. Klicka på **"Välj fil"** under "Ladda fil (JSON)"
3. Välj din sparade JSON-fil
4. Data laddas in automatiskt

**OBS:** Detta ersätter all nuvarande data! Spara först om du vill behålla den.

#### Radera alla uppgifter

1. Klicka på **☰** (filmenyn)
2. Klicka på **"Radera alla uppgifter"**
3. Bekräfta att du vill radera ALLT
4. Tidslinjen rensas helt

**VARNING:** Detta kan inte ångras med Ctrl+Z! Spara till fil först.

### Automatisk sparning

- All data sparas automatiskt i webbläsarens localStorage
- Data finns kvar när du stänger och öppnar webbläsaren
- Fungerar bara på samma dator och webbläsare
- **Rekommendation:** Spara till fil regelbundet som backup!

### Språkstöd

TimeGrid stödjer svenska och engelska:

1. Klicka på **🇸🇪 Svenska** eller **🇬🇧 English** längst upp
2. Språket byts direkt i hela gränssnittet
3. Valet sparas för framtida sessioner

**Språkstöd i rapporter:**

- Alla rapporter genereras automatiskt på det valda språket
- Datumformat anpassas automatiskt:
  - Svenska: "17 december 2025"
  - Engelska: "December 17, 2025"
- CSV-filer får språkspecifika filnamn:
  - Svenska: `veckorapport_2025.csv`, `avbrottsrapport_2025.csv`, `kvalitetsforlust_rapport_2025.csv`
  - Engelska: `weekly_report_2025.csv`, `interruption_report_2025.csv`, `quality_loss_report_2025.csv`
- Exporterade rapporter innehåller alla texter och rubriker på valt språk

**Rapporter som stödjer språkval:**
- Beläggningsrapport (Weekly Capacity Report)
- Avbrottsrapport (Interruption Report)
- Kvalitetsförlustrapport (Quality Loss Report)
- Alla CSV-exporter

---

## Tips och tricks

### Effektiv planering

1. **Börja med årsoversikten**
   - Identifiera viktiga perioder (semester, helgdagar)
   - Markera perioder med reducerad kapacitet

2. **Planera stora projekt först**
   - Lägg in stora projekt som "ankare"
   - Fyll sedan i mindre uppgifter runt dessa

3. **Använd kommentarer för viktiga anteckningar**
   - Dokumentera varför en uppgift är placerad på ett visst datum
   - Notera beroenden eller särskilda omständigheter
   - Lägg till påminnelser om vad som behöver göras

4. **Anpassa uppgiftstyper efter era behov**
   - Lägg till organisationsspecifika uppgiftstyper via inställningar
   - Markera waste-typer för korrekt rapportering
   - Använd konsekventa namn för bättre analys

5. **Reservera tid för support**
   - Baserat på historiska data från avbrottsrapporten
   - Lägg in som Support-uppgifter

6. **Håll 80-90% beläggning som mål**
   - Ger buffert för oväntade händelser
   - Minskar stress och risker

### Rapportering till ledning

1. **Veckovis uppföljning**
   - Kör beläggningsrapport varje vecka
   - Jämför planerad vs faktisk beläggning
   - Justera kommande veckor baserat på insikter

2. **Månadsvis avbrottsanalys**
   - Kör avbrottsrapport vid månadsskifte
   - Identifiera trender och mönster
   - Presentera förbättringspotential för ledningen

3. **Kvartalsvis kapacitetsöversikt**
   - Exportera data för kvartalet
   - Analysera projektgenomförande
   - Identifiera kvalitetsförluster

### Arbeta med team

1. **Dela filer regelbundet**
   - Spara till fil och dela via mail/Teams
   - Använd namngivning: `Team-planering-2025-vecka-12.json`

2. **Central lagring**
   - Överväg delad nätverksmapp för JSON-filer
   - Alla kan ladda senaste versionen

3. **Rollfördelning**
   - En person är "planeringsledare" som uppdaterar
   - Team rapporterar avbrott löpande
   - Veckomöte för att synka planeringen

### Optimera arbetsflödet

**Tangentbordsgenvägar:**
- `Ctrl+Z` - Ångra
- `Ctrl+Y` - Gör om
- `Ctrl+A` - Markera alla uppgifter
- `Ctrl+klick` - Markera flera / Kopiera uppgift
- `Shift+klick` - Markera intervall
- `Escape` - Avbryt pågående operation
- `Högerklick` - Snabbmeny

**Musgester:**
- Dra block - Flytta uppgift
- Ctrl+Dra - Kopiera uppgift
- Högerklick - Kontextmeny
- Dubbelklick - Redigera (framtida funktion)

---

## Felsökning

### Problem: Tidslinjen visas inte

**Lösning:**
1. Öppna webbläsarens utvecklarverktyg (F12)
2. Kolla Console-fliken för felmeddelanden
3. Ladda om sidan med Ctrl+F5 (hård omladdning)
4. Om problemet kvarstår, kontakta support

### Problem: Data försvinner

**Möjliga orsaker:**
- Använder inkognitoläge (localStorage rensas)
- Rensning av webbläsarhistorik/cache
- Byte av webbläsare eller dator

**Lösningar:**
1. **Använd ALLTID filsparning som backup**
2. Använd inte inkognitoläge för viktiga planeringar
3. Spara till fil före rensning av cache

### Problem: Fel år visas

**Lösning:**
1. Ändra år i fältet **"Visa planering för år:"**
2. Klicka på **"Uppdatera Tidslinje"**
3. Om problemet kvarstår, rensa localStorage och ladda om

### Problem: Max-tid visar fel värde (t.ex. 5 istället för 7)

**Lösning:**
1. Detta beror på gammalt värde i localStorage
2. Ladda om sidan med Ctrl+F5
3. Koden uppdaterar automatiskt till 7 om värdet är lägre

**Alternativ lösning (manuell):**
1. Öppna Console (F12)
2. Kör: `localStorage.setItem('HOURS_PER_DAY_DEFAULT', '7')`
3. Ladda om sidan (F5)

### Problem: Rapporter visar fel siffror

**Kontrollera:**
1. Har du registrerat avbrott korrekt med tid?
2. Är uppgiftstyperna rätt (Omarbete vs Projekt)?
3. Är årtalet rätt inställt?

**Lösning:**
1. Kontrollera data i tidslinjen
2. Kör rapporten igen
3. Om problemet kvarstår, exportera data och granska JSON-filen

### Problem: Kan inte placera uppgift

**Möjliga orsaker:**
- Inget utrymme i tidslinjen för uppgiften
- Felaktigt antal timmar angivet
- Problem med datumval

**Lösningar:**
1. Kontrollera att totalantalet timmar är rimligt
2. Försök med mindre uppgift först
3. Se till att det finns tillgänglig kapacitet på valda dagar
4. Öka max-tid på dagar om nödvändigt

---

## Support och kontakt

### Rapportera fel

Om du hittar buggar eller problem:

1. Dokumentera problemet:
   - Vad gjorde du innan felet uppstod?
   - Vilket felmeddelande visades (om något)?
   - Skärmdump om möjligt

2. Kontrollera Console (F12) för felmeddelanden

3. Kontakta utvecklaren med informationen

### Förslag på förbättringar

Vi välkomnar förslag! Kontakta oss med:
- Beskrivning av önskad funktion
- Varför den skulle vara användbar
- Hur du ser att den skulle fungera

### Dokumentation

Denna manual uppdateras regelbundet. Kontrollera versionsnummer längst upp.

**Senaste uppdatering:** December 2025

**Nyheter i version 2.0:**
- ✨ Kommentarer på block med gul indikator
- ⚙️ Anpassningsbara uppgiftstyper, avdelningar och kontaktmetoder
- 🎨 Automatisk färggenerering för nya uppgiftstyper
- 📱 Förbättrad mobil responsivitet
- 🎯 Auto-scroll till dagens datum
- 💾 Kommentarer bevaras vid omberäkning av projekt
- 🔧 Flexibel waste-markering för kvalitetsanalys

---

## Appendix A: Beräkningar

### Beläggning

```
Beläggning (%) = (Använd tid / Tillgänglig tid) × 100
```

**Exempel:**
- Tillgänglig tid: 7h
- Använd tid: 6h
- Beläggning: (6 / 7) × 100 = 85.7%

### Tillgänglig projekttid

```
Tillgänglig projekttid = Max arbetstid - Mötestid - Avbrottstid - Support/Change
```

**Exempel:**
- Max arbetstid: 7h
- Mötestid: 1h
- Avbrottstid: 0.5h
- Support: 1h
- Tillgänglig projekttid: 7 - 1 - 0.5 - 1 = 4.5h

### Kvalitetsförlust

```
Kvalitetsförlust = Omarbete + Sent tillägg
```

**OBS:** Avbrott räknas INTE som kvalitetsförlust eftersom de ofta är legitima arbetsuppgifter.

### Genomförandeeffektivitet

```
Genomförandeeffektivitet (%) = (Ideal arbetsdagar / Faktiska arbetsdagar) × 100
```

- 100% = Perfekt tempo
- >100% = Snabbare än ideal (ovanligt)
- <100% = Långsammare än ideal

**Ideal arbetsdagar beräknas som:**
```
Ideal arbetsdagar = Total projekttid / (Daglig arbetstid × 0.75)
```

Antar att 75% av arbetstiden går till projektet.

---

## Appendix B: Dataformat

### JSON-fil struktur

Sparade filer innehåller:

```json
{
  "tasks": [
    {
      "name": "P2",
      "hours": 40,
      "type": "project",
      "date": "2025-01-15",
      "dayLimit": 7,
      "comment": "Viktigt projekt med deadline"
    }
  ],
  "interruptionTasks": {
    "2025-01-15": [
      {
        "department": "PI",
        "contact": "Mail",
        "issue": "Fråga om system",
        "hours": 0.5
      }
    ]
  },
  "customTaskTypes": ["Utbildning", "Forskning"],
  "wasteTypes": ["omarbete", "sent_tillagg"],
  "customDepartments": ["HR", "IT Support"],
  "customContactMethods": ["Slack", "SMS"]
}
```

### Uppgiftsegenskaper

Varje uppgift kan ha följande egenskaper:

- `name` (sträng) - Uppgiftens namn
- `hours` (nummer) - Timmar för uppgiften
- `type` (sträng) - Uppgiftstyp
- `date` (sträng) - Datum i format YYYY-MM-DD
- `dayLimit` (nummer) - Max arbetstid för dagen
- `comment` (sträng, valfri) - Kommentar på blocket
- `locked` (boolean, valfri) - Om blocket är manuellt placerat
- `totalHours` (nummer, valfri) - Total tid för projekt
- `direction` (sträng, valfri) - 'forward' eller 'backward'

### Uppgiftstyper (type)

**Standard-typer:**
- `project` - Projekt
- `support` - Support
- `change` - Change Request
- `förbättring` - Förbättring
- `omarbete` - Omarbete (waste)
- `sent_tillagg` - Sent Tillägg (waste)
- `eplan_underhåll` - Eplan underhåll
- `meeting` - Möte (internt)
- `dummy` - Dummy (internt)

**Anpassade typer:**
- Du kan lägga till egna typer via inställningsmenyn
- Anpassade typer får automatiskt genererade färger
- Markera typer som waste för korrekt rapportering

---

## Appendix C: Snabbguide

### Vanliga arbetsflöden

#### Planera nytt projekt med kommentar
1. Ange projektnamn och totala timmar
2. Välj "Projekt" som typ
3. Klicka "Placera uppgift"
4. Klicka på startdatum
5. Välj "Framåt i tiden"
6. Högerklicka på projektet
7. Välj "Lägg till kommentar"
8. Dokumentera viktiga detaljer om projektet

#### Anpassa verktyget för din organisation
1. Klicka på ⚙️ Inställningar
2. Lägg till era specifika uppgiftstyper
3. Lägg till relevanta avdelningar
4. Lägg till era kontaktmetoder
5. Markera waste-typer enligt era definitioner
6. Stäng inställningar

#### Logga avbrott
1. Scrolla till avbrottsloggen
2. Hitta rätt datum
3. Klicka "Lägg till avbrott"
4. Fyll i tid, avdelning (från era anpassade), kontakt och beskrivning

#### Generera veckorapport
1. Klicka "Generera Beläggningsrapport"
2. Granska veckodata
3. Klicka "Exportera till Excel (CSV)"
4. Öppna i Excel och filtrera på aktuell vecka

#### Flytta flera uppgifter
1. Ctrl+klick på alla uppgifter att flytta
2. Högerklicka på någon markerad
3. Välj "Radera markerade"
4. Lägg till uppgifterna på nytt plats

---

**Lycka till med din planering! 🚀**
