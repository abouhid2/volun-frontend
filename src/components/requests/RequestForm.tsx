import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
  Autocomplete
} from '@mui/material';
import { Request, RequestFormValues } from '../../types';
import { translations } from '../../translations/pt';
import { format } from 'date-fns';

interface RequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: RequestFormValues) => void;
  selectedRequest?: Request;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  open,
  onClose,
  onSubmit,
  selectedRequest
}) => {
  const [formValues, setFormValues] = useState<RequestFormValues>({
    item_name: '',
    item_type: '',
    quantity: '1',
    unit: 'units',
    requested_by: '',
    notes: '',
    requested_at: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (selectedRequest) {
      setFormValues({
        item_name: selectedRequest.item_name,
        item_type: selectedRequest.item_type,
        quantity: selectedRequest.quantity,
        unit: selectedRequest.unit,
        requested_by: selectedRequest.requested_by || '',
        notes: selectedRequest.notes || '',
        requested_at: selectedRequest.requested_at ? format(new Date(selectedRequest.requested_at), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
      });
    } else {
      setFormValues({
        item_name: '',
        item_type: '',
        quantity: '1',
        unit: 'units',
        requested_by: '',
        notes: '',
        requested_at: format(new Date(), 'yyyy-MM-dd')
      });
    }
  }, [selectedRequest, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } }) => {
    const name = e.target.name;
    const value = e.target.value;
    
    if (name) {
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedRequest ? translations.requests.editRequest : translations.requests.addButton}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 1 }}>
            <TextField
              label={translations.requests.itemName}
              name="item_name"
              value={formValues.item_name}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <TextField
              label={translations.requests.itemType}
              name="item_type"
              value={formValues.item_type}
              onChange={handleChange}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label={translations.requests.quantity}
                name="quantity"
                type="number"
                value={formValues.quantity}
                onChange={handleChange}
                fullWidth
              />
              
              <FormControl fullWidth required>
                <InputLabel>{translations.requests.unit}</InputLabel>
                <Select
                  name="unit"
                  value={formValues.unit}
                  onChange={handleChange}
                  label={translations.requests.unit}
                >
                  {Object.entries(translations.donations.units).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label={translations.requests.requestedBy}
              name="requested_by"
              value={formValues.requested_by}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label={translations.requests.requestedOn}
              name="requested_at"
              type="date"
              value={formValues.requested_at}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label={translations.requests.notes}
              name="notes"
              value={formValues.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {translations.common.cancel}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {translations.common.save}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 