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
import { format, isSameDay, parseISO, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { eventListStyles } from '../styles/eventList.styles';

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

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
      setError(error.response?.data?.error || "Failed to load events. Please try again later.");
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
      setSelectedDate(new Date(searchParams.get('date')!));
      setIsFormOpen(true);
    }
  }, [searchParams]);

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (eventId: number) => {
    if (!entityId) return;
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(parseInt(entityId), eventId);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEvent(undefined);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const handleDayClick = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) {
      setSelectedDate(date);
      setIsFormOpen(true);
      setSelectedEvent(undefined);
    }
  };

  const handleEventClick = (event: Event, element: HTMLElement) => {
    setSelectedEvent(event);
    setAnchorEl(element);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedEvent(undefined);
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading events...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          <Button variant="outlined" onClick={fetchEvents}>Try Again</Button>
        </Box>
      </Container>
    );
  }

  if (!entity) return null;

  return (
    <Container maxWidth="lg" sx={eventListStyles.container}>
      <Box sx={eventListStyles.header}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Events by {entity.name}
        </Typography>
        <Button 
          variant="contained" 
          sx={eventListStyles.createButton}
          onClick={() => setIsFormOpen(true)}
        >
          CREATE EVENT
        </Button>
      </Box>

      <Box sx={eventListStyles.calendarContainer}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Box sx={eventListStyles.calendarWrapper}>
            <DateCalendar 
              value={selectedDate}
              onChange={handleDateChange}
              sx={eventListStyles.calendar}
              dayOfWeekFormatter={(day) => WEEKDAY_LABELS[day.getDay()]}
              slots={{
                day: (props) => (
                  <CalendarDayCell
                    day={props.day}
                    events={getEventsForDate(props.day)}
                    selectedDate={selectedDate}
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
      />

      <EventForm
        open={isFormOpen}
        onClose={handleFormClose}
        onEventCreated={fetchEvents}
        initialData={selectedEvent}
        defaultDate={selectedDate}
      />
    </Container>
  );
};
