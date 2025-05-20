import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, IconButton, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Event } from '../../types';
import { getEvent } from '../../services/api';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { translations } from '../../translations/pt';
import { EventForm } from './EventForm';

export const EventDetails: React.FC = () => {
  const { entityId, eventId } = useParams<{ entityId: string; eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!entityId || !eventId) return;
      try {
        setLoading(true);
        const data = await getEvent(parseInt(entityId), parseInt(eventId));
        setEvent(data);
      } catch (err) {
        setError(translations.events.loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [entityId, eventId]);

  if (loading) return <LoadingState message={translations.events.loading} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!event) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {event.title}
        </Typography>
        <Button
          variant="contained"
          sx={{ ml: 'auto' }}
          onClick={() => setIsFormOpen(true)}
        >
          {translations.common.edit}
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {translations.forms.event.date}
        </Typography>
        <Typography variant="body1" paragraph>
          {format(new Date(event.date), 'dd/MM/yyyy HH:mm')}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {translations.forms.event.description}
        </Typography>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {translations.forms.event.location}
        </Typography>
        <Typography variant="body1">
          {event.location}
        </Typography>
      </Paper>

      <EventForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onEventCreated={() => {
          setIsFormOpen(false);
          window.location.reload();
        }}
        initialData={event}
        currentMonth={new Date(event.date)}
      />
    </Container>
  );
}; 