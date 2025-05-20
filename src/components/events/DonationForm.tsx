import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Donation } from '../../types';
import { translations } from '../../translations/pt';

interface DonationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (donation: Partial<Donation>) => void;
  selectedDonation: Donation | null;
}

export const DonationForm: React.FC<DonationFormProps> = ({ open, onClose, onSubmit, selectedDonation }) => {
  const [formData, setFormData] = useState<Partial<Donation>>({
    donation_type: '',
    quantity: 0,
    unit: '',
    description: ''
  });

  useEffect(() => {
    if (selectedDonation) {
      setFormData(selectedDonation);
    } else {
      setFormData({
        donation_type: '',
        quantity: 0,
        unit: '',
        description: ''
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedDonation ? translations.common.edit : translations.common.create}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>{translations.donations.type}</InputLabel>
          <Select
            value={formData.donation_type || ''}
            onChange={(e) => handleChange('donation_type', e.target.value)}
          >
            {Object.entries(translations.donations.types).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
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
            {Object.entries(translations.donations.units).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translations.common.cancel}</Button>
        <Button onClick={handleSubmit}>{translations.common.save}</Button>
      </DialogActions>
    </Dialog>
  );
}; 