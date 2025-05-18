import { useState } from 'react';
import { AuthService } from '../services/auth.service';

export const useAuthCheck = () => {
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();

  const checkAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }
    callback();
  };

  return {
    isAuthenticated,
    showAuthAlert,
    setShowAuthAlert,
    checkAuth,
  };
}; 