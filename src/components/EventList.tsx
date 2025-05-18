import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Event, Entity } from "../types";
import { EventForm } from "./EventForm";
import { CalendarDayCell } from "./CalendarDayCell";
import { EventPopover } from "./EventPopover";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { deleteEvent } from '../services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format, isSameDay, parseISO, isSameMonth, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { eventListStyles } from '../styles/eventList.styles';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { LoadingState } from './common/LoadingState';
import { ErrorState } from './common/ErrorState';
import { AuthRequiredAlert } from './common/AuthRequiredAlert';
import { translations } from '../translations/pt';

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, showAuthAlert, setShowAuthAlert, checkAuth } = useAuthCheck();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventsResponse, entityResponse] = await Promise.all([
        axios.get<Event[]>(`${API_CONFIG.baseURL}/entities/${entityId}/events`),
        axios.get<Entity>(`${API_CONFIG.baseURL}/entities/${entityId}`)
      ]);
      setEvents(eventsResponse.data);
      setEntity(entityResponse.data);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError(error.response?.data?.error || translations.events.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      fetchEvents();
    }
  }, [entityId]);

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

  const handleEventClick = (event: Event, element: HTMLElement) => {
    setSelectedEvent(event);
    setAnchorEl(element);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedEvent(undefined);
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

  return (
    <Container maxWidth="lg" sx={eventListStyles.container}>
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
                  />
                )
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>

      <EventPopover
        event={selectedEvent}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAuthenticated={isAuthenticated}
      />

      <EventForm
        open={isFormOpen}
        onClose={handleFormClose}
        onEventCreated={fetchEvents}
        initialData={selectedEvent}
        defaultDate={selectedDate}
        currentMonth={currentMonth}
      />

      <AuthRequiredAlert 
        open={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
      />
    </Container>
  );
};
