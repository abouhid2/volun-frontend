import React from 'react';
import { Paper, Typography, Box, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Donation } from '../../types';
import { translations } from '../../translations/pt';

interface DonationListProps {
  donations: Donation[];
  onAddDonation: () => void;
  onEditDonation: (donation: Donation) => void;
  onDeleteDonation: (donationId: number) => void;
}

export const DonationList: React.FC<DonationListProps> = ({ donations, onAddDonation, onEditDonation, onDeleteDonation }) => {
  return (
    <Paper sx={{ p: 3, flex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{translations.donations.title}</Typography>
        <Button startIcon={<AddIcon />} onClick={onAddDonation}>
          {translations.donations.addButton}
        </Button>
      </Box>
      <List>
        {donations.map((donation) => (
          <ListItem key={donation.id}>
            <ListItemText
              primary={`${translations.donations.types[donation.donation_type as keyof typeof translations.donations.types]} - ${donation.quantity} ${translations.donations.units[donation.unit as keyof typeof translations.donations.units]}`}
              secondary={donation.description}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onEditDonation(donation)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => onDeleteDonation(donation.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 