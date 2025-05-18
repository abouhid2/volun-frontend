const getBaseUrl = () => {
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  // Development default
  return 'http://127.0.0.1:3001';
};

export const API_CONFIG = {
  baseURL: getBaseUrl()
}; 