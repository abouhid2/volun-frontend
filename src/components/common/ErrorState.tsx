import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { translations } from '../../translations/pt';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography color="error" sx={{ mb: 2 }}>{message}</Typography>
        <Button variant="outlined" onClick={onRetry}>
          {translations.common.tryAgain}
        </Button>
      </Box>
    </Container>
  );
}; 