export const validateCollegeEmail = (email) => {
  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'ghru.edu.in';
  return email.endsWith(`@${allowedDomain}`);
};

export default validateCollegeEmail;
