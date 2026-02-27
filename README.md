# TimeGrid - Projektstruktur

## 📁 FILÖVERSIKT

### Huvudfiler
- **Index.html** - Huvudsidan med UI-struktur
- **Style.css** - Stilmall för huvudapplikationen
- **interruptions.css** - Stilmall för avbrottstidslinjen

### JavaScript-moduler (laddas i denna ordning)

#### 1. Konfiguration
- **config.js** ⭐ NYA MODULEN
  - Globala konstanter (HOURS_PER_DAY_DEFAULT, DEFAULT_WEEKLY_HOURS, OVERTIME_LIMIT)
  - Globala variabler (tasks, currentYear, pendingTask, etc.)
  - UNDO/REDO stacks
  - Multi-select variabler (selectedBlocks, lastSelectedIndex)
  - Swap & Copy mode variabler
  - DOM-referenser (timeline, yearInput)

#### 2. Grundläggande funktioner
- **calendar.js** ⭐ NY MODUL
  - `toLocalISOString(date)` - Konvertera datum till ISO-sträng
  - `SWEDISH_HOLIDAYS(date)` - Kontrollera svenska helgdagar
  - `getWeekNumber(d)` - Få veckonummer
  - `getFullYearDates()` - Generera alla datum för året
  - `getWeekdays()` - Hämta veckodagsnamn
  - `countWorkDays(startDate, endDate)` - Räkna arbetsdagar
  - `changeYear()` - Ändra visat år

- **storage.js** ⭐ NY MODUL
  - `save()` - Spara tasks till localStorage
  - `saveUndoState()` - Spara för undo-funktionalitet
  - `undo()` - Ångra senaste ändring
  - `redo()` - Gör om ångrad ändring
  - `downloadData()` - Exportera till JSON-fil
  - `loadData(event)` - Importera från JSON-fil
  - `clearAllTasks()` - Radera alla uppgifter

#### 3. Användarinteraktion
- **keyboard.js** ⭐ NY MODUL
  - Ctrl+Z / Ctrl+Y - Undo/Redo
  - Escape - Avbryt speciallägen
  - Ctrl+A - Markera alla block
  - Ctrl cursor - Visa copy-cursor

- **selection.js** ⭐ NY MODUL
  - `toggleBlockSelection(index, blockElement)` - Markera/avmarkera block
  - `selectBlockRange(index, blockElement)` - Markera flera block (Shift+klick)
  - `clearBlockSelections()` - Rensa alla markeringar
  - `updateInfoMessage()` - Uppdatera info-meddelande
  - `moveSelectedBlocks(targetDate)` - Flytta markerade block
  - `deleteSelectedBlocks()` - Radera markerade block

#### 4. Huvudfunktionalitet
- **Script.js** (KVAR, men mindre)
  - Projekt-allokering (`recalculateAllTasks()`)
  - Tidslinje-rendering (`generateTimeline()`, `renderTasks()`)
  - Block-rendering (`renderProjectBlock()`, `renderNonProjectBlock()`)
  - Uppgifts-placering (`startAddTask()`, `placeTask()`)
  - Projekt-placering (`confirmProjectPlacement()`)
  - Drag & Drop (`handleDrop()`, `startDrag()`)
  - Context menu (`showContextMenu()`)
  - Projekt-operationer (radera, flytta, dela)
  - Input-hantering (`updateWorkHours()`, `updateMeetingHours()`)
  - Rapporter (`generateWeeklyReport()`)

#### 5. Avbrottstidslinje
- **interruptions.js** (BEFINTLIG)
  - Separat tidslinje för avbrott
  - `getInterruptionHoursForDate(dateStr)` - Hämta avbrottstimmar

#### 6. Språkhantering
- **language.js** (BEFINTLIG)
  - Svenska/Engelska översättningar
  - `t(key)` - Översättningsfunktion

### Dokumentation
- **FUNCTION_MAP.md** ⭐ NY FIL
  - Komplett karta över alla funktioner med radnummer
  - Logisk gruppering
  - Navigeringsguide

- **README.md** ⭐ DENNA FIL
  - Projektstruktur-översikt
  - Fil-beroenden
  - Utvecklingsinstruktioner

## 🔧 LADDNINGSORDNING (VIKTIGT!)

Modulerna måste laddas i denna ordning i Index.html:

