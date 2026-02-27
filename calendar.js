// ===============================================
// KALENDER & DATUM-FUNKTIONER
// ===============================================

function toLocalISOString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const SWEDISH_HOLIDAYS = date => {
  const year = date.getFullYear();
  const holidays = [
    new Date(year,0,1), new Date(year,0,6), new Date(year,4,1), 
    new Date(year,5,6), new Date(year,11,24), new Date(year,11,25), 
    new Date(year,11,26), new Date(year,11,31)
  ];
  return holidays.some(h => h.toDateString() === date.toDateString());
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

function getFullYearDates() {
    const dates = [];
    const start = new Date(currentYear, 0, 1);
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        dates.push(toLocalISOString(d));
    }
    return dates;
}

function getWeekdays() {
    return typeof t === 'function' ? t('weekdays') : ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'];
}

// Hjälpfunktion för att räkna arbetsdagar mellan två datum (inklusive båda)
function countWorkDays(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // Exkludera söndag (0) och lördag (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

function changeYear() {
  const newYear = parseInt(yearInput.value);
  if (isNaN(newYear) || newYear < 1900 || newYear > 2100) {
    alert('Ogiltigt år! Ange ett år mellan 1900 och 2100.');
    yearInput.value = currentYear;
    return;
  }
  
  currentYear = newYear;
  generateTimeline();
  document.getElementById('info').textContent = `Visning uppdaterad till år ${currentYear}`;
  setTimeout(() => document.getElementById('info').textContent = '', 2000);
}
