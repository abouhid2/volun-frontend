import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { translations } from '../../translations/pt';

interface DonationSettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (types: string[], units: string[]) => void;
  initialTypes: string[];
  initialUnits: string[];
}

export const DonationSettings: React.FC<DonationSettingsProps> = ({
  open,
  onClose,
  onSave,
  initialTypes,
  initialUnits,
}) => {
  const [types, setTypes] = useState<string[]>(initialTypes);
  const [units, setUnits] = useState<string[]>(initialUnits);
  const [newType, setNewType] = useState('');
  const [newUnit, setNewUnit] = useState('');

  const handleAddType = () => {
    if (newType.trim() && !types.includes(newType.trim())) {
      setTypes([...types, newType.trim()]);
      setNewType('');
    }
  };

  const handleAddUnit = () => {
    if (newUnit.trim() && !units.includes(newUnit.trim())) {
      setUnits([...units, newUnit.trim()]);
      setNewUnit('');
    }
  };

  const handleDeleteType = (type: string) => {
    setTypes(types.filter(t => t !== type));
  };

  const handleDeleteUnit = (unit: string) => {
    setUnits(units.filter(u => u !== unit));
  };

  const handleSave = () => {
    onSave(types, units);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'type' | 'unit') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'type') {
        handleAddType();
      } else {
        handleAddUnit();
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{translations.donations.settings}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>{translations.donations.type}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'type')}
              placeholder={translations.donations.type}
            />
            <Button variant="contained" onClick={handleAddType} startIcon={<AddIcon />}>
              {translations.common.create}
            </Button>
          </Box>
          <List>
            {types.map((type) => (
              <ListItem key={type}>
                <ListItemText primary={type} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteType(type)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>{translations.donations.unit}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'unit')}
              placeholder={translations.donations.unit}
            />
            <Button variant="contained" onClick={handleAddUnit} startIcon={<AddIcon />}>
              {translations.common.create}
            </Button>
          </Box>
          <List>
            {units.map((unit) => (
              <ListItem key={unit}>
                <ListItemText primary={unit} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteUnit(unit)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translations.common.cancel}</Button>
        <Button onClick={handleSave} variant="contained">{translations.common.save}</Button>
      </DialogActions>
    </Dialog>
  );
}; 