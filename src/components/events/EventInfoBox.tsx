import React from 'react';
import { Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { translations } from '../../translations/pt';

interface EventInfoBoxProps {
  date: string | Date;
  description: string;
  location: string;
}

export const EventInfoBox: React.FC<EventInfoBoxProps> = ({ date, description, location }) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {translations.forms.event.date}
      </Typography>
      <Typography variant="body1" paragraph>
        {format(new Date(date), 'dd/MM/yyyy HH:mm')}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {translations.forms.event.description}
      </Typography>
      <Typography variant="body1" paragraph>
        {description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {translations.forms.event.location}
      </Typography>
      <Typography variant="body1">
        {location}
      </Typography>
    </Paper>
  );
}; 