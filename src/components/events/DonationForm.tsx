import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Box } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { Donation, Car } from '../../types';
import { translations } from '../../translations/pt';
import { DonationSettings } from './DonationSettings';

interface DonationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (donation: Partial<Donation>) => void;
  selectedDonation: Donation | null;
  cars: Car[];
  types: string[];
  units: string[];
  onUpdateSettings: (types: string[], units: string[]) => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  open,
  onClose,
  onSubmit,
  selectedDonation,
  cars,
  types,
  units,
  onUpdateSettings
}) => {
  const [formData, setFormData] = useState<Partial<Donation>>({
    donation_type: '',
    quantity: 0,
    unit: '',
    description: '',
    car_id: null
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (selectedDonation) {
      setFormData(selectedDonation);
    } else {
      setFormData({
        donation_type: '',
        quantity: 0,
        unit: '',
        description: '',
        car_id: null
      });
    }
  }, [selectedDonation]);

  const handleChange = (field: keyof Donation, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {selectedDonation ? translations.common.edit : translations.common.create}
            <IconButton onClick={() => setIsSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>{translations.donations.type}</InputLabel>
            <Select
              value={formData.donation_type || ''}
              onChange={(e) => handleChange('donation_type', e.target.value)}
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label={translations.donations.quantity}
            type="number"
            fullWidth
            value={formData.quantity || ''}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>{translations.donations.unit}</InputLabel>
            <Select
              value={formData.unit || ''}
              onChange={(e) => handleChange('unit', e.target.value)}
            >
              {units.map((unit) => (
                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label={translations.donations.description}
            fullWidth
            multiline
            rows={2}
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>{translations.donations.car}</InputLabel>
            <Select
              value={formData.car_id || ''}
              label={translations.donations.car}
              onChange={(e) => handleChange('car_id', e.target.value || null)}
            >
              <MenuItem value="">{translations.donations.noCar}</MenuItem>
              {cars.map(car => (
                <MenuItem key={car.id} value={car.id}>
                  {car.driver_name}
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

      <DonationSettings
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={onUpdateSettings}
        initialTypes={types}
        initialUnits={units}
      />
    </>
  );
}; 