import React from 'react';
import { Paper, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { translations } from '../../translations/pt';

interface Participant {
  id: number;
  name?: string;
}

interface ParticipationBoxProps {
  participants: Participant[];
  onAddParticipant: () => void;
}

export const ParticipationBox: React.FC<ParticipationBoxProps> = ({ participants, onAddParticipant }) => {
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
          participants.map((participant) => (
            <ListItem key={participant.id}>
              <ListItemText primary={participant.name || `ID: ${participant.id}`} />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
}; 