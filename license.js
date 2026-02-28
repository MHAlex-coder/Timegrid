// ===============================================
// LICENSHANTERING
// ===============================================

const LICENSE_TYPES = {
  TRIAL: 'trial',
  ANNUAL: 'annual',
  LIFETIME: 'lifetime'
};

const LICENSE_STORAGE_KEY = 'timegrid_license';
const LEGACY_LICENSE_STORAGE_KEY = 'timeweaver_license';
const FIRST_RUN_STORAGE_KEY = 'timegrid_first_run';
const LEGACY_FIRST_RUN_STORAGE_KEY = 'timeweaver_first_run';

function migrateLegacyLicenseStorage() {
  const legacyLicense = localStorage.getItem(LEGACY_LICENSE_STORAGE_KEY);
  const currentLicense = localStorage.getItem(LICENSE_STORAGE_KEY);

  if (!currentLicense && legacyLicense) {
    localStorage.setItem(LICENSE_STORAGE_KEY, legacyLicense);
  }

  const legacyFirstRun = localStorage.getItem(LEGACY_FIRST_RUN_STORAGE_KEY);
  const currentFirstRun = localStorage.getItem(FIRST_RUN_STORAGE_KEY);

  if (!currentFirstRun && legacyFirstRun) {
    localStorage.setItem(FIRST_RUN_STORAGE_KEY, legacyFirstRun);
  }
}

// Enkel XOR-kryptering (för obfuskering, inte säkerhet)
function simpleEncrypt(text, key = 'TW2025KEY') {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

function simpleDecrypt(encrypted, key = 'TW2025KEY') {
  try {
    const decoded = atob(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (e) {
    return null;
  }
}

// Generera checksumma
function generateChecksum(data) {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Validera licensnyckel
function validateLicenseKey(licenseKey) {
  if (!licenseKey || typeof licenseKey !== 'string') {
    return { valid: false, error: 'Ogiltig licensnyckel' };
  }

  // Dekryptera licensnyckel
  const decrypted = simpleDecrypt(licenseKey);
  if (!decrypted) {
    return { valid: false, error: 'Kunde inte dekryptera licensnyckel' };
  }

  // Parsa licensedata: TYPE|EXPIRY|ID|CHECKSUM
  const parts = decrypted.split('|');
  if (parts.length !== 4) {
    return { valid: false, error: 'Felaktigt licensformat' };
  }

  const [type, expiry, id, checksum] = parts;

  // Validera checksumma
  const dataToCheck = `${type}|${expiry}|${id}`;
  const expectedChecksum = generateChecksum(dataToCheck);
  if (checksum !== expectedChecksum) {
    return { valid: false, error: 'Licensnyckel är korrupt eller ogiltig' };
  }

  // Validera licenstyp
  if (!Object.values(LICENSE_TYPES).includes(type)) {
    return { valid: false, error: 'Okänd licenstyp' };
  }

  // Validera utgångsdatum (om inte lifetime)
  if (type !== LICENSE_TYPES.LIFETIME) {
    const expiryDate = new Date(parseInt(expiry));
    const now = new Date();
    
    if (isNaN(expiryDate.getTime())) {
      return { valid: false, error: 'Ogiltigt utgångsdatum' };
    }

    if (now > expiryDate) {
      return { valid: false, error: 'Licensen har gått ut', expired: true };
    }
    
    // Beräkna dagar kvar
    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    return {
      valid: true,
      type: type,
      expiry: expiryDate,
      daysLeft: daysLeft,
      id: id
    };
  }

  return {
    valid: true,
    type: type,
    expiry: null,
    id: id
  };
}

// Spara licens
function saveLicense(licenseKey) {
  const validation = validateLicenseKey(licenseKey);
  
  if (!validation.valid) {
    return validation;
  }

  // Spara licens i localStorage
  const licenseData = {
    key: licenseKey,
    activatedAt: new Date().toISOString(),
    type: validation.type,
    expiry: validation.expiry ? validation.expiry.toISOString() : null,
    id: validation.id
  };

  localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(licenseData));
  
  return { valid: true, ...validation };
}

// Hämta licensstatus
function getLicenseStatus() {
  migrateLegacyLicenseStorage();

  const stored = localStorage.getItem(LICENSE_STORAGE_KEY);
  
  if (!stored) {
    // Kolla om det är första gången (trial börjar)
    const firstRun = localStorage.getItem(FIRST_RUN_STORAGE_KEY);
    
    if (!firstRun) {
      // Första körningen - starta 10-dagars trial
      const trialExpiry = new Date();
      trialExpiry.setDate(trialExpiry.getDate() + 10);
      
      const trialData = {
        type: LICENSE_TYPES.TRIAL,
        activatedAt: new Date().toISOString(),
        expiry: trialExpiry.toISOString(),
        id: 'TRIAL-' + Date.now()
      };
      
      localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(trialData));
      localStorage.setItem(FIRST_RUN_STORAGE_KEY, new Date().toISOString());
      
      return {
        valid: true,
        type: LICENSE_TYPES.TRIAL,
        expiry: trialExpiry,
        daysLeft: 10,
        isTrial: true
      };
    }
    
    return { valid: false, error: 'Ingen licens hittades' };
  }

  try {
    const licenseData = JSON.parse(stored);
    
    // Om det finns en nyckel, validera den
    if (licenseData.key) {
      return validateLicenseKey(licenseData.key);
    }
    
    // Annars validera lagrad trial-data
    if (licenseData.type === LICENSE_TYPES.TRIAL) {
      const expiry = new Date(licenseData.expiry);
      const now = new Date();
      
      if (now > expiry) {
        return { valid: false, error: 'Testperioden har gått ut', expired: true };
      }
      
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      
      return {
        valid: true,
        type: LICENSE_TYPES.TRIAL,
        expiry: expiry,
        daysLeft: daysLeft,
        isTrial: true
      };
    }
    
    // Validera andra licenstyper
    if (licenseData.type === LICENSE_TYPES.LIFETIME) {
      return {
        valid: true,
        type: LICENSE_TYPES.LIFETIME,
        expiry: null
      };
    }
    
    if (licenseData.type === LICENSE_TYPES.ANNUAL) {
      const expiry = new Date(licenseData.expiry);
      const now = new Date();
      
      if (now > expiry) {
        return { valid: false, error: 'Licensen har gått ut', expired: true };
      }
      
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      
      return {
        valid: true,
        type: LICENSE_TYPES.ANNUAL,
        expiry: expiry,
        daysLeft: daysLeft
      };
    }
    
    return { valid: false, error: 'Okänd licenstyp' };
    
  } catch (e) {
    return { valid: false, error: 'Kunde inte läsa licensdata' };
  }
}

// Formatera licenstext för visning
function formatLicenseStatus(status) {
  if (!status.valid) {
    return status.error || 'Ingen giltig licens';
  }

  const translations = {
    sv: {
      trial: 'Testversion',
      annual: 'Årslicens',
      lifetime: 'Evighetslicens',
      daysLeft: 'dagar kvar',
      noExpiry: 'Utgår aldrig'
    },
    en: {
      trial: 'Trial Version',
      annual: 'Annual License',
      lifetime: 'Lifetime License',
      daysLeft: 'days left',
      noExpiry: 'Never expires'
    }
  };

  const lang = localStorage.getItem('language') || 'sv';
  const t = translations[lang] || translations.sv;

  let typeText = '';
  if (status.type === LICENSE_TYPES.TRIAL) typeText = t.trial;
  else if (status.type === LICENSE_TYPES.ANNUAL) typeText = t.annual;
  else if (status.type === LICENSE_TYPES.LIFETIME) typeText = t.lifetime;

  if (status.type === LICENSE_TYPES.LIFETIME) {
    return `${typeText} (${t.noExpiry})`;
  }

  if (status.daysLeft !== undefined) {
    return `${typeText} (${status.daysLeft} ${t.daysLeft})`;
  }

  if (status.expiry) {
    const expiry = new Date(status.expiry);
    return `${typeText} (${expiry.toLocaleDateString()})`;
  }

  return typeText;
}

// Ta bort licens
function removeLicense() {
  localStorage.removeItem(LICENSE_STORAGE_KEY);
}

// Kontrollera om funktioner är tillåtna
function isFeatureAllowed(feature) {
  const status = getLicenseStatus();
  
  if (!status.valid) {
    return false;
  }

  // Alla funktioner är tillåtna med giltig licens
  return true;
}
