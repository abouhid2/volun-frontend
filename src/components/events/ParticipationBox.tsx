import React from 'react';
import { Paper, Box, Typography, Button, List, ListItem, ListItemText, IconButton, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { translations } from '../../translations/pt';
import { Participant, Car } from '../../types';

interface ParticipationBoxProps {
  participants: Participant[];
  cars: Car[];
  onAddParticipant: () => void;
  onEditParticipant: (participant: Participant) => void;
  onDeleteParticipant: (participant: Participant) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'going':
      return 'success';
    case 'not_going':
      return 'error';
    case 'maybe':
      return 'warning';
    default:
      return 'default';
  }
};

export const ParticipationBox: React.FC<ParticipationBoxProps> = ({ participants, cars, onAddParticipant, onEditParticipant, onDeleteParticipant }) => {
  const sortedParticipants = [...participants].sort((a, b) => a.id - b.id);

  const handleEditParticipant = (participant: Participant) => {
    if (participant.status === 'not_going' && participant.car_id) {
      onEditParticipant({ ...participant, car_id: undefined });
    } else {
      onEditParticipant(participant);
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6">{translations.events.participants}</Typography>
          <Typography variant="body2" color="text.secondary">
            {translations.events.totalParticipants}: {participants.length}
          </Typography>
        </Box>
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
          sortedParticipants.map((participant, index) => {
            const car = cars.find(car => car.id === participant.car_id);
            return (
              <ListItem 
                key={participant.id} 
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {participant.status && (
                      <Chip 
                        size="small" 
                        label={translations.events.status[participant.status as keyof typeof translations.events.status] || participant.status}
                        color={getStatusColor(participant.status)}
                      />
                    )}
                    <IconButton size="small" onClick={() => handleEditParticipant(participant)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDeleteParticipant(participant)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" sx={{ minWidth: '24px' }}>
                        {index + 1}.
                      </Typography>
                      <Typography component="span">
                        {participant.name || `ID: ${participant.id}`}
                      </Typography>
                    </Box>
                  }
                  secondary={car ? `${translations.cars.car}: ${car.driver_name}` : undefined}
                />
              </ListItem>
            );
          })
        )}
      </List>
    </Paper>
  );
}; 