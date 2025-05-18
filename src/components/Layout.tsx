import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { useLanguage } from '../context/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Volun
          </Typography>
          {isAuthenticated ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" color="inherit">
                Logado como: {currentUser?.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                {translations.auth.logout}
              </Button>
            </Stack>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                {translations.auth.login}
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                {translations.auth.register}
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}; 