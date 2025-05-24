import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { EventList } from './components/events/EventList';
import { EntityList } from './components/entities/EntityList';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import { EventDetails } from './components/events/EventDetails';
import Home from './components/Home';
import { Profile } from './components/Profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>}/>
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/register" element={<Layout><Register /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/entities" element={<Layout><EntityList /></Layout>} />
              <Route path="/entities/:entityId/events" element={<Layout><EventList /></Layout>} />
              <Route path="/entities/:entityId/events/:eventId" element={<Layout><EventDetails /></Layout>} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
