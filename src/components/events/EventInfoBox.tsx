import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { CalendarToday as CalendarIcon, AccessTime as ClockIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { translations } from '../../translations/pt';

interface EventInfoBoxProps {
  date: string;
  description: string;
  location: string;
}

export const EventInfoBox: React.FC<EventInfoBoxProps> = ({ date, description, location }) => {
  const formattedDate = format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(new Date(date), 'HH:mm', { locale: ptBR });

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon color="primary" />
          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {formattedDate}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ClockIcon color="primary" />
          <Typography variant="body1">
            {formattedTime}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon color="primary" />
          <Typography variant="body1">
            {location}
          </Typography>
        </Box>
        {description && (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}; 