// ===============================================
// TANGENTBORDSHANTERING
// ===============================================

// Lyssna på Ctrl+Z och Ctrl+Y
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    undo();
  } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault();
    redo();
  } else if (e.key === 'Escape') {
    // Avbryt alla speciallägen med Escape
    if (swapMode) {
      cancelSwapMode();
    } else if (splitMode) {
      splitMode = null;
      document.getElementById('info').textContent = 'Split-läge avbrutet';
      document.getElementById('info').style.color = '';
      document.getElementById('info').style.fontWeight = '';
      setTimeout(() => document.getElementById('info').textContent = '', 2000);
    } else if (selectedBlocks.size > 0) {
      clearBlockSelections();
    }
  } else if (e.ctrlKey && e.key === 'a') {
    // Ctrl+A: Markera alla block
    e.preventDefault();
    tasks.forEach((task, idx) => {
      if (task.type !== 'meeting' && task.type !== 'dummy') {
        selectedBlocks.add(idx);
      }
    });
    recalculateAllTasks();
    updateInfoMessage();
  }
  
  // Visa copy cursor när Ctrl hålls ned
  if (e.ctrlKey || e.metaKey) {
    document.querySelectorAll('.block').forEach(block => {
      block.classList.add('copying');
    });
  }
});

// Ta bort copy cursor när Ctrl släpps
document.addEventListener('keyup', (e) => {
  if (!e.ctrlKey && !e.metaKey) {
    document.querySelectorAll('.block.copying').forEach(block => {
      block.classList.remove('copying');
    });
  }
});
