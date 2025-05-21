import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Entity } from '../../types';
import { createEntity, updateEntity } from '../../services/api';
import { translations } from '../../translations/pt';

interface EntityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  initialData?: Entity;
}

export const EntityForm: React.FC<EntityFormProps> = ({
  open,
  onClose,
  onSubmitSuccess,
  initialData
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setLogo(initialData.logo);
      setWebsite(initialData.website || '');
      setAddress(initialData.address);
      setPhone(initialData.phone);
      setEmail(initialData.email);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const entityData = {
        name,
        description,
        logo,
        website,
        address,
        phone,
        email
      };

      if (initialData) {
        await updateEntity(initialData.id, entityData);
      } else {
        await createEntity(entityData);
      }
      
      onSubmitSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving entity:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setLogo('');
    setWebsite('');
    setAddress('');
    setPhone('');
    setEmail('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? translations.common.edit : translations.common.create}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={translations.forms.organization.title}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label={translations.forms.organization.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              label={translations.forms.organization.logo}
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
            <TextField
              label={translations.forms.organization.website}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <TextField
              label={translations.forms.organization.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              label={translations.forms.organization.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              label={translations.forms.organization.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{translations.common.cancel}</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {initialData ? translations.common.save : translations.common.create}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 