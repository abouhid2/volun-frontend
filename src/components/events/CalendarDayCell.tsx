import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { format, isSameDay, isSameMonth } from 'date-fns';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupIcon from '@mui/icons-material/Group';
import { Event } from '../../types';
import { eventListStyles } from '../../styles/eventList.styles';
import { translations } from '../../translations/pt';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';

interface CalendarDayCellProps {
  day: Date;
  events: Event[];
  selectedDate: Date | null;
  currentMonth: Date;
  onDayClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onEventDuplicate: (event: Event) => void;
  entityId: number;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  events,
  selectedDate,
  currentMonth,
  onDayClick,
  onEventClick,
  onEventDuplicate,
  entityId
}) => {
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const currentUser = AuthService.getCurrentUser();

  const handleEventClick = (event: React.MouseEvent<HTMLElement>, eventData: Event) => {
    event.stopPropagation();
    setSelectedEvent(eventData);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleEdit = () => {
    if (selectedEvent) {
      onEventClick(selectedEvent);
    }
    handleMenuClose();
  };

  const handleViewDetails = () => {
    if (selectedEvent && entityId) {
      navigate(`/entities/${entityId}/events/${selectedEvent.id}`);
    }
    handleMenuClose();
  };

  const handleDuplicate = () => {
    if (selectedEvent) {
      onEventDuplicate(selectedEvent);
    }
    handleMenuClose();
  };

  const isOwner = currentUser?.id === selectedEvent?.user_id;

  return (
    <Box
      onClick={() => isCurrentMonth && onDayClick(day)}
      sx={{
        ...eventListStyles.dayCell,
        cursor: isCurrentMonth ? "pointer" : "default",
        bgcolor: isToday ? "#e8f0fe" : "transparent",
        opacity: isCurrentMonth ? 1 : 0.5,
        "&:hover": {
          bgcolor: isCurrentMonth ? "#f8f9fa" : "transparent",
        },
      }}
      role="gridcell"
      aria-selected={isToday}
    >
      <Typography
        sx={{
          ...eventListStyles.dayNumber,
          color: isToday ? "#1a73e8" : "inherit",
          fontWeight: isToday ? 500 : 400,
        }}
      >
        {format(day, "dd")}
      </Typography>
      <div>
        {events.slice(0, 2).map((event) => (
          <Box
            key={event.id}
            onClick={(e) => handleEventClick(e, event)}
            sx={eventListStyles.eventItem}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ flex: 1 }}>{event.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DirectionsCarIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption">{event.total_cars || 0}</Typography>
                <GroupIcon sx={{ fontSize: 16, ml: 0.5 }} />
                <Typography variant="caption">{event.total_participants || 0}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
        {events.length > 2 && (
          <Box
            sx={{
              ...eventListStyles.eventItem,
              cursor: "pointer",
              color: "#1976d2",
              fontWeight: 500,
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Show all events for day", day, events);
            }}
          >
            {`+${events.length - 2} ${translations.common.more}`}
          </Box>
        )}
      </div>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
        <MenuItem onClick={handleViewDetails}>
          {translations.common.viewDetails}
        </MenuItem>
        {isOwner && (
          <MenuItem onClick={handleEdit}>{translations.common.edit}</MenuItem>
        )}
        {isOwner && (
          <MenuItem onClick={handleDuplicate}>
            {translations.events.duplicateTitle}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}; 