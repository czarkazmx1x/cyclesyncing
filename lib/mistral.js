// Safely initialize Mistral client
let mistral = null;

if (typeof window === 'undefined') {
  // Only initialize on server side
  try {
    const { Mistral } = require('@mistralai/mistralai');
    const apiKey = process.env.MISTRAL_API_KEY;
    
    if (apiKey) {
      mistral = new Mistral({
        apiKey: apiKey
      });
    } else {
      console.warn('MISTRAL_API_KEY not found in environment variables');
    }
  } catch (error) {
    console.warn('Mistral client could not be initialized:', error.message);
  }
}

// Create a safe export that handles missing client
export { mistral };