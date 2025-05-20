import React from 'react';
import { Box, Typography } from '@mui/material';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { Event } from '../types';
import { eventListStyles } from '../styles/eventList.styles';
import { translations } from '../translations/pt';

interface CalendarDayCellProps {
  day: Date;
  events: Event[];
  selectedDate: Date | null;
  currentMonth: Date;
  onDayClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  events,
  selectedDate,
  currentMonth,
  onDayClick,
  onEventClick
}) => {
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, currentMonth);

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
      role="gridcell"
      aria-selected={isToday}
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
        {events.slice(0, 2).map((event) => (
          <Box
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            sx={eventListStyles.eventItem}
          >
            {event.title}
          </Box>
        ))}
        {events.length > 2 && (
          <Box
            sx={{ ...eventListStyles.eventItem, cursor: 'pointer', color: '#1976d2', fontWeight: 500 }}
            onClick={e => {
              e.stopPropagation();
              console.log('Show all events for day', day, events);
            }}
          >
            {`+${events.length - 2} ${translations.common.more}`}
          </Box>
        )}
      </Box>
    </Box>
  );
}; 