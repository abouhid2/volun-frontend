import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Donation } from '../../types';
import { translations } from '../../translations/pt';

interface DonationListProps {
  donations: Donation[];
  onEditDonation: (donation: Donation) => void;
  onDeleteDonation: (donationId: number) => void;
}

export const DonationList: React.FC<DonationListProps> = ({ donations, onEditDonation, onDeleteDonation }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {donations.map((donation) => (
        <Paper key={donation.id} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1">
                {translations.donations.types[donation.donation_type as keyof typeof translations.donations.types]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {donation.quantity} {translations.donations.units[donation.unit as keyof typeof translations.donations.units]}
              </Typography>
              {donation.description && (
                <Typography variant="body2" color="text.secondary">
                  {donation.description}
                </Typography>
              )}
      </Box>
            <Box>
              <IconButton size="small" onClick={() => onEditDonation(donation)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => onDeleteDonation(donation.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
        ))}
    </Box>
  );
}; 