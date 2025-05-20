import React from 'react';
import { Paper, Typography, Box, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Car } from '../../types';
import { translations } from '../../translations/pt';

interface CarListProps {
  cars: Car[];
  onAddCar: () => void;
  onEditCar: (car: Car) => void;
  onDeleteCar: (carId: number) => void;
}

export const CarList: React.FC<CarListProps> = ({ cars, onAddCar, onEditCar, onDeleteCar }) => {
  return (
    <Paper sx={{ p: 3, flex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{translations.cars.title}</Typography>
        <Button startIcon={<AddIcon />} onClick={onAddCar}>
          {translations.cars.addButton}
        </Button>
      </Box>
      <List>
        {cars.map((car) => (
          <ListItem key={car.id}>
            <ListItemText
              primary={`${car.driver?.name || translations.cars.unknownDriver} - ${car.seats} ${translations.cars.seats}`}
              secondary={`${car.participants?.length || 0} ${translations.cars.participants}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onEditCar(car)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => onDeleteCar(car.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 