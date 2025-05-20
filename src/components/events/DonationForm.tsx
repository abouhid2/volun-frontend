import React from 'react';
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
  const handleSubmit = () => {
    onSubmit(selectedDonation || {});
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedDonation ? translations.common.edit : translations.common.create}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>{translations.donations.type}</InputLabel>
          <Select
            value={selectedDonation?.donation_type || ''}
            onChange={(e) => onSubmit({ donation_type: e.target.value })}
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
          value={selectedDonation?.quantity || ''}
          onChange={(e) => onSubmit({ quantity: parseInt(e.target.value) })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>{translations.donations.unit}</InputLabel>
          <Select
            value={selectedDonation?.unit || ''}
            onChange={(e) => onSubmit({ unit: e.target.value })}
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
          value={selectedDonation?.description || ''}
          onChange={(e) => onSubmit({ description: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translations.common.cancel}</Button>
        <Button onClick={handleSubmit}>{translations.common.save}</Button>
      </DialogActions>
    </Dialog>
  );
}; 