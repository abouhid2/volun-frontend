import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Event, Car, Donation, Participant } from '../../types';
import { getEvent, getCars, createCar, updateCar, deleteCar, getDonations, createDonation, updateDonation, deleteDonation, getParticipants, participate } from '../../services/api';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { translations } from '../../translations/pt';
import { EventForm } from './EventForm';
import { CarForm } from './CarForm';
import { DonationForm } from './DonationForm';
import { EventInfoBox } from './EventInfoBox';
import { DonationBox } from './DonationBox';
import { CarBox } from './CarBox';
import { ParticipationBox } from './ParticipationBox';

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
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isParticipantDialogOpen, setIsParticipantDialogOpen] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantStatus, setNewParticipantStatus] = useState('going');
  const [newParticipantCarId, setNewParticipantCarId] = useState('');

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

  const fetchParticipants = async () => {
    if (!eventId) return;
    try {
      const data = await getParticipants(parseInt(eventId));
      setParticipants(data);
    } catch (err) {
      // handle error if needed
    }
  };

  useEffect(() => {
    fetchData();
    fetchParticipants();
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

  const handleAddParticipant = async () => {
    if (!eventId || !newParticipantName) return;
    try {
      await participate(parseInt(eventId), {
        name: newParticipantName,
        status: newParticipantStatus,
        car_id: newParticipantCarId ? parseInt(newParticipantCarId) : undefined,
      });
      setIsParticipantDialogOpen(false);
      setNewParticipantName('');
      setNewParticipantStatus('going');
      setNewParticipantCarId('');
      fetchParticipants();
    } catch (err) {
      // handle error if needed
    }
  };

  if (loading) return <LoadingState message={translations.events.loading} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!event) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch' }}>
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <EventInfoBox
                date={event.date}
                description={event.description}
                location={event.location}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <DonationBox
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
          <Box sx={{ flex: 1 }}>
            <CarBox
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
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' }}>
          <ParticipationBox
            participants={participants}
            onAddParticipant={() => setIsParticipantDialogOpen(true)}
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
      <Dialog open={isParticipantDialogOpen} onClose={() => setIsParticipantDialogOpen(false)}>
        <DialogTitle>{translations.events.addParticipant}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            value={newParticipantName}
            onChange={e => setNewParticipantName(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newParticipantStatus}
              label="Status"
              onChange={e => setNewParticipantStatus(e.target.value)}
            >
              <MenuItem value="going">Indo</MenuItem>
              <MenuItem value="not_going">Não vai</MenuItem>
              <MenuItem value="maybe">Talvez</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Carro</InputLabel>
            <Select
              value={newParticipantCarId}
              label="Carro"
              onChange={e => setNewParticipantCarId(e.target.value)}
            >
              <MenuItem value="">Nenhum</MenuItem>
              {cars.map(car => (
                <MenuItem key={car.id} value={car.id}>{car.driver_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsParticipantDialogOpen(false)}>{translations.common.cancel}</Button>
          <Button onClick={handleAddParticipant} variant="contained">{translations.common.save}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 