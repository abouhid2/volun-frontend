import React from 'react';
import { Paper, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { translations } from '../../translations/pt';
import { Participant, Car } from '../../types';

interface ParticipationBoxProps {
  participants: Participant[];
  cars: Car[];
  onAddParticipant: () => void;
  onEditParticipant: (participant: Participant) => void;
  onDeleteParticipant: (participant: Participant) => void;
}

export const ParticipationBox: React.FC<ParticipationBoxProps> = ({ participants, cars, onAddParticipant, onEditParticipant, onDeleteParticipant }) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{translations.events.participants}</Typography>
        <Button startIcon={<AddIcon />} onClick={onAddParticipant}>
          {translations.events.addParticipant}
        </Button>
      </Box>
      <List>
        {participants.length === 0 ? (
          <ListItem>
            <ListItemText primary={translations.events.noParticipants} />
          </ListItem>
        ) : (
          participants.map((participant) => {
            const car = cars.find(car => car.id === participant.car_id);
            return (
              <ListItem key={participant.id} secondaryAction={
                <Box>
                  <Button size="small" onClick={() => onEditParticipant(participant)}>{translations.common.edit}</Button>
                  <Button size="small" color="error" onClick={() => onDeleteParticipant(participant)}>{translations.common.delete}</Button>
                </Box>
              }>
                <ListItemText
                  primary={participant.name || `ID: ${participant.id}`}
                  secondary={car ? `${translations.cars.title}: ${car.driver_name}` : undefined}
                />
              </ListItem>
            );
          })
        )}
      </List>
    </Paper>
  );
}; 