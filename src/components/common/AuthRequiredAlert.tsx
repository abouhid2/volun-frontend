import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { translations } from '../../translations/pt';

interface AuthRequiredAlertProps {
  open: boolean;
  onClose: () => void;
}

export const AuthRequiredAlert: React.FC<AuthRequiredAlertProps> = ({
  open,
  onClose
}) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="warning">
        {translations.common.authRequired}
      </Alert>
    </Snackbar>
  );
}; 