```html
<!-- 1. Konfiguration först (definierar alla globala variabler) -->
<script src="config.js"></script>

<!-- 2. Grundläggande funktioner -->
<script src="calendar.js"></script>
<script src="storage.js"></script>

<!-- 3. Användarinteraktion -->
<script src="keyboard.js"></script>
<script src="selection.js"></script>

<!-- 4. Huvudfunktionalitet (beror på allt ovanstående) -->
<script src="Script.js"></script>

<!-- 5. Avbrottstidslinje -->
<script src="interruptions.js"></script>

<!-- 6. Språk -->
<script src="language.js"></script>
```

## 🔗 BEROENDEN

### config.js
- **Exporterar**: Alla globala variabler och konstanter
- **Beror på**: Ingenting
- **Används av**: ALLA andra moduler

### calendar.js
- **Exporterar**: Datumfunktioner
- **Beror på**: config.js (currentYear)
- **Används av**: Script.js, reports

### storage.js
- **Exporterar**: Lagrings- och undo/redo-funktioner
- **Beror på**: config.js (tasks, undoStack, redoStack)
- **Används av**: ALLA moduler som ändrar data

### keyboard.js
- **Exporterar**: Tangentbordshanterare (DOM event listeners)
- **Beror på**: config.js, storage.js (undo/redo), selection.js
- **Används av**: Direkt ansluten till DOM

### selection.js
- **Exporterar**: Multi-select funktioner
- **Beror på**: config.js (selectedBlocks), storage.js, Script.js (showContextMenu, recalculateAllTasks)
- **Används av**: keyboard.js, Script.js (context menu)

### Script.js
- **Exporterar**: Alla kärn-funktioner (rendering, projekt-logik, rapporter)
- **Beror på**: ALLA ovanstående moduler
- **Används av**: UI-events, context menu callbacks

## 📊 FILSTORLEKAR (UPPSKATTNING)

| Fil | Rader | Beskrivning |
|-----|-------|-------------|
| config.js | 40 | Konfiguration |
| calendar.js | 75 | Datum-hantering |
| storage.js | 115 | Lagring & undo/redo |
| keyboard.js | 50 | Tangentbordshantering |
| selection.js | 175 | Multi-select |
| Script.js | ~2800 | Kärn-funktionalitet |
| interruptions.js | ~250 | Avbrottstidslinje |
| language.js | ~520 | Översättningar |

**Total**: ~4025 rader (tidigare 3424 i en fil)

## 🎯 FRAMTIDA REFAKTORERING

Om Script.js fortfarande är för stor kan dessa moduler skapas:

1. **projects.js** (~600 rader)
   - `recalculateAllTasks()` och relaterad logik

2. **rendering.js** (~400 rader)
   - `renderTasks()`, `renderProjectBlock()`, `renderNonProjectBlock()`
   - `generateTimeline()`

3. **contextmenu.js** (~300 rader)
   - `showContextMenu()` och alla meny-åtgärder

4. **modals.js** (~200 rader)
   - Datum-pickers och dialoger

5. **reports.js** (~500 rader)
   - `generateWeeklyReport()` och export

6. **dragdrop.js** (~200 rader)
   - `handleDrop()`, `startDrag()`, swap-funktionalitet

## 🚀 UTVECKLINGSINSTRUKTIONER

### Lägga till ny funktion
1. Identifiera vilken modul funktionen hör till
2. Lägg till funktionen i rätt modul
3. Om funktionen använder globala variabler, se till att config.js har dem
4. Testa att laddningsordningen fortfarande fungerar

### Debugga
1. Öppna browser console (F12)
2. Kontrollera att alla script-filer laddas utan fel
3. Använd FUNCTION_MAP.md för att hitta funktioner snabbt
4. Sök efter funktionsnamn i relevanta moduler

### Ändra standardvärden
- Redigera config.js rad 5: `HOURS_PER_DAY_DEFAULT`
- Alla moduler kommer automatiskt använda det nya värdet

## ✅ FÖRDELAR MED NY STRUKTUR

✅ **Lättare att navigera** - Funktioner grupperade logiskt
✅ **Snabbare utveckling** - Mindre filer att läsa
✅ **Bättre för AI** - Kan fokusera på relevanta moduler
✅ **Enklare att underhålla** - Tydliga ansvarsområden
✅ **Minskad risk för buggar** - Ändringar påverkar färre delar

## 📝 VERSION

- **Skapad**: 2025-12-19
- **Script.js original**: 3424 rader
- **Efter refaktorering**: 5 nya moduler + dokumentation
- **Status**: ✅ Grundläggande struktur klar, Script.js kan delas upp vidare vid behov
