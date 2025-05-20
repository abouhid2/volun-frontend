import React, { useEffect, useState, useCallback } from "react";
import { Container, Typography, Button, Box, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Event, Entity } from "../../types";
import { EventForm } from "./EventForm";
import { CalendarDayCell } from "../../components/CalendarDayCell";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../../config/api';
import { deleteEvent } from '../../services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { isSameDay, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { eventListStyles } from '../../styles/eventList.styles';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { AuthRequiredAlert } from '../common/AuthRequiredAlert';
import { translations } from '../../translations/pt';

interface ErrorResponse {
  error: string;
}

export const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [entity, setEntity] = useState<Entity | null>(null);
  const { entityId } = useParams<{ entityId: string }>();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const navigate = useNavigate();
  const { isAuthenticated, showAuthAlert, setShowAuthAlert, checkAuth } = useAuthCheck();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventsResponse, entityResponse] = await Promise.all([
        axios.get<Event[]>(`${API_CONFIG.baseURL}/entities/${entityId}/events`),
        axios.get<Entity>(`${API_CONFIG.baseURL}/entities/${entityId}`)
      ]);
      setEvents(eventsResponse.data);
      setEntity(entityResponse.data);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response) {
        const status = axiosError.response.status;
        if (status === 404) {
          setError(translations.events.entityNotFound);
        } else if (status === 401) {
          setError(translations.events.unauthorized);
        } else if (status === 403) {
          setError(translations.events.forbidden);
        } else {
          setError(axiosError.response.data?.error || translations.events.loadError);
        }
      } else if (axiosError.request) {
        setError(translations.events.networkError);
      } else {
        setError(translations.events.loadError);
      }
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  useEffect(() => {
    if (entityId) {
      fetchEvents();
    }
  }, [entityId, fetchEvents]);

  useEffect(() => {
    if (searchParams.get('date')) {
      const newDate = new Date(searchParams.get('date')!);
      setSelectedDate(newDate);
      setCurrentMonth(startOfMonth(newDate));
      setIsFormOpen(true);
    }
  }, [searchParams]);

  const handleEdit = (event: Event) => {
    checkAuth(() => {
      setSelectedEvent(event);
      setIsFormOpen(true);
    });
  };

  const handleDelete = async (eventId: number) => {
    if (!entityId) return;
    checkAuth(async () => {
      if (window.confirm(translations.common.confirmDelete)) {
        try {
          await deleteEvent(parseInt(entityId), eventId);
          fetchEvents();
          setIsFormOpen(false);
          setSelectedEvent(undefined);
        } catch (error) {
          console.error('Error deleting event:', error);
        }
      }
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEvent(undefined);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(startOfMonth(date));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const handleDayClick = (date: Date) => {
    checkAuth(() => {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length === 0) {
        setSelectedDate(date);
        setIsFormOpen(true);
        setSelectedEvent(undefined);
      }
    });
  };

  const handleEventClick = (event: Event) => {
    handleEdit(event);
  };

  const handleCreateClick = () => {
    checkAuth(() => setIsFormOpen(true));
  };

  if (loading) {
    return <LoadingState message={translations.events.loading} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchEvents} />;
  }

  if (!entity) return null;

  if (!entityId) {
    return <ErrorState message={translations.events.entityNotFound} onRetry={fetchEvents} />;
  }

  const parsedEntityId = parseInt(entityId);

  return (
    <Box sx={{ ...eventListStyles.container, width: '97vw', minHeight: '100vh', p: 0 }}>
      <Box sx={eventListStyles.header}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {translations.events.title} {entity.name}
        </Typography>
        {isAuthenticated && (
          <Button 
            variant="contained" 
            sx={eventListStyles.createButton}
            onClick={handleCreateClick}
          >
            {translations.events.createButton}
          </Button>
        )}
      </Box>

      <Box sx={eventListStyles.calendarContainer}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Box sx={eventListStyles.calendarWrapper}>
            <DateCalendar 
              value={selectedDate}
              onChange={handleDateChange}
              onMonthChange={handleMonthChange}
              sx={eventListStyles.calendar}
              dayOfWeekFormatter={(day) => translations.events.weekDays[day.getDay()]}
              slots={{
                day: (props) => (
                  <CalendarDayCell
                    day={props.day}
                    events={getEventsForDate(props.day)}
                    selectedDate={selectedDate}
                    currentMonth={currentMonth}
                    onDayClick={handleDayClick}
                    onEventClick={handleEventClick}
                    entityId={parsedEntityId}
                  />
                )
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>

      <EventForm
        open={isFormOpen}
        onClose={handleFormClose}
        onEventCreated={fetchEvents}
        initialData={selectedEvent}
        defaultDate={selectedDate}
        currentMonth={currentMonth}
        onDelete={selectedEvent ? () => handleDelete(selectedEvent.id) : undefined}
      />

      <AuthRequiredAlert 
        open={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
      />
    </Box>
  );
};
