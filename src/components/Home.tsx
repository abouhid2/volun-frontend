import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Tabs, Tab, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Event } from '../types';
import { getEvents } from '../services/api';
import { LoadingState } from './common/LoadingState';
import { ErrorState } from './common/ErrorState';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents(0);
      setEvents(response);
    } catch (error: any) {
      setError(error.message || 'Error loading events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEventClick = (eventId: number, entityId: number) => {
    navigate(`/entities/${entityId}/events/${eventId}`);
  };

  if (loading) {
    return <LoadingState message="Loading events..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchEvents} />;
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3,
          py: 4
        }}
      >
        <VLogo />
        <Typography variant="h3" component="h1" gutterBottom>
          Volun
        </Typography>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Upcoming Events" />
              <Tab label="Calendar View" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3
            }}>
              {events.map((event) => (
                <Card 
                  key={event.id}
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                  onClick={() => handleEventClick(event.id, event.entityId)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.entity?.logo || "https://placehold.co/400x200"}
                    alt={event.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {format(new Date(event.date), "PPP", { locale: ptBR })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                View Calendar
              </Button>
            </Box>
          </TabPanel>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 