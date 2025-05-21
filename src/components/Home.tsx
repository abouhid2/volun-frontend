import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const VLogo = styled(Box)(({ theme }) => ({
  width: '120px',
  height: '120px',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '"V"',
    fontSize: '80px',
    fontWeight: 'bold',
    color: theme.palette.primary.contrastText,
  }
}));

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3
        }}
      >
        <VLogo />
        <Typography variant="h3" component="h1" gutterBottom>
          Volun
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/entities')}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.2rem',
            borderRadius: '30px'
          }}
        >
          Começar
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 