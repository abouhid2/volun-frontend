import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, IconButton, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Event, Car, Donation } from '../../types';
import { getEvent, getCars, createCar, updateCar, deleteCar, getDonations, createDonation, updateDonation, deleteDonation } from '../../services/api';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { translations } from '../../translations/pt';
import { EventForm } from './EventForm';
import { CarList } from './CarList';
import { CarForm } from './CarForm';
import { DonationList } from './DonationList';
import { DonationForm } from './DonationForm';

export const EventDetails: React.FC = () => {
  const { entityId, eventId } = useParams<{ entityId: string; eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCarFormOpen, setIsCarFormOpen] = useState(false);
  const [isDonationFormOpen, setIsDonationFormOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const fetchData = async () => {
    if (!entityId || !eventId) return;
    try {
      setLoading(true);
      const [eventData, carsData, donationsData] = await Promise.all([
        getEvent(parseInt(entityId), parseInt(eventId)),
        getCars(parseInt(eventId)),
        getDonations(parseInt(eventId))
      ]);
      setEvent(eventData);
      setCars(carsData);
      setDonations(donationsData);
    } catch (err) {
      setError(translations.events.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [entityId, eventId]);

  const handleCarSubmit = async (car: Partial<Car>) => {
    if (!eventId) return;
    try {
      if (selectedCar) {
        await updateCar(parseInt(eventId), selectedCar.id, car);
      } else {
        await createCar(parseInt(eventId), car as Omit<Car, 'id'>);
      }
      setIsCarFormOpen(false);
      setSelectedCar(null);
      fetchData();
    } catch (err) {
      console.error('Error saving car:', err);
    }
  };

  const handleDonationSubmit = async (donation: Partial<Donation>) => {
    if (!eventId) return;
    try {
      if (selectedDonation) {
        await updateDonation(parseInt(eventId), selectedDonation.id, donation);
      } else {
        await createDonation(parseInt(eventId), donation as Omit<Donation, 'id'>);
      }
      setIsDonationFormOpen(false);
      setSelectedDonation(null);
      fetchData();
    } catch (err) {
      console.error('Error saving donation:', err);
    }
  };

  const handleDeleteCar = async (carId: number) => {
    if (!eventId) return;
    if (window.confirm(translations.common.confirmDelete)) {
      try {
        await deleteCar(parseInt(eventId), carId);
        fetchData();
      } catch (err) {
        console.error('Error deleting car:', err);
      }
    }
  };

  const handleDeleteDonation = async (donationId: number) => {
    if (!eventId) return;
    if (window.confirm(translations.common.confirmDelete)) {
      try {
        await deleteDonation(parseInt(eventId), donationId);
        fetchData();
      } catch (err) {
        console.error('Error deleting donation:', err);
      }
    }
  };

  if (loading) return <LoadingState message={translations.events.loading} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!event) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {event.title}
        </Typography>
        <Button
          variant="contained"
          sx={{ ml: 'auto' }}
          onClick={() => setIsFormOpen(true)}
        >
          {translations.common.edit}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {translations.forms.event.date}
          </Typography>
          <Typography variant="body1" paragraph>
            {format(new Date(event.date), 'dd/MM/yyyy HH:mm')}
          </Typography>

          <Typography variant="h6" gutterBottom>
            {translations.forms.event.description}
          </Typography>
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>

          <Typography variant="h6" gutterBottom>
            {translations.forms.event.location}
          </Typography>
          <Typography variant="body1">
            {event.location}
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <CarList
            cars={cars}
            onAddCar={() => {
              setSelectedCar(null);
              setIsCarFormOpen(true);
            }}
            onEditCar={(car) => {
              setSelectedCar(car);
              setIsCarFormOpen(true);
            }}
            onDeleteCar={handleDeleteCar}
          />

          <DonationList
            donations={donations}
            onAddDonation={() => {
              setSelectedDonation(null);
              setIsDonationFormOpen(true);
            }}
            onEditDonation={(donation) => {
              setSelectedDonation(donation);
              setIsDonationFormOpen(true);
            }}
            onDeleteDonation={handleDeleteDonation}
          />
        </Box>
      </Box>

      <EventForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onEventCreated={() => {
          setIsFormOpen(false);
          fetchData();
        }}
        initialData={event}
        currentMonth={new Date(event.date)}
      />

      <CarForm
        open={isCarFormOpen}
        onClose={() => setIsCarFormOpen(false)}
        onSubmit={handleCarSubmit}
        selectedCar={selectedCar}
      />

      <DonationForm
        open={isDonationFormOpen}
        onClose={() => setIsDonationFormOpen(false)}
        onSubmit={handleDonationSubmit}
        selectedDonation={selectedDonation}
      />
    </Container>
  );
}; 