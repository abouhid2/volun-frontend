import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  TextField,
  Stack,
} from '@mui/material';
import { Event } from '../../types';
import { translations } from '../../translations/pt';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

interface EventDuplicateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    title: string;
    description: string;
    date: Date;
    location: string;
    keepParticipants: boolean;
    keepCars: boolean;
    keepDonations: boolean;
  }) => void;
  event: Event;
}

export const EventDuplicateDialog: React.FC<EventDuplicateDialogProps> = ({
  open,
  onClose,
  onConfirm,
  event,
}) => {
  const [formData, setFormData] = useState({
    title: `${event.title} (Cópia)`,
    description: event.description,
    date: new Date(event.date),
    location: event.location,
    keepParticipants: true,
    keepCars: true,
    keepDonations: true,
  });

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: new Date(date),
      }));
    }
  };

  const handleCheckboxChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };

  const handleConfirm = () => {
    onConfirm({
      ...formData,
      date: new Date(formData.date),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{translations.events.duplicateTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label={translations.forms.event.title}
            value={formData.title}
            onChange={handleChange('title')}
            fullWidth
          />
          <TextField
            label={translations.forms.event.description}
            value={formData.description}
            onChange={handleChange('description')}
            multiline
            rows={4}
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label={translations.forms.event.date}
              value={formData.date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
          <TextField
            label={translations.forms.event.location}
            value={formData.location}
            onChange={handleChange('location')}
            fullWidth
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.keepParticipants}
                  onChange={handleCheckboxChange('keepParticipants')}
                />
              }
              label={translations.events.keepParticipants}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.keepCars}
                  onChange={handleCheckboxChange('keepCars')}
                />
              }
              label={translations.events.keepCars}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.keepDonations}
                  onChange={handleCheckboxChange('keepDonations')}
                />
              }
              label={translations.events.keepDonations}
            />
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translations.common.cancel}</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          {translations.common.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 