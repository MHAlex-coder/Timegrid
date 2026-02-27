// ===============================================
// KONFIGURATION & KONSTANTER
// ===============================================
// HOURS_PER_DAY_DEFAULT: Standard projekttid per dag (ändra siffran nedan för att justera)
// Hämta från localStorage, men om det är mindre än 7, använd 7 som default
let storedHours = parseFloat(localStorage.getItem('HOURS_PER_DAY_DEFAULT'));
let HOURS_PER_DAY_DEFAULT = (storedHours && storedHours >= 7) ? storedHours : 7;
// Uppdatera localStorage om det var fel värde
if (!storedHours || storedHours < 7) localStorage.setItem('HOURS_PER_DAY_DEFAULT', '7');  // <-- Ändra 7 till önskat standardvärde
const DEFAULT_WEEKLY_HOURS = 40;
const OVERTIME_LIMIT = 8.0;

// ===============================================
// HJÄLPFUNKTIONER FÖR PRECISION
// ===============================================
// Konstant för floating-point jämförelser
const EPSILON = 0.001;

// Avrunda till 2 decimaler för att undvika floating-point fel
function roundHours(value) {
  return Math.round(value * 100) / 100;
}

// Säker jämförelse för timmar (tar hänsyn till floating-point precision)
function hoursGreaterThan(a, b) {
  return a > b + EPSILON;
}

function hoursLessThanOrEqual(a, b) {
  return a <= b + EPSILON;
}

// Säker parse av nummer med fallback
function safeParseFloat(value, defaultValue) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Säker konvertering av datumsträng till Date-objekt (undviker timezone-problem)
// Om dateStr redan är ett Date-objekt, returneras det direkt
function parseDate(dateStr) {
  if (dateStr instanceof Date) {
    return dateStr;
  }
  if (typeof dateStr === 'string') {
    // Lägg till T00:00:00 om strängen är i format YYYY-MM-DD för att undvika UTC-tolkning
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(dateStr + 'T00:00:00');
    }
    return new Date(dateStr);
  }
  return new Date(dateStr);
}

// ===============================================
// GLOBALA VARIABLER
// ===============================================
let currentYear = new Date().getFullYear();
let tasks = JSON.parse(localStorage.getItem('timelineTasks') || '[]');
let pendingTask = null;
let currentPlacementDate = null;
let dragMode = 'single';
let contextOriginDate = null;
let splitMode = null; // {projectName, splitDate} fÃ¶r att dela upp projekt

// UNDO/REDO System
let undoStack = [];
let redoStack = [];
const MAX_UNDO_STEPS = 50;

// MULTI-SELECT System
let selectedBlocks = new Set(); // Set av task indices
let lastSelectedIndex = null; // FÃ¶r Shift+klick

// SWAP Mode
let swapMode = null; // {sourceIndex, sourceDate} nÃ¤r man ska byta dagar

// COPY Mode
let copyMode = false; // true nÃ¤r Ctrl hÃ¥lls ned under drag

// DOM-referenser
const timeline = document.getElementById('timeline');
const yearInput = document.getElementById('yearInput');

