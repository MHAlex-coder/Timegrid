// ===============================================
// SCRIPT.JS - KÄRN-FUNKTIONALITET
// ===============================================
// OBS: Globala variabler och konstanter definieras i config.js
// OBS: Datum-funktioner finns i calendar.js
// OBS: Lagrings-funktioner finns i storage.js
// OBS: Multi-select finns i selection.js
// OBS: Tangentbordshantering finns i keyboard.js

// ===============================================
// C. VERKTYG & HJÄLPFUNKTIONER (Datum/Hjälp)
// ===============================================
// getWeekdays() finns nu i calendar.js

// ===============================================
// D. DATAHANTERING (Spara/Ladda/Radera/Exportera)
// ... (Flyttat till storage.js) ...
// ===============================================

// save(), undo(), redo() finns nu i storage.js

// ===============================================
// TANGENTBORDSHANTERING
// ... (Flyttat till keyboard.js) ...
// ===============================================

// clearAllTasks() finns nu i storage.js

// Funktion för att toggla fil-menyn
function toggleFileMenu() {
  const menu = document.getElementById('fileMenu');
  if (menu.style.display === 'none' || menu.style.display === '') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

// Funktion för att ändra standard projekttid per dag
function changeDefaultProjectHours() {
  const currentValue = HOURS_PER_DAY_DEFAULT;
  const newValue = prompt(`Ange standard projekttid per dag:\n\nNuvarande: ${currentValue}h`, currentValue);
  
  if (newValue === null || newValue.trim() === '') return;
  
  const parsedValue = parseFloat(newValue);
  if (isNaN(parsedValue) || parsedValue <= 0 || parsedValue > 24) {
    alert('Ogiltigt värde! Ange ett tal mellan 0 och 24.');
    return;
  }
  
  const oldValue = HOURS_PER_DAY_DEFAULT;
  HOURS_PER_DAY_DEFAULT = parsedValue;
  localStorage.setItem('HOURS_PER_DAY_DEFAULT', parsedValue);
  
  // Uppdatera DOM först så att workhours är korrekt
  document.querySelectorAll('.day').forEach(dayDiv => {
    const currentWorkHours = parseFloat(dayDiv.dataset.workhours);
    if (currentWorkHours === oldValue || isNaN(currentWorkHours)) {
      dayDiv.dataset.workhours = parsedValue;
      // Uppdatera även input-fältet
      const workHoursInput = dayDiv.querySelector('input[type="number"]');
      if (workHoursInput && parseFloat(workHoursInput.value) === oldValue) {
        workHoursInput.value = parsedValue;
      }
    }
  });
  
  // Gruppera tasks per dag och uppdatera dayLimit där det matchar gamla standardvärdet
  const tasksByDate = {};
  tasks.forEach(task => {
    if (!tasksByDate[task.date]) {
      tasksByDate[task.date] = [];
    }
    tasksByDate[task.date].push(task);
  });
  
  // För varje dag, kolla om dagens dayLimit är det gamla standardvärdet
  Object.keys(tasksByDate).forEach(date => {
    const dayTasks = tasksByDate[date];
    // Hitta aktuell dayLimit för dagen (första task med dayLimit satt)
    const currentDayLimit = dayTasks.find(t => t.dayLimit !== undefined)?.dayLimit;
    
    // Om dagen har det gamla standardvärdet (eller inget värde alls), uppdatera alla tasks för den dagen
    if (currentDayLimit === oldValue || currentDayLimit === undefined) {
      dayTasks.forEach(task => {
        task.dayLimit = parsedValue;
      });
    }
  });
  
  // Fråga om befintliga projekt ska uppdateras
  const updateExisting = confirm(
    `Standard projekttid är nu ${parsedValue}h per dag.\n\n` +
    `Vill du uppdatera alla befintliga projekt på tidslinjen med denna nya standard?\n\n` +
    `Detta kommer att räkna om totala projekttimmar baserat på varje projekts varaktighet.`
  );
  
  if (updateExisting) {
    updateExistingProjectsWithNewStandard(parsedValue);
  }
  
  save();
  // Omallokera alla projekt med det nya standardvärdet
  recalculateAllTasks();
  renderTasks();
  
  document.getElementById('info').textContent = `Standard projekttid uppdaterad till ${parsedValue}h per dag!`;
  setTimeout(() => document.getElementById('info').textContent = '', 3000);
}

// Funktion för att uppdatera befintliga projekt med ny timstandard
function updateExistingProjectsWithNewStandard(hoursPerDay) {
  // Gruppera alla projektblock per projektnamn
  const projectGroups = {};
  
  tasks.forEach((task, idx) => {
    if (task.type === 'project') {
      const baseName = task.name.replace(/\s*\(del\s+\d+\)\s*$/i, '');
      if (!projectGroups[baseName]) {
        projectGroups[baseName] = [];
      }
      projectGroups[baseName].push(idx);
    }
  });
  
  // För varje projekt, beräkna varaktighet och ny totalHours
  Object.keys(projectGroups).forEach(projectName => {
    const indices = projectGroups[projectName];
    if (indices.length === 0) return;
    
    // Hitta första och sista dagen för projektet
    let minDate = null;
    let maxDate = null;
    
    indices.forEach(idx => {
      const task = tasks[idx];
      const taskDate = new Date(task.date + 'T00:00:00');
      if (!minDate || taskDate < minDate) minDate = taskDate;
      if (!maxDate || taskDate > maxDate) maxDate = taskDate;
    });
    
    // Beräkna antal arbetsdagar (exkludera helger)
    const workDays = countWorkDays(minDate, maxDate);
    const newTotalHours = workDays * hoursPerDay;
    
    // Uppdatera totalHours för alla block i projektet
    indices.forEach(idx => {
      tasks[idx].totalHours = newTotalHours;
    });
  });
  
  save();
}

// countWorkDays() finns nu i calendar.js

// Stäng menyn om man klickar utanför
document.addEventListener('click', function(e) {
  const menu = document.getElementById('fileMenu');
  const btn = document.getElementById('fileMenuBtn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.style.display = 'none';
  }
});

// downloadData() och loadData() finns nu i storage.js

function exportToCsv() {
    const headers = [
        "Datum", "Vecka", "Veckodag", "Max_Arbetstid_h", "Bokad_Mötestid_h", 
        "Bokad_Support_Change_h", "Avbrottstid_h", "Tillgänglig_Projekttid_h", 
        "Uppgiftsnamn", "Uppgiftstyp", "Allokerade_Timmar_h", "Total_Timmar_Projekt", "Riktning"
    ];
    let csvContent = headers.join(";") + "\n";
    
    const allDates = getFullYearDates(); // Använder det aktuella året
    const tasksByDate = tasks.reduce((acc, t) => {
        if (!acc[t.date]) acc[t.date] = [];
        acc[t.date].push(t);
        return acc;
    }, {});
    
    allDates.forEach(dateStr => {
        const d = new Date(dateStr);
        const dayTasks = tasksByDate[dateStr] || [];

        const dayLimit = dayTasks.find(t => t.dayLimit !== undefined)?.dayLimit || HOURS_PER_DAY_DEFAULT;
        
        const isWeekendOrHoliday = (d.getDay() === 0 || d.getDay() === 6 || SWEDISH_HOLIDAYS(d));
        const hasCustomData = dayTasks.length > 0 || dayLimit !== HOURS_PER_DAY_DEFAULT;

        if (isWeekendOrHoliday && !hasCustomData) {
            return;
        }
        
        const meetingHours = dayTasks
            .filter(t => t.type === 'meeting')
            .reduce((sum, t) => sum + t.hours, 0);

        const supportChangeHours = dayTasks
            .filter(t => t.type === 'support' || t.type === 'change')
            .reduce((sum, t) => sum + t.hours, 0);

        // Hämta avbrottstid för denna dag
        const interruptionHours = (typeof getInterruptionHoursForDate === 'function') 
            ? getInterruptionHoursForDate(dateStr) 
            : 0;

        const otherUsedHours = meetingHours + supportChangeHours + interruptionHours;
        const availableProjectTime = Math.max(0, dayLimit - otherUsedHours);

        const week = getWeekNumber(d);
        const weekdayName = getWeekdays()[d.getDay()];
        
        const allocatedTasks = dayTasks.filter(t => t.hours > 0.001 || t.type === 'project'); 

        if (allocatedTasks.length > 0) {
            allocatedTasks.forEach(t => {
                const row = [
                    dateStr,
                    `v${week}`,
                    weekdayName,
                    dayLimit,
                    meetingHours.toFixed(1).replace('.', ','),
                    supportChangeHours.toFixed(1).replace('.', ','),
                    interruptionHours.toFixed(1).replace('.', ','),
                    availableProjectTime.toFixed(1).replace('.', ','),
                    t.name,
                    t.type,
                    t.hours.toFixed(1).replace('.', ','),
                    t.type === 'project' ? t.totalHours.toFixed(1).replace('.', ',') : '',
                    t.type === 'project' ? (t.direction || 'forward') : ''
                ];
                csvContent += row.join(";") + "\n";
            });
        } else if (dayLimit > 0 && !isWeekendOrHoliday) {
             const row = [
                dateStr,
                `v${week}`,
                weekdayName,
                dayLimit,
                0,
                0,
                0,
                dayLimit.toFixed(1).replace('.', ','),
                "LEDIG/TILLGÄNGLIG",
                "free",
                0,
                '',
                ''
            ];
            csvContent += row.join(";") + "\n";
        }
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `arbetsplan_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.getElementById('info').textContent = 'Planeringen exporterad till Excel-fil (CSV)!';
}


// ===============================================
// E. KÄRNLOGIK (Omallokering av Projekt)
// ... (Inga ändringar i denna sektion - Projektberäkning intakt) ...
// ===============================================

function recalculateAllTasks() {
  // Bevara alla kommentarer från befintliga projektblock
  const commentMap = {}; // {projectName-date: comment}
  tasks.forEach(t => {
    if (t.type === 'project' && t.comment) {
      const key = `${t.name}-${t.date}`;
      commentMap[key] = t.comment;
      // Spara också med basnamn (utan del X) för att bevara vid split
      const baseName = t.name.replace(/\\s*\\(del\\s+\\d+\\)\\s*$/i, '');
      if (baseName !== t.name) {
        const baseKey = `${baseName}-${t.date}`;
        if (!commentMap[baseKey]) {
          commentMap[baseKey] = t.comment;
        }
      }
    }
  });
  
  // Spara alla locked (manuellt placerade) projektblock
  let lockedProjectBlocks = tasks.filter(t => t.type === 'project' && t.locked === true);
  
  // Slå ihop duplikat locked blocks (samma projekt på samma datum)
  const lockedBlockMap = {};
  lockedProjectBlocks.forEach(block => {
    const key = `${block.name}-${block.date}`;
    if (lockedBlockMap[key]) {
      // Om båda har riktiga timmar, lägg ihop dem
      if (block.hasRealHours && lockedBlockMap[key].hasRealHours) {
        lockedBlockMap[key].hours += block.hours;
        if (block.originalHours) {
          lockedBlockMap[key].originalHours = (lockedBlockMap[key].originalHours || lockedBlockMap[key].hours) + block.originalHours;
        }
      } else if (block.hasRealHours && !lockedBlockMap[key].hasRealHours) {
        // Om den nya har timmar men den gamla är ett gap, ersätt med den nya
        lockedBlockMap[key] = block;
      }
      // Om båda är gaps eller om befintlig har timmar men nya inte har, behåll befintlig
    } else {
      lockedBlockMap[key] = block;
    }
  });
  
  // Använd de sammanslagna blocken
  lockedProjectBlocks = Object.values(lockedBlockMap);
  
  const projectNames = new Set(tasks.filter(t => t.type === 'project').map(t => t.name));

  const nonProjectTasks = tasks.filter(t => t.type !== 'project' && t.type !== 'dummy');
  
  const allLimits = {};
  tasks.forEach(t => {
      if (t.dayLimit !== undefined) {
          allLimits[t.date] = t.dayLimit;
      }
  });
  
  // Spara ursprungliga timmar för varje locked block (innan justering)
  lockedProjectBlocks.forEach(lockedBlock => {
    if (lockedBlock.hasRealHours && !lockedBlock.originalHours) {
      lockedBlock.originalHours = lockedBlock.hours;
    }
  });
  
  // Justera locked blocks för mötestid/uppgifter och samla överskjutande timmar
  // VIKTIGT: Hantera flera locked blocks på samma dag genom att dela upp tiden rättvist
  let overflowHours = {}; // {projectName: hours}
  
  // Gruppera locked blocks per datum
  const lockedBlocksByDate = {};
  lockedProjectBlocks.forEach(lockedBlock => {
    if (!lockedBlock.hasRealHours) return; // Skippa gaps
    if (!lockedBlocksByDate[lockedBlock.date]) {
      lockedBlocksByDate[lockedBlock.date] = [];
    }
    lockedBlocksByDate[lockedBlock.date].push(lockedBlock);
  });
  
  // Justera locked blocks per dag
  Object.keys(lockedBlocksByDate).forEach(date => {
    const blocksOnDate = lockedBlocksByDate[date];
    
    const dayLimit = allLimits[date] || HOURS_PER_DAY_DEFAULT;
    const nonProjectUsed = nonProjectTasks
      .filter(t => t.date === date)
      .reduce((sum, t) => sum + t.hours, 0);
    
    const interruptionHours = (typeof getInterruptionHoursForDate === 'function') 
      ? getInterruptionHoursForDate(date) 
      : 0;
    
    const qualityLossHours = (typeof getQualityLossHoursForDate === 'function')
      ? getQualityLossHoursForDate(date)
      : 0;
    
    const availableForProjects = Math.max(0, dayLimit - nonProjectUsed - interruptionHours - qualityLossHours);
    
    // Beräkna totala ursprungliga timmar för alla locked blocks denna dag
    const totalOriginalHours = blocksOnDate.reduce((sum, block) => {
      return sum + (block.originalHours || block.hours);
    }, 0);
    
    if (totalOriginalHours <= availableForProjects) {
      // Alla block får plats - återställ till ursprungliga värden
      blocksOnDate.forEach(block => {
        block.hours = block.originalHours || block.hours;
      });
    } else {
      // Block får inte plats - fördela proportionellt
      blocksOnDate.forEach(block => {
        const originalHours = block.originalHours || block.hours;
        const proportion = originalHours / totalOriginalHours;
        const newHours = Math.max(0, availableForProjects * proportion);
        const overflow = originalHours - newHours;
        
        block.hours = newHours;
        
        if (overflow > 0.01) {
          if (!overflowHours[block.name]) {
            overflowHours[block.name] = 0;
          }
          overflowHours[block.name] += overflow;
        }
      });
    }
  });
  
  // NU beräkna projectData EFTER justering av locked blocks
  let projectData = [];
  projectNames.forEach(name => {
    // Försök först hitta unlocked task, annars ta första locked task för att få projektinfo
    let firstTask = tasks.find(t => t.name === name && t.type === 'project' && !t.locked);
    if (!firstTask) {
      firstTask = tasks.find(t => t.name === name && t.type === 'project');
    }
    
    if (firstTask) {
        // Beräkna totala timmar från JUSTERADE locked blocks för detta projekt (efter mötestid påverkat)
        const adjustedLockedHours = lockedProjectBlocks
          .filter(t => t.name === name && t.hasRealHours === true)
          .reduce((sum, t) => sum + t.hours, 0);
        
        // Återstående timmar att allokera = totalHours - justerade locked hours
        const remainingToAllocate = Math.max(0, firstTask.totalHours - adjustedLockedHours);
        
        // Hitta senaste locked block för detta projekt för att sätta korrekt startDate
        const projectLockedBlocks = lockedProjectBlocks
          .filter(t => t.name === name && t.hasRealHours === true)
          .sort((a, b) => parseDate(b.date) - parseDate(a.date));
        
        let startDateForAllocation = firstTask.date;
        
        // Om det finns locked blocks, sätt startDate till dagen EFTER det senaste locked blocket
        // Detta gäller särskilt när overflow ska allokeras
        if (projectLockedBlocks.length > 0) {
          const lastLockedDate = new Date(projectLockedBlocks[0].date);
          lastLockedDate.setDate(lastLockedDate.getDate() + 1);
          // Hitta nästa arbetsdag
          while (lastLockedDate.getDay() === 0 || lastLockedDate.getDay() === 6 || SWEDISH_HOLIDAYS(lastLockedDate)) {
            lastLockedDate.setDate(lastLockedDate.getDate() + 1);
          }
          startDateForAllocation = toLocalISOString(lastLockedDate);
        }
        
        projectData.push({
            name: name,
            remainingHours: remainingToAllocate, 
            totalHours: firstTask.totalHours,
            startDate: startDateForAllocation,
            isComplete: false,
            direction: firstTask.direction || 'forward',
            lockedHours: adjustedLockedHours,
            laneIndex: firstTask.laneIndex  // Bevara laneIndex
        });
    }
  });
  
  // Sortera locked blocks efter datum för varje projekt
  const blocksByProject = {};
  lockedProjectBlocks.forEach(block => {
    if (block.hasRealHours) {
      if (!blocksByProject[block.name]) {
        blocksByProject[block.name] = [];
      }
      blocksByProject[block.name].push(block);
    }
  });
  
  Object.keys(blocksByProject).forEach(projectName => {
    blocksByProject[projectName].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  });
  
  // Fördela overflow på befintliga locked blocks i datumordning
  Object.keys(overflowHours).forEach(projectName => {
    let remainingOverflow = overflowHours[projectName];
    const projectBlocks = blocksByProject[projectName] || [];
    
    for (let block of projectBlocks) {
      if (remainingOverflow <= 0.01) break;
      
      const dayLimit = allLimits[block.date] || HOURS_PER_DAY_DEFAULT;
      const nonProjectUsed = nonProjectTasks
        .filter(t => t.date === block.date)
        .reduce((sum, t) => sum + t.hours, 0);
      
      const interruptionHours = (typeof getInterruptionHoursForDate === 'function') 
        ? getInterruptionHoursForDate(block.date) 
        : 0;
      
      const qualityLossHours = (typeof getQualityLossHoursForDate === 'function')
        ? getQualityLossHoursForDate(block.date)
        : 0;
      
      const availableForProject = Math.max(0, dayLimit - nonProjectUsed - interruptionHours - qualityLossHours);
      const remainingCapacity = availableForProject - block.hours;
      
      if (remainingCapacity > 0.01) {
        const toAdd = Math.min(remainingCapacity, remainingOverflow);
        block.hours += toAdd; // Uppdatera direkt i originalet
        remainingOverflow -= toAdd;
      }
    }
    
    // Uppdatera overflow med det som inte kunde fördelas
    overflowHours[projectName] = remainingOverflow;
  });
  
  // Starta med non-project tasks OCH justerade locked project blocks
  let newTasks = [...nonProjectTasks, ...lockedProjectBlocks]; 
  
  // Räkna om lockedHours EFTER overflow-fördelning för att bestämma vad som ska allokeras
  const recalculatedLockedHours = {};
  lockedProjectBlocks.forEach(block => {
    if (block.hasRealHours && block.type === 'project') {
      if (!recalculatedLockedHours[block.name]) {
        recalculatedLockedHours[block.name] = 0;
      }
      recalculatedLockedHours[block.name] += block.hours;
    }
  });
  
  projectData.forEach(p => {
      // Använd de OMRÄKNADE locked hours (efter overflow-fördelning)
      const actualLockedHours = recalculatedLockedHours[p.name] || 0;
      const actualRemaining = Math.max(0, p.totalHours - actualLockedHours);
      
      // Om inget kvar att allokera efter overflow-fördelning, skippa
      if (actualRemaining <= 0.01) {
        return;
      }
      
      // Kontrollera om det redan finns ett locked block på startdatumet
      const hasLockedOnStart = lockedProjectBlocks.some(b => 
        b.date === p.startDate && 
        b.name === p.name && 
        b.type === 'project'
      );
      
      if (!hasLockedOnStart) {
        newTasks.push({
            name: p.name, 
            type: 'project', 
            date: p.startDate, 
            hours: 0, 
            totalHours: p.totalHours,
            dayLimit: allLimits[p.startDate] || HOURS_PER_DAY_DEFAULT,
            direction: p.direction,
            lockedHours: actualLockedHours,
            remainingHours: actualRemaining,
            laneIndex: p.laneIndex  // Bevara laneIndex
        });
      }
  });

  tasks = newTasks;

  Object.keys(allLimits).forEach(date => {
      if (!tasks.some(t => t.date === date)) {
          tasks.push({ date: date, dayLimit: allLimits[date], hours: 0, type: 'dummy', name: 'limit' });
      }
  });

  const timelineDates = getFullYearDates(); 
  
  // Använd omräknade locked hours för att bestämma faktisk remainingHours
  const forwardProjects = projectData.map(p => {
    const actualLockedHours = recalculatedLockedHours[p.name] || 0;
    const actualRemaining = Math.max(0, p.totalHours - actualLockedHours);
    return {
      ...p,
      remainingHours: actualRemaining
    };
  }).filter(p => p.direction === 'forward' && p.remainingHours > 0.01);
  
  const backwardProjects = projectData.map(p => {
    const actualLockedHours = recalculatedLockedHours[p.name] || 0;
    const actualRemaining = Math.max(0, p.totalHours - actualLockedHours);
    return {
      ...p,
      remainingHours: actualRemaining
    };
  }).filter(p => p.direction === 'backward' && p.remainingHours > 0.01);

  const nonProjectUsedHoursMap = {};
  nonProjectTasks.forEach(t => {
      if (!nonProjectUsedHoursMap[t.date]) nonProjectUsedHoursMap[t.date] = 0;
      nonProjectUsedHoursMap[t.date] += t.hours;
  });
  
  // Skapa separat map för locked project blocks per projekt
  const lockedProjectHoursMap = {};
  lockedProjectBlocks.forEach(t => {
      if (t.hours > 0 && t.hasRealHours) {
        const key = `${t.date}_${t.name}`;
        if (!lockedProjectHoursMap[key]) lockedProjectHoursMap[key] = 0;
        lockedProjectHoursMap[key] += t.hours;
      }
  });

  // Steg 6A: initial framåt-allokering
  for (let dateIndex = 0; dateIndex < timelineDates.length; dateIndex++) {
    const dayStr = timelineDates[dateIndex];
    const d = new Date(dayStr);

    if(d.getDay() === 0 || d.getDay() === 6 || SWEDISH_HOLIDAYS(d)) continue;
    
    let dayLimit = HOURS_PER_DAY_DEFAULT;
    const dayDiv = document.querySelector(`.day[data-date='${dayStr}']`);
    if (dayDiv) dayLimit = parseFloat(dayDiv.dataset.workhours) || HOURS_PER_DAY_DEFAULT;
    
    const otherUsedHours = nonProjectUsedHoursMap[dayStr] || 0;
    
    // Hämta avbrottstid för denna dag
    const interruptionHours = (typeof getInterruptionHoursForDate === 'function') 
        ? getInterruptionHoursForDate(dayStr) 
        : 0;
    
    // Hämta kvalitetsförlust-tid för denna dag
    const qualityLossHours = (typeof getQualityLossHoursForDate === 'function')
        ? getQualityLossHoursForDate(dayStr)
        : 0;
    
    const activeProjects = forwardProjects.filter(p => 
        !p.isComplete && 
        parseDate(p.startDate) <= d
    );
    
    // Beräkna totala locked project hours på denna dag från ANDRA projekt
    let otherProjectsLockedHours = 0;
    lockedProjectBlocks.forEach(lb => {
      if (lb.date === dayStr && lb.hasRealHours && !activeProjects.some(p => p.name === lb.name)) {
        otherProjectsLockedHours += lb.hours;
      }
    });
    
    // Tillgänglig projekttid = daggräns - nonProject - andra projekts locked blocks - avbrott - kvalitetsförluster
    const availableProjectTime = Math.max(0, dayLimit - otherUsedHours - otherProjectsLockedHours - interruptionHours - qualityLossHours);
    
    if (activeProjects.length > 0) {
        const numParallelProjects = activeProjects.length;
        const sharedTime = availableProjectTime / numParallelProjects;
        
        activeProjects.forEach(p => {
            const alloc = Math.min(p.remainingHours, sharedTime);
            
            if (alloc > 0.25) {
                let existingTask = tasks.find(t => t.date === dayStr && t.name === p.name && t.type === 'project' && !t.locked);

                if (existingTask) {
                    existingTask.hours = alloc;
                    existingTask.dayLimit = dayLimit;
                    // Bevara kommentarer och andra befintliga egenskaper
                } else {
                    // Kontrollera att det inte redan finns ett locked block här
                    const hasLockedBlock = tasks.some(t => t.date === dayStr && t.name === p.name && t.type === 'project' && t.locked);
                    if (!hasLockedBlock) {
                      const commentKey = `${p.name}-${dayStr}`;
                      const savedComment = commentMap[commentKey];
                      console.log('Skapar nytt block för', commentKey, 'med kommentar:', savedComment);
                      const newTask = {
                          name: p.name, 
                          type: 'project', 
                          date: dayStr, 
                          hours: alloc, 
                          totalHours: p.totalHours,
                          dayLimit: dayLimit,
                          direction: 'forward'
                      };
                      if (savedComment) {
                        newTask.comment = savedComment;
                        console.log('✓ Kommentar tillagd till nytt block');
                      }
                      tasks.push(newTask);
                    }
                }
                
                p.remainingHours -= alloc;
                
                if (hoursLessThanOrEqual(p.remainingHours, 0.25)) {
                    p.isComplete = true;
                }
            } else {
                let existingTask = tasks.find(t => t.date === dayStr && t.name === p.name && t.type === 'project' && !t.locked);
                if (existingTask) {
                    existingTask.hours = 0;
                    existingTask.dayLimit = dayLimit;
                } else {
                    // Kontrollera att det inte redan finns ett locked block här
                    const hasLockedBlock = tasks.some(t => t.date === dayStr && t.name === p.name && t.type === 'project' && t.locked);
                    if (!hasLockedBlock) {
                      const commentKey = `${p.name}-${dayStr}`;
                      const savedComment = commentMap[commentKey];
                      const newTask = {
                          name: p.name,
                          type: 'project',
                          date: dayStr,
                          hours: 0,
                          totalHours: p.totalHours,
                          dayLimit: dayLimit,
                          direction: 'forward'
                      };
                      if (savedComment) {
                        newTask.comment = savedComment;
                      }
                      tasks.push(newTask);
                    }
                }
            }
        });
    }
  }

  // Återställ inför Steg 6B med korrekta omräknade locked hours
  forwardProjects.forEach(p => {
      p.remainingHours = p.totalHours - (recalculatedLockedHours[p.name] || 0);
      p.isComplete = false;
  });

  // Steg 6B: framåt justering dag-för-dag
  for (let dateIndex = 0; dateIndex < timelineDates.length; dateIndex++) {
      const dayStr = timelineDates[dateIndex];
      const d = new Date(dayStr);

      if(d.getDay() === 0 || d.getDay() === 6 || SWEDISH_HOLIDAYS(d)) continue;

      let dayLimit = HOURS_PER_DAY_DEFAULT;
      const dayDiv = document.querySelector(`.day[data-date='${dayStr}']`);
      if (dayDiv) dayLimit = parseFloat(dayDiv.dataset.workhours) || HOURS_PER_DAY_DEFAULT;
      
      const otherUsedHours = nonProjectUsedHoursMap[dayStr] || 0;
      
      // Hämta avbrottstid för denna dag
      const interruptionHours = (typeof getInterruptionHoursForDate === 'function') 
          ? getInterruptionHoursForDate(dayStr) 
          : 0;
      
      // Hämta kvalitetsförlust-tid för denna dag
      const qualityLossHours = (typeof getQualityLossHoursForDate === 'function')
          ? getQualityLossHoursForDate(dayStr)
          : 0;
      
      const activeForwardProjectsOnDay = forwardProjects.filter(p => 
          !p.isComplete && 
          parseDate(p.startDate) <= d
      );
      
      // Beräkna totala locked project hours på denna dag från ANDRA projekt
      let otherProjectsLockedHours = 0;
      lockedProjectBlocks.forEach(lb => {
        if (lb.date === dayStr && lb.hasRealHours && !activeForwardProjectsOnDay.some(p => p.name === lb.name)) {
          otherProjectsLockedHours += lb.hours;
        }
      });
      
      // Tillgänglig projekttid = daggräns - nonProject - andra projekts locked blocks - avbrott - kvalitetsförluster
      const availableProjectTime = Math.max(0, dayLimit - otherUsedHours - otherProjectsLockedHours - interruptionHours - qualityLossHours);
      
      const numProjectsToday = activeForwardProjectsOnDay.length;

      if (numProjectsToday > 0) {
          const sharedTime = availableProjectTime / numProjectsToday;

          activeForwardProjectsOnDay.forEach(p => {
              let task = tasks.find(t => t.date === dayStr && t.name === p.name && t.type === 'project' && !t.locked);
              
              const alloc = Math.min(p.remainingHours, sharedTime);
              
              if (alloc > 0.25) {
                  if (task) {
                      task.hours = alloc;
                      // Lägg till kommentar om den saknas men finns i commentMap
                      const commentKey = `${p.name}-${dayStr}`;
                      const savedComment = commentMap[commentKey];
                      if (savedComment && !task.comment) {
                        task.comment = savedComment;
                      }
                  } else {
                      // Kontrollera att det inte redan finns ett locked block här
                      const hasLockedBlock = tasks.some(t => t.date === dayStr && t.name === p.name && t.type === 'project' && t.locked);
                      if (!hasLockedBlock) {
                        const commentKey = `${p.name}-${dayStr}`;
                        const savedComment = commentMap[commentKey];
                        const newTask = {
                              name: p.name, 
                              type: 'project', 
                              date: dayStr, 
                              hours: alloc, 
                              totalHours: p.totalHours,
                              dayLimit: dayLimit,
                              direction: 'forward'
                          };
                        if (savedComment) {
                          newTask.comment = savedComment;
                        }
                        tasks.push(newTask);
                      }
                  }

                  p.remainingHours -= alloc; 
                  if (hoursLessThanOrEqual(p.remainingHours, 0.25)) p.isComplete = true;

              } else {
                  if (hoursGreaterThan(p.remainingHours, 0.25)) {
                      if (task) {
                          task.hours = 0;
                          task.dayLimit = dayLimit;
                      } else {
                          // Kontrollera att det inte redan finns ett locked block här
                          const hasLockedBlock = tasks.some(t => t.date === dayStr && t.name === p.name && t.type === 'project' && t.locked);
                          if (!hasLockedBlock) {
                            const commentKey = `${p.name}-${dayStr}`;
                            const savedComment = commentMap[commentKey];
                            const newTask = {
                                name: p.name,
                                type: 'project',
                                date: dayStr,
                                hours: 0,
                                totalHours: p.totalHours,
                                dayLimit: dayLimit,
                                direction: 'forward'
                            };
                            if (savedComment) {
                              newTask.comment = savedComment;
                            }
                            tasks.push(newTask);
                          }
                      }
                  } else if (task) {
                      task.hours = 0;
                  }
              }
          });
      }
  }

  // Bakåtprojekt: kompakt bakåt-allokering
  backwardProjects.forEach(p => {
    // Ta bort alla unlocked block för detta bakåtprojekt (behåll locked)
    tasks = tasks.filter(t => !(t.type === 'project' && t.name === p.name && t.direction === 'backward' && !t.locked));

    let remaining = p.remainingHours;
    
    // Allokera bakåt från startDate
    // För att få rätt ordning på timmarna (tidigaste dag får mest, senaste dag får minst),
    // beräkna först vilka dagar som behövs, sen allokera från tidigaste och framåt
    
    let daysNeeded = [];
    let tempRemaining = remaining;
    let tempCurrent = parseDate(p.startDate);
    
    // Samla alla dagar som behövs och deras tillgängliga tid
    while (tempRemaining > 0.25) {
      const dayStr = toLocalISOString(tempCurrent);
      if (tempCurrent.getFullYear() !== currentYear) break;

      if (!(tempCurrent.getDay() === 0 || tempCurrent.getDay() === 6 || SWEDISH_HOLIDAYS(tempCurrent))) {
        const hasLockedBlock = tasks.some(t => t.date === dayStr && t.name === p.name && t.type === 'project' && t.locked);
        
        if (!hasLockedBlock) {
          let dayLimit = HOURS_PER_DAY_DEFAULT;
          const dayDiv = document.querySelector(`.day[data-date='${dayStr}']`);
          if (dayDiv) dayLimit = parseFloat(dayDiv.dataset.workhours) || HOURS_PER_DAY_DEFAULT;

          const usedOther = nonProjectUsedHoursMap[dayStr] || 0;
          let otherProjectsLockedHours = 0;
          lockedProjectBlocks.forEach(lb => {
            if (lb.date === dayStr && lb.hasRealHours && lb.name !== p.name) {
              otherProjectsLockedHours += lb.hours;
            }
          });

          const interruptionHours = (typeof getInterruptionHoursForDate === 'function') ? getInterruptionHoursForDate(dayStr) : 0;
          const qualityLossHours = (typeof getQualityLossHoursForDate === 'function') ? getQualityLossHoursForDate(dayStr) : 0;
          const available = Math.max(0, dayLimit - usedOther - otherProjectsLockedHours - interruptionHours - qualityLossHours);

          if (available > 0.25) {
            daysNeeded.push({ date: dayStr, available: available, dayLimit: dayLimit });
            tempRemaining -= Math.min(tempRemaining, available);
          }
        }
      }
      tempCurrent.setDate(tempCurrent.getDate() - 1);
    }
    
    // Vänd ordningen så vi har tidigaste dagen först
    daysNeeded.reverse();
    
    // Allokera från tidigaste dagen (längst bort från startdatum) framåt mot startdatumet
    // OBS: Konvertera till 'forward' direction direkt så framtida omberäkningar fungerar korrekt
    for (let dayInfo of daysNeeded) {
      if (remaining <= 0.25) break;
      
      const alloc = Math.min(remaining, dayInfo.available);
      const commentKey = `${p.name}-${dayInfo.date}`;
      const savedComment = commentMap[commentKey];
      const newTask = {
        name: p.name,
        type: 'project',
        date: dayInfo.date,
        hours: alloc,
        totalHours: p.totalHours,
        dayLimit: dayInfo.dayLimit,
        direction: 'forward'  // Konvertera till forward efter placering!
      };
      if (savedComment) newTask.comment = savedComment;
      tasks.push(newTask);
      remaining -= alloc;
    }
  });

  // Ta bort unlocked projektblock med 0 timmar (inte längre behövda overflow-block)
  tasks = tasks.filter(t => {
    if (t.type === 'project' && !t.locked && t.hours <= 0.01) {
      return false; // Ta bort detta block
    }
    return true; // Behåll allt annat
  });

  save();
  renderTasks();
}


// ===============================================
// F. UI-RENDERING (Tidslinje/Block)
// ===============================================

function generateTimeline() {
  timeline.innerHTML = '';
  
  document.getElementById('yearInput').value = currentYear; // <-- Sätter värdet i inmatningsfältet
  
  const start = new Date(currentYear,0,1); // <-- Använder currentYear
  const end = new Date(start);
  end.setFullYear(end.getFullYear()+1);

  for (let d = new Date(start); d < end; d.setDate(d.getDate()+1)) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    
    const dateStr = toLocalISOString(d);
    dayDiv.dataset.date = dateStr;
    
    // Markera om detta är swap-källan
    if (swapMode && swapMode.sourceDate === dateStr) {
      dayDiv.classList.add('swap-source');
    }
    
    let workHours = HOURS_PER_DAY_DEFAULT;
    const dayTaskForLimit = tasks.find(t => t.date === dateStr);
    if (dayTaskForLimit) {
        workHours = dayTaskForLimit.dayLimit || HOURS_PER_DAY_DEFAULT; 
    }
    
    dayDiv.dataset.workhours = workHours;
    
    const meetingHours = tasks
      .filter(t => t.date === dateStr && t.type === 'meeting')
      .reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0);
    
    dayDiv.dataset.meetinghours = meetingHours;
    
    // Hämta avbrottstid om tillgänglig
    let interruptionHours = 0;
    if (typeof getInterruptionHoursForDate === 'function') {
        interruptionHours = getInterruptionHoursForDate(dateStr);
    }
    dayDiv.dataset.interruptionhours = interruptionHours;
    
    // Hämta kvalitetsförlust-tid om tillgänglig
    let qualityLossHours = 0;
    if (typeof getQualityLossHoursForDate === 'function') {
        qualityLossHours = getQualityLossHoursForDate(dateStr);
    }
    dayDiv.dataset.qualitylosshours = qualityLossHours;

    const week = getWeekNumber(d);
    const weekdayName = getWeekdays()[d.getDay()];

    if(d.getDay() === 0 || d.getDay() === 6 || SWEDISH_HOLIDAYS(d)) {
      dayDiv.classList.add(d.getDay()===0||d.getDay()===6?'weekend':'holiday');
    }

    dayDiv.innerHTML = `
      <header>v${week} ${weekdayName}<br>${d.toLocaleDateString('sv-SE')}</header>
      <div class="blocks" ondragover="event.preventDefault()" ondrop="handleDrop(event,'${dateStr}')"></div>
      <div class="day-footer">
        <span class="hours-info"></span>
        <div class="status-bar"><div class="status-fill"></div></div>
        <div style="margin-top:4px; font-size:0.9em; display:flex; justify-content:space-between;">
            <span>${typeof t === 'function' ? t('max') : 'Max'}: <input type="number" class="work-hours-input" style="width:35px" value="${workHours}" onchange='updateWorkHours("${dateStr}", this.value)'> h</span>
            <span>${typeof t === 'function' ? t('capacity') : 'Mötestid'}: <input type="number" class="meeting-hours-input" style="width:35px" value="${meetingHours}" onchange='updateMeetingHours("${dateStr}", this.value)'> h</span>
        </div>
        <div id="interruption-info-${dateStr}" style="margin-top:4px; font-size:0.85em; color:#e74c3c; font-weight:bold;"></div>
        <div id="quality-loss-info-${dateStr}" style="margin-top:4px; font-size:0.85em; color:#f57c00; font-weight:bold;"></div>
      </div>`;

    dayDiv.addEventListener('click', ()=>placeTask(dayDiv.dataset.date));
    timeline.appendChild(dayDiv);
  }
  renderTasks();
  // Scroll-synk sker via gemensam wrapper i HTML
  
  // Scrolla till dagens datum
  scrollToToday();
}

// Funktion för att scrolla till dagens datum
function scrollToToday() {
  const today = new Date();
  const todayStr = toLocalISOString(today);
  
  // Hitta dagens datum-element i tidslinjen
  const todayElement = document.querySelector(`.day[data-date="${todayStr}"]`);
  
  if (todayElement) {
    // Scrolla så att dagens datum är längst till vänster
    todayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }
}

// Hjälpfunktion för att rendera projektblock
function renderProjectBlock(t, date, projectsInDay, interruptionHours, conflict, container) {
  // Visa gap placeholders som luckor
  if (t.locked === true && t.hours === 0 && !t.hasRealHours) {
    const block = document.createElement('div');
    block.className = 'block gap-block';
    block.style.backgroundColor = '#e0e0e0';
    block.style.border = '2px dashed #999';
    block.style.opacity = '0.5';
    block.textContent = `${t.name} (Lucka)`;
    block.title = `Lucka i ${t.name} - manuellt flyttad`;
    container.appendChild(block);
    return;
  }

  const baseProjectName = t.name.replace(/\s*\(del\s+\d+\)\s*$/i, '');
  
  // Hitta alla relaterade projektdelar
  const relatedProjectNames = new Set();
  tasks.filter(tt => tt.type === 'project').forEach(pt => {
      const ptBaseName = pt.name.replace(/\s*\(del\s+\d+\)\s*$/i, '');
      if (ptBaseName === baseProjectName) {
          relatedProjectNames.add(pt.name);
      }
  });
  
  // Beräkna total projektomfattning
  let projectTotalHours = 0;
  relatedProjectNames.forEach(relatedName => {
      const relatedTask = tasks.find(tt => tt.name === relatedName && tt.type === 'project');
      if (relatedTask) {
          projectTotalHours += relatedTask.totalHours;
      }
  });
  
  // Beräkna allokerad tid
  let allocatedSoFar = 0;
  const currentDate = parseDate(date);
  
  relatedProjectNames.forEach(relatedName => {
      const allocations = tasks
          .filter(tt => tt.name === relatedName && tt.type === 'project')
          .sort((a, b) => parseDate(a.date) - parseDate(b.date));
      
      allocations.forEach(alloc => {
          // Avbrott är redan avdragna i recalculateAllTasks - använd alloc.hours direkt
          if (parseDate(alloc.date) < currentDate) {
              allocatedSoFar += alloc.hours;
          } else if (parseDate(alloc.date).getTime() === currentDate.getTime()) {
              allocatedSoFar += alloc.hours;
          }
      });
  });

  const remainingTotal = Math.max(0, projectTotalHours - allocatedSoFar);
  
  // t.hours är redan justerade för avbrott i recalculateAllTasks - ingen ytterligare reduktion behövs
  const effectiveHours = t.hours;
  
  let text = `${t.name} (${effectiveHours.toFixed(1)}h | ${remainingTotal.toFixed(1)}h kvar)`;
  if (conflict) {
      text += ' ⚠';
  }
  
  // Om effektiv tid är 0, visa tydligt
  if (effectiveHours === 0 && t.hours > 0) {
      text = `${t.name} (0.0h - blockerad | ${remainingTotal.toFixed(1)}h kvar)`;
  }

  const block = document.createElement('div');
  block.className = 'block project' + (t.direction === 'backward' ? ' backward' : '');
  if (conflict) {
      block.classList.add('project-conflict');
  }
  
  // Om projekttid är 0, ge det en annan stil
  if (effectiveHours === 0) {
      block.style.opacity = '0.6';
      block.style.backgroundColor = '#bdc3c7';
  }
  
  block.textContent = text;
  block.title = `${t.name}: ${effectiveHours.toFixed(1)}h${interruptionHours > 0 ? ` (Avbrott på dagen: ${interruptionHours.toFixed(1)}h, redan beaktade)` : ''} | Återstående totalt: ${remainingTotal.toFixed(1)}h${t.direction ? ' | Riktning: '+t.direction : ''}${conflict ? ' | PROJEKTKROCK denna dag' : ''}`;
  
  // Hitta index via data-matchning istället för referens-jämförelse
  const taskIndex = tasks.findIndex(task => 
    task.name === t.name && 
    task.date === t.date && 
    task.type === t.type
  );
  block.dataset.index = taskIndex;
  block.dataset.taskName = t.name;
  block.dataset.taskDate = t.date;
  block.dataset.taskType = t.type;
  
  // Visa kommentarmarkering om kommentar finns (projektblock)
  if (t.comment && t.comment.trim()) {
    const commentIcon = document.createElement('div');
    commentIcon.className = 'comment-indicator';
    commentIcon.setAttribute('data-comment', t.comment);
    block.style.position = 'relative';
    block.appendChild(commentIcon);
  }
  
  // Multi-select
  block.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      toggleBlockSelection(block.dataset.index, block);
    } else if (e.shiftKey) {
      e.preventDefault();
      selectBlockRange(block.dataset.index, block);
    } else {
      if (selectedBlocks.size > 0 && !swapMode) {
        clearBlockSelections();
      }
    }
  });
  
  block.addEventListener('contextmenu', e=>{ 
    e.preventDefault();
    const ctrlPressed = e.ctrlKey;
    const blockIndex = parseInt(block.dataset.index);
    
    // Om det finns markerade block och detta block är INTE markerat, rensa markeringen
    if (selectedBlocks.size > 0 && !selectedBlocks.has(blockIndex)) {
      clearBlockSelections();
    }
    
    showContextMenu(e.pageX, e.pageY, block.dataset.index, t.date, ctrlPressed); 
  });
  
  if (selectedBlocks.has(parseInt(block.dataset.index))) {
    block.classList.add('selected');
  }
  
  container.appendChild(block);
}

// Hjälpfunktion för att rendera icke-projektblock
function renderNonProjectBlock(t, container) {
  if (t.type === 'dummy') return;
  
  const text = `${t.name} (${t.hours.toFixed(1)}h)`;
  
  const block = document.createElement('div');
  block.className = 'block ' + t.type;
  block.textContent = text;
  block.title = `${t.name}: ${t.hours.toFixed(1)}h | Typ: ${t.type}`;
  
  // Hitta index via data-matchning istället för referens-jämförelse
  const taskIndex = tasks.findIndex(task => 
    task.name === t.name && 
    task.date === t.date && 
    task.type === t.type &&
    Math.abs(task.hours - t.hours) < 0.01
  );
  block.dataset.index = taskIndex;
  block.dataset.taskName = t.name;
  block.dataset.taskDate = t.date;
  block.dataset.taskType = t.type;
  
  // Tilldela en default-färg för nya anpassade typer
  const predefinedTypes = ['support', 'change', 'forbattring', 'meeting', 'eplan_underhall', 'omarbete', 'sent_tillagg'];
  if (!predefinedTypes.includes(t.type) && t.type !== 'project') {
    // Generera en konsekvent färg baserat på typen
    const hash = t.type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    block.style.backgroundColor = `hsl(${hue}, 60%, 55%)`;
  }
  
  // Visa kommentarmarkering om kommentar finns (icke-projektblock)
  if (t.comment && t.comment.trim()) {
    const commentIcon = document.createElement('div');
    commentIcon.className = 'comment-indicator';
    commentIcon.setAttribute('data-comment', t.comment);
    block.style.position = 'relative';
    block.appendChild(commentIcon);
  }
  
  // Multi-select
  block.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      toggleBlockSelection(block.dataset.index, block);
    } else if (e.shiftKey) {
      e.preventDefault();
      selectBlockRange(block.dataset.index, block);
    } else {
      if (selectedBlocks.size > 0 && !swapMode) {
        clearBlockSelections();
      }
    }
  });
  
  if (t.type !== 'meeting') {
    block.addEventListener('contextmenu', e=>{ 
      e.preventDefault();
      const ctrlPressed = e.ctrlKey;
      const blockIndex = parseInt(block.dataset.index);
      
      // Om det finns markerade block och detta block är INTE markerat, rensa markeringen
      if (selectedBlocks.size > 0 && !selectedBlocks.has(blockIndex)) {
        clearBlockSelections();
      }
      
      showContextMenu(e.pageX, e.pageY, block.dataset.index, t.date, ctrlPressed); 
    });
  }
  
  if (selectedBlocks.has(parseInt(block.dataset.index))) {
    block.classList.add('selected');
  }
  
  container.appendChild(block);
}

function renderTasks(){
  document.querySelectorAll('.blocks').forEach(b=>b.innerHTML='');
  const tasksByDay = {};
  
  tasks.forEach(t=>{
    if(!tasksByDay[t.date]) tasksByDay[t.date] = [];
    tasksByDay[t.date].push(t);
  });

  // Skapa en global projektlista (ordning bestäms av laneIndex eller första förekomsten i tasks)
  // VIKTIGT: Bygg från ALLA tasks, inte bara de i nuvarande vy, så att "ingen aktivitet" visas korrekt
  const allProjectNames = [];
  const projectLaneIndex = {};
  
  // Använd hela tasks-arrayen från currentYear för att få alla projekt
  const allYearTasks = Object.values(tasks);
  allYearTasks.filter(t => t.type === 'project' && new Date(t.date).getFullYear() === currentYear).forEach((t, idx) => {
    const baseName = t.name.replace(/\s*\(del\s+\d+\)\s*$/i, '');
    if (!allProjectNames.includes(baseName)) {
      allProjectNames.push(baseName);
      // Använd befintligt laneIndex om det finns, annars använd ordningen i tasks
      projectLaneIndex[baseName] = t.laneIndex !== undefined ? t.laneIndex : idx;
    }
  });
  
  // Sortera projekt efter laneIndex (behåller ursprunglig ordning)
  allProjectNames.sort((a, b) => projectLaneIndex[a] - projectLaneIndex[b]);

  Object.keys(tasksByDay).forEach(date=>{
    // Filtrera bort datum som inte hör till det aktuella året
    if (new Date(date).getFullYear() !== currentYear) return; 
      
    const dayDiv = document.querySelector(`.day[data-date='${date}']`);
    if(!dayDiv) return;
    
    const dayTasks = tasksByDay[date];
    const dayLimit = parseFloat(dayDiv.dataset.workhours) || HOURS_PER_DAY_DEFAULT;
    
    // Gruppera tasks per typ
    const projectsInDay = dayTasks.filter(t => t.type === 'project');
    const meetingsInDay = dayTasks.filter(t => t.type === 'meeting');
    
    // Dynamisk hantering av övriga uppgifter - filtrera alla som inte är projekt, möten eller dummy
    const otherTasksInDay = dayTasks.filter(t => 
        t.type !== 'project' && 
        t.type !== 'meeting' && 
        t.type !== 'dummy'
    );
    
    const totalProjects = new Set(projectsInDay.map(p => {
      return p.name.replace(/\s*\(del\s+\d+\)\s*$/i, '');
    })).size;
    
    const totalUsed = dayTasks.filter(t => t.type !== 'dummy').reduce((s, t) => s + t.hours, 0);
    const nonProjectUsed = dayTasks.filter(t => t.type !== 'project' && t.type !== 'dummy').reduce((s,t)=>s+t.hours,0);
    const totalMeetingHours = meetingsInDay.reduce((s, t) => s + (parseFloat(t.hours) || 0), 0);
    
    // Hämta avbrottstid för denna dag
    const interruptionHours = parseFloat(dayDiv.dataset.interruptionhours) || 0;
    
    // Hämta kvalitetsförlust-tid för denna dag
    const qualityLossHours = parseFloat(dayDiv.dataset.qualitylosshours) || 0;
    
    // Uppdatera avbrottsinfo i UI
    const interruptionInfo = dayDiv.querySelector(`#interruption-info-${date}`);
    if (interruptionInfo) {
        if (interruptionHours > 0) {
            interruptionInfo.textContent = `⚠ Avbrott: ${interruptionHours.toFixed(2)} h`;
        } else {
            interruptionInfo.textContent = '';
        }
    }
    
    // Uppdatera kvalitetsförlust-info i UI
    const qualityLossInfo = dayDiv.querySelector(`#quality-loss-info-${date}`);
    if (qualityLossInfo) {
        if (qualityLossHours > 0) {
            qualityLossInfo.textContent = `⚠ Kvalitetsförlust: ${qualityLossHours.toFixed(2)} h`;
        } else {
            qualityLossInfo.textContent = '';
        }
    }
    
    // Tillgänglig projekttid (inkluderar både avbrott OCH kvalitetsförluster)
    const projectAvailableForConflict = Math.max(0, dayLimit - nonProjectUsed);
    const projectAvailable = Math.max(0, dayLimit - nonProjectUsed - interruptionHours - qualityLossHours);
    const totalProjectHours = projectsInDay.reduce((s,t)=>s+t.hours,0);
    const conflict = totalProjectHours > projectAvailableForConflict + 0.01 && totalProjectHours > 0;

    if (conflict) {
        dayDiv.classList.add('conflict-day');
    } else {
        dayDiv.classList.remove('conflict-day');
    }

    const blocksContainer = dayDiv.querySelector('.blocks');

    // Synka footer-inputs med faktisk data efter inläsning/omrendering
    const workHoursInput = dayDiv.querySelector('.work-hours-input');
    if (workHoursInput) {
      workHoursInput.value = dayLimit;
    }

    const meetingHoursInput = dayDiv.querySelector('.meeting-hours-input');
    if (meetingHoursInput) {
      meetingHoursInput.value = totalMeetingHours;
    }
    dayDiv.dataset.meetinghours = totalMeetingHours;
    
    // === RENDERA I ORDNING: PROJEKT (simbanor) → ÖVRIGA UPPGIFTER → MÖTEN ===
    
    // 1. Rendera projektblock i simbanor (varje projekt får sin dedikerade rad)
    // Viktigt: Vi renderar ALLA projekt för att behålla simbanorna, även om projektet inte finns den dagen
    allProjectNames.forEach(projectBaseName => {
      const projectBlock = projectsInDay.find(p => {
        const baseName = p.name.replace(/\s*\(del\s+\d+\)\s*$/i, '');
        return baseName === projectBaseName;
      });
      
      if (projectBlock) {
        renderProjectBlock(projectBlock, date, projectsInDay, interruptionHours, conflict, blocksContainer);
      } else {
        // Rendera en tom plats för att behålla simbanans position
        const emptyBlock = document.createElement('div');
        emptyBlock.className = 'block empty-lane';
        emptyBlock.style.backgroundColor = '#ecf0f1';
        emptyBlock.style.border = '1px solid #bdc3c7';
        emptyBlock.style.opacity = '0.7';
        emptyBlock.style.color = '#7f8c8d';
        emptyBlock.style.fontWeight = '500';
        emptyBlock.textContent = `${projectBaseName}`;
        emptyBlock.title = `${projectBaseName} - ingen aktivitet denna dag`;
        blocksContainer.appendChild(emptyBlock);
      }
    });
    
    // 2. Rendera övriga uppgifter (alla typer utom projekt och möten)
    otherTasksInDay.forEach(t => {
      renderNonProjectBlock(t, blocksContainer);
    });
    
    // 3. Rendera möten sist
    meetingsInDay.forEach(t => {
      renderNonProjectBlock(t, blocksContainer);
    });

    // Uppdatera footer
    const footerInfo = dayDiv.querySelector('.day-footer .hours-info');
    const statusFill = dayDiv.querySelector('.status-bar .status-fill');
    let percent;

    statusFill.classList.remove('overbooked', 'yellow-warning', 'green-ok');
    
    const totalUsedWithInterruptions = totalUsed + interruptionHours;
    const totalProjectHoursAllocated = projectsInDay.reduce((s, pt) => s + pt.hours, 0);
    const effectiveProjectHours = Math.max(0, totalProjectHoursAllocated - interruptionHours);
    
    // Beräkna övertid när dayLimit överstiger standard
    const overtimeHours = Math.max(0, dayLimit - HOURS_PER_DAY_DEFAULT);
    const normalHours = Math.min(dayLimit, HOURS_PER_DAY_DEFAULT);

    if (totalProjects > 0) {
        const shared = effectiveProjectHours / (totalProjects || 1);
        let infoText = `Projekt: **${totalProjects} st** | Delad tid: **${shared.toFixed(1)}h**`;
        if (overtimeHours > 0) {
            infoText += ` | <span style="color:#e67e22;font-weight:bold;">ÖT: ${overtimeHours.toFixed(1)}h</span>`;
        }
        if (conflict) {
            infoText += ' | <span style="color:#e74c3c;font-weight:bold;">PROJEKTKROCK</span>';
        }
        footerInfo.innerHTML = infoText;
        percent = (totalUsedWithInterruptions / dayLimit) * 100;
        statusFill.style.backgroundColor = '#2980b9'; 
    } else {
        let infoText = `Totalt bokad: ${totalUsedWithInterruptions.toFixed(1)}h / ${dayLimit}h`;
        if (overtimeHours > 0) {
            infoText += ` (${overtimeHours.toFixed(1)}h ÖT)`;
        }
        footerInfo.textContent = infoText;
        percent = (totalUsedWithInterruptions / dayLimit) * 100;
        statusFill.style.backgroundColor = '#2ecc71';
    }

    if (totalUsedWithInterruptions > OVERTIME_LIMIT) { 
        statusFill.classList.add('overbooked'); 
        footerInfo.style.color = 'red';
        statusFill.style.backgroundColor = '#e74c3c'; 
    } else if(totalUsedWithInterruptions > dayLimit * 1.01) { 
        statusFill.classList.add('yellow-warning'); 
        footerInfo.style.color = 'orange'; 
        statusFill.style.backgroundColor = '#f1c40f'; 
    } else {
        statusFill.classList.add('green-ok'); 
        footerInfo.style.color = '#555';
        if (totalProjects === 0) {
            statusFill.style.backgroundColor = '#2ecc71';
        } else {
            statusFill.style.backgroundColor = '#2980b9';
        }
    }
    
    // Visa övertidsdel visuellt i stapeln
    if (overtimeHours > 0 && totalUsedWithInterruptions <= dayLimit) {
        const normalPercent = (normalHours / dayLimit) * percent;
        const overtimePercent = (overtimeHours / dayLimit) * percent;
        statusFill.style.background = `linear-gradient(to right, ${statusFill.style.backgroundColor} ${normalPercent}%, #e67e22 ${normalPercent}%, #e67e22 100%)`;
    }

    statusFill.style.width = Math.min(percent, 100) + '%';
  });
  
  // Uppdatera footer för dagar SOM INTE har några uppgifter (de hoppades över ovan)
  document.querySelectorAll('.day').forEach(dayDiv => {
    const dateStr = dayDiv.dataset.date;
    if (!tasksByDay[dateStr]) {
      // Denna dag har inga uppgifter, uppdatera footern till standardvärden
      const footerInfo = dayDiv.querySelector('.day-footer .hours-info');
      const statusFill = dayDiv.querySelector('.status-bar .status-fill');
      const dayLimit = parseFloat(dayDiv.dataset.workhours) || HOURS_PER_DAY_DEFAULT;
      const interruptionHours = parseFloat(dayDiv.dataset.interruptionhours) || 0;
      const overtimeHours = Math.max(0, dayLimit - HOURS_PER_DAY_DEFAULT);
      const workHoursInput = dayDiv.querySelector('.work-hours-input');
      if (workHoursInput) {
        workHoursInput.value = dayLimit;
      }
      const meetingHoursInput = dayDiv.querySelector('.meeting-hours-input');
      if (meetingHoursInput) {
        meetingHoursInput.value = '0';
      }
      
      let infoText = `Totalt bokad: ${interruptionHours.toFixed(1)}h / ${dayLimit}h`;
      if (overtimeHours > 0) {
        infoText += ` (${overtimeHours.toFixed(1)}h ÖT)`;
      }
      footerInfo.textContent = infoText;
      footerInfo.style.color = '#555';
      
      const percent = (interruptionHours / dayLimit) * 100;
      statusFill.classList.remove('overbooked', 'yellow-warning', 'green-ok');
      statusFill.classList.add('green-ok');
      statusFill.style.backgroundColor = '#2ecc71';
      statusFill.style.width = Math.min(percent, 100) + '%';
    }
  });
  
  // Återställ visuella markeringar efter rendering
  restoreBlockSelections();
}

// Återställ visuella markeringar baserat på selectedTasksSet
function restoreBlockSelections() {
  if (typeof selectedTasksSet === 'undefined' || selectedTasksSet.length === 0) return;
  
  // Hitta alla block och markera de som är i selectedTasksSet
  document.querySelectorAll('.block[data-task-name]').forEach(block => {
    const taskName = block.dataset.taskName;
    const taskDate = block.dataset.taskDate;
    const taskType = block.dataset.taskType;
    
    if (!taskName || !taskDate || !taskType) return;
    
    const isSelected = selectedTasksSet.some(t => 
      t.name === taskName && t.date === taskDate && t.type === taskType
    );
    
    if (isSelected) {
      block.classList.add('selected');
      // Uppdatera även index i selectedBlocks
      const idx = parseInt(block.dataset.index);
      if (!isNaN(idx) && idx >= 0) {
        selectedBlocks.add(idx);
      }
    }
  });
}

// ===============================================
// G. INTERAKTION & EVENTHANTERING
// ===============================================

// ... (Alla befintliga interaktionsfunktioner är intakta) ...

function setTimelineYear() { // <-- NY FUNKTION
    const yearInput = document.getElementById('yearInput');
    const newYear = parseInt(yearInput.value);
    
    if (isNaN(newYear) || newYear < 2000 || newYear > 2100) {
        document.getElementById('info').textContent = 'Ange ett giltigt årtal (2000-2100).';
        return;
    }

    currentYear = newYear;
    
    // Genererar om tidslinjen och ritar ut uppgifterna för det nya året
    generateTimeline();
    // Uppdatera avbrotts- och kvalitetsförlusttidslinjer med samma år
    if (typeof initInterruptionTimeline === 'function') initInterruptionTimeline();
    if (typeof initQualityLossTimeline === 'function') initQualityLossTimeline();
    document.getElementById('info').textContent = `Tidslinje uppdaterad till år ${newYear}.`;
}

function updateWorkHours(date, value){
// ... (resten av funktionen) ...
  const newHours = parseFloat(value);
  const dayDiv = document.querySelector(`.day[data-date='${date}']`);
  dayDiv.dataset.workhours = newHours; 

  tasks.filter(t => t.date === date).forEach(t => t.dayLimit = newHours);

  save();
  recalculateAllTasks();
  renderTasks();
}

function updateMeetingHours(date, value){
    const newHours = parseFloat(value) || 0;
    const dayDiv = document.querySelector(`.day[data-date='${date}']`);
    
    // Hämta den aktuella dagliga gränsen från DOM, eller standardvärde
    const currentDayLimit = parseFloat(dayDiv.dataset.workhours) || HOURS_PER_DAY_DEFAULT; 

    // 1. Ta bort befintliga uppgifter för möte OCH dagliga gräns/dummy
    tasks = tasks.filter(t => t.date !== date || (t.type !== 'meeting' && t.type !== 'dummy'));
    
    // 2. Om ny mötestid > 0, lägg till den nya mötesuppgiften
    if (newHours > 0) {
        tasks.push({
            name: 'Mötestid', 
            type: 'meeting', 
            date: date, 
            hours: newHours, 
            totalHours: newHours,
            dayLimit: currentDayLimit // Behåll den befintliga dagliga gränsen
        });
    }

    // 3. Återskapa eller uppdatera den dagliga timgränsen i tasks-arrayen
    // Detta garanterar att den anpassade dayLimit inte försvinner om mötet raderas,
    // eller om dagen annars skulle sakna en uppgift för recalculateAllTasks att hitta.
    if (!tasks.some(t => t.date === date && t.dayLimit !== undefined)) {
         tasks.push({ date: date, dayLimit: currentDayLimit, hours: 0, type: 'dummy', name: 'limit' });
    }
    
    // Uppdatera DOM-datatsetet för att vara konsekvent, även om det borde vara rätt
    dayDiv.dataset.meetinghours = newHours; 

    recalculateAllTasks();
}

function startAddTask() {
// ... (resten av funktionen) ...
  const taskName = document.getElementById('taskName');
  const taskType = document.getElementById('taskType');
  const taskHours = document.getElementById('taskHours');
  
  if (!taskName.value || !taskHours.value) return;
  pendingTask = { 
    name: taskName.value, 
    type: taskType.value, 
    hours: parseFloat(taskHours.value), 
    totalHours: parseFloat(taskHours.value) 
  };
  document.getElementById('info').textContent = 'Klicka på startdatum i tidslinjen';
}

function placeTask(startDateStr){
// ... (resten av funktionen) ...
    // Hantera split mode
    if (splitMode) {
        const newStartDate = new Date(startDateStr + 'T00:00:00');
        const splitDate = new Date(splitMode.splitDate + 'T00:00:00');
        
        // Kontrollera att det nya datumet är tidigare
        if (newStartDate >= splitDate) {
            alert('Du måste välja ett TIDIGARE datum än uppdelningsdatumet!');
            return;
        }
        
        // Hitta projektets huvuduppgift
        const mainProjectTask = tasks.find(t => t.name === splitMode.projectName && t.type === 'project');
        
        if (!mainProjectTask) {
            splitMode = null;
            document.getElementById('info').textContent = '';
            document.getElementById('info').style.color = '';
            document.getElementById('info').style.fontWeight = '';
            return;
        }
        
        // Hitta alla allokeringar för projektet
        const projectAllocations = tasks.filter(t => t.name === splitMode.projectName && t.type === 'project');
        
        // Bevara kommentarer från befintliga allokeringar
        const commentMap = {};
        projectAllocations.forEach(a => {
            if (a.comment && a.comment.trim()) {
                commentMap[a.date] = a.comment;
            }
        });
        
        // Beräkna hur många timmar som är allokerade före splitDate
        let hoursBeforeSplit = 0;
        projectAllocations.forEach(a => {
            const allocDate = new Date(a.date + 'T00:00:00');
            if (allocDate < splitDate) {
                hoursBeforeSplit += a.hours;
            }
        });
        
        if (hoursBeforeSplit < 0.01) {
            alert('Det finns inga allokerade timmar före uppdelningsdatumet!');
            splitMode = null;
            document.getElementById('info').textContent = '';
            document.getElementById('info').style.color = '';
            document.getElementById('info').style.fontWeight = '';
            return;
        }
        
        // Ta bort alla befintliga allokeringar för detta projekt
        tasks = tasks.filter(t => !(t.name === splitMode.projectName && t.type === 'project'));
        
        // Skapa två nya projekt-startpunkter
        const totalHours = mainProjectTask.totalHours;
        const hoursAfterSplit = totalHours - hoursBeforeSplit;
        
        // Hitta nästa lediga del-nummer
        let partNum = 1;
        while (tasks.some(t => t.name === `${splitMode.projectName} (del ${partNum})`)) {
            partNum++;
        }
        
        // Del 1: Före split (börjar från newStartDate)
        const name1 = `${splitMode.projectName} (del ${partNum})`;
        tasks.push({
            name: name1,
            type: 'project',
            date: startDateStr,
            hours: 0,
            totalHours: hoursBeforeSplit,
            dayLimit: HOURS_PER_DAY_DEFAULT,
            direction: mainProjectTask.direction || 'forward'
        });
        
        // Del 2: Efter split (börjar från splitDate)
        const name2 = `${splitMode.projectName} (del ${partNum + 1})`;
        tasks.push({
            name: name2,
            type: 'project',
            date: splitMode.splitDate,
            hours: 0,
            totalHours: hoursAfterSplit,
            dayLimit: HOURS_PER_DAY_DEFAULT,
            direction: mainProjectTask.direction || 'forward'
        });
        
        recalculateAllTasks();
        document.getElementById('info').textContent = `Projektet "${splitMode.projectName}" uppdelat i två delar med lucka!`;
        document.getElementById('info').style.color = '';
        document.getElementById('info').style.fontWeight = '';
        splitMode = null;
        return;
    }
    
    if (!pendingTask) return;
    
    if (pendingTask.type === 'project') {
        currentPlacementDate = startDateStr;
        document.getElementById('modalTitle').textContent = `Schemaläggning av projekt "${pendingTask.name}"`;
        document.getElementById('selectedDateSpan').textContent = startDateStr;
        document.getElementById('directionModal').classList.add('show');
    } else {
         const dayDiv = document.querySelector(`.day[data-date='${startDateStr}']`);
         const dayLimit = dayDiv ? parseFloat(dayDiv.dataset.workhours) : HOURS_PER_DAY_DEFAULT;

         tasks.push({
             name: pendingTask.name, 
             type: pendingTask.type, 
             date: startDateStr, 
             hours: pendingTask.hours, 
             totalHours: pendingTask.totalHours,
             dayLimit: dayLimit
         });
         recalculateAllTasks();
         pendingTask = null;
         document.getElementById('info').textContent = '';
    }
}

function confirmProjectPlacement(direction) {
// ... (resten av funktionen) ...
    document.getElementById('directionModal').classList.remove('show');
    const startDateStr = currentPlacementDate;
    
    const dayDiv = document.querySelector(`.day[data-date='${startDateStr}']`);
    const dayLimit = dayDiv ? parseFloat(dayDiv.dataset.workhours) : HOURS_PER_DAY_DEFAULT;

    const existingProject = tasks.find(t => t.name === pendingTask.name && t.type === 'project');
    if (existingProject) {
        tasks = tasks.filter(t => t.name !== pendingTask.name);
    }
    
    // Tilldela laneIndex baserat på antalet unika projekt
    const existingProjects = new Set(tasks.filter(t => t.type === 'project').map(t => t.name.replace(/\s*\(del\s+\d+\)\s*$/i, '')));
    const laneIndex = existingProjects.size;

    tasks.push({
        name: pendingTask.name, 
        type: pendingTask.type, 
        date: startDateStr, 
        hours: 0, 
        totalHours: pendingTask.totalHours,
        dayLimit: dayLimit,
        direction: direction,
        laneIndex: laneIndex
    });
    
    recalculateAllTasks(); 
    pendingTask = null;
    document.getElementById('info').textContent = `Projekt placerat: ${direction === 'forward' ? 'Framåt' : 'Bakåt'}`;
}

function cancelPlacement() {
// ... (resten av funktionen) ...
    document.getElementById('directionModal').classList.remove('show');
    pendingTask = null;
    currentPlacementDate = null;
    document.getElementById('info').textContent = 'Placering avbruten.';
}

function handleDrop(e, newDate){
// ... (resten av funktionen) ...
  e.preventDefault();
  const index = e.dataTransfer.getData('index');
  if(index===null || isNaN(index)) return;
  const idx = parseInt(index);
  const task = tasks[idx];
  if(!task || task.type === 'meeting') return; 

  saveUndoState();

  // Om copyMode är aktivt (Ctrl hålls ned), kopiera istället för att flytta
  if (copyMode) {
    const newTask = {...task, date: newDate};
    tasks.push(newTask);
    document.getElementById('info').textContent = `Kopierade "${task.name}" till ${newDate}`;
    setTimeout(() => document.getElementById('info').textContent = '', 2000);
  } else {
    // Vanlig flytt
    if(task.type !== 'project'){
      task.date = newDate;
    } else {
      // För projektblock - kolla om det är ett locked block
      if (task.locked === true) {
        // Flytta det låsta blocket
        task.date = newDate;
      } else {
        // Om det inte är låst, flytta hela projektets startdatum
        const startTask = tasks.find(t => t.name === task.name && t.type === 'project');
        if (startTask) {
            startTask.date = newDate;
            startTask.direction = startTask.direction || 'forward';
        }
      }
    }
  }
  
  copyMode = false; // Återställ copyMode
  dragMode='single'; 
  contextOriginDate=null; 
  recalculateAllTasks(); 
}

// ===============================================
// MULTI-SELECT FUNKTIONER
// OBS: Huvudfunktionerna finns i selection.js
// ===============================================

// ===============================================
// FLYTTA MARKERADE BLOCK TILL NYTT DATUM
// ===============================================
function moveSelectedBlocksToDate() {
  if (typeof selectedTasksSet === 'undefined' || selectedTasksSet.length === 0) {
    if (selectedBlocks.size === 0) return;
  }
  
  const blockCount = typeof selectedTasksSet !== 'undefined' ? selectedTasksSet.length : selectedBlocks.size;
  
  // Skapa en modal med datumväljare
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    min-width: 300px;
  `;
  
  dialog.innerHTML = `
    <h3 style="margin-top: 0;">Flytta ${blockCount} block till nytt datum</h3>
    <label style="display: block; margin-bottom: 10px;">
      Välj eller skriv datum (ÅÅÅÅ-MM-DD):
      <input type="text" id="moveDatePicker" placeholder="ÅÅÅÅ-MM-DD" pattern="\\d{4}-\\d{2}-\\d{2}" style="display: block; width: 100%; padding: 8px; margin-top: 5px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;">
    </label>
    <div style="display: flex; gap: 10px; margin-top: 15px;">
      <button id="confirmMove" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Flytta</button>
      <button id="cancelMove" style="flex: 1; padding: 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Avbryt</button>
    </div>
  `;
  
  modal.appendChild(dialog);
  document.body.appendChild(modal);
  
  const dateInput = document.getElementById('moveDatePicker');
  const confirmBtn = document.getElementById('confirmMove');
  const cancelBtn = document.getElementById('cancelMove');
  
  // Sätt dagens datum som default (ÅÅÅÅ-MM-DD format)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${year}-${month}-${day}`;
  dateInput.focus();
  dateInput.select(); // Markera texten så användaren kan börja skriva direkt
  
  // Hantera Avbryt
  const closeModal = () => {
    document.body.removeChild(modal);
  };
  
  cancelBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
  
  // Hantera Flytta
  confirmBtn.onclick = () => {
    const dateStr = dateInput.value;
    
    if (!dateStr) {
      alert('Välj ett datum!');
      return;
    }
    
    closeModal();
    
    const targetDate = new Date(dateStr + 'T00:00:00');
    if (isNaN(targetDate.getTime())) {
      alert('Ogiltigt datum!');
      return;
    }
  
  saveUndoState();
  
  // Hämta alla markerade block och sortera dem efter datum
  const selectedTasks = Array.from(selectedBlocks)
    .map(idx => ({ idx, task: tasks[idx], date: tasks[idx]?.date }))
    .filter(item => item.task)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));
  
  if (selectedTasks.length === 0) return;
  
  // Kontrollera om det är projektblock
  const isProjectBlocks = selectedTasks.every(item => item.task.type === 'project');
  
  if (isProjectBlocks) {
    // För projektblock: flytta datum OCH markera som låsta
    
    // Spara all nödvändig info från de markerade blocken INNAN vi modifierar tasks
    const blocksToMove = selectedTasks.map(item => ({
      name: item.task.name,
      hours: item.task.hours,
      totalHours: item.task.totalHours,
      dayLimit: item.task.dayLimit || HOURS_PER_DAY_DEFAULT,
      direction: item.task.direction || 'forward',
      originalDate: item.task.date,
      originalIndex: item.idx
    }));
    
    // Samla projektnamn som påverkas
    const affectedProjects = new Set(blocksToMove.map(b => b.name));
    
    // Markera ALLA befintliga block för påverkade projekt som locked
    affectedProjects.forEach(projectName => {
      tasks.forEach(t => {
        if (t.name === projectName && t.type === 'project' && !t.locked) {
          t.locked = true;
          if (t.hours > 0) {
            t.hasRealHours = true;
          }
        }
      });
    });
    
    // Ta bort BARA de specifika block som flyttas (baserat på index)
    const indicesToRemove = new Set(blocksToMove.map(b => b.originalIndex));
    tasks = tasks.filter((t, idx) => !indicesToRemove.has(idx));
    
    // INTE skapa gap placeholders - användaren vill bara flytta blocken, inte skapa luckor
    
    // Skapa nya locked blocks på målplatserna
    let currentDate = new Date(targetDate);
    
    blocksToMove.forEach(blockInfo => {
      // Hitta nästa arbetsdag
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6 || SWEDISH_HOLIDAYS(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Skapa nytt locked block på nya platsen
      tasks.push({
        name: blockInfo.name,
        type: 'project',
        date: toLocalISOString(currentDate),
        hours: blockInfo.hours,
        totalHours: blockInfo.totalHours,
        dayLimit: blockInfo.dayLimit,
        direction: blockInfo.direction,
        locked: true,
        hasRealHours: true
      });
      
      // Gå till nästa dag
      currentDate.setDate(currentDate.getDate() + 1);
    });
    
    save();
    renderTasks();
    
  } else {
    // För icke-projektblock: flytta bara datum
    let currentDate = new Date(targetDate);
    
    selectedTasks.forEach(item => {
      const task = tasks[item.idx];
      
      // Hitta nästa arbetsdag
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6 || SWEDISH_HOLIDAYS(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      task.date = toLocalISOString(currentDate);
      
      // Gå till nästa dag för nästa block
      currentDate.setDate(currentDate.getDate() + 1);
    });
    
    save();
    renderTasks();
  }
  
  clearBlockSelections();
  
  document.getElementById('info').textContent = `${selectedTasks.length} block flyttade till ${dateStr} och framåt!`;
  setTimeout(() => document.getElementById('info').textContent = '', 3000);
  }; // Stäng confirmBtn.onclick
}
// ===============================================

function showContextMenu(x,y,index,date,ctrlPressed=false){
// ... (resten av funktionen) ...
  removeContextMenu();
  const menu=document.createElement('div');
  menu.className='context-menu';
  menu.style.left=x+'px';
  menu.style.top=y+'px';
  
  const task = tasks[parseInt(index)];
  const isProject = task && task.type === 'project';
  const taskName = task ? task.name : '';
  
  let menuHtml = '';
  
  // Om ett eller flera block är markerade, visa batch-alternativ (högsta prioritet)
  const selectedCount = typeof selectedTasksSet !== 'undefined' ? selectedTasksSet.length : selectedBlocks.size;
  if (selectedCount >= 1) {
    const blockCount = selectedCount;
    menuHtml += `<button onclick="moveSelectedBlocksToDate()">📅 Flytta ${blockCount} block till nytt datum</button>`;
    menuHtml += `<button onclick="deleteSelectedBlocks()">⚠ Radera ${blockCount} markerade block</button>`;
    menuHtml += `<button onclick="removeContextMenu(); clearBlockSelections();">Avmarkera alla</button>`;
  } else {
    // Kommentaralternativ för alla block
    const hasComment = task && task.comment && task.comment.trim();
    menuHtml += `<button onclick="editBlockComment(${index})">${hasComment ? '✏ Redigera kommentar' : '💬 Lägg till kommentar'}</button>`;
    if (hasComment) {
      menuHtml += `<button onclick="removeBlockComment(${index})">🗑 Ta bort kommentar</button>`;
    }
    menuHtml += '<div style="border-top:1px solid #ddd;margin:5px 0;"></div>';
    
    // Vanliga alternativ för enstaka block (när inget är markerat via Ctrl+klick)
    if (isProject) {
        menuHtml += `<button onclick="editProjectTotalHours('${taskName}')">✏ Ändra projekttid (totalHours)</button>`;
        menuHtml += `<button onclick="moveToSpecificDate('${taskName}')">📅 Flytta hela projektet till specifikt datum</button>`;
        menuHtml += `<button onclick="offsetProject('${taskName}')">↔ Förskjut hela projektet (±dagar)</button>`;
        menuHtml += `<button style="color: red;" onclick="deleteProject('${taskName}')">Ta bort HELA projektet (${taskName})</button>`;
    } else {
        menuHtml += `<button onclick="editTaskHours(${index})">✏ Ändra timmar</button>`;
        menuHtml += `<button onclick="deleteTask(${index})">Ta bort detta block</button>`;
    }
  }

  menu.innerHTML = menuHtml;
  document.body.appendChild(menu);
  document.addEventListener('click',removeContextMenu,{once:true});
}

function deleteTask(index){ 
// ... (resten av funktionen) ...
    const idx = parseInt(index);
    tasks.splice(idx, 1);
    recalculateAllTasks(); 
    removeContextMenu(); 
}

function deleteProject(name) {
// ... (resten av funktionen) ...
    if(confirm(`Är du säker på att du vill ta bort HELA projektet "${name}" från tidslinjen?`)){
        saveUndoState();
        tasks = tasks.filter(t => t.name !== name);
        recalculateAllTasks();
        removeContextMenu();
        document.getElementById('info').textContent = `Projektet ${name} har raderats!`;
    }
}

function editProjectTotalHours(projectName) {
  removeContextMenu();
  
  // Hitta ett projektblock för att få nuvarande totalHours
  const projectTask = tasks.find(t => t.name === projectName && t.type === 'project');
  if (!projectTask) return;
  
  const currentTotal = projectTask.totalHours;
  const newTotal = prompt(`Ange ny total projekttid för "${projectName}":\n\nNuvarande: ${currentTotal}h`, currentTotal);
  
  if (newTotal === null || newTotal.trim() === '') return;
  
  const parsedTotal = parseFloat(newTotal);
  if (isNaN(parsedTotal) || parsedTotal <= 0) {
    alert('Ogiltig projekttid! Ange ett positivt tal.');
    return;
  }
  
  saveUndoState();
  
  // Uppdatera totalHours för ALLA block som tillhör detta projekt
  // Bevara alla andra egenskaper inklusive comments
  tasks.forEach(t => {
    if (t.name === projectName && t.type === 'project') {
      t.totalHours = parsedTotal;
    }
  });
  
  // Omallokera projektet med den nya totaltiden
  recalculateAllTasks();
  
  document.getElementById('info').textContent = `Projekttid för ${projectName} uppdaterad till ${parsedTotal}h!`;
  setTimeout(() => document.getElementById('info').textContent = '', 3000);
}

function editTaskHours(index) {
  removeContextMenu();
  
  const idx = parseInt(index);
  const task = tasks[idx];
  if (!task) return;
  
  const currentHours = task.hours || 0;
  const newHours = prompt(`Ändra timmar för "${task.name}" (${task.date}):\n\nNuvarande: ${currentHours}h`, currentHours);
  
  if (newHours === null || newHours.trim() === '') return;
  
  const parsedHours = parseFloat(newHours);
  if (isNaN(parsedHours) || parsedHours < 0) {
    alert('Ogiltigt värde! Ange ett positivt tal.');
    return;
  }
  
  saveUndoState();
  
  // Uppdatera timmar för detta specifika block
  tasks[idx].hours = parsedHours;
  
  // Omrendera
  renderTasks();
  save();
  
  document.getElementById('info').textContent = `Timmar för ${task.name} uppdaterad till ${parsedHours}h!`;
  setTimeout(() => document.getElementById('info').textContent = '', 3000);
}

function editProjectDayHours(index) {
  removeContextMenu();
  
  const idx = parseInt(index);
  const task = tasks[idx];
  if (!task || task.type !== 'project') return;
  
  const currentHours = task.hours || 0;
  const projectName = task.name;
  const taskDate = task.date;
  
  const newHours = prompt(`Ändra projekttid för "${projectName}" den ${taskDate}:\n\nNuvarande: ${currentHours}h\n\nOBS! Detta låser blocket och justerar projektets totalHours.`, currentHours);
  
  if (newHours === null || newHours.trim() === '') return;
  
  const parsedHours = parseFloat(newHours);
  if (isNaN(parsedHours) || parsedHours < 0) {
    alert('Ogiltigt värde! Ange ett positivt tal.');
    return;
  }
  
  saveUndoState();
  
  // Beräkna skillnaden
  const hoursDifference = parsedHours - currentHours;
  
  // Uppdatera detta blocks timmar och lås det
  tasks[idx].hours = parsedHours;
  tasks[idx].locked = true;
  tasks[idx].hasRealHours = true;
  tasks[idx].originalHours = parsedHours;
  
  // Uppdatera totalHours för ALLA block i samma projekt
  // (alla block måste ha samma totalHours för korrekt beräkning)
  const currentTotalHours = tasks[idx].totalHours || 0;
  const newTotalHours = currentTotalHours + hoursDifference;
  
  tasks.forEach(t => {
    if (t.type === 'project' && t.name === projectName) {
      t.totalHours = newTotalHours;
    }
  });
  
  // Omberäkna och omrendera
  recalculateAllTasks();
  renderTasks();
  save();
  
  document.getElementById('info').textContent = `Projekttid för ${projectName} (${taskDate}) ändrad till ${parsedHours}h!`;
  setTimeout(() => document.getElementById('info').textContent = '', 3000);
}

// ===============================================
// SWAP MODE - Byt plats mellan två dagar
// ===============================================
function startSwapMode(index, date) {
  removeContextMenu();
  swapMode = {
    sourceIndex: parseInt(index),
    sourceDate: date
  };
  
  const task = tasks[swapMode.sourceIndex];
  document.getElementById('info').textContent = `BYTA PLATS: Vald "${task.name}" (${date}). Högerklicka på den dag du vill byta med.`;
  document.getElementById('info').style.color = '#3498db';
  document.getElementById('info').style.fontWeight = 'bold';
  
  // Markera källblocket
  recalculateAllTasks();
}

function completeSwap(targetIndex, targetDate) {
  removeContextMenu();
  
  if (!swapMode) return;
  
  const sourceTask = tasks[swapMode.sourceIndex];
  const targetTask = tasks[parseInt(targetIndex)];
  
  if (!sourceTask || !targetTask) {
    cancelSwapMode();
    return;
  }
  
  saveUndoState();
  
  // Byt datum mellan de två tasksna
  const tempDate = sourceTask.date;
  sourceTask.date = targetTask.date;
  targetTask.date = tempDate;
  
  cancelSwapMode();
  recalculateAllTasks();
  
  document.getElementById('info').textContent = `Bytt plats mellan "${sourceTask.name}" och "${targetTask.name}"!`;
  document.getElementById('info').style.color = '';
  document.getElementById('info').style.fontWeight = '';
  setTimeout(() => document.getElementById('info').textContent = '', 3000);
}

function cancelSwapMode() {
  swapMode = null;
  document.getElementById('info').textContent = '';
  document.getElementById('info').style.color = '';
  document.getElementById('info').style.fontWeight = '';
  recalculateAllTasks();
}

// ===============================================
// OFFSET PROJECT - Förskjut projekt ±dagar
// ===============================================
function offsetProject(projectName) {
  removeContextMenu();
  
  const days = prompt(`Förskjut projektet "${projectName}"\nAnge antal dagar (positivt = framåt, negativt = bakåt):`);
  
  if (days === null || days.trim() === '') return;
  
  const offsetDays = parseInt(days);
  
  if (isNaN(offsetDays)) {
    alert('Ogiltigt antal dagar!');
    return;
  }
  
  saveUndoState();
  
  // Hitta alla allokeringar för projektet (både locked och unlocked)
  const projectTasks = tasks.filter(t => t.name === projectName && t.type === 'project');
  
  if (projectTasks.length === 0) return;
  
  // Skapa en temporär kopia av befintliga datum för att upptäcka överlappningar
  const existingDates = new Set(projectTasks.map(t => t.date));
  const newDates = new Set();
  
  projectTasks.forEach(task => {
    const currentDate = new Date(task.date + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + offsetDays);
    const newDateStr = toLocalISOString(currentDate);
    newDates.add(newDateStr);
  });
  
  // Kontrollera om några nya datum överlappar med befintliga
  const overlaps = [...newDates].filter(d => existingDates.has(d));
  
  if (overlaps.length > 0 && Math.abs(offsetDays) < 30) {
    const confirmed = confirm(
      `VARNING: Vissa dagar kommer att överlappa med befintliga projektdagar.\n\n` +
      `Detta kommer att slå ihop timmarna på de dagarna.\n\n` +
      `Överlappande datum: ${overlaps.join(', ')}\n\n` +
      `Vill du fortsätta?`
    );
    if (!confirmed) {
      return;
    }
  }
  
  // Flytta varje allokering
  projectTasks.forEach(task => {
    const currentDate = new Date(task.date + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + offsetDays);
    task.date = toLocalISOString(currentDate);
  });
  
  recalculateAllTasks();
  
  document.getElementById('info').textContent = `Projektet "${projectName}" förskjutet ${offsetDays} dagar ${offsetDays > 0 ? 'framåt' : 'bakåt'}!`;
  setTimeout(() => document.getElementById('info').textContent = '', 3000);
}

// ===============================================
// CREATE GAP IN PROJECT - Skapa lucka i projekt
// ===============================================
function createGapInProject(projectName, fromDate) {
  removeContextMenu();
  
  const gapDays = prompt(`Skapa lucka i projektet "${projectName}" från ${fromDate}\nAnge antal arbetsdagar för luckan (hoppar över helger/helgdagar):`);
  
  if (gapDays === null || gapDays.trim() === '') return;
  
  const days = parseInt(gapDays);
  
  if (isNaN(days) || days <= 0) {
    alert('Ange ett positivt antal arbetsdagar!');
    return;
  }
  
  saveUndoState();
  
  const fromDateObj = new Date(fromDate + 'T00:00:00');
  
  // Extrahera basnamn (ta bort " (del X)" om det redan finns)
  const baseProjectName = projectName.replace(/\s*\(del\s+\d+\)\s*$/i, '');
  
  // Hitta alla relaterade projektdelar med samma basnamn
  const relatedProjects = tasks.filter(t => {
    const tBaseName = t.name.replace(/\s*\(del\s+\d+\)\s*$/i, '');
    return tBaseName === baseProjectName && t.type === 'project';
  });
  
  // Hitta projektets huvuduppgift (startpunkten) bland relaterade projekt
  const mainProjectTask = tasks.find(t => t.name === projectName && t.type === 'project');
  
  if (!mainProjectTask) {
    alert(`Projektet "${projectName}" hittades inte!`);
    return;
  }
  
  const projectStartDate = new Date(mainProjectTask.date + 'T00:00:00');
  const isBackward = mainProjectTask.direction === 'backward';
  
  // För bakåt-projekt: fromDate måste vara FÖRE startdatum (eftersom projektet går bakåt)
  // För framåt-projekt: fromDate måste vara EFTER startdatum
  if (isBackward) {
    if (fromDateObj >= projectStartDate) {
      alert('För bakåt-projekt måste du välja ett datum FÖRE projektets startdatum för att skapa en lucka!');
      return;
    }
  } else {
    if (fromDateObj <= projectStartDate) {
      alert('Du måste välja ett datum EFTER projektets startdatum för att skapa en lucka!');
      return;
    }
  }
  
  // Beräkna hur många timmar som har allokerats baserat på riktning
  const projectAllocations = tasks.filter(t => t.name === projectName && t.type === 'project');
  
  let hoursBeforeGap = 0;
  projectAllocations.forEach(a => {
    const allocDate = new Date(a.date + 'T00:00:00');
    
    if (isBackward) {
      // För bakåt-projekt: räkna timmar EFTER fromDate (närmare startdatum)
      if (allocDate > fromDateObj) {
        hoursBeforeGap += a.hours;
      }
    } else {
      // För framåt-projekt: räkna timmar FÖRE fromDate
      if (allocDate < fromDateObj) {
        hoursBeforeGap += a.hours;
      }
    }
  });
  
  if (hoursBeforeGap < 0.01) {
    alert(isBackward 
      ? 'Det finns inga allokerade timmar efter det valda datumet (närmare startdatum)!'
      : 'Det finns inga allokerade timmar före det valda datumet!');
    return;
  }
  
  const totalHours = mainProjectTask.totalHours;
  const hoursAfterGap = totalHours - hoursBeforeGap;
  
  if (hoursAfterGap < 0.01) {
    alert('Det finns inga timmar kvar att flytta efter luckan!');
    return;
  }
  
  // Ta bort alla befintliga allokeringar för detta projekt
  tasks = tasks.filter(t => !(t.name === projectName && t.type === 'project'));
  
  // Hitta nästa lediga del-nummer baserat på basnamnet
  let partNum = 1;
  while (tasks.some(t => {
    const tBaseName = t.name.replace(/\s*\(del\s+\d+\)\s*$/i, '');
    return tBaseName === baseProjectName && t.name.includes(`(del ${partNum})`);
  })) {
    partNum++;
  }
  
  // Beräkna nytt startdatum efter luckan (endast vardagar)
  const newStartDate = new Date(fromDate + 'T00:00:00');
  let workdaysAdded = 0;
  
  if (isBackward) {
    // För bakåt-projekt: gå bakåt i tiden
    while (workdaysAdded < days) {
      newStartDate.setDate(newStartDate.getDate() - 1);
      
      // Räkna bara arbetsdagar (inte helger eller helgdagar)
      if (newStartDate.getDay() !== 0 && newStartDate.getDay() !== 6 && !SWEDISH_HOLIDAYS(newStartDate)) {
        workdaysAdded++;
      }
    }
  } else {
    // För framåt-projekt: gå framåt i tiden
    while (workdaysAdded < days) {
      newStartDate.setDate(newStartDate.getDate() + 1);
      
      // Räkna bara arbetsdagar (inte helger eller helgdagar)
      if (newStartDate.getDay() !== 0 && newStartDate.getDay() !== 6 && !SWEDISH_HOLIDAYS(newStartDate)) {
        workdaysAdded++;
      }
    }
  }
  
  const newStartDateStr = toLocalISOString(newStartDate);
  
  // Skapa delprojekt baserat på riktning
  if (isBackward) {
    // För bakåt-projekt:
    // Del 1: Närmare startdatum (från ursprungligt startdatum)
    const name1 = `${baseProjectName} (del ${partNum})`;
    tasks.push({
      name: name1,
      type: 'project',
      date: mainProjectTask.date, // Behåll ursprungligt startdatum
      hours: 0,
      totalHours: hoursBeforeGap,
      dayLimit: HOURS_PER_DAY_DEFAULT,
      direction: 'backward'
    });
    
    // Del 2: Längre bort från startdatum (nytt startdatum efter luckan, bakåt)
    const name2 = `${baseProjectName} (del ${partNum + 1})`;
    tasks.push({
      name: name2,
      type: 'project',
      date: newStartDateStr,
      hours: 0,
      totalHours: hoursAfterGap,
      dayLimit: HOURS_PER_DAY_DEFAULT,
      direction: 'backward'
    });
  } else {
    // För framåt-projekt:
    // Del 1: Före luckan (från ursprungligt startdatum till fromDate)
    const name1 = `${baseProjectName} (del ${partNum})`;
    tasks.push({
      name: name1,
      type: 'project',
      date: mainProjectTask.date, // Behåll ursprungligt startdatum
      hours: 0,
      totalHours: hoursBeforeGap,
      dayLimit: HOURS_PER_DAY_DEFAULT,
      direction: 'forward'
    });
    
    // Del 2: Efter luckan (från newStartDate)
    const name2 = `${baseProjectName} (del ${partNum + 1})`;
    tasks.push({
      name: name2,
      type: 'project',
      date: newStartDateStr,
      hours: 0,
      totalHours: hoursAfterGap,
      dayLimit: HOURS_PER_DAY_DEFAULT,
      direction: 'forward'
    });
  }
  
  recalculateAllTasks();
  
  document.getElementById('info').textContent = `Lucka på ${days} arbetsdagar skapad i projektet "${baseProjectName}"!`;
  setTimeout(() => document.getElementById('info').textContent = '', 3000);
}

// ===============================================
// MOVE TO SPECIFIC DATE - Flytta till exakt datum
// ===============================================
function moveToSpecificDate(projectName) {
  removeContextMenu();
  
  // Skapa en modal med datumväljare
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    min-width: 300px;
  `;
  
  dialog.innerHTML = `
    <h3 style="margin-top: 0;">Flytta projektet "${projectName}"</h3>
    <label style="display: block; margin-bottom: 10px;">
      Välj eller skriv nytt startdatum (ÅÅÅÅ-MM-DD):
      <input type="text" id="moveProjectDatePicker" placeholder="ÅÅÅÅ-MM-DD" pattern="\\d{4}-\\d{2}-\\d{2}" style="display: block; width: 100%; padding: 8px; margin-top: 5px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;">
    </label>
    <div style="display: flex; gap: 10px; margin-top: 15px;">
      <button id="confirmProjectMove" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Flytta</button>
      <button id="cancelProjectMove" style="flex: 1; padding: 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Avbryt</button>
    </div>
  `;
  
  modal.appendChild(dialog);
  document.body.appendChild(modal);
  
  const dateInput = document.getElementById('moveProjectDatePicker');
  const confirmBtn = document.getElementById('confirmProjectMove');
  const cancelBtn = document.getElementById('cancelProjectMove');
  
  // Sätt dagens datum som default (ÅÅÅÅ-MM-DD format)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${year}-${month}-${day}`;
  dateInput.focus();
  dateInput.select(); // Markera texten så användaren kan börja skriva direkt
  
  // Hantera Avbryt
  const closeModal = () => {
    document.body.removeChild(modal);
  };
  
  cancelBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
  
  // Hantera Flytta
  confirmBtn.onclick = () => {
    const dateStr = dateInput.value;
    
    if (!dateStr) {
      alert('Välj ett datum!');
      return;
    }
    
    closeModal();
    
    const newDate = new Date(dateStr + 'T00:00:00');
    if (isNaN(newDate.getTime())) {
      alert('Ogiltigt datum!');
      return;
    }
    
    saveUndoState();
    
    // Hitta projektets startpunkt
    const startTask = tasks.find(t => t.name === projectName && t.type === 'project');
    
    if (startTask) {
      startTask.date = dateStr;
      recalculateAllTasks();
      
      document.getElementById('info').textContent = `Projektet "${projectName}" flyttat till ${dateStr}!`;
      setTimeout(() => document.getElementById('info').textContent = '', 3000);
    }
  };
}
// ===============================================

function removeContextMenu(){
// ... (resten av funfunktionen) ...
  const menu=document.querySelector('.context-menu');
  if(menu) menu.remove();
}

// Lägg till eller redigera kommentar på ett block
function editBlockComment(index) {
  removeContextMenu();
  const task = tasks[parseInt(index)];
  if (!task) return;
  
  const currentComment = task.comment || '';
  const newComment = prompt('Ange kommentar för detta block:', currentComment);
  
  if (newComment !== null) { // null om användaren klickar på Avbryt
    task.comment = newComment.trim();
    save();
    renderTasks();
  }
}

// Ta bort kommentar från ett block
function removeBlockComment(index) {
  removeContextMenu();
  const task = tasks[parseInt(index)];
  if (!task) return;
  
  if (confirm('Är du säker på att du vill ta bort kommentaren?')) {
    task.comment = '';
    save();
    renderTasks();
  }
}

function prepareMove(mode,originDate){
// ... (resten av funktionen) ...
  dragMode=mode;
  contextOriginDate=originDate;
  removeContextMenu();
  document.getElementById('info').textContent = mode==='all' 
    ? 'Drag-n-drop: Flytta HELA projektet från vald dag' 
    : 'Drag-n-drop: Flytta endast ett block';
}

function splitProject(projectName, fromDate) {
  removeContextMenu();
  
  // Aktivera split mode
  splitMode = {
    projectName: projectName,
    splitDate: fromDate
  };
  
  document.getElementById('info').textContent = `DELA UPP PROJEKT "${projectName}": Klicka på ett TIDIGARE datum där du vill flytta de första allokeringarna till. Projektet kommer delas upp med en lucka.`;
  document.getElementById('info').style.color = '#e74c3c';
  document.getElementById('info').style.fontWeight = 'bold';
}

/* ======================== */
/* BELÄGGNINGSRAPPORT      */
/* ======================== */
function generateWeeklyReport() {

    const allDates = getFullYearDates();
    const weeklyData = {};
    const STANDARD_WORKDAY = 8; // Normal arbetsdag är 8 timmar

    const customTitle = prompt(t('enterReportName') || 'Ange rapportnamn (valfritt):', '');
    const baseTitle = `${t('capacityReportTitle')} (${currentYear})`;
    const reportTitle = (customTitle && customTitle.trim()) ? baseTitle : baseTitle;
    const reportSubtitle = (customTitle && customTitle.trim()) ? customTitle.trim() : '';

    // Samla alla unika uppgiftstyper (exkluderar projekt, möten och dummy)
    const allTaskTypes = new Set();
    tasks.forEach(t => {
        if (t.type !== 'project' && t.type !== 'meeting' && t.type !== 'dummy') {
            allTaskTypes.add(t.type);
        }
    });
    
    // Konvertera till array och sortera
    const taskTypesArray = Array.from(allTaskTypes).sort();
    
    // Hämta information om vilka som är slöseri
    const taskTypeSettings = typeof getTaskTypes === 'function' ? getTaskTypes() : [];
    const wasteTypes = new Set(taskTypeSettings.filter(t => t.isWaste).map(t => t.value));

    // Totalsummor för hela året - dynamisk struktur
    let yearTotals = {
        availableHours: 0,
        usedHours: 0,
        projectHours: 0,
        meetingHours: 0,
        interruptionHours: 0,
        qualityLossHours: 0,
        overtimeHours: 0,
        workingDays: 0
    };
    
    // Lägg till dynamiska kategorier
    taskTypesArray.forEach(type => {
        yearTotals[type + 'Hours'] = 0;
    });

    // ======================
    // VECKODATA
    // ======================
    allDates.forEach(dateStr => {
        const d = new Date(dateStr);
        const week = getWeekNumber(d);
        const year = d.getFullYear();
        const weekKey = `${year}-W${String(week).padStart(2, '0')}`;

        const dayTasks = tasks.filter(t => t.date === dateStr);
        const isWorkingDay =
            !(d.getDay() === 0 || d.getDay() === 6 || SWEDISH_HOLIDAYS(d));

        if (!isWorkingDay) return; // Hoppa över helger

        const dayLimit = dayTasks.find(t => t.dayLimit !== undefined)?.dayLimit || HOURS_PER_DAY_DEFAULT;

        // Hämta avbrottstid för denna dag
        const interruptionHours = (typeof getInterruptionHoursForDate === 'function') 
            ? getInterruptionHoursForDate(dateStr) 
            : 0;
        
        // Hämta kvalitetsförlust-tid för denna dag
        const qualityLossHours = (typeof getQualityLossHoursForDate === 'function')
            ? getQualityLossHoursForDate(dateStr)
            : 0;

        const totalUsed = dayTasks
            .filter(t => t.type !== 'dummy')
            .reduce((s, t) => s + t.hours, 0) + interruptionHours + qualityLossHours;

        const projectTasks = dayTasks.filter(t => t.type === 'project');
        const projectHours = projectTasks.reduce((s, t) => s + t.hours, 0);
        const projectCount = projectTasks.length;

        // Beräkna mötestimmar separat
        const meetingHours = dayTasks
            .filter(t => t.type === 'meeting')
            .reduce((s, t) => s + t.hours, 0);

        // Dynamisk beräkning av timmar per typ
        const typeHours = {};
        taskTypesArray.forEach(type => {
            typeHours[type] = dayTasks
                .filter(t => t.type === type)
                .reduce((s, t) => s + t.hours, 0);
        });

        // Övertid = tid utöver normal 8-timmars arbetsdag
        const overtimeHours = Math.max(0, dayLimit - STANDARD_WORKDAY);

        // Kvalitetsförlust (waste) = summan av alla typer markerade som slöseri + kvalitetsförluster från logg
        const wasteHours = taskTypesArray
            .filter(type => wasteTypes.has(type))
            .reduce((sum, type) => sum + typeHours[type], 0) + qualityLossHours;

        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
                available: 0,
                used: 0,
                projectHours: 0,
                projectCount: 0,
                meetingHours: 0,
                wasteHours: 0,
                interruptionHours: 0,
                qualityLossHours: 0,
                overtimeHours: 0,
                workingDays: 0,
                startDate: dateStr,
                endDate: dateStr
            };
            
            // Lägg till dynamiska kategorier
            taskTypesArray.forEach(type => {
                weeklyData[weekKey][type + 'Hours'] = 0;
            });
        }

        weeklyData[weekKey].available += dayLimit;
        weeklyData[weekKey].used += totalUsed;
        weeklyData[weekKey].projectHours += projectHours;
        weeklyData[weekKey].projectCount += projectCount;
        weeklyData[weekKey].meetingHours += meetingHours;
        weeklyData[weekKey].wasteHours += wasteHours;
        weeklyData[weekKey].interruptionHours += interruptionHours;
        weeklyData[weekKey].qualityLossHours += qualityLossHours;
        weeklyData[weekKey].overtimeHours += overtimeHours;
        weeklyData[weekKey].endDate = dateStr;
        weeklyData[weekKey].workingDays++;
        
        // Uppdatera dynamiska kategorier
        taskTypesArray.forEach(type => {
            weeklyData[weekKey][type + 'Hours'] += typeHours[type];
        });

        // Uppdatera årstotaler
        yearTotals.availableHours += dayLimit;
        yearTotals.usedHours += totalUsed;
        yearTotals.projectHours += projectHours;
        yearTotals.meetingHours += meetingHours;
        yearTotals.interruptionHours += interruptionHours;
        yearTotals.qualityLossHours += qualityLossHours;
        yearTotals.overtimeHours += overtimeHours;
        yearTotals.workingDays++;
        
        // Uppdatera dynamiska kategorier
        taskTypesArray.forEach(type => {
            yearTotals[type + 'Hours'] += typeHours[type];
        });
    });

    // Beräkna årsstatistik
    const yearUtilization = yearTotals.availableHours > 0 
        ? (yearTotals.usedHours / yearTotals.availableHours) * 100 
        : 0;
    const yearProjectShare = yearTotals.usedHours > 0 
        ? (yearTotals.projectHours / yearTotals.usedHours) * 100 
        : 0;
    
    const totalWasteHours = taskTypesArray
        .filter(type => wasteTypes.has(type))
        .reduce((sum, type) => sum + yearTotals[type + 'Hours'], 0);
    const yearWasteShare = yearTotals.usedHours > 0 
        ? (totalWasteHours / yearTotals.usedHours) * 100 
        : 0;

    // ======================
    // BYGG HTML
    // ======================
    const locale = currentLanguage === 'sv' ? 'sv-SE' : 'en-US';
    const reportDate = new Date().toLocaleString(locale, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    // Få etiketter för alla kategorier
    const getTaskTypeLabel = (type) => {
        const typeSettings = taskTypeSettings.find(t => t.value === type);
        return typeSettings ? typeSettings.label : type;
    };
    
    // Bygg kategori-HTML dynamiskt
    let categoryHtml = '';
    const categoriesPerRow = 3;
    for (let i = 0; i < taskTypesArray.length; i += categoriesPerRow) {
        const typesInRow = taskTypesArray.slice(i, i + categoriesPerRow);
        typesInRow.forEach(type => {
            const hours = yearTotals[type + 'Hours'];
            const label = getTaskTypeLabel(type);
            const isWaste = wasteTypes.has(type);
            categoryHtml += `<strong>${label}:</strong> ${hours.toFixed(1)}h${isWaste ? ' <span style="color:#e74c3c">⚠</span>' : ''}<br>`;
        });
    }

    let reportHtml = `
        <div class="report-modal" onclick="if(event.target.classList.contains('report-modal')) { document.body.classList.remove('report-open'); this.remove(); }">
            <div class="report-content">
                <div class="report-header">
                    <h2>${reportTitle}</h2>
                    <button onclick="exportWeeklyReportToCsv()">${t('exportToExcel')}</button>
                    <button onclick="document.body.classList.remove('report-open'); this.closest('.report-modal').remove()">${t('closeAndGoBack')}</button>
                </div>
                
                ${reportSubtitle ? `<h3 style="margin:10px 0 5px 0;font-weight:normal;color:#555;text-align:left;">${reportSubtitle}</h3>` : ''}
                <div style="font-size:0.85em;color:#666;margin:10px 0 20px 0;text-align:left;">Rapport skapad: ${reportDate}</div>

                <!-- ÅRSSAMMANFATTNING -->
                <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px;">
                    <h3 style="margin-top:0;">Årssammanfattning ${currentYear}</h3>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
                        <div>
                            <strong>${t('workDays')}:</strong> ${yearTotals.workingDays}<br>
                            <strong>${t('availableTime')}:</strong> ${yearTotals.availableHours.toFixed(1)}h<br>
                            <strong>${t('usedTime')}:</strong> ${yearTotals.usedHours.toFixed(1)}h
                        </div>
                        <div>
                            <strong>${t('capacityPercent').replace(' (%)', '')}:</strong> <span style="color:${yearUtilization >= 100 ? '#e74c3c' : yearUtilization >= 85 ? '#f39c12' : '#27ae60'}">${yearUtilization.toFixed(1)}%</span><br>
                            <strong>${t('totalOvertime')}:</strong> <span style="color:#e67e22">${yearTotals.overtimeHours.toFixed(1)}h</span><br>
                            <strong>${t('projectShare')}:</strong> ${yearProjectShare.toFixed(1)}%
                        </div>
                        <div>
                            <strong>${t('projects').replace(' (h)', '')}:</strong> ${yearTotals.projectHours.toFixed(1)}h<br>
                            <strong>${t('meetings').replace(' (h)', '')}:</strong> ${yearTotals.meetingHours.toFixed(1)}h<br>
                            ${categoryHtml}
                        </div>
                        <div>
                            <strong>${t('interruptionsPiMail')}:</strong> ${yearTotals.interruptionHours.toFixed(1)}h<br>
                            <strong>${t('qualityLoss')}:</strong> <span style="color:#f39c12">${yearTotals.qualityLossHours.toFixed(1)}h</span>
                        </div>
                        ${totalWasteHours > 0 ? `
                        <div style="background:#fff3cd;padding:10px;border-radius:5px;">
                            <strong style="color:#856404;">${t('waste')}:</strong><br>
                            <span style="font-size:1.2em;color:#e74c3c">${totalWasteHours.toFixed(1)}h (${yearWasteShare.toFixed(1)}%)</span><br>
                            ${taskTypesArray.filter(type => wasteTypes.has(type)).map(type => 
                                `<small>${getTaskTypeLabel(type)}: ${yearTotals[type + 'Hours'].toFixed(1)}h</small><br>`
                            ).join('')}
                        </div>
                        ` : ''}
                    </div>
                </div>

                <h3>${t('capacityByWeek')}</h3>
                <p style="font-size:0.9em;color:#666;margin-bottom:10px;">
                    ${t('capacityStatusLegend')}
                </p>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>${t('week')}</th>
                            <th>${t('period')}</th>
                            <th>${t('availableTime')}</th>
                            <th>${t('usedTime')}</th>
                            <th>${t('capacityPercent').replace(' (%)', '')}</th>
                            <th>${t('projects').replace(' (h)', '')}</th>
                            <th>${t('meetings')}</th>
                            <th>${t('otherTasks')}</th>
                            <th>${t('overtime')}</th>
                            <th>${t('interruptions')}</th>
                            ${totalWasteHours > 0 ? `<th>${t('waste')}</th>` : ''}
                            <th>${t('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    Object.keys(weeklyData).sort().forEach(key => {
        const data = weeklyData[key];
        const weekNumber = key.split('-W')[1];

        const available = data.available;
        const used = data.used;

        const utilization = available > 0 ? (used / available) * 100 : 0;

        const projectShare = used > 0 ? (data.projectHours / used) * 100 : 0;
        const meetingShare = used > 0 ? (data.meetingHours / used) * 100 : 0;
        
        // Summera alla övriga uppgifter (ej projekt och möten)
        const otherTasksHours = taskTypesArray.filter(type => type !== 'meeting').reduce((sum, type) => sum + (data[type + 'Hours'] || 0), 0);

        const wasteShare = used > 0 ? (data.wasteHours / used) * 100 : 0;

        let barClass, statusText;
        if (utilization >= 100.1) {
            barClass = 'red';
            statusText = t('statusOverloaded');
        } else if (utilization >= 85) {
            barClass = 'yellow';
            statusText = t('statusHighLoad');
        } else {
            barClass = 'green';
            statusText = t('statusGoodCapacity');
        }
        
        // Bygg detaljer för övriga uppgifter (exkludera möten)
        let otherTasksDetails = taskTypesArray
            .filter(type => type !== 'meeting' && (data[type + 'Hours'] || 0) > 0)
            .map(type => `${getTaskTypeLabel(type).substring(0, 3)}: ${data[type + 'Hours'].toFixed(1)}h`)
            .join(', ');
        if (otherTasksDetails.length > 40) {
            otherTasksDetails = otherTasksDetails.substring(0, 40) + '...';
        }

        reportHtml += `
            <tr>
                <td><strong>V${weekNumber}</strong></td>
                <td style="font-size:0.85em;">${data.startDate} – ${data.endDate}</td>
                <td>${available.toFixed(1)}h</td>
                <td>${used.toFixed(1)}h</td>
                <td class="progress-bar">
                    <div class="bar ${barClass}"
                         style="width:${Math.min(utilization,100)}%; min-width:${utilization>0?'10px':'0'}">
                        ${utilization.toFixed(0)}%
                    </div>
                </td>
                <td>${data.projectCount > 0 ? `${data.projectHours.toFixed(1)}h<br><small style="color:#666">(${projectShare.toFixed(0)}%)</small>` : `<span style="color:#999;font-style:italic">-</span><br><small style="color:#aaa">Ej planerat</small>`}</td>
                <td>${data.meetingHours > 0 ? data.meetingHours.toFixed(1) + 'h<br><small style="color:#666">(' + meetingShare.toFixed(0) + '%)</small>' : '-'}</td>
                <td>${otherTasksHours.toFixed(1)}h${otherTasksDetails ? `<br><small style="color:#666">${otherTasksDetails}</small>` : ''}</td>
                <td style="${data.overtimeHours > 0 ? 'color:#e67e22;font-weight:bold;' : ''}">${data.overtimeHours > 0 ? data.overtimeHours.toFixed(1)+'h' : '-'}</td>
                <td style="${data.interruptionHours > 0 ? 'color:#9b59b6;font-weight:bold;' : ''}">${data.interruptionHours > 0 ? data.interruptionHours.toFixed(1)+'h' : '-'}</td>
                ${totalWasteHours > 0 ? `
                <td>
                  ${data.wasteHours > 0 ? `
                    <span style="color:#e74c3c;font-weight:bold">${data.wasteHours.toFixed(1)}h</span>
                    <small style="color:#666"> (${wasteShare.toFixed(0)}%)</small>
                  ` : '-'}
                </td>
                ` : ''}
                <td>${statusText}</td>
            </tr>
        `;
    });

    reportHtml += `
                    </tbody>
                </table>

                <h3 style="margin-top:30px;">${t('dailyCapacityWorkdays')}</h3>
                <p style="font-size:0.9em;color:#666;margin-bottom:10px;">
                    ${t('dailyCapacityDescription')}
                </p>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>${t('date')}</th>
                            <th>${t('weekday')}</th>
                            <th>${t('availableTime')}</th>
                            <th>${t('overtime')}</th>
                            <th>${t('usedTime')}</th>
                            <th>${t('capacityPercent').replace(' (%)', '')}</th>
                            <th>${t('projects').replace(' (h)', '')}</th>
                            <th>${t('meetings')}</th>
                            <th>${t('supportChange')}</th>
                            <th>${t('interruptions').replace(' (h)', '')}</th>
                            <th>${t('qualityLoss')}</th>
                            <th>${t('other')}</th>
                            <th>${t('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    // Lägg till dagliga rader
    allDates.forEach(dateStr => {
        const d = new Date(dateStr);
        const isWorkingDay = !(d.getDay() === 0 || d.getDay() === 6 || SWEDISH_HOLIDAYS(d));
        
        if (!isWorkingDay) return; // Hoppa över helger
        
        const dayTasks = tasks.filter(t => t.date === dateStr);
        const dayLimit = dayTasks.find(t => t.dayLimit !== undefined)?.dayLimit || HOURS_PER_DAY_DEFAULT;
        
        const interruptionHours = (typeof getInterruptionHoursForDate === 'function') ? getInterruptionHoursForDate(dateStr) : 0;
        const qualityLossHours = (typeof getQualityLossHoursForDate === 'function') ? getQualityLossHoursForDate(dateStr) : 0;
        
        const totalUsed = dayTasks.filter(t => t.type !== 'dummy').reduce((s, t) => s + t.hours, 0) + interruptionHours + qualityLossHours;
        const projectTasks = dayTasks.filter(t => t.type === 'project');
        const projectHours = projectTasks.reduce((s, t) => s + t.hours, 0);
        const hasProjects = projectTasks.length > 0;
        const meetingHours = dayTasks.filter(t => t.type === 'meeting').reduce((s, t) => s + t.hours, 0);
        const supportHours = dayTasks.filter(t => t.type === 'support').reduce((s, t) => s + t.hours, 0);
        const changeHours = dayTasks.filter(t => t.type === 'change').reduce((s, t) => s + t.hours, 0);
        const supportChangeHours = supportHours + changeHours;
        
        const omarbeteHours = dayTasks.filter(t => t.type === 'omarbete').reduce((s, t) => s + t.hours, 0);
        const senTilläggHours = dayTasks.filter(t => t.type === 'sent_tillagg').reduce((s, t) => s + t.hours, 0);
        const wasteHours = omarbeteHours + senTilläggHours;
        
        const overtimeHours = Math.max(0, dayLimit - STANDARD_WORKDAY);
        // Beläggning ska alltid beräknas mot normal arbetsdag (8h), inte mot utökad tid
        const utilization = STANDARD_WORKDAY > 0 ? (totalUsed / STANDARD_WORKDAY) * 100 : 0;
        
        let statusClass, statusText;
        // Färgkodning baserad på faktiska arbetstimmar
        if (totalUsed > 9) {
            statusClass = 'red';
            statusText = t('statusOverloaded');
        } else if (totalUsed >= 8) {
            statusClass = 'yellow';
            statusText = t('statusHigh');
        } else {
            statusClass = 'green';
            statusText = t('statusOk');
        }
        
        reportHtml += `
            <tr>
                <td>${dateStr}</td>
                <td>${getWeekdays()[d.getDay()]}</td>
                <td>${dayLimit.toFixed(1)}h</td>
                <td style="${overtimeHours > 0 ? 'color:#e67e22;font-weight:bold;' : ''}">${overtimeHours > 0 ? overtimeHours.toFixed(1)+'h' : '-'}</td>
                <td>${totalUsed.toFixed(1)}h</td>
                <td style="font-weight:bold;color:${statusClass === 'red' ? '#e74c3c' : statusClass === 'yellow' ? '#f39c12' : '#27ae60'}">${utilization.toFixed(0)}%</td>
                <td>${hasProjects ? projectHours.toFixed(1)+'h' : '<span style="color:#999;font-style:italic">-</span>'}</td>
                <td>${meetingHours > 0 ? meetingHours.toFixed(1)+'h' : '-'}</td>
                <td>${supportChangeHours > 0 ? supportChangeHours.toFixed(1)+'h' : '-'}</td>
                <td>${interruptionHours > 0 ? interruptionHours.toFixed(1)+'h' : '-'}</td>
                <td style="${qualityLossHours > 0 ? 'color:#f39c12;font-weight:bold;' : ''}">${qualityLossHours > 0 ? qualityLossHours.toFixed(1)+'h' : '-'}</td>
                <td style="${wasteHours > 0 ? 'color:#e74c3c;font-weight:bold;' : ''}">${wasteHours > 0 ? wasteHours.toFixed(1)+'h' : '-'}</td>
                <td>${statusText}</td>
            </tr>
        `;
    });

    reportHtml += `
                    </tbody>
                </table>

                <div style="background:#e8f5e9;padding:15px;border-radius:8px;margin-top:20px;border-left:4px solid #4caf50;">
                    <h4 style="margin-top:0;color:#2e7d32;">📊 Färgkodning (Status)</h4>
                    <p style="margin:5px 0;">
                        <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#27ae60;margin-right:8px;"></span>
                        <strong style="color:#27ae60;">Grön (OK):</strong> Under 8 timmar arbetstid per dag
                    </p>
                    <p style="margin:5px 0;">
                        <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#f39c12;margin-right:8px;"></span>
                        <strong style="color:#f39c12;">Gul (Hög belastning):</strong> 8-9 timmar arbetstid per dag
                    </p>
                    <p style="margin:5px 0;">
                        <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#e74c3c;margin-right:8px;"></span>
                        <strong style="color:#e74c3c;">Röd (Överbelastad):</strong> Över 9 timmar arbetstid per dag
                    </p>
                </div>

                <div style="background:#fff3cd;padding:15px;border-radius:8px;margin-top:20px;">
                    <h4 style="margin-top:0;color:#856404;">💡 Förklaring av begrepp</h4>
                    <p style="margin:5px 0;"><strong>Tillgänglig tid:</strong> Total arbetstid per dag/vecka (inklusive eventuell övertid).</p>
                    <p style="margin:5px 0;"><strong>Använd tid:</strong> Summan av all allokerad tid för uppgifter (inkl. avbrott och kvalitetsförluster).</p>
                    <p style="margin:5px 0;"><strong>Beläggning:</strong> Använd tid ÷ Tillgänglig tid × 100%. Visar hur fullt schemat är.</p>
                    <p style="margin:5px 0;"><strong>Övertid:</strong> Tid utöver normal 8-timmars arbetsdag.</p>
                    <p style="margin:5px 0;"><strong>Kvalitetsförlust:</strong> Arbete som inte skapar värde = Omarbete + Sent tillägg. <em>Exkluderar avbrott eftersom dessa ofta är legitima arbetsuppgifter (PI, mail).</em></p>
                    <p style="margin:5px 0;"><strong>Projektandel:</strong> Hur stor del av arbetstiden som går till projekt.</p>
                </div>

                <h3 style="margin-top:30px;">${t('projectCompletion')}</h3>
                <p style="font-size:0.9em;color:#666;margin-bottom:10px;">
                    ${t('projectCompletionDescription').replace('{hours}', (HOURS_PER_DAY_DEFAULT * 0.75).toFixed(1))}
                </p>

                <table class="report-table">
                    <thead>
                        <tr>
                            <th>${t('project')}</th>
                            <th>${t('total')}</th>
                            <th>${t('startDate')}</th>
                            <th>${t('endDate')}</th>
                            <th>${t('actualWorkDays')}</th>
                            <th>${t('idealWorkDays75')}</th>
                            <th>Avvikelse (dagar)</th>
                            <th>${t('completionEfficiency')}</th>
                        </tr>
                    </thead>
                    <tbody>
                `;

        // Gruppera projekten
        const projectEntries = tasks.filter(t => t.type === 'project');
        const projects = {};
        projectEntries.forEach(t => {
                const name = t.name || 'Projekt';
                const date = t.date;
                const hours = t.hours || 0;
                if (!projects[name]) {
                        projects[name] = { totalHours: 0, start: date, end: date };
                }
                const p = projects[name];
                p.totalHours += hours;
                if (date < p.start) p.start = date;
                if (date > p.end) p.end = date;
        });

        const idealPerDay75 = HOURS_PER_DAY_DEFAULT * 0.75; // 75% av arbetstiden

        const projectNames = Object.keys(projects);
        if (projectNames.length === 0) {
                reportHtml += `<tr><td colspan="8" style="text-align:center;color:#777;">${t('noProjects')}</td></tr>`;
        } else {
                projectNames.sort().forEach(name => {
                        const p = projects[name];
                        // Konvertera datumsträngar till Date-objekt med T00:00:00 för att undvika timezone-problem
                        const startDate = new Date(p.start + 'T00:00:00');
                        const endDate = new Date(p.end + 'T00:00:00');
                        const actualDays = countWorkDays(startDate, endDate);
                        const idealDays75 = Math.ceil(p.totalHours / idealPerDay75);
                        const deviation = actualDays - idealDays75;
                        const efficiency = actualDays > 0 ? (idealDays75 / actualDays) * 100 : 0;

                        const devClass = deviation > 0 ? 'red' : (deviation < 0 ? 'green' : 'yellow');
                        const effClass = efficiency >= 90 ? 'green' : (efficiency >= 70 ? 'yellow' : 'red');

                        reportHtml += `
                            <tr>
                                <td><strong>${name}</strong></td>
                                <td>${p.totalHours.toFixed(1)}h</td>
                                <td>${p.start}</td>
                                <td>${p.end}</td>
                                <td>${actualDays}</td>
                                <td>${idealDays75}</td>
                                <td class="progress-bar">
                                    <div class="bar ${devClass}" style="width:${Math.min(Math.abs(deviation)*10,100)}%">
                                        ${deviation > 0 ? '+'+deviation : deviation} dagar
                                    </div>
                                </td>
                                <td class="progress-bar">
                                    <div class="bar ${effClass}" style="width:${Math.min(efficiency,100)}%">
                                        ${efficiency.toFixed(0)}%
                                    </div>
                                </td>
                            </tr>
                        `;
                });
        }

        reportHtml += `
                    </tbody>
                </table>

                <p style="margin-top:10px;color:#555;font-size:0.9em;">
                    <strong>${t('interpretation')}</strong><br>
                    ${t('greenDeviationExplanation')}<br>
                    ${t('redDeviationExplanation')}<br>
                    ${t('efficiencyExplanation')}
                </p>
            </div>
        </div>
    `;

    document.body.classList.add('report-open');
    document.getElementById('reportContainer').innerHTML = reportHtml;
}

// Exportera beläggningsrapport per vecka till CSV
function exportWeeklyReportToCsv() {
    const allDates = getFullYearDates();
    const weeklyData = {};
    const STANDARD_WORKDAY = 8;
    
    // Totalsummor för hela året
    let yearTotals = {
        availableHours: 0,
        usedHours: 0,
        projectHours: 0,
        meetingHours: 0,
        supportHours: 0,
        changeHours: 0,
        improvementHours: 0,
        eplanHours: 0,
        omarbeteHours: 0,
        senTilläggHours: 0,
        interruptionHours: 0,
        qualityLossHours: 0,
        overtimeHours: 0,
        workingDays: 0
    };
    
    // Samla daglig data också
    const dailyData = [];

    allDates.forEach(dateStr => {
        const d = new Date(dateStr);
        const week = getWeekNumber(d);
        const year = d.getFullYear();
        const weekKey = `${year}-W${String(week).padStart(2, '0')}`;

        const dayTasks = tasks.filter(t => t.date === dateStr);
        const isWorkingDay = !(d.getDay() === 0 || d.getDay() === 6 || SWEDISH_HOLIDAYS(d));

        if (!isWorkingDay) return;

        const dayLimit = dayTasks.find(t => t.dayLimit !== undefined)?.dayLimit || HOURS_PER_DAY_DEFAULT;
        const totalUsed = dayTasks.filter(t => t.type !== 'dummy').reduce((s, t) => s + t.hours, 0);
        const projectHours = dayTasks.filter(t => t.type === 'project').reduce((s, t) => s + t.hours, 0);
        const meetingHours = dayTasks.filter(t => t.type === 'meeting').reduce((s, t) => s + t.hours, 0);
        const supportHours = dayTasks.filter(t => t.type === 'support').reduce((s, t) => s + t.hours, 0);
        const changeHours = dayTasks.filter(t => t.type === 'change').reduce((s, t) => s + t.hours, 0);
        const improvementHours = dayTasks.filter(t => t.type === 'förbättring').reduce((s, t) => s + t.hours, 0);
        const eplanHours = dayTasks.filter(t => t.type === 'eplan_underhåll').reduce((s, t) => s + t.hours, 0);

        const omarbeteHours = dayTasks.filter(t => t.type === 'omarbete').reduce((s, t) => s + t.hours, 0);
        const senTilläggHours = dayTasks.filter(t => t.type === 'sent_tillagg').reduce((s, t) => s + t.hours, 0);
        const interruptionHours = (typeof getInterruptionHoursForDate === 'function') ? getInterruptionHoursForDate(dateStr) : 0;
        const qualityLossHours = (typeof getQualityLossHoursForDate === 'function') ? getQualityLossHoursForDate(dateStr) : 0;
        const overtimeHours = Math.max(0, dayLimit - STANDARD_WORKDAY);
        const wasteHours = omarbeteHours + senTilläggHours;
        
        // Spara daglig data
        const utilization = dayLimit > 0 ? (totalUsed / dayLimit) * 100 : 0;
        let status = t('statusOk').replace(/🟢/g, '').trim();
        if (utilization >= 100.1) status = t('overloaded');
        else if (utilization >= 85) status = t('highLoad');
        
        dailyData.push({
            date: dateStr,
            weekday: getWeekdays()[d.getDay()],
            dayLimit: dayLimit,
            overtimeHours: overtimeHours,
            totalUsed: totalUsed,
            projectHours: projectHours,
            meetingHours: meetingHours,
            supportHours: supportHours,
            changeHours: changeHours,
            improvementHours: improvementHours,
            eplanHours: eplanHours,
            wasteHours: wasteHours,
            omarbeteHours: omarbeteHours,
            senTilläggHours: senTilläggHours,
            interruptionHours: interruptionHours,
            qualityLossHours: qualityLossHours,
            utilization: utilization,
            status: status
        });

        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
                available: 0,
                used: 0,
                projectHours: 0,
                meetingHours: 0,
                supportHours: 0,
                changeHours: 0,
                improvementHours: 0,
                eplanHours: 0,
                wasteHours: 0,
                omarbeteHours: 0,
                senTilläggHours: 0,
                interruptionHours: 0,
                qualityLossHours: 0,
                overtimeHours: 0,
                workingDays: 0,
                startDate: dateStr,
                endDate: dateStr
            };
        }

        weeklyData[weekKey].available += dayLimit;
        weeklyData[weekKey].used += totalUsed;
        weeklyData[weekKey].projectHours += projectHours;
        weeklyData[weekKey].meetingHours += meetingHours;
        weeklyData[weekKey].supportHours += supportHours;
        weeklyData[weekKey].changeHours += changeHours;
        weeklyData[weekKey].improvementHours += improvementHours;
        weeklyData[weekKey].eplanHours += eplanHours;
        weeklyData[weekKey].wasteHours += wasteHours;
        weeklyData[weekKey].omarbeteHours += omarbeteHours;
        weeklyData[weekKey].senTilläggHours += senTilläggHours;
        weeklyData[weekKey].interruptionHours += interruptionHours;
        weeklyData[weekKey].qualityLossHours += qualityLossHours;
        weeklyData[weekKey].overtimeHours += overtimeHours;
        weeklyData[weekKey].endDate = dateStr;
        weeklyData[weekKey].workingDays++;

        // Uppdatera årstotaler
        yearTotals.availableHours += dayLimit;
        yearTotals.usedHours += totalUsed;
        yearTotals.projectHours += projectHours;
        yearTotals.meetingHours += meetingHours;
        yearTotals.supportHours += supportHours;
        yearTotals.changeHours += changeHours;
        yearTotals.improvementHours += improvementHours;
        yearTotals.eplanHours += eplanHours;
        yearTotals.omarbeteHours += omarbeteHours;
        yearTotals.senTilläggHours += senTilläggHours;
        yearTotals.interruptionHours += interruptionHours;
        yearTotals.qualityLossHours += qualityLossHours;
        yearTotals.overtimeHours += overtimeHours;
        yearTotals.workingDays++;
    });

    const rows = [];
    
    // ÅRSSAMMANFATTNING
    rows.push(['ÅRSSAMMANFATTNING ' + currentYear]);
    rows.push([]);
    rows.push(['Arbetsdagar', yearTotals.workingDays]);
    rows.push(['Tillgänglig tid (h)', yearTotals.availableHours.toFixed(1)]);
    rows.push(['Använd tid (h)', yearTotals.usedHours.toFixed(1)]);
    rows.push(['Beläggning (%)', (yearTotals.availableHours > 0 ? (yearTotals.usedHours / yearTotals.availableHours) * 100 : 0).toFixed(1)]);
    rows.push(['Övertid totalt (h)', yearTotals.overtimeHours.toFixed(1)]);
    rows.push([]);
    rows.push(['FÖRDELNING AV TID']);
    rows.push(['Projekt (h)', yearTotals.projectHours.toFixed(1)]);
    rows.push(['Möten (h)', yearTotals.meetingHours.toFixed(1)]);
    rows.push(['Support (h)', yearTotals.supportHours.toFixed(1)]);
    rows.push(['Change (h)', yearTotals.changeHours.toFixed(1)]);
    rows.push(['Förbättring (h)', yearTotals.improvementHours.toFixed(1)]);
    rows.push(['Eplan (h)', yearTotals.eplanHours.toFixed(1)]);
    rows.push(['Avbrott PI/Mail (h)', yearTotals.interruptionHours.toFixed(1)]);
    rows.push(['Kvalitetsförlust från andra avd. (h)', yearTotals.qualityLossHours.toFixed(1)]);
    rows.push([]);
    rows.push(['KVALITETSFÖRLUST']);
    rows.push(['Omarbete (h)', yearTotals.omarbeteHours.toFixed(1)]);
    rows.push(['Sent tillägg (h)', yearTotals.senTilläggHours.toFixed(1)]);
    rows.push(['Total kvalitetsförlust (h)', (yearTotals.omarbeteHours + yearTotals.senTilläggHours).toFixed(1)]);
    rows.push(['Andel av total tid (%)', (yearTotals.usedHours > 0 ? ((yearTotals.omarbeteHours + yearTotals.senTilläggHours) / yearTotals.usedHours) * 100 : 0).toFixed(1)]);
    rows.push([]);
    rows.push([]);
    
    // Lägg till veckobeläggning
    rows.push([t('csvCapacityPerWeek')]);
    rows.push([
        t('week'),t('period'),t('workDays'),t('availableTimeHours').replace(' (h)', '_h'),t('usedTimeHours').replace(' (h)', '_h'),t('utilizationPercent').replace(' (%)', '_%'),
        'Projekt_h','Möten_h','Support_h','Change_h','Förbättring_h','Eplan_h','Avbrott_h','Kvalitetsförlust_andra_avd_h',
        'Övertid_h','Kvalitetsförlust_h','Omarbete_h','Sent_tillägg_h'
    ]);

    Object.keys(weeklyData).sort().forEach(key => {
        const data = weeklyData[key];
        const available = data.available;
        const used = data.used;
        const utilization = available > 0 ? (used / available) * 100 : 0;

        rows.push([
            key,
            `${data.startDate} - ${data.endDate}`,
            data.workingDays,
            available.toFixed(1),
            used.toFixed(1),
            utilization.toFixed(1),
            data.projectHours.toFixed(1),
            data.meetingHours.toFixed(1),
            data.supportHours.toFixed(1),
            data.changeHours.toFixed(1),
            data.improvementHours.toFixed(1),
            data.eplanHours.toFixed(1),
            data.interruptionHours.toFixed(1),
            data.qualityLossHours.toFixed(1),
            data.overtimeHours.toFixed(1),
            data.wasteHours.toFixed(1),
            data.omarbeteHours.toFixed(1),
            data.senTilläggHours.toFixed(1)
        ]);
    });
    
    // Lägg till tom rad
    rows.push([]);
    
    // Lägg till daglig beläggning
    rows.push(['DAGLIG BELÄGGNING']);
    rows.push([
        'Datum','Veckodag','Tillgänglig_tid_h','Övertid_h','Använd_tid_h','Beläggning_%',
        'Projekt_h','Möten_h','Support_h','Change_h','Förbättring_h','Eplan_h','Avbrott_h','Kvalitetsförlust_andra_avd_h',
        'Kvalitetsförlust_h','Omarbete_h','Sent_tillägg_h','Status'
    ]);
    
    dailyData.forEach(day => {
        rows.push([
            day.date,
            day.weekday,
            day.dayLimit.toFixed(1),
            day.overtimeHours.toFixed(1),
            day.totalUsed.toFixed(1),
            day.utilization.toFixed(1),
            day.projectHours.toFixed(1),
            day.meetingHours.toFixed(1),
            day.supportHours.toFixed(1),
            day.changeHours.toFixed(1),
            day.improvementHours.toFixed(1),
            day.eplanHours.toFixed(1),
            day.interruptionHours.toFixed(1),
            day.qualityLossHours.toFixed(1),
            day.wasteHours.toFixed(1),
            day.omarbeteHours.toFixed(1),
            day.senTilläggHours.toFixed(1),
            day.status
        ]);
    });

    // Tom rad
    rows.push([]);
    
    // --- Projektgenomförande ---
    rows.push(["PROJEKTGENOMFÖRANDE"]);
    rows.push([
        'Projekt','Total_tid_h','Startdatum','Slutdatum','Faktiska_arbetsdagar',
        'Ideal_arbetsdagar_75%','Avvikelse_dagar','Genomförandeeffektivitet_%'
    ]);

    const projectEntries = tasks.filter(t => t.type === 'project');
    const projects = {};
    projectEntries.forEach(t => {
        const name = t.name || 'Projekt';
        const date = t.date;
        const hours = t.hours || 0;
        if (!projects[name]) {
            projects[name] = { totalHours: 0, start: date, end: date };
        }
        const p = projects[name];
        p.totalHours += hours;
        if (date < p.start) p.start = date;
        if (date > p.end) p.end = date;
    });

    const idealPerDay75 = HOURS_PER_DAY_DEFAULT * 0.75;

    Object.keys(projects).sort().forEach(name => {
        const p = projects[name];
        // Konvertera strängar till Date-objekt för countWorkDays
        const startDate = new Date(p.start + 'T00:00:00');
        const endDate = new Date(p.end + 'T00:00:00');
        const actualDays = countWorkDays(startDate, endDate);
        const idealDays75 = Math.ceil(p.totalHours / idealPerDay75);
        const deviation = actualDays - idealDays75;
        const efficiency = idealDays75 > 0 ? (idealDays75 / actualDays) * 100 : 0;

        rows.push([
            name,
            p.totalHours.toFixed(1),
            p.start,
            p.end,
            actualDays,
            idealDays75,
            deviation,
            efficiency.toFixed(1)
        ]);
    });

    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `belaggningsrapport_${currentYear}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const infoEl = document.getElementById('info');
    if (infoEl) infoEl.textContent = 'Beläggningsrapport (vecka) exporterad till CSV.';
}

// Exportera avbrottsdata till CSV för Excel
function exportInterruptionReportToCsv() {
    const allDates = getFullYearDates();
    const departmentStats = {};
    const contactStats = {};
    const monthlyStats = {};
    let totalCount = 0;
    let totalTime = 0;
    
    const rows = [];
    
    // Samla statistik
    allDates.forEach(dateStr => {
        if (interruptionTasks && interruptionTasks[dateStr]) {
            interruptionTasks[dateStr].forEach(t => {
                const minutes = (parseFloat(t.hours) || 0) * 60; // Konvertera timmar till minuter
                totalCount++;
                totalTime += minutes;
                
                // Avdelningsstatistik
                if (!departmentStats[t.department]) {
                    departmentStats[t.department] = { count: 0, totalMinutes: 0 };
                }
                departmentStats[t.department].count++;
                departmentStats[t.department].totalMinutes += minutes;
                
                // Kontaktstatistik
                if (!contactStats[t.contact]) {
                    contactStats[t.contact] = { count: 0, totalMinutes: 0 };
                }
                contactStats[t.contact].count++;
                contactStats[t.contact].totalMinutes += minutes;
                
                // Månadsstatistik
                const month = dateStr.substring(0, 7);
                if (!monthlyStats[month]) {
                    monthlyStats[month] = { count: 0, totalMinutes: 0 };
                }
                monthlyStats[month].count++;
                monthlyStats[month].totalMinutes += minutes;
            });
        }
    });
    
    const workingDays = allDates.filter(dateStr => {
        const date = new Date(dateStr + 'T00:00:00');
        return !(date.getDay() === 0 || date.getDay() === 6 || SWEDISH_HOLIDAYS(date));
    }).length;
    
    const totalHours = totalTime / 60;
    const avgCountPerDay = workingDays > 0 ? totalCount / workingDays : 0;
    const avgTimePerDay = workingDays > 0 ? totalTime / workingDays : 0;
    const avgTimePerInterruption = totalCount > 0 ? totalTime / totalCount : 0;
    
    // ÅRSSAMMANFATTNING
    rows.push(['ÅRSSAMMANFATTNING ' + currentYear]);
    rows.push([]);
    rows.push(['Totalt antal avbrott', totalCount]);
    rows.push(['Total tid förlorad (h)', totalHours.toFixed(1)]);
    rows.push(['Total tid förlorad (min)', totalTime]);
    rows.push(['Arbetsdagar', workingDays]);
    rows.push(['Avbrott per dag (snitt)', avgCountPerDay.toFixed(2)]);
    rows.push(['Tid per dag (snitt, min)', avgTimePerDay.toFixed(0)]);
    rows.push(['Tid per avbrott (snitt, min)', avgTimePerInterruption.toFixed(0)]);
    rows.push(['Förbättringspotential (25% minskning, h)', (totalHours * 0.25).toFixed(1)]);
    rows.push([]);
    rows.push([]);
    
    // AVDELNINGSSTATISTIK
    rows.push(['AVBROTT PER AVDELNING']);
    rows.push(['Avdelning', 'Antal_avbrott', 'Andel_%', 'Total_tid_min', 'Total_tid_h', 'Snitt_per_avbrott_min']);
    Object.entries(departmentStats).sort((a, b) => b[1].count - a[1].count).forEach(([dept, stats]) => {
        const pct = (stats.count / totalCount * 100).toFixed(1);
        const hours = (stats.totalMinutes / 60).toFixed(1);
        const avg = stats.count > 0 ? (stats.totalMinutes / stats.count).toFixed(0) : 0;
        rows.push([dept, stats.count, pct, stats.totalMinutes, hours, avg]);
    });
    rows.push([]);
    rows.push([]);
    
    // KONTAKTMETODSTATISTIK
    rows.push(['AVBROTT PER KONTAKTMETOD']);
    rows.push(['Kontaktmetod', 'Antal_avbrott', 'Andel_%', 'Total_tid_min', 'Total_tid_h', 'Snitt_per_avbrott_min']);
    Object.entries(contactStats).sort((a, b) => b[1].count - a[1].count).forEach(([contact, stats]) => {
        const pct = (stats.count / totalCount * 100).toFixed(1);
        const hours = (stats.totalMinutes / 60).toFixed(1);
        const avg = stats.count > 0 ? (stats.totalMinutes / stats.count).toFixed(0) : 0;
        rows.push([contact, stats.count, pct, stats.totalMinutes, hours, avg]);
    });
    rows.push([]);
    rows.push([]);
    
    // MÅNADSSTATISTIK
    rows.push(['AVBROTT PER MÅNAD']);
    rows.push(['Månad', 'Antal_avbrott', 'Total_tid_h', 'Andel_av_år_%']);
    Object.keys(monthlyStats).sort().forEach(month => {
        const stats = monthlyStats[month];
        const hours = (stats.totalMinutes / 60).toFixed(1);
        const pct = (stats.count / totalCount * 100).toFixed(1);
        rows.push([month, stats.count, hours, pct]);
    });
    rows.push([]);
    rows.push([]);
    
    // DETALJERAD DATA
    rows.push(['DETALJERAD AVBROTTSLISTA']);
    rows.push(['Datum', 'Vecka', 'Veckodag', 'Avdelning', 'Kontakt', 'Tid_h', 'Tid_min', 'Ärende']);

    allDates.forEach(dateStr => {
        if (interruptionTasks && interruptionTasks[dateStr]) {
            const d = new Date(dateStr + 'T00:00:00');
            const week = getWeekNumber(d);
            const weekday = getWeekdays()[d.getDay()];
            interruptionTasks[dateStr].forEach(t => {
                const hours = parseFloat(t.hours) || 0;
                const minutes = hours * 60;
                rows.push([
                    dateStr,
                    `${d.getFullYear()}-W${String(week).padStart(2,'0')}`,
                    weekday,
                    t.department || '',
                    t.contact || '',
                    hours.toFixed(2),
                    minutes.toFixed(0),
                    t.issue || ''
                ]);
            });
        }
    });

    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avbrottsrapport_${currentYear}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const infoEl = document.getElementById('info');
    if (infoEl) infoEl.textContent = 'Avbrottsrapport exporterad till CSV.';
}



// ===============================================
// J. AVBROTTSRAPPORT (Six Sigma)
// ===============================================

function generateInterruptionReport() {

    const customTitle = prompt(t('enterReportName') || 'Ange rapportnamn (valfritt):', '');
    const baseTitle = `📞 ${t('interruptionReport')} ${currentYear}`;
    const reportSubtitle = (customTitle && customTitle.trim()) ? customTitle.trim() : '';

    const allDates = getFullYearDates();
    const today = new Date();
    const currentDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Visa alla datum för året (inkl. framtida datum med registrerade avbrott)
    const relevantDates = allDates;
    
    const reportData = {};
    const departmentStats = {};
    const contactStats = {};
    const dailyInterruptions = {};
    const weeklyInterruptions = {};
    const monthlyInterruptions = {};
    
    let totalTime = 0; // Total tid i minuter (från årets början till idag)
    let totalCount = 0; // Totalt antal avbrott (från årets början till idag)
    
    // Samla data (endast från årets början till idag)
    relevantDates.forEach(dateStr => {
        const date = new Date(dateStr + 'T00:00:00');
        const dayName = getWeekdays()[date.getDay()];
        const dayNum = date.getDate();
        const month = date.getMonth() + 1;
        const monthName = date.toLocaleString('sv-SE', { month: 'long' });
        const week = getWeekNumber(date);
        const weekKey = `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
        const monthKey = `${date.getFullYear()}-${String(month).padStart(2, '0')}`;
        
        dailyInterruptions[dateStr] = {
            date: dateStr,
            dayName: dayName,
            dayNum: dayNum,
            month: month,
            interruptions: [],
            count: 0,
            totalMinutes: 0
        };
        
        // Initiera vecko- och månadsdata
        if (!weeklyInterruptions[weekKey]) {
            weeklyInterruptions[weekKey] = { count: 0, totalMinutes: 0, dates: [] };
        }
        if (!monthlyInterruptions[monthKey]) {
            monthlyInterruptions[monthKey] = { count: 0, totalMinutes: 0, monthName: monthName };
        }
        
        if (interruptionTasks[dateStr]) {
            interruptionTasks[dateStr].forEach(task => {
                // Räkna alla avbrott som har tid registrerad (oavsett om avdelning/beskrivning är ifylld)
                const hours = parseFloat(task.hours) || 0;
                if (hours > 0) {
                    const minutes = hours * 60; // Konvertera timmar till minuter
                    
                    dailyInterruptions[dateStr].interruptions.push(task);
                    dailyInterruptions[dateStr].count++;
                    dailyInterruptions[dateStr].totalMinutes += minutes;
                    
                    // Vecko- och månadsstatistik
                    weeklyInterruptions[weekKey].count++;
                    weeklyInterruptions[weekKey].totalMinutes += minutes;
                    monthlyInterruptions[monthKey].count++;
                    monthlyInterruptions[monthKey].totalMinutes += minutes;
                    
                    // Totaler
                    totalCount++;
                    totalTime += minutes;
                    
                    // Avdelningsstatistik
                    if (!departmentStats[task.department]) {
                        departmentStats[task.department] = { count: 0, totalMinutes: 0 };
                    }
                    departmentStats[task.department].count++;
                    departmentStats[task.department].totalMinutes += minutes;
                    
                    // Kontaktmetodstatistik
                    if (!contactStats[task.contact]) {
                        contactStats[task.contact] = { count: 0, totalMinutes: 0 };
                    }
                    contactStats[task.contact].count++;
                    contactStats[task.contact].totalMinutes += minutes;
                }
            });
        }
    });
    
    // Beräkna arbetsdagar från årets början till idag (exkludera helger och helgdagar)
    const workingDays = relevantDates.filter(dateStr => {
        const date = new Date(dateStr + 'T00:00:00');
        return !(date.getDay() === 0 || date.getDay() === 6 || SWEDISH_HOLIDAYS(date));
    }).length;
    
    const avgCountPerDay = workingDays > 0 ? totalCount / workingDays : 0;
    const avgTimePerDay = workingDays > 0 ? totalTime / workingDays : 0;
    const avgTimePerInterruption = totalCount > 0 ? totalTime / totalCount : 0;
    const totalHours = totalTime / 60;
    
    // Sortera statistik
    const sortedDepts = Object.entries(departmentStats).sort((a, b) => b[1].count - a[1].count);
    const sortedContacts = Object.entries(contactStats).sort((a, b) => b[1].count - a[1].count);
    
    // HTML-rapport
    const reportDate = new Date().toLocaleString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    let reportHtml = `
        <div class="report-modal" onclick="if(event.target.classList.contains('report-modal')) { document.body.classList.remove('report-open'); this.remove(); }">
            <div class="report-content">
                <div class="report-header">
                    <h2>${baseTitle}</h2>
                    <button onclick="exportInterruptionReportToCsv()">${t('exportToExcel')}</button>
                    <button onclick="document.body.classList.remove('report-open'); this.closest('.report-modal').remove()">${t('closeAndGoBack')}</button>
                </div>
                
                ${reportSubtitle ? `<h3 style="margin:10px 0 5px 0;font-weight:normal;color:#555;text-align:left;">${reportSubtitle}</h3>` : ''}
                <div style="font-size:0.85em;color:#666;margin:10px 0 20px 0;text-align:left;">${t('reportCreated')}: ${reportDate}</div>
                
                <!-- ÅRSSAMMANFATTNING -->
                <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px;">
                    <h3 style="margin-top:0;">${t('yearSummary')} ${currentYear}</h3>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
                        <div>
                            <strong>${t('totalInterruptionCount')}:</strong> <span style="font-size:1.3em;color:#e74c3c">${totalCount}</span><br>
                            <strong>${t('totalTimeLost')}:</strong> <span style="font-size:1.3em;color:#e67e22">${totalHours.toFixed(1)}h</span><br>
                            <small>(${totalTime} ${t('min')})</small>
                        </div>
                        <div>
                            <strong>${t('avgTimePerInterruption')}:</strong><br>
                            <span style="font-size:1.2em;color:#3498db">${avgTimePerInterruption.toFixed(0)} ${t('min')}</span>
                        </div>
                        <div style="background:#fff3cd;padding:10px;border-radius:5px;">
                            <strong style="color:#856404;">${t('improvementPotential')}</strong><br>
                            Om avbrotten minskade med 25% (från årets början):<br>
                            <span style="color:#27ae60;font-weight:bold">+${(totalHours * 0.25).toFixed(1)}h</span> ${t('savedTime')}
                        </div>
                    </div>
                </div>

                <h3>${t('interruptionsByDepartmentTitle')}</h3>
                <p style="font-size:0.9em;color:#666;margin-bottom:10px;">
                    ${t('departmentSectionDescription')}
                </p>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>${t('department')}</th>
                            <th>${t('interruptionCount')}</th>
                            <th>${t('shareOfTotal')}</th>
                            <th>${t('totalTimeMin')}</th>
                            <th>${t('totalTimeHours')}</th>
                            <th>${t('avgPerInterruptionMin')}</th>
                            <th>${t('distribution')}</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    sortedDepts.forEach(([dept, stats]) => {
        const pct = (stats.count / totalCount * 100).toFixed(1);
        const hours = (stats.totalMinutes / 60).toFixed(1);
        const avgTime = stats.count > 0 ? (stats.totalMinutes / stats.count).toFixed(0) : 0;
        reportHtml += `
            <tr>
                <td><strong>${dept}</strong></td>
                <td>${stats.count}</td>
                <td>${pct}%</td>
                <td>${stats.totalMinutes}</td>
                <td>${hours}h</td>
                <td>${avgTime}</td>
                <td class="progress-bar">
                    <div class="bar ${pct > 30 ? 'red' : pct > 20 ? 'yellow' : 'green'}" style="width:${Math.min(pct * 2, 100)}%">
                        ${pct}%
                    </div>
                </td>
            </tr>
        `;
    });
    
    reportHtml += `
                    </tbody>
                </table>
                
                <h3>${t('interruptionsByContactMethodTitle')}</h3>
                <p style="font-size:0.9em;color:#666;margin-bottom:10px;">
                    ${t('contactMethodSectionDescription')}
                </p>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Kontaktmetod</th>
                            <th>Antal avbrott</th>
                            <th>Andel av totalt</th>
                            <th>Total tid (min)</th>
                            <th>Total tid (h)</th>
                            <th>Snitt per avbrott (min)</th>
                            <th>Fördelning</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    sortedContacts.forEach(([contact, stats]) => {
        const pct = (stats.count / totalCount * 100).toFixed(1);
        const hours = (stats.totalMinutes / 60).toFixed(1);
        const avgTime = stats.count > 0 ? (stats.totalMinutes / stats.count).toFixed(0) : 0;
        reportHtml += `
            <tr>
                <td><strong>${contact}</strong></td>
                <td>${stats.count}</td>
                <td>${pct}%</td>
                <td>${stats.totalMinutes}</td>
                <td>${hours}h</td>
                <td>${avgTime}</td>
                <td class="progress-bar">
                    <div class="bar yellow" style="width:${Math.min(pct * 2, 100)}%">
                        ${pct}%
                    </div>
                </td>
            </tr>
        `;
    });
    
    reportHtml += `
                    </tbody>
                </table>
                
                <h3>📅 Avbrott per månad</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Månad</th>
                            <th>Antal avbrott</th>
                            <th>Total tid (h)</th>
                            <th>Snitt avbrott/dag</th>
                            <th>Trend</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    Object.keys(monthlyInterruptions).sort().forEach(monthKey => {
        const data = monthlyInterruptions[monthKey];
        const hours = (data.totalMinutes / 60).toFixed(1);
        const daysInMonth = allDates.filter(d => d.startsWith(monthKey)).filter(dateStr => {
            const date = new Date(dateStr + 'T00:00:00');
            return !(date.getDay() === 0 || date.getDay() === 6 || SWEDISH_HOLIDAYS(date));
        }).length;
        const avgPerDay = daysInMonth > 0 ? (data.count / daysInMonth).toFixed(1) : 0;
        
        reportHtml += `
            <tr>
                <td><strong>${data.monthName}</strong></td>
                <td>${data.count}</td>
                <td>${hours}h</td>
                <td>${avgPerDay}</td>
                <td class="progress-bar">
                    <div class="bar ${data.count > avgCountPerDay * 20 ? 'red' : 'green'}" style="width:${totalCount > 0 ? Math.min(data.count / totalCount * 1000, 100) : 0}%">
                        ${totalCount > 0 ? ((data.count / totalCount) * 100).toFixed(0) : 0}%
                    </div>
                </td>
            </tr>
        `;
    });
    
    reportHtml += `
                    </tbody>
                </table>
                
                <h3>🔝 Top 10 dagar med flest avbrott</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Veckodag</th>
                            <th>Antal avbrott</th>
                            <th>Total tid (min)</th>
                            <th>Detaljer</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    const topDays = Object.values(dailyInterruptions)
        .filter(d => d.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    topDays.forEach(day => {
        let details = day.interruptions.map(t => `${t.department} (${t.contact}, ${(t.hours || 0).toFixed(2)}h)`).join(', ');
        if (details.length > 100) details = details.substring(0, 100) + '...';
        
        reportHtml += `
            <tr>
                <td><strong>${day.date}</strong></td>
                <td>${day.dayName}</td>
                <td style="font-size:1.2em;color:#e74c3c"><strong>${day.count}</strong></td>
                <td>${day.totalMinutes.toFixed(0)} min (${(day.totalMinutes / 60).toFixed(1)}h)</td>
                <td style="font-size:0.85em;color:#666">${details}</td>
            </tr>
        `;
    });
    
    reportHtml += `
                    </tbody>
                </table>
                
                <div style="background:#e8f5e9;padding:15px;border-radius:8px;margin-top:20px;">
                    <h4 style="margin-top:0;color:#2e7d32;">💡 Insikter och förbättringsförslag</h4>
                    <p style="margin:5px 0;"><strong>Förbättringspotential:</strong> Om antalet avbrott reduceras med 25% sparas ca ${(totalHours * 0.25).toFixed(1)} timmar per år.</p>
                    <p style="margin:5px 0;"><strong>Fokusområden:</strong> De ${sortedDepts.length > 0 ? 'tre' : ''} avdelningar som orsakar flest avbrott står för ${
                        sortedDepts.slice(0, 3).reduce((sum, [_, stats]) => sum + stats.count, 0) / totalCount * 100
                    }% av alla avbrott.</p>
                    <p style="margin:5px 0;"><strong>Kontaktmetod:</strong> ${
                        sortedContacts.length > 0 
                            ? `${sortedContacts[0][0]} är vanligaste kontaktmetoden (${(sortedContacts[0][1].count / totalCount * 100).toFixed(0)}%).`
                            : 'Ingen data.'
                    }</p>
                </div>
                
                <div style="background:#fff3cd;padding:15px;border-radius:8px;margin-top:20px;">
                    <h4 style="margin-top:0;color:#856404;">📊 Förklaring av mätvärden</h4>
                    <p style="margin:5px 0;"><strong>Antal avbrott:</strong> Totalt antal registrerade avbrott under året.</p>
                    <p style="margin:5px 0;"><strong>Total tid förlorad:</strong> Summan av all tid som spenderats på avbrott (i timmar och minuter).</p>
                    <p style="margin:5px 0;"><strong>Snitt per avbrott:</strong> Genomsnittlig tid varje avbrott tar (total tid ÷ antal avbrott).</p>
                    <p style="margin:5px 0;"><strong>Avbrott per dag:</strong> Genomsnittligt antal avbrott per arbetsdag.</p>
                    <p style="margin:5px 0;"><strong>Förbättringspotential:</strong> Beräknad tid som kan sparas genom att minska avbrott.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.classList.add('report-open');
    document.getElementById('reportContainer').innerHTML = reportHtml;
}


// Sätter startåret i fältet och genererar tidslinjen
generateTimeline();

// Initiera avbrotts- och kvalitetsförlusttidslinjer
if (typeof initInterruptionTimeline === 'function') initInterruptionTimeline();
if (typeof initQualityLossTimeline === 'function') initQualityLossTimeline();