import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Car } from '../../types';
import { translations } from '../../translations/pt';

interface CarListProps {
  cars: Car[];
  onEditCar: (car: Car) => void;
  onDeleteCar: (carId: number) => void;
}

export const CarList: React.FC<CarListProps> = ({ cars, onEditCar, onDeleteCar }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
        {cars.map((car) => (
        <Paper key={car.id} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              {car.driver_name || translations.cars.unknownDriver}
            </Typography>
            <Box>
              <IconButton size="small" onClick={() => onEditCar(car)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => onDeleteCar(car.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: car.seats }, (_, i) => (
              <Box
                key={i}
                sx={{
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: car.participants?.[i] ? 'action.selected' : 'background.paper'
                }}
              >
                {car.participants?.[i]?.name || `${translations.cars.seats} ${i + 1}`}
              </Box>
        ))}
          </Box>
    </Paper>
      ))}
    </Box>
  );
}; 