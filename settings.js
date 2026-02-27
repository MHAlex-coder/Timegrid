// ===============================================
// SETTINGS.JS - INSTÄLLNINGAR FÖR LISTOR
// ===============================================

// Standardvärden för listor
const DEFAULT_TASK_TYPES = [
    { value: 'support', label: 'Support', isWaste: false },
    { value: 'change', label: 'Change', isWaste: false },
    { value: 'forbattring', label: 'Förbättring', isWaste: false },
    { value: 'omarbete', label: 'Omarbete', isWaste: true },
    { value: 'sent_tillagg', label: 'Sent Tillägg', isWaste: true },
    { value: 'eplan_underhall', label: 'Eplan', isWaste: false }
];

const DEFAULT_DEPARTMENTS = ['PI', 'Prog', 'ProjMan', 'Comm', 'Instal', 'Devel', 'Sales', 'Service', 'Other'];
const DEFAULT_CONTACTS = ['Mail', 'Teams', 'Telefon', 'Direkt'];
const DEFAULT_QUALITY_LOSS_TYPES = [
    'Underlag saknas',
    'Ofullständiga underlag',
    'Dålig kvalitet på underlag',
    'Information saknas',
    'Felaktig information',
    'Oklara krav',
    'Sent levererat underlag'
];

// Hämta inställningar från localStorage
function getTaskTypes() {
    const saved = localStorage.getItem('customTaskTypes');
    return saved ? JSON.parse(saved) : DEFAULT_TASK_TYPES;
}

function getDepartments() {
    const saved = localStorage.getItem('customDepartments');
    return saved ? JSON.parse(saved) : DEFAULT_DEPARTMENTS;
}

function getContacts() {
    const saved = localStorage.getItem('customContacts');
    return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
}

function getQualityLossTypes() {
    const saved = localStorage.getItem('customQualityLossTypes');
    return saved ? JSON.parse(saved) : DEFAULT_QUALITY_LOSS_TYPES;
}

// Spara inställningar
function saveTaskTypes(types) {
    localStorage.setItem('customTaskTypes', JSON.stringify(types));
    updateTaskTypeSelect();
}

function saveDepartments(departments) {
    localStorage.setItem('customDepartments', JSON.stringify(departments));
}

function saveContacts(contacts) {
    localStorage.setItem('customContacts', JSON.stringify(contacts));
}

function saveQualityLossTypes(types) {
    localStorage.setItem('customQualityLossTypes', JSON.stringify(types));
}

