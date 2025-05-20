import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Car, Participant } from '../../types';
import { translations } from '../../translations/pt';
import { CarList } from './CarList';

interface CarBoxProps {
  cars: Car[];
  onAddCar: () => void;
  onEditCar: (car: Car) => void;
  onDeleteCar: (carId: number) => void;
  onRemoveParticipant: (participantId: number) => void;
  participants?: Participant[];
}

export const CarBox: React.FC<CarBoxProps> = ({ 
  cars, 
  onAddCar, 
  onEditCar, 
  onDeleteCar, 
  onRemoveParticipant,
  participants = [] 
}) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{translations.cars.title}</Typography>
        <Button startIcon={<AddIcon />} onClick={onAddCar}>
          {translations.cars.addButton}
        </Button>
      </Box>
      <CarList
        cars={cars}
        onEditCar={onEditCar}
        onDeleteCar={onDeleteCar}
        onRemoveParticipant={onRemoveParticipant}
        participants={participants}
      />
    </Paper>
  );
}; 