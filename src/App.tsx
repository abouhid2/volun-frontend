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
import { EntityDetails } from './components/entities/EntityDetails';
import { InventoryList } from './components/inventory/InventoryList';
import { InventoryDetails } from './components/inventory/InventoryDetails';

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
              <Route path="/entities/:entityId" element={<Layout><EntityDetails /></Layout>} />
              <Route path="/entities/:entityId/events" element={<Layout><EventList /></Layout>} />
              <Route path="/entities/:entityId/events/:eventId" element={<Layout><EventDetails /></Layout>} />
              <Route path="/entities/:entityId/inventory" element={<Layout><InventoryList /></Layout>} />
              <Route path="/entities/:entityId/inventory/:inventoryId" element={<Layout><InventoryDetails /></Layout>} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
