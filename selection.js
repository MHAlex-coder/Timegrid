// ===============================================
// MULTI-SELECT & BLOCK-MARKERING
// ===============================================

// Lagrar task-identifiering istället för index
// Format: Set med objekt { name, date, type }
let selectedTasksSet = [];

function getTaskKey(task) {
  return `${task.name}|${task.date}|${task.type}`;
}

function toggleBlockSelection(index, blockElement) {
  const idx = parseInt(index);
  
  // Hämta task-identifiering från blockElement
  const taskName = blockElement.dataset.taskName;
  const taskDate = blockElement.dataset.taskDate;
  const taskType = blockElement.dataset.taskType;
  
  if (!taskName || !taskDate || !taskType) {
    console.warn('Block saknar task-data', blockElement.dataset);
    return;
  }
  
  const taskKey = `${taskName}|${taskDate}|${taskType}`;
  const existingIdx = selectedTasksSet.findIndex(t => getTaskKey(t) === taskKey);
  
  if (existingIdx !== -1) {
    // Ta bort från selektion
    selectedTasksSet.splice(existingIdx, 1);
    selectedBlocks.delete(idx);
    blockElement.classList.remove('selected');
  } else {
    // Lägg till i selektion
    selectedTasksSet.push({ name: taskName, date: taskDate, type: taskType });
    selectedBlocks.add(idx);
    blockElement.classList.add('selected');
    
    // Om bara ett block är markerat, visa kontextmenyn direkt
    if (selectedTasksSet.length === 1) {
      const rect = blockElement.getBoundingClientRect();
      const task = tasks[idx];
      if (task) {
        showContextMenu(rect.right + 5, rect.top, idx, task.date);
      }
    }
  }
  
  lastSelectedIndex = idx;
  updateInfoMessage();
}

function selectBlockRange(index, blockElement) {
  const idx = parseInt(index);
  
  if (lastSelectedIndex === null) {
    toggleBlockSelection(index, blockElement);
    return;
  }
  
  // Markera alla block mellan lastSelectedIndex och idx via DOM-elements
  // Hitta alla block i DOM och selektera de som är mellan start och end
  const allBlocks = document.querySelectorAll('.block[data-task-name]');
  const blockArray = Array.from(allBlocks);
  
  const startBlockIndex = blockArray.findIndex(b => parseInt(b.dataset.index) === lastSelectedIndex);
  const endBlockIndex = blockArray.findIndex(b => parseInt(b.dataset.index) === idx);
  
  if (startBlockIndex === -1 || endBlockIndex === -1) {
    // Fallback: bara markera det klickade blocket
    toggleBlockSelection(index, blockElement);
    return;
  }
  
  const start = Math.min(startBlockIndex, endBlockIndex);
  const end = Math.max(startBlockIndex, endBlockIndex);
  
  for (let i = start; i <= end; i++) {
    const block = blockArray[i];
    const blockIdx = parseInt(block.dataset.index);
    const taskName = block.dataset.taskName;
    const taskDate = block.dataset.taskDate;
    const taskType = block.dataset.taskType;
    
    if (taskName && taskDate && taskType) {
      const taskKey = `${taskName}|${taskDate}|${taskType}`;
      const existingIdx = selectedTasksSet.findIndex(t => getTaskKey(t) === taskKey);
      
      if (existingIdx === -1) {
        selectedTasksSet.push({ name: taskName, date: taskDate, type: taskType });
        selectedBlocks.add(blockIdx);
        block.classList.add('selected');
      }
    }
  }
  
  lastSelectedIndex = idx;
  updateInfoMessage();
}

function clearBlockSelections() {
  selectedBlocks.clear();
  selectedTasksSet = [];
  lastSelectedIndex = null;
  
  // Ta bort selected-klassen från alla block
  document.querySelectorAll('.block.selected').forEach(b => {
    b.classList.remove('selected');
  });
  
  updateInfoMessage();
}

function updateInfoMessage() {
  const count = selectedTasksSet.length;
  if (count > 0) {
    document.getElementById('info').textContent = `${count} block markerade. Högerklicka för att utföra åtgärder.`;
  } else {
    document.getElementById('info').textContent = '';
  }
}

function moveSelectedBlocks(targetDate) {
  if (selectedTasksSet.length === 0) return;
  
  saveUndoState();
  
  // Flytta tasks baserat på matchning direkt från selectedTasksSet
  selectedTasksSet.forEach(taskInfo => {
    const task = tasks.find(t => 
      t.name === taskInfo.name && 
      t.date === taskInfo.date && 
      t.type === taskInfo.type
    );
    if (task) {
      task.date = targetDate;
    }
  });
  
  clearBlockSelections();
  recalculateAllTasks();
  
  document.getElementById('info').textContent = 'Block flyttade!';
  setTimeout(() => document.getElementById('info').textContent = '', 2000);
}

function deleteSelectedBlocks() {
  if (selectedTasksSet.length === 0) return;
  
  // Separera projekt-block från andra block
  const projectTasks = selectedTasksSet.filter(t => t.type === 'project');
  const otherTasks = selectedTasksSet.filter(t => t.type !== 'project');
  
  if (projectTasks.length > 0 && otherTasks.length > 0) {
    alert('Du kan inte radera projektblock och andra typer av block samtidigt!');
    return;
  }
  
  if (projectTasks.length > 0) {
    // Radera projektblock - skapa lucka på den dagen
    if (!confirm(`Vill du radera ${projectTasks.length} projektblock? En lucka skapas och timmarna allokeras framåt.`)) return;
    
    saveUndoState();
    
    // Ta bort blocken och skapa gap-placeholders
    projectTasks.forEach(taskInfo => {
      const task = tasks.find(t => 
        t.name === taskInfo.name && 
        t.date === taskInfo.date && 
        t.type === taskInfo.type
      );
      
      if (task) {
        const projectDate = task.date;
        const projectName = task.name;
        const projectTotalHours = task.totalHours;
        const projectDirection = task.direction || 'forward';
        const projectLaneIndex = task.laneIndex;
        
        // Ta bort själva blocket
        const idx = tasks.findIndex(t => t === task);
        if (idx !== -1) {
          tasks.splice(idx, 1);
        }
        
        // Skapa ett gap-block (lucka) på samma datum
        // Detta är ett locked block med hours=0 som skapar en visuell lucka
        tasks.push({
          name: projectName,
          type: 'project',
          date: projectDate,
          hours: 0,
          totalHours: projectTotalHours,
          locked: true,
          hasRealHours: false,
          direction: projectDirection,
          laneIndex: projectLaneIndex
        });
      }
    });
    
    clearBlockSelections();
    save();
    recalculateAllTasks();
    
    document.getElementById('info').textContent = `${projectTasks.length} projektblock raderade och timmarna omallokerade!`;
    setTimeout(() => document.getElementById('info').textContent = '', 3000);
  } else {
    // Radera andra typer av block
    if (!confirm(`Vill du radera ${otherTasks.length} markerade block?`)) return;
    
    saveUndoState();
    
    // Ta bort blocken genom att matcha på data, inte index
    otherTasks.forEach(taskInfo => {
      const idx = tasks.findIndex(t => 
        t.name === taskInfo.name && 
        t.date === taskInfo.date && 
        t.type === taskInfo.type
      );
      if (idx !== -1) {
        tasks.splice(idx, 1);
      }
    });
    
    clearBlockSelections();
    save();
    recalculateAllTasks();
    
    document.getElementById('info').textContent = `${otherTasks.length} block raderade!`;
    setTimeout(() => document.getElementById('info').textContent = '', 2000);
  }
}
