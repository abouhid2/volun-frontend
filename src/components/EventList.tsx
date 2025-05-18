import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, IconButton, Paper, Popover } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Event, Entity } from "../types";
import { EventForm } from "./EventForm";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { deleteEvent } from '../services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format, isSameDay, parseISO, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const [hoveredEvents, setHoveredEvents] = useState<Event[]>([]);
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
    if (dayEvents.length > 0) {
      setHoveredEvents(dayEvents);
    } else {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Events by {entity.name}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            ml: 'auto',
            bgcolor: '#1a73e8',
            '&:hover': {
              bgcolor: '#1557b0'
            }
          }} 
          onClick={() => setIsFormOpen(true)}
        >
          CREATE EVENT
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Box sx={{ 
            flex: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            overflow: 'hidden',
            height: '100vh'
          }}>
            <DateCalendar 
              value={selectedDate}
              onChange={handleDateChange}
              sx={{
                width: '100%',
                height: '100%',
                '& .MuiDayCalendar-weekContainer': {
                  margin: 0,
                  minHeight: '120px',
                },
                '& .MuiPickersDay-root': {
                  height: '120px',
                  width: '100%',
                  borderRadius: 0,
                  border: '1px solid',
                  borderColor: 'divider',
                  margin: 0,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                    color: 'text.primary',
                  }
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  width: '100%',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  pl: 1
                },
                '& .MuiPickersDay-dayOutsideMonth': {
                  opacity: 0.5,
                  pointerEvents: 'none',
                  backgroundColor: '#f5f5f5',
                }
              }}
              dayOfWeekFormatter={(day) => WEEKDAY_LABELS[day.getDay()]}
              slots={{
                day: (props) => {
                  const dayEvents = getEventsForDate(props.day);
                  const isToday = isSameDay(props.day, new Date());
                  const isCurrentMonth = isSameMonth(props.day, selectedDate || new Date());

                  return (
                    <Box
                      onClick={() => isCurrentMonth && handleDayClick(props.day)}
                      sx={{
                        height: '100%',
                        width: '100%',
                        p: 1,
                        cursor: isCurrentMonth ? 'pointer' : 'default',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: isToday ? '#e8f0fe' : 'transparent',
                        opacity: isCurrentMonth ? 1 : 0.5,
                        '&:hover': {
                          bgcolor: isCurrentMonth ? '#f8f9fa' : 'transparent'
                        }
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontSize: '1rem', 
                          mb: 0.5,
                          color: isToday ? '#1a73e8' : 'inherit',
                          fontWeight: isToday ? 500 : 400,
                          textAlign: 'left'
                        }}
                      >
                        {format(props.day, 'dd')}
                      </Typography>
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        {dayEvents.map((event, index) => (
                          <Box
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event, e.currentTarget as HTMLElement);
                            }}
                            sx={{
                              backgroundColor: '#1a73e8',
                              color: '#ffffff',
                              p: 0.5,
                              borderRadius: '4px',
                              mb: 0.5,
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#1557b0',
                              },
                            }}
                          >
                            {event.title}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  );
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {selectedEvent && (
          <Box sx={{ p: 2, maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
              {selectedEvent.title}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {format(parseISO(selectedEvent.date), 'dd/MM/yyyy')}
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedEvent.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Location: {selectedEvent.location}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => {
                  handleEdit(selectedEvent);
                  handlePopoverClose();
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  handleDelete(selectedEvent.id);
                  handlePopoverClose();
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        )}
      </Popover>

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
