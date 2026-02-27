// JavaScript för kvalitetsförluster
let qualityLossTasks = JSON.parse(localStorage.getItem('qualityLossTasks') || '{}');

// Guard för att förhindra dubbelanrop av init
let qualityLossTimelineInitialized = false;

// Debounce-timeout för att undvika race conditions
let qualityLossRecalcTimeout = null;

// Debounced recalculate för att förhindra multipla snabba omräkningar
function debouncedRecalculateFromQualityLoss(scrollLeft) {
  if (qualityLossRecalcTimeout) clearTimeout(qualityLossRecalcTimeout);
  qualityLossRecalcTimeout = setTimeout(() => {
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

function initQualityLossTimeline() {
  // Init är en wrapper för render - kan anropas flera gånger
  renderQualityLossTimeline();
}

// Separat render-funktion som kan anropas flera gånger
function renderQualityLossTimeline() {
  const timeline = document.getElementById('quality-loss-timeline');
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
    dayDiv.className = 'quality-loss-day';
    dayDiv.setAttribute('data-date', dateStr);

    if (isWeekend) dayDiv.classList.add('weekend');
    if (isHoliday) dayDiv.classList.add('holiday');

    // Dag-header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'quality-loss-day-header';
    dayHeader.innerHTML = `${dayOfWeek} ${dayNum}`;
    dayDiv.appendChild(dayHeader);

    // Kontainer för uppgifter
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'quality-loss-tasks-container';

    // Hämta eller skapa uppgifter för denna dag
    if (!qualityLossTasks[dateStr]) {
      qualityLossTasks[dateStr] = [];
    }

    // Rendera befintliga uppgifter
    qualityLossTasks[dateStr].forEach((task, index) => {
      const taskEl = createQualityLossTaskElement(dateStr, index, task);
      tasksContainer.appendChild(taskEl);
    });

    // Sammanfattning av kvalitetsförlust-tid
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'quality-loss-summary';
    summaryDiv.id = `quality-loss-summary-${dateStr}`;
    summaryDiv.style.cssText = 'font-size: 0.75em; color: #e74c3c; font-weight: bold; padding: 4px; margin-top: 4px; border-top: 1px solid #eee;';
    updateDayQualityLossSummaryElement(dateStr, summaryDiv);
    dayDiv.appendChild(summaryDiv);

    dayDiv.appendChild(tasksContainer);

    // Lägg till knapp för nya uppgifter
    const addBtn = document.createElement('button');
    addBtn.className = 'add-quality-loss-btn';
    addBtn.style.cssText = 'width: 100%; padding: 4px; margin-top: auto; font-size: 0.7em; background: #f0f0f0; border: 1px dashed #ccc; cursor: pointer; border-radius: 4px;';
    addBtn.textContent = typeof t === 'function' ? t('addQualityLoss') : 'Lägg till slöseri';
    addBtn.onclick = () => addQualityLossTask(dateStr);
    dayDiv.appendChild(addBtn);

    timeline.appendChild(dayDiv);
  });
}

function createQualityLossTaskElement(dateStr, index, task = {}) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'quality-loss-task';

  // Rad 1: Tidsfält + Avdelning
  const row1 = document.createElement('div');
  row1.className = 'quality-loss-task-row';

  // Tidsfält (dropdown)
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
    
    qualityLossTasks[dateStr][index].hours = parseFloat(timeInput.value) || 0;
    saveQualityLossData();
    updateDayQualityLossSummary(dateStr);
    // Omberäkna projekt när kvalitetsförlust-tid ändras (med debouncing)
    debouncedRecalculateFromQualityLoss(scrollLeft);
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
    qualityLossTasks[dateStr][index].department = departmentSelect.value;
    saveQualityLossData();
  };

  row1.appendChild(timeInput);
  row1.appendChild(departmentSelect);
  taskDiv.appendChild(row1);

  // Rad 2: Typ av förlust
  const row2 = document.createElement('div');
  row2.className = 'quality-loss-task-row';

  const lossTypeSelect = document.createElement('select');
  const lossTypes = typeof getQualityLossTypes === 'function' ? getQualityLossTypes() : [
    'Underlag saknas',
    'Ofullständiga underlag',
    'Dålig kvalitet på underlag',
    'Information saknas',
    'Felaktig information',
    'Oklara krav',
    'Sent levererat underlag'
  ];
  
  // Lägg till --- som första alternativ
  const lossDefaultOption = document.createElement('option');
  lossDefaultOption.value = '';
  lossDefaultOption.textContent = '---';
  lossTypeSelect.appendChild(lossDefaultOption);
  
  lossTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    lossTypeSelect.appendChild(option);
  });
  lossTypeSelect.value = task.lossType || '';
  lossTypeSelect.onchange = () => {
    qualityLossTasks[dateStr][index].lossType = lossTypeSelect.value;
    saveQualityLossData();
  };

  row2.appendChild(lossTypeSelect);
  taskDiv.appendChild(row2);

  // Rad 3: Projekt (select dropdown)
  const row3 = document.createElement('div');
  row3.className = 'quality-loss-task-row';

  const projectSelect = document.createElement('select');
  projectSelect.style.cssText = 'width: 100%; max-width: 150px; font-size: 0.9em;';
  
  // Lägg till --- som första alternativ
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = '---';
  projectSelect.appendChild(emptyOption);
  
  // Hämta alla projekt från tasks
  if (typeof tasks !== 'undefined') {
    const projectNames = [...new Set(tasks
      .filter(t => t.type === 'project')
      .map(t => t.name.replace(/\s*\(del\s+\d+\)\s*$/i, ''))
    )].sort();
    
    projectNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      projectSelect.appendChild(option);
    });
  }
  
  projectSelect.value = task.project || '';
  projectSelect.onchange = () => {
    qualityLossTasks[dateStr][index].project = projectSelect.value;
    saveQualityLossData();
  };

  row3.appendChild(projectSelect);
  taskDiv.appendChild(row3);

  // Rad 4: Textfält för beskrivning
  const issueInput = document.createElement('textarea');
  issueInput.placeholder = typeof t === 'function' ? t('description') : 'Beskriv kvalitetsförlusten...';
  issueInput.value = task.description || '';
  issueInput.onchange = () => {
    qualityLossTasks[dateStr][index].description = issueInput.value;
    saveQualityLossData();
  };
  taskDiv.appendChild(issueInput);

  // Raderaknapp
  const deleteBtn = document.createElement('button');
  deleteBtn.style.cssText = 'padding: 2px; font-size: 0.7em; background: #e74c3c; color: white; border: none; border-radius: 2px; cursor: pointer;';
  deleteBtn.textContent = typeof t === 'function' ? t('delete') : 'Radera';
  deleteBtn.onclick = () => {
    qualityLossTasks[dateStr].splice(index, 1);
    saveQualityLossData();
    initQualityLossTimeline();
    if (typeof recalculateAllTasks === 'function') {
      recalculateAllTasks();
    }
  };
  taskDiv.appendChild(deleteBtn);

  return taskDiv;
}

