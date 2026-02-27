// ===============================================
// DATAHANTERING & LAGRING
// ===============================================

function save(){
  try {
    localStorage.setItem('timelineTasks', JSON.stringify(tasks));
    saveUndoState(); // Spara till undo-stack vid varje ändring
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Varning: Lagringsutrymmet är fullt! Exportera dina data innan du fortsätter.');
      console.error('localStorage quota exceeded:', e);
    } else {
      console.error('Save failed:', e);
    }
  }
}

// ===============================================
// UNDO/REDO SYSTEM
// ===============================================
function saveUndoState() {
  // Spara alla datatyper i ett kombinerat state
  const currentState = JSON.stringify({
    tasks: tasks,
    interruptionTasks: typeof interruptionTasks !== 'undefined' ? interruptionTasks : {},
    qualityLossTasks: typeof qualityLossTasks !== 'undefined' ? qualityLossTasks : {}
  });
  
  // Undvik att spara samma state flera gånger i rad
  if (undoStack.length > 0 && undoStack[undoStack.length - 1] === currentState) {
    return;
  }
  
  undoStack.push(currentState);
  
  // Begränsa stacken
  if (undoStack.length > MAX_UNDO_STEPS) {
    undoStack.shift();
  }
  
  // Rensa redo-stacken när ny ändring görs
  redoStack = [];
}

function undo() {
  if (undoStack.length <= 1) {
    document.getElementById('info').textContent = 'Inget att ångra!';
    return;
  }
  
  // Spara nuvarande state till redo
  const currentState = undoStack.pop();
  redoStack.push(currentState);
  
  // Ta tillbaka till förra state
  const previousState = JSON.parse(undoStack[undoStack.length - 1]);
  
  // Återställ alla datatyper
  tasks = previousState.tasks || [];
  if (typeof interruptionTasks !== 'undefined' && previousState.interruptionTasks) {
    interruptionTasks = previousState.interruptionTasks;
    localStorage.setItem('interruptionTasks', JSON.stringify(interruptionTasks));
  }
  if (typeof qualityLossTasks !== 'undefined' && previousState.qualityLossTasks) {
    qualityLossTasks = previousState.qualityLossTasks;
    localStorage.setItem('qualityLossTasks', JSON.stringify(qualityLossTasks));
  }
  
  localStorage.setItem('timelineTasks', JSON.stringify(tasks));
  recalculateAllTasks();
  
  // Uppdatera avbrotts- och kvalitetsförlusttidslinjer
  if (typeof renderInterruptionTimeline === 'function') renderInterruptionTimeline();
  if (typeof renderQualityLossTimeline === 'function') renderQualityLossTimeline();
  
  document.getElementById('info').textContent = 'Ångrat!';
  setTimeout(() => document.getElementById('info').textContent = '', 2000);
}

function redo() {
  if (redoStack.length === 0) {
    document.getElementById('info').textContent = 'Inget att göra om!';
    return;
  }
  
  // Återställ från redo
  const nextStateStr = redoStack.pop();
  undoStack.push(nextStateStr);
  const nextState = JSON.parse(nextStateStr);
  
  // Återställ alla datatyper
  tasks = nextState.tasks || [];
  if (typeof interruptionTasks !== 'undefined' && nextState.interruptionTasks) {
    interruptionTasks = nextState.interruptionTasks;
    localStorage.setItem('interruptionTasks', JSON.stringify(interruptionTasks));
  }
  if (typeof qualityLossTasks !== 'undefined' && nextState.qualityLossTasks) {
    qualityLossTasks = nextState.qualityLossTasks;
    localStorage.setItem('qualityLossTasks', JSON.stringify(qualityLossTasks));
  }
  
  localStorage.setItem('timelineTasks', JSON.stringify(tasks));
  recalculateAllTasks();
  
  // Uppdatera avbrotts- och kvalitetsförlusttidslinjer
  if (typeof renderInterruptionTimeline === 'function') renderInterruptionTimeline();
  if (typeof renderQualityLossTimeline === 'function') renderQualityLossTimeline();
  
  document.getElementById('info').textContent = 'Gjort om!';
  setTimeout(() => document.getElementById('info').textContent = '', 2000);
}

