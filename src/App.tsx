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

const theme = createTheme();

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<EntityList />} />
                <Route path="/entities/:entityId/events" element={<EventList />} />
                <Route path="/entities/:entityId/events/:eventId" element={<EventDetails />} />
              </Routes>
            </Layout>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
