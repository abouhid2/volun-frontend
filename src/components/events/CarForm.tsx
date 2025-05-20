import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Car } from '../../types';
import { translations } from '../../translations/pt';

interface CarFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (car: Partial<Car>) => void;
  selectedCar: Car | null;
}

export const CarForm: React.FC<CarFormProps> = ({ open, onClose, onSubmit, selectedCar }) => {
  const [driverName, setDriverName] = useState('');
  const [seats, setSeats] = useState('');

  useEffect(() => {
    if (selectedCar) {
      setDriverName(selectedCar.driver_name || '');
      setSeats(selectedCar.seats?.toString() || '');
    } else {
      setDriverName('');
      setSeats('');
    }
  }, [selectedCar]);

  const handleSubmit = () => {
    onSubmit({
      driver_name: driverName,
      seats: parseInt(seats) || 0
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedCar ? translations.common.edit : translations.common.create}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome do Motorista"
          fullWidth
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>{translations.cars.seats}</InputLabel>
          <Select
            value={seats}
            label={translations.cars.seats}
            onChange={(e) => setSeats(e.target.value)}
          >
            {[2,3,4,5].map((value) => (
              <MenuItem key={value} value={value.toString()}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translations.common.cancel}</Button>
        <Button onClick={handleSubmit}>{translations.common.save}</Button>
      </DialogActions>
    </Dialog>
  );
}; 