function downloadData() {
  // Kombinera tasks och interruption data i en struktur
  const combinedData = {
    tasks: tasks,
    interruptionTasks: typeof interruptionTasks !== 'undefined' ? interruptionTasks : {},
    qualityLossTasks: typeof qualityLossTasks !== 'undefined' ? qualityLossTasks : {}
  };
  const dataStr = JSON.stringify(combinedData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `arbetsplan_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  document.getElementById('info').textContent = 'Data sparad till fil!';
}

function loadData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const loadedData = JSON.parse(e.target.result);
      
      // Hantera både gamla format (array) och nytt format (object med tasks och interruptionTasks)
      if (Array.isArray(loadedData) && loadedData.every(item => item.date && item.type)) {
        // Gamla format - bara tasks
        tasks = loadedData;
        save();
        recalculateAllTasks();
        document.getElementById('info').textContent = `Data laddad från ${file.name}!`;
      } else if (loadedData.tasks && Array.isArray(loadedData.tasks)) {
        // Nytt format - tasks och interruptionTasks
        tasks = loadedData.tasks;
        if (typeof interruptionTasks !== 'undefined') {
          interruptionTasks = loadedData.interruptionTasks || {};
          localStorage.setItem('interruptionTasks', JSON.stringify(interruptionTasks));
        }
        if (typeof qualityLossTasks !== 'undefined') {
          qualityLossTasks = loadedData.qualityLossTasks || {};
          localStorage.setItem('qualityLossTasks', JSON.stringify(qualityLossTasks));
        }
        save();
        recalculateAllTasks();
        if (typeof renderInterruptionTimeline === 'function') renderInterruptionTimeline();
        if (typeof renderQualityLossTimeline === 'function') renderQualityLossTimeline();
        document.getElementById('info').textContent = `Data laddad från ${file.name}!`;
      } else {
        alert('Felaktigt filformat. Filen måste innehålla uppgiftsdata.');
      }
    } catch (err) {
      alert('Kunde inte läsa filen. Kontrollera att det är en giltig JSON-fil.');
      console.error(err);
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function clearAllTasks() {
  if (!confirm('Är du säker på att du vill radera ALLA uppgifter? Detta går inte att ångra!')) return;
  tasks = [];
  interruptionTasks = {};
  qualityLossTasks = {};
  save();
  localStorage.setItem('interruptionTasks', JSON.stringify(interruptionTasks));
  localStorage.setItem('qualityLossTasks', JSON.stringify(qualityLossTasks));
  
  // Rensa DOM-data för alla dagar
  document.querySelectorAll('.day').forEach(dayDiv => {
    dayDiv.dataset.interruptionhours = '0';
    dayDiv.dataset.qualitylosshours = '0';
    dayDiv.dataset.meetinghours = '0';
    
    // Rensa avbrotts- och kvalitetsförlust-indikatorer
    const interruptionInfo = dayDiv.querySelector('[id^="interruption-info-"]');
    if (interruptionInfo) interruptionInfo.textContent = '';
    
    const qualityLossInfo = dayDiv.querySelector('[id^="quality-loss-info-"]');
    if (qualityLossInfo) qualityLossInfo.textContent = '';
    
    // Återställ mötestid-input till 0
    const meetingInput = dayDiv.querySelector('input[onchange*="updateMeetingHours"]');
    if (meetingInput) meetingInput.value = '0';
  });
  
  recalculateAllTasks();
  
  // Regenerera tidslinjen för att visa rent
  if (typeof generateTimeline === 'function') {
    generateTimeline();
  }
  
  if (typeof renderInterruptionTimeline === 'function') {
    renderInterruptionTimeline();
  }
  if (typeof renderQualityLossTimeline === 'function') {
    renderQualityLossTimeline();
  }
  document.getElementById('info').textContent = 'Alla uppgifter raderade!';
}