// Öppna/stäng inställningsmodal
function openSettingsModal() {
    document.getElementById('settingsModal').style.display = 'flex';
    renderTaskTypeSettings();
    renderDepartmentSettings();
    renderContactSettings();
    renderQualityLossSettings();
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

// Rendera uppgiftstyper
function renderTaskTypeSettings() {
    const container = document.getElementById('taskTypeSettings');
    const types = getTaskTypes();
    
    container.innerHTML = types.map((type, index) => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 6px;">
            <input type="text" 
                   value="${type.label}" 
                   onchange="updateTaskTypeLabel(${index}, this.value)"
                   style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <label style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
                <input type="checkbox" 
                       ${type.isWaste ? 'checked' : ''} 
                       onchange="updateTaskTypeWaste(${index}, this.checked)">
                Slöseri
            </label>
            <button onclick="deleteTaskType(${index})" 
                    style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🗑️
            </button>
        </div>
    `).join('');
}

// Rendera avdelningar
function renderDepartmentSettings() {
    const container = document.getElementById('departmentSettings');
    const departments = getDepartments();
    
    container.innerHTML = departments.map((dept, index) => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 6px;">
            <input type="text" 
                   value="${dept}" 
                   onchange="updateDepartment(${index}, this.value)"
                   style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <button onclick="deleteDepartment(${index})" 
                    style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🗑️
            </button>
        </div>
    `).join('');
}

// Rendera kontaktmetoder
function renderContactSettings() {
    const container = document.getElementById('contactSettings');
    const contacts = getContacts();
    
    container.innerHTML = contacts.map((contact, index) => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 6px;">
            <input type="text" 
                   value="${contact}" 
                   onchange="updateContact(${index}, this.value)"
                   style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <button onclick="deleteContact(${index})" 
                    style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🗑️
            </button>
        </div>
    `).join('');
}

// Uppdatera uppgiftstyper
function updateTaskTypeLabel(index, newLabel) {
    const types = getTaskTypes();
    types[index].label = newLabel;
    saveTaskTypes(types);
    renderTaskTypeSettings();
}

function updateTaskTypeWaste(index, isWaste) {
    const types = getTaskTypes();
    types[index].isWaste = isWaste;
    saveTaskTypes(types);
}

function deleteTaskType(index) {
    if (!confirm('Är du säker på att du vill ta bort denna uppgiftstyp?')) return;
    const types = getTaskTypes();
    types.splice(index, 1);
    saveTaskTypes(types);
    renderTaskTypeSettings();
}

function addNewTaskType() {
    const label = prompt('Ange namn på ny uppgiftstyp:');
    if (!label || label.trim() === '') return;
    
    const types = getTaskTypes();
    const value = label.toLowerCase().replace(/\s+/g, '_').replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o');
    types.push({ value, label: label.trim(), isWaste: false });
    saveTaskTypes(types);
    renderTaskTypeSettings();
}

// Uppdatera avdelningar
function updateDepartment(index, newValue) {
    const departments = getDepartments();
    departments[index] = newValue;
    saveDepartments(departments);
    renderDepartmentSettings();
}

function deleteDepartment(index) {
    if (!confirm('Är du säker på att du vill ta bort denna avdelning?')) return;
    const departments = getDepartments();
    departments.splice(index, 1);
    saveDepartments(departments);
    renderDepartmentSettings();
}

function addNewDepartment() {
    const name = prompt('Ange namn på ny avdelning:');
    if (!name || name.trim() === '') return;
    
    const departments = getDepartments();
    departments.push(name.trim());
    saveDepartments(departments);
    renderDepartmentSettings();
}

// Uppdatera kontaktmetoder
function updateContact(index, newValue) {
    const contacts = getContacts();
    contacts[index] = newValue;
    saveContacts(contacts);
    renderContactSettings();
}

function deleteContact(index) {
    if (!confirm('Är du säker på att du vill ta bort denna kontaktmetod?')) return;
    const contacts = getContacts();
    contacts.splice(index, 1);
    saveContacts(contacts);
    renderContactSettings();
}

function addNewContact() {
    const name = prompt('Ange namn på ny kontaktmetod:');
    if (!name || name.trim() === '') return;
    
    const contacts = getContacts();
    contacts.push(name.trim());
    saveContacts(contacts);
    renderContactSettings();
}

// Rendera kvalitetsförlustyper
function renderQualityLossSettings() {
    const container = document.getElementById('qualityLossSettings');
    const types = getQualityLossTypes();
    
    container.innerHTML = types.map((type, index) => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 6px;">
            <input type="text" 
                   value="${type}" 
                   onchange="updateQualityLossType(${index}, this.value)"
                   style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <button onclick="deleteQualityLossType(${index})" 
                    style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🗑️
            </button>
        </div>
    `).join('');
}

// Uppdatera kvalitetsförlustyper
function updateQualityLossType(index, newValue) {
    const types = getQualityLossTypes();
    types[index] = newValue;
    saveQualityLossTypes(types);
    renderQualityLossSettings();
}

function deleteQualityLossType(index) {
    if (!confirm('Är du säker på att du vill ta bort denna kvalitetsförlustyp?')) return;
    const types = getQualityLossTypes();
    types.splice(index, 1);
    saveQualityLossTypes(types);
    renderQualityLossSettings();
}

function addNewQualityLossType() {
    const name = prompt('Ange namn på ny kvalitetsförlustyp:');
    if (!name || name.trim() === '') return;
    
    const types = getQualityLossTypes();
    types.push(name.trim());
    saveQualityLossTypes(types);
    renderQualityLossSettings();
}

// Uppdatera select-elementet för uppgiftstyper
function updateTaskTypeSelect() {
    const select = document.getElementById('taskType');
    if (!select) return;
    
    const types = getTaskTypes();
    
    // Spara nuvarande val
    const currentValue = select.value;
    
    // Rensa och återskapa options
    select.innerHTML = '<option value="project">Projekt</option>';
    
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        select.appendChild(option);
    });
    
    // Återställ val om det fortfarande finns
    if (currentValue) {
        select.value = currentValue;
    }
}

// Initiera vid sidladdning
document.addEventListener('DOMContentLoaded', function() {
    updateTaskTypeSelect();
});