function addQualityLossTask(dateStr) {
  if (!qualityLossTasks[dateStr]) {
    qualityLossTasks[dateStr] = [];
  }
  
  qualityLossTasks[dateStr].push({
    hours: 0,
    department: '',
    lossType: '',
    project: '',
    description: ''
  });
  saveQualityLossData();
  initQualityLossTimeline();
}

function saveQualityLossData() {
  localStorage.setItem('qualityLossTasks', JSON.stringify(qualityLossTasks));
}

function updateDayQualityLossSummary(dateStr) {
  const summaryEl = document.getElementById(`quality-loss-summary-${dateStr}`);
  if (summaryEl) {
    updateDayQualityLossSummaryElement(dateStr, summaryEl);
  }
  
  // Uppdatera även dataset på huvudtidslinjens dag-element
  const mainDayDiv = document.querySelector(`.day[data-date='${dateStr}']`);
  if (mainDayDiv) {
    const totalHours = getQualityLossHoursForDate(dateStr);
    mainDayDiv.dataset.qualitylosshours = totalHours;
    
    // Uppdatera kvalitetsförlust-info-elementet i huvudtidslinjen direkt
    const qualityLossInfo = mainDayDiv.querySelector(`#quality-loss-info-${dateStr}`);
    if (qualityLossInfo) {
      if (totalHours > 0) {
        qualityLossInfo.textContent = `⚠ Kvalitetsförlust: ${totalHours.toFixed(2)} h`;
      } else {
        qualityLossInfo.textContent = '';
      }
    }
  }
}

function updateDayQualityLossSummaryElement(dateStr, element) {
  const tasksForDay = qualityLossTasks[dateStr] || [];
  const totalHours = tasksForDay.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0);
  const count = tasksForDay.length;

  if (count > 0) {
    element.textContent = `⚠️ ${count} kvalitetsförlust(er): ${totalHours.toFixed(2)}h`;
  } else {
    element.textContent = '';
  }
}

// Hämta total kvalitetsförlust-tid för ett datum (används i Script.js)
function getQualityLossHoursForDate(dateStr) {
  const tasksForDay = qualityLossTasks[dateStr] || [];
  return tasksForDay.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0);
}

// Generera rapport för kvalitetsförluster per projekt
function generateQualityLossReport() {
  const customTitle = prompt(t('enterReportName'), '');
  const baseTitle = `⚠️ ${t('qualityLossesPerProject')} ${currentYear}`;
  const reportSubtitle = (customTitle && customTitle.trim()) ? customTitle.trim() : '';
  const locale = currentLanguage === 'sv' ? 'sv-SE' : 'en-US';
  const reportDate = new Date().toLocaleString(locale, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  const projectLosses = {};
  
  // Samla all data per projekt
  Object.keys(qualityLossTasks).forEach(dateStr => {
    const tasksForDay = qualityLossTasks[dateStr] || [];
    tasksForDay.forEach(task => {
      const project = task.project || t('noProjectSpecified');
      const hours = parseFloat(task.hours) || 0;
      
      if (!projectLosses[project]) {
        projectLosses[project] = {
          totalHours: 0,
          count: 0,
          byDepartment: {},
          byLossType: {},
          details: []
        };
      }
      
      projectLosses[project].totalHours += hours;
      projectLosses[project].count++;
      
      // Per avdelning
      const dept = task.department || t('unknown');
      projectLosses[project].byDepartment[dept] = (projectLosses[project].byDepartment[dept] || 0) + hours;
      
      // Per förlusttyp
      const lossType = task.lossType || t('unknown');
      projectLosses[project].byLossType[lossType] = (projectLosses[project].byLossType[lossType] || 0) + hours;
      
      // Detaljer
      projectLosses[project].details.push({
        date: dateStr,
        hours: hours,
        department: dept,
        lossType: lossType,
        description: task.description || ''
      });
    });
  });
  
  // Bygg rapport-HTML
  let reportHtml = `
    <div class="report-modal" onclick="if(event.target.classList.contains('report-modal')) { document.body.classList.remove('report-open'); this.remove(); }">
      <div class="report-content">
        <div class="report-header">
          <h2>${baseTitle}</h2>
          <button onclick="exportQualityLossReportToCsv()">📊 ${t('exportToExcel')}</button>
          <button onclick="document.body.classList.remove('report-open'); this.closest('.report-modal').remove()">${t('closeReport')}</button>
        </div>
        
        ${reportSubtitle ? `<h3 style="margin:10px 0 5px 0;font-weight:normal;color:#555;text-align:left;">${reportSubtitle}</h3>` : ''}
        <div style="font-size:0.85em;color:#666;margin:10px 0 20px 0;text-align:left;">${t('reportCreated')}: ${reportDate}</div>
        
        <p style="margin: 15px 0; color: #666;">
          ${t('qualityLossReportSubtitle')}
        </p>
  `;
  
  const projectNames = Object.keys(projectLosses).sort();
  
  if (projectNames.length === 0) {
    reportHtml += `<p style="text-align:center;color:#999;padding:40px;">${t('noQualityLossesRegistered')}</p>`;
  } else {
    projectNames.forEach(projectName => {
      const data = projectLosses[projectName];
      
      reportHtml += `
        <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:20px;">
          <h3 style="margin:0 0 10px 0;color:#333;">${projectName}</h3>
          <div style="background:#fff3cd;padding:10px;border-radius:4px;margin-bottom:15px;">
            <strong style="font-size:1.2em;color:#f57c00;">
              ${t('totalTime')}: ${data.totalHours.toFixed(2)}h
            </strong>
            <span style="margin-left:20px;color:#666;">
              (${data.count} ${data.count !== 1 ? t('events') : t('event')})
            </span>
          </div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
            <div>
              <h4 style="margin:0 0 8px 0;font-size:0.9em;color:#666;">${t('perDepartment')}</h4>
              <table style="width:100%;font-size:0.85em;">
      `;
      
      Object.entries(data.byDepartment)
        .sort((a, b) => b[1] - a[1])
        .forEach(([dept, hours]) => {
          const percent = ((hours / data.totalHours) * 100).toFixed(1);
          reportHtml += `
            <tr>
              <td style="padding:4px 0;">${dept}</td>
              <td style="text-align:right;font-weight:bold;">${hours.toFixed(2)}h</td>
              <td style="text-align:right;color:#999;padding-left:8px;">${percent}%</td>
            </tr>
          `;
        });
      
      reportHtml += `
              </table>
            </div>
            <div>
              <h4 style="margin:0 0 8px 0;font-size:0.9em;color:#666;">${t('perLossType')}</h4>
              <table style="width:100%;font-size:0.85em;">
      `;
      
      Object.entries(data.byLossType)
        .sort((a, b) => b[1] - a[1])
        .forEach(([lossType, hours]) => {
          const percent = ((hours / data.totalHours) * 100).toFixed(1);
          reportHtml += `
            <tr>
              <td style="padding:4px 0;">${lossType}</td>
              <td style="text-align:right;font-weight:bold;">${hours.toFixed(2)}h</td>
              <td style="text-align:right;color:#999;padding-left:8px;">${percent}%</td>
            </tr>
          `;
        });
      
      reportHtml += `
              </table>
            </div>
          </div>
          
          <details style="margin-top:15px;">
            <summary style="cursor:pointer;padding:8px;background:#f5f5f5;border-radius:4px;font-weight:bold;">
              ${t('showAllEvents')} ${data.count} ${data.count !== 1 ? t('events') : t('event')}
            </summary>
            <table class="report-table" style="margin-top:10px;width:100%;">
              <thead>
                <tr>
                  <th>${t('date')}</th>
                  <th>${t('hours')}</th>
                  <th>${t('department')}</th>
                  <th>${t('lossType')}</th>
                  <th>${t('description')}</th>
                </tr>
              </thead>
              <tbody>
      `;
      
      data.details
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(detail => {
          reportHtml += `
            <tr>
              <td>${detail.date}</td>
              <td style="font-weight:bold;">${detail.hours.toFixed(2)}h</td>
              <td>${detail.department}</td>
              <td>${detail.lossType}</td>
              <td style="font-size:0.85em;">${detail.description || '-'}</td>
            </tr>
          `;
        });
      
      reportHtml += `
              </tbody>
            </table>
          </details>
        </div>
      `;
    });
  }
  
  reportHtml += `
      </div>
    </div>
  `;
  
  document.body.classList.add('report-open');
  document.getElementById('reportContainer').innerHTML = reportHtml;
}

// Exportera kvalitetsförlustrappport till CSV
function exportQualityLossReportToCsv() {
  const projectLosses = {};
  
  // Samla data
  Object.keys(qualityLossTasks).forEach(dateStr => {
    const tasksForDay = qualityLossTasks[dateStr] || [];
    tasksForDay.forEach(task => {
      const project = task.project || t('noProjectSpecified');
      const hours = parseFloat(task.hours) || 0;
      const dept = task.department || t('unknown');
      const lossType = task.lossType || t('unknown');
      
      if (!projectLosses[project]) {
        projectLosses[project] = {
          totalHours: 0,
          count: 0,
          byDepartment: {},
          byLossType: {},
          details: []
        };
      }
      
      projectLosses[project].totalHours += hours;
      projectLosses[project].count++;
      projectLosses[project].byDepartment[dept] = (projectLosses[project].byDepartment[dept] || 0) + hours;
      projectLosses[project].byLossType[lossType] = (projectLosses[project].byLossType[lossType] || 0) + hours;
      
      projectLosses[project].details.push({
        date: dateStr,
        hours: hours,
        department: dept,
        lossType: lossType,
        description: task.description || ''
      });
    });
  });
  
  const rows = [];
  
  // Huvudrubrik
  rows.push([t('qualityLossesPerProject').toUpperCase() + ' ' + currentYear]);
  rows.push([]);
  
  const projectNames = Object.keys(projectLosses).sort();
  
  if (projectNames.length === 0) {
    rows.push([t('noQualityLossesRegistered')]);
  } else {
    projectNames.forEach(projectName => {
      const data = projectLosses[projectName];
      
      rows.push([`${t('project').toUpperCase()}: ${projectName}`]);
      rows.push([t('totalTime') + ' (h)', data.totalHours.toFixed(2)]);
      rows.push([t('count') + ' ' + t('events'), data.count]);
      rows.push([]);
      
      // Per avdelning
      rows.push([t('distributionPerDepartment').toUpperCase()]);
      rows.push([t('department'), t('hours'), t('percent')]);
      Object.entries(data.byDepartment)
        .sort((a, b) => b[1] - a[1])
        .forEach(([dept, hours]) => {
          const percent = ((hours / data.totalHours) * 100).toFixed(1);
          rows.push([dept, hours.toFixed(2), percent + '%']);
        });
      rows.push([]);
      
      // Per förlusttyp
      rows.push([t('distributionPerLossType').toUpperCase()]);
      rows.push([t('lossType'), t('hours'), t('percent')]);
      Object.entries(data.byLossType)
        .sort((a, b) => b[1] - a[1])
        .forEach(([lossType, hours]) => {
          const percent = ((hours / data.totalHours) * 100).toFixed(1);
          rows.push([lossType, hours.toFixed(2), percent + '%']);
        });
      rows.push([]);
      
      // Detaljerad lista
      rows.push([t('detailedList').toUpperCase()]);
      rows.push([t('date'), t('hours'), t('department'), t('lossType'), t('description')]);
      data.details
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(detail => {
          rows.push([
            detail.date,
            detail.hours.toFixed(2),
            detail.department,
            detail.lossType,
            detail.description
          ]);
        });
      
      rows.push([]);
      rows.push([]);
    });
  }
  
  // Konvertera till CSV
  const csvContent = rows.map(row => 
    row.map(cell => {
      const cellStr = String(cell || '');
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return '"' + cellStr.replace(/"/g, '""') + '"';
      }
      return cellStr;
    }).join(',')
  ).join('\n');
  
  // Ladda ner
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filename = currentLanguage === 'sv' ? 'kvalitetsforlust_rapport' : 'quality_loss_report';
  a.download = `${filename}_${currentYear}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initiera när sidan laddas
document.addEventListener('DOMContentLoaded', function() {
  initQualityLossTimeline();
});
