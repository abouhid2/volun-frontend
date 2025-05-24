import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Stack, 
  IconButton, 
  Menu, 
  MenuItem, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './common/Logo';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    AuthService.logout();
    handleUserMenuClose();
    navigate('/login');
  };
  
  const handleNavigation = (path: string) => {
    handleMenuClose();
    navigate(path);
  };
  
  const handleNavigateToProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
              cursor: 'pointer' 
            }}
            onClick={() => navigate("/")}
          >
            <Logo size="small" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Volun
            </Typography>
          </Box>
          
          {isAuthenticated ? (
            isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="user menu"
                  onClick={handleUserMenuOpen}
                  edge="end"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleNavigateToProfile}>
                    {currentUser?.name}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    {translations.auth.logout}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center">
                <Button 
                  color="inherit" 
                  startIcon={<AccountCircleIcon />}
                  onClick={handleNavigateToProfile}
                >
                  {currentUser?.name}
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  {translations.auth.logout}
                </Button>
              </Stack>
            )
          ) : (
            isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                  edge="end"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleNavigation("/")}>
                    {translations.auth.home}
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation("/login")}>
                    {translations.auth.login}
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation("/register")}>
                    {translations.auth.register}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate("/")}>
                  {translations.auth.home}
                </Button>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  {translations.auth.login}
                </Button>
                <Button color="inherit" onClick={() => navigate("/register")}>
                  {translations.auth.register}
                </Button>
              </>
            )
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}; 