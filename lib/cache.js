// In-memory cache for access codes
const codes = new Map();

export const generateCode = () => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  codes.set(code, { 
    expiresAt, 
    used: false,
    createdAt: Date.now()
  });
  
  // Clean expired codes
  cleanExpiredCodes();
  
  return code;
};

export const validateCode = (inputCode) => {
  const code = inputCode.toUpperCase().trim();
  const data = codes.get(code);
  
  if (!data || data.used || Date.now() > data.expiresAt) {
    return false;
  }
  
  // Mark as used
  data.used = true;
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