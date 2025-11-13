// In-memory cache for access codes
const codes = new Map();

export const generateCode = () => {
  let code;
  let attempts = 0;
  
  // Generate unique code (avoid collisions)
  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    attempts++;
  } while (codes.has(code) && attempts < 10);
  
  // Add timestamp to ensure uniqueness
  if (codes.has(code)) {
    code = code + Date.now().toString().slice(-2);
  }
  
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  codes.set(code, { 
    expiresAt, 
    used: false,
    createdAt: Date.now()
  });
  
  // Clean expired codes
  cleanExpiredCodes();
  
  console.log(`Generated code: ${code}, Total codes: ${codes.size}`);
  return code;
};

export const validateCode = (inputCode) => {
  const code = inputCode.toUpperCase().trim();
  const data = codes.get(code);
  
  console.log(`Validating code: ${code}, Found: ${!!data}, Used: ${data?.used}, Expired: ${data ? Date.now() > data.expiresAt : 'N/A'}`);
  
  if (!data || data.used || Date.now() > data.expiresAt) {
    return false;
  }
  
  // Mark as used
  data.used = true;
  console.log(`Code ${code} marked as used`);
  return true;
};

// Clean expired codes to prevent memory leak
const cleanExpiredCodes = () => {
  const now = Date.now();
  for (const [code, data] of codes.entries()) {
    if (now > data.expiresAt) {
      codes.delete(code);
    }
  }
};

export const getCodeStats = () => ({
  total: codes.size,
  active: Array.from(codes.values()).filter(d => !d.used && Date.now() < d.expiresAt).length
});