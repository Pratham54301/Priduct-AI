const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key] || process.env[key].trim() === '');
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
