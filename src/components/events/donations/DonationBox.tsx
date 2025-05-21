import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Donation, Car } from '../../../types';
import { translations } from '../../../translations/pt';
import { DonationList } from './DonationList';

interface DonationBoxProps {
  donations: Donation[];
  cars: Car[];
  onAddDonation: () => void;
  onEditDonation: (donation: Donation) => void;
  onDeleteDonation: (donationId: number) => void;
}

export const DonationBox: React.FC<DonationBoxProps> = ({ donations, cars, onAddDonation, onEditDonation, onDeleteDonation }) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{translations.donations.title}</Typography>
        <Button startIcon={<AddIcon />} onClick={onAddDonation}>
          {translations.donations.addButton}
        </Button>
      </Box>
      <DonationList
        donations={donations}
        cars={cars}
        onEditDonation={onEditDonation}
        onDeleteDonation={onDeleteDonation}
      />
    </Paper>
  );
}; 