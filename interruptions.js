// JavaScript för avbrottslogg
let interruptionTasks = JSON.parse(localStorage.getItem('interruptionTasks') || '{}');

// Guard för att förhindra dubbelanrop av init
let interruptionTimelineInitialized = false;

// Debounce-timeout för att undvika race conditions
let interruptionRecalcTimeout = null;

// Debounced recalculate för att förhindra multipla snabba omräkningar
function debouncedRecalculateFromInterruption(scrollLeft) {
  if (interruptionRecalcTimeout) clearTimeout(interruptionRecalcTimeout);
  interruptionRecalcTimeout = setTimeout(() => {
    if (typeof recalculateAllTasks === 'function') {
      recalculateAllTasks();
    }
    // Återställ scrollposition efter omräkning
    const timeline = document.getElementById('timeline');
    if (timeline && scrollLeft !== undefined) {
      timeline.scrollLeft = scrollLeft;
    }
  }, 150);
}

function initInterruptionTimeline() {
  // Init är en wrapper för render - kan anropas flera gånger
  renderInterruptionTimeline();
}

// Separat render-funktion som kan anropas flera gånger
function renderInterruptionTimeline() {
  const timeline = document.getElementById('interruption-timeline');
  if (!timeline) return; // Säkerställ att DOM är redo
  timeline.innerHTML = '';

  const allDates = getFullYearDates();

  allDates.forEach(dateStr => {
    const date = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = getWeekdays()[date.getDay()];
    const dayNum = date.getDate();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = SWEDISH_HOLIDAYS(date);

    // Skapa dag-div
    const dayDiv = document.createElement('div');
    dayDiv.className = 'interruption-day';
    dayDiv.setAttribute('data-date', dateStr);

    if (isWeekend) dayDiv.classList.add('weekend');
    if (isHoliday) dayDiv.classList.add('holiday');

    // Dag-header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'interruption-day-header';
    dayHeader.innerHTML = `${dayOfWeek} ${dayNum}`;
    dayDiv.appendChild(dayHeader);

    // Kontainer för uppgifter
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'interruption-tasks-container';

    // Hämta eller skapa uppgifter för denna dag
    if (!interruptionTasks[dateStr]) {
      interruptionTasks[dateStr] = [];
    }

    // Rendera befintliga uppgifter
    interruptionTasks[dateStr].forEach((task, index) => {
      const taskEl = createInterruptionTaskElement(dateStr, index, task);
      tasksContainer.appendChild(taskEl);
    });

    // Sammanfattning av avbrottstid
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'interruption-summary';
    summaryDiv.id = `interruption-summary-${dateStr}`;
    summaryDiv.style.cssText = 'font-size: 0.75em; color: #e74c3c; font-weight: bold; padding: 4px; margin-top: 4px; border-top: 1px solid #eee;';
    updateDayInterruptionSummaryElement(dateStr, summaryDiv);
    dayDiv.appendChild(summaryDiv);

    dayDiv.appendChild(tasksContainer);

    // Lägg till knapp för nya uppgifter
    const addBtn = document.createElement('button');
    addBtn.style.cssText = 'width: 100%; padding: 4px; margin-top: auto; font-size: 0.7em; background: #f0f0f0; border: 1px dashed #ccc; cursor: pointer; border-radius: 4px;';
    addBtn.textContent = typeof t === 'function' ? t('addInterruption') : 'Lägg till avbrott';
    addBtn.onclick = () => addInterruptionTask(dateStr);
    dayDiv.appendChild(addBtn);

    timeline.appendChild(dayDiv);
  });
}

