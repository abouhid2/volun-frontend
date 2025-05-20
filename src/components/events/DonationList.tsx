import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Donation, Car } from '../../types';
import { translations } from '../../translations/pt';

interface DonationListProps {
  donations: Donation[];
  cars: Car[];
  onEditDonation: (donation: Donation) => void;
  onDeleteDonation: (donationId: number) => void;
}

export const DonationList: React.FC<DonationListProps> = ({ donations, cars, onEditDonation, onDeleteDonation }) => {
  const getCarName = (carId: number | null) => {
    if (!carId) return null;
    const car = cars.find(c => c.id === carId);
    return car?.driver_name;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {donations.map((donation) => (
        <Paper key={donation.id} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1">
                {donation.donation_type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {donation.quantity} {donation.unit}
              </Typography>
              {donation.description && (
                <Typography variant="body2" color="text.secondary">
                  {donation.description}
                </Typography>
              )}
              {donation.car_id && (
                <Typography variant="body2" color="primary">
                  {translations.donations.assignedTo} {getCarName(donation.car_id)}
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