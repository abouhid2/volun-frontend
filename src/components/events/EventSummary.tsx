import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DirectionsCar as CarIcon, Person as PersonIcon, CardGiftcard as GiftIcon } from '@mui/icons-material';
import { Car, Donation, Participant } from '../../types';
import { translations } from '../../translations/pt';

interface EventSummaryProps {
  cars: Car[];
  participants: Participant[];
  donations: Donation[];
}

export const EventSummary: React.FC<EventSummaryProps> = ({ cars, participants, donations }) => {
  const totalSeats = cars.reduce((acc, car) => acc + car.seats, 0);
  const assignedSeats = participants.filter(p => p.car_id).length;
  const goingParticipants = participants.filter(p => p.status === 'going').length;

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
      <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CarIcon color="primary" />
          <Typography variant="h6" color="primary">
            {cars.length}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {translations.cars.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {assignedSeats}/{totalSeats} {translations.cars.seats}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6" color="primary">
            {participants.length}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {translations.events.participants}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {goingParticipants} {translations.events.status.total_going}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GiftIcon color="primary" />
          <Typography variant="h6" color="primary">
            {donations.length}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {translations.donations.title}
        </Typography>
      </Paper>
    </Box>
  );
}; 