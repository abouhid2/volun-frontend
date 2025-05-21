import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Car, Participant, Donation } from '../../types';
import { translations } from '../../translations/pt';
import { CarList } from './CarList';

interface CarBoxProps {
  cars: Car[];
  onAddCar: () => void;
  onEditCar: (car: Car) => void;
  onDeleteCar: (carId: number) => void;
  onRemoveParticipant: (participantId: number) => void;
  onRemoveDonation: (donationId: number) => void;
  participants?: Participant[];
  donations?: Donation[];
  activeTab: number;
  onDropParticipant?: (carId: number, seatIndex: number, participant: Participant) => void;
}

export const CarBox: React.FC<CarBoxProps> = ({ 
  cars, 
  onAddCar, 
  onEditCar, 
  onDeleteCar, 
  onRemoveParticipant,
  onRemoveDonation,
  participants = [],
  donations = [],
  activeTab,
  onDropParticipant
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
        onRemoveDonation={onRemoveDonation}
        participants={participants}
        donations={donations}
        activeTab={activeTab}
        onDropParticipant={(carId, seatIndex, participant) => {
          if (typeof onDropParticipant === 'function') {
            onDropParticipant(carId, seatIndex, participant);
          }
        }}
      />
    </Paper>
  );
}; 