function createInterruptionTaskElement(dateStr, index, task = {}) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'interruption-task';

  // Rad 1: Tidsfält + Avdelning
  const row1 = document.createElement('div');
  row1.className = 'interruption-task-row';

  // Tidsfält för avbrottet (dropdown)
  const timeInput = document.createElement('select');
  timeInput.style.cssText = 'width: 60px; padding: 2px 4px; border: 1px solid #ddd; border-radius: 2px; font-size: 0.9em;';
  
  // Lägg till tidsalternativ
  const timeOptions = [
    { value: '', label: '---' },
    { value: '0.08', label: '5m' },
    { value: '0.17', label: '10m' },
    { value: '0.25', label: '15m' },
    { value: '0.5', label: '30m' },
    { value: '0.75', label: '45m' },
    { value: '1', label: '1h' },
    { value: '1.5', label: '1.5h' },
    { value: '2', label: '2h' },
    { value: '3', label: '3h' },
    { value: '4', label: '4h' },
    { value: '6', label: '6h' },
    { value: '8', label: '8h' }
  ];
  
  timeOptions.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    timeInput.appendChild(option);
  });
  
  timeInput.value = task.hours || '';
  timeInput.onchange = () => {
    // Spara scrollposition före omräkning
    const timeline = document.getElementById('timeline');
    const scrollLeft = timeline ? timeline.scrollLeft : 0;
    
    interruptionTasks[dateStr][index].hours = parseFloat(timeInput.value) || 0;
    saveInterruptionData();
    updateDayInterruptionSummary(dateStr);
    // Omberäkna projekt när avbrottstid ändras (med debouncing)
    debouncedRecalculateFromInterruption(scrollLeft);
  };

  const departmentSelect = document.createElement('select');
  const departments = typeof getDepartments === 'function' ? getDepartments() : ['PI', 'Prog', 'ProjMan', 'Comm', 'Instal', 'Devel', 'Sales', 'Service', 'Other'];
  
  // Lägg till --- som första alternativ
  const deptDefaultOption = document.createElement('option');
  deptDefaultOption.value = '';
  deptDefaultOption.textContent = '---';
  departmentSelect.appendChild(deptDefaultOption);
  
  departments.forEach(dep => {
    const option = document.createElement('option');
    option.value = dep;
    option.textContent = dep;
    departmentSelect.appendChild(option);
  });
  departmentSelect.value = task.department || '';
  departmentSelect.onchange = () => {
    interruptionTasks[dateStr][index].department = departmentSelect.value;
    saveInterruptionData();
  };

  row1.appendChild(timeInput);
  row1.appendChild(departmentSelect);
  taskDiv.appendChild(row1);

  // Rad 2: Kontaktmetod
  const row2 = document.createElement('div');
  row2.className = 'interruption-task-row';

  const contactSelect = document.createElement('select');
  const contacts = typeof getContacts === 'function' ? getContacts() : ['Mail', 'Teams', 'Telefon', 'Direkt'];
  
  // Lägg till --- som första alternativ
  const contactDefaultOption = document.createElement('option');
  contactDefaultOption.value = '';
  contactDefaultOption.textContent = '---';
  contactSelect.appendChild(contactDefaultOption);
  
  contacts.forEach(contact => {
    const option = document.createElement('option');
    option.value = contact;
    option.textContent = contact;
    contactSelect.appendChild(option);
  });
  contactSelect.value = task.contact || '';
  contactSelect.onchange = () => {
    interruptionTasks[dateStr][index].contact = contactSelect.value;
    saveInterruptionData();
  };

  row2.appendChild(contactSelect);
  taskDiv.appendChild(row2);

  // Rad 3: Textfält för ärende
  const issueInput = document.createElement('textarea');
  issueInput.placeholder = typeof t === 'function' ? t('description') : 'Beskriv ärendet...';
  issueInput.value = task.issue || '';
  issueInput.onchange = () => {
    interruptionTasks[dateStr][index].issue = issueInput.value;
    saveInterruptionData();
  };
  taskDiv.appendChild(issueInput);

  // Raderaknapp
  const deleteBtn = document.createElement('button');
  deleteBtn.style.cssText = 'padding: 2px; font-size: 0.7em; background: #e74c3c; color: white; border: none; border-radius: 2px; cursor: pointer;';
  deleteBtn.textContent = typeof t === 'function' ? t('delete') : 'Radera';
  deleteBtn.onclick = () => {
    interruptionTasks[dateStr].splice(index, 1);
    saveInterruptionData();
    initInterruptionTimeline();
  };
  taskDiv.appendChild(deleteBtn);

  return taskDiv;
}

function addInterruptionTask(dateStr) {
  if (!interruptionTasks[dateStr]) {
    interruptionTasks[dateStr] = [];
  }
  interruptionTasks[dateStr].push({ department: '', contact: '', issue: '', hours: 0 });
  saveInterruptionData();
  renderInterruptionTimeline();
}

function updateDayInterruptionSummaryElement(dateStr, summaryDiv) {
  const dayTasks = interruptionTasks[dateStr] || [];
  const totalInterruptionHours = dayTasks.reduce((sum, task) => sum + (parseFloat(task.hours) || 0), 0);
  
  const interruptionLabel = typeof t === 'function' ? t('interruptions') : 'Avbrott';
  
  if (totalInterruptionHours > 0) {
    summaryDiv.textContent = `⚠ ${interruptionLabel}: ${totalInterruptionHours.toFixed(2)} h`;
    summaryDiv.style.display = 'block';
  } else {
    summaryDiv.textContent = '';
    summaryDiv.style.display = 'none';
  }
}

function updateDayInterruptionSummary(dateStr) {
  const summaryDiv = document.getElementById(`interruption-summary-${dateStr}`);
  if (summaryDiv) {
    updateDayInterruptionSummaryElement(dateStr, summaryDiv);
  }
  
  // Uppdatera även dataset på huvudtidslinjens dag-element
  const mainDayDiv = document.querySelector(`.day[data-date='${dateStr}']`);
  if (mainDayDiv) {
    const totalHours = getInterruptionHoursForDate(dateStr);
    mainDayDiv.dataset.interruptionhours = totalHours;
    
    // Uppdatera avbrottsinfo-elementet i huvudtidslinjen direkt
    const interruptionInfo = mainDayDiv.querySelector(`#interruption-info-${dateStr}`);
    if (interruptionInfo) {
      if (totalHours > 0) {
        interruptionInfo.textContent = `⚠ Avbrott: ${totalHours.toFixed(2)} h`;
      } else {
        interruptionInfo.textContent = '';
      }
    }
  }
}

// Funktion för att hämta total avbrottstid för ett datum
function getInterruptionHoursForDate(dateStr) {
  const dayTasks = interruptionTasks[dateStr] || [];
  return dayTasks.reduce((sum, task) => sum + (parseFloat(task.hours) || 0), 0);
}

function saveInterruptionData() {
  localStorage.setItem('interruptionTasks', JSON.stringify(interruptionTasks));
}

// Initialisera när sidan laddar
document.addEventListener('DOMContentLoaded', initInterruptionTimeline);