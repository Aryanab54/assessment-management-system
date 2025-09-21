const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRequired = (fields, data) => {
  const missing = [];
  fields.forEach(field => {
    if (!data[field]) missing.push(field);
  });
  return missing;
};

const validateLead = (leadData) => {
  const required = ['fullName'];
  const missing = validateRequired(required, leadData);
  
  if (missing.length > 0) {
    return { isValid: false, errors: [`Missing required fields: ${missing.join(', ')}`] };
  }
  
  if (leadData.email && !validateEmail(leadData.email)) {
    return { isValid: false, errors: ['Invalid email format'] };
  }
  
  return { isValid: true, errors: [] };
};

module.exports = {
  validateEmail,
  validateRequired,
  validateLead
};