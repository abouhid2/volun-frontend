import React from 'react';
import { Box, Typography, Button, Popover } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { Event } from '../types';
import { eventListStyles } from '../styles/eventList.styles';

interface EventPopoverProps {
  event: Event | undefined;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
  isAuthenticated: boolean;
}

export const EventPopover: React.FC<EventPopoverProps> = ({
  event,
  anchorEl,
  onClose,
  onEdit,
  onDelete,
  isAuthenticated
}) => {
  if (!event) return null;

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={eventListStyles.popoverContent}>
        <Typography variant="h6" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {format(parseISO(event.date), 'dd/MM/yyyy')}
        </Typography>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Location: {event.location}
        </Typography>
        {isAuthenticated && (
          <Box sx={eventListStyles.popoverActions}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => {
                onEdit(event);
                onClose();
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                onDelete(event.id);
                onClose();
              }}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>
    </Popover>
  );
}; 