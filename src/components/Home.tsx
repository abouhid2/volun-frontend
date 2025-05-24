import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { EntityList } from './entities/EntityList';
import { Logo } from './common/Logo';

const Home = () => {
  const { translations } = useLanguage();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pt: 6,
          pb: 4
        }}
      >
        <Logo size="large" sx={{ mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          {translations.home.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {translations.home.tagline}
        </Typography>
      </Box>

      <EntityList />
    </Container>
  );
};

export default Home; 