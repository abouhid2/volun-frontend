import React from 'react';
import { Box, Typography } from '@mui/material';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { Event } from '../types';
import { eventListStyles } from '../styles/eventList.styles';

interface CalendarDayCellProps {
  day: Date;
  events: Event[];
  selectedDate: Date | null;
  onDayClick: (date: Date) => void;
  onEventClick: (event: Event, element: HTMLElement) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  events,
  selectedDate,
  onDayClick,
  onEventClick
}) => {
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, selectedDate || new Date());

  return (
    <Box
      onClick={() => isCurrentMonth && onDayClick(day)}
      sx={{
        ...eventListStyles.dayCell,
        cursor: isCurrentMonth ? 'pointer' : 'default',
        bgcolor: isToday ? '#e8f0fe' : 'transparent',
        opacity: isCurrentMonth ? 1 : 0.5,
        '&:hover': {
          bgcolor: isCurrentMonth ? '#f8f9fa' : 'transparent'
        }
      }}
    >
      <Typography 
        sx={{ 
          ...eventListStyles.dayNumber,
          color: isToday ? '#1a73e8' : 'inherit',
          fontWeight: isToday ? 500 : 400,
        }}
      >
        {format(day, 'dd')}
      </Typography>
      <Box sx={eventListStyles.eventContainer}>
        {events.map((event) => (
          <Box
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event, e.currentTarget);
            }}
            sx={eventListStyles.eventItem}
          >
            {event.title}
          </Box>
        ))}
      </Box>
    </Box>
  );
}; 