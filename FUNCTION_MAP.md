# TimeWeaver - Funktionskarta (Script.js)

## INNEHÅLLSFÖRTECKNING MED RADNUMMER

### A. KONFIGURATION (1-40)
- `HOURS_PER_DAY_DEFAULT` - Rad 4-5 (Standard projekttid per dag)
- `DEFAULT_WEEKLY_HOURS` - Rad 6
- `OVERTIME_LIMIT` - Rad 7
- Globala variabler: tasks, pendingTask, currentYear, etc. - Rad 10-35

### B. DATUM & KALENDER (45-85)
- `toLocalISOString(date)` - Rad 47
- `SWEDISH_HOLIDAYS(date)` - Rad 53
- `getWeekNumber(d)` - Rad 61
- `getFullYearDates()` - Rad 68
- `getWeekdays()` - Rad 36
- `countWorkDays(startDate, endDate)` - Rad 330

### C. LAGRING & DATAHANTERING (89-230)
- `save()` - Rad 89
- `saveUndoState()` - Rad 98
- `undo()` - Rad 116
- `redo()` - Rad 136
- `downloadData()` - Använd storage.js
- `loadData(event)` - Använd storage.js
- `clearAllTasks()` - Rad 210

### D. FIL-MENY (227-340)
- `toggleFileMenu()` - Rad 227
- `changeDefaultProjectHours()` - Rad 237 (ANVÄNDS EJ LÄNGRE)
- `updateExistingProjectsWithNewStandard(hoursPerDay)` - Rad 281

### E. TANGENTBORDSHANTERING (160-210)
- Ctrl+Z/Y (Undo/Redo) - Rad 169
- Escape (Avbryt lägen) - Rad 174
- Ctrl+A (Markera alla) - Rad 183
- Ctrl copy cursor - Rad 195

### F. PROJEKT-ALLOKERING (505-1045)
- `recalculateAllTasks()` - Rad 545 (⚠️ KÄRN FUNKTION 500+ rader)
  - Hanterar locked blocks
  - Overflow-hantering  
  - Projekt-allokering
  - Gap placeholders

### G. TIDSLINJE-RENDERING (1080-1145)
- `generateTimeline()` - Rad 1080
- `changeYear()` - Använd calendar.js

### H. BLOCK-RENDERING (1165-1470)
- `renderProjectBlock(t, date, projectsInDay, interruptionHours, conflict, container)` - Rad 1165
- `renderNonProjectBlock(t, container)` - Rad 1261
- `renderTasks()` - Rad 1303 (⚠️ KÄRN FUNKTION)

### I. INPUT-HANTERING (1480-1520)
- `updateWorkHours(date, value)` - Rad 1490
- `updateMeetingHours(date, value)` - Rad 1500

### J. UPPGIFTS-PLACERING (1552-1710)
- `startAddTask()` - Rad 1552
- `placeTask(startDateStr)` - Rad 1569

### K. PROJEKT-PLACERING (1711-1765)
- `confirmProjectPlacement(direction)` - Rad 1711
- `cancelPlacement()` - Rad 1743

### L. MULTI-SELECT SYSTEM (1767-1885)
- `toggleBlockSelection(index, blockElement)` - Rad 1767
- `selectBlockRange(index, blockElement)` - Rad 1794
- `clearBlockSelections()` - Rad 1809
- `updateInfoMessage()` - Rad 1817

### M. DRAG & DROP (1828-1990)
- `handleDrop(e, newDate)` - Rad 1851
- `startDrag(e, index)` - Rad 1894
- `cancelSwapMode()` - Rad 1903
- Swap functionality - Rad 1913-1950

### N. BLOCK-OPERATIONER (1960-2090)
- `deleteBlock(index)` - Rad 1960
- `deleteSelectedBlocks()` - Rad 1780
- `deleteProject(projectName)` - Rad 2010

### O. BLOCK-FLYTT (2060-2116)
- `moveSelectedBlocksToDate()` - Rad 2060 (📅 Datum-modal för batch-flytt)
- `moveToSpecificDate(projectName)` - Rad 2400 (📅 Flytta helt projekt)

### P. KONTEXTMENY (2117-2285)
- `showContextMenu(x,y,index,date)` - Rad 2117 (⚠️ STOR FUNKTION)
  - Batch-operationer för markerade block
  - Projekt-specifika alternativ
  - Task-specifika alternativ
- `removeContextMenu()` - Rad 2193
- `editProjectTotalHours(taskName)` - Rad 2027
- `offsetProject(projectName)` - Rad 2257

### Q. PROJEKT-MANIPULATION (2285-2450)
- `deleteProject(projectName)` - Rad 2305
- `splitProject(projectName)` - Rad 2337
- `moveToSpecificDate(projectName)` - Rad 2400

### R. RAPPORTER (2547-3150)
- `generateWeeklyReport()` - Rad 2628 (⚠️ STOR FUNKTION 500+ rader)
  - Veckorapport
  - Daglig kapacitet
  - Lead time-analys
- `exportWeeklyReportToCsv()` - Rad 2950

### S. AVBROTTSTIDSLINJE (3180-3424)
- Hela avbrottssystemet med egen tidslinje
- `getInterruptionHoursForDate(dateStr)` - Interruptionsfunktion
- Separata interruption-funktioner

## FILSTRUKTUR - FÖRESLAGEN UPPDELNING

Om refaktorering görs i framtiden:

```
/Planerare_V5
├── Index.html (uppdatera <script> tags)
├── config.js ✅ SKAPAD
├── storage.js ✅ SKAPAD
├── calendar.js ✅ SKAPAD
├── Script.js (behåll som main entry)
└── (skapa vid behov):
    ├── projects.js (recalculateAllTasks)
    ├── rendering.js (renderTasks, renderProjectBlock, renderNonProjectBlock)
    ├── selection.js (multi-select funktioner)
    ├── contextmenu.js (showContextMenu + alla menu-funktioner)
    ├── modals.js (datum-pickers, dialogs)
    ├── reports.js (generateWeeklyReport, export)
    ├── interruptions.js (avbrottstidslinje)
    └── dragdrop.js (drag & drop, swap)
```

## KRITISKA BEROENDEN

- `recalculateAllTasks()` används av nästan ALLT
- `renderTasks()` måste köras efter varje data-ändring
- `save()` måste anropas för att spara till localStorage

## TIPS FÖR NAVIGERING

- Sök efter funktionsnamn med Ctrl+F
- Stora funktioner (>200 rader): recalculateAllTasks, generateWeeklyReport, renderTasks
- Context menu har många sub-funktioner (editProjectTotalHours, offsetProject, etc.)
