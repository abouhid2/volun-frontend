import React from 'react';
import { Container, Typography } from '@mui/material';

interface LoadingStateProps {
  message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <Container>
      <Typography>{message}</Typography>
    </Container>
  );
}; 