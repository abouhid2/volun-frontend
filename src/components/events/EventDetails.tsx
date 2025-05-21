import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Tabs, Tab, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Shuffle as ShuffleIcon, Casino as CasinoIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Event, Car, Donation, Participant } from '../../types';
import { getEvent, getCars, createCar, updateCar, deleteCar, getDonations, createDonation, updateDonation, deleteDonation, getParticipants, participate, updateParticipant, deleteParticipant, cleanCarSeats, getDonationSettings, updateDonationSettings } from '../../services/api';
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
import { ParticipantDialog } from './ParticipantDialog';
import { EventSummary } from './EventSummary';

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
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [donationTypes, setDonationTypes] = useState<string[]>([]);
  const [donationUnits, setDonationUnits] = useState<string[]>([]);

  const fetchData = async () => {
    if (!entityId || !eventId) return;
    try {
      setLoading(true);
      const [eventData, carsData, donationsData, settingsData] = await Promise.all([
        getEvent(parseInt(entityId), parseInt(eventId)),
        getCars(parseInt(eventId)),
        getDonations(parseInt(eventId)),
        getDonationSettings(parseInt(eventId))
      ]);
      setEvent(eventData);
      setCars(carsData);
      setDonations(donationsData);
      setDonationTypes(settingsData.types);
      setDonationUnits(settingsData.units);
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
        const createdCar = await createCar(parseInt(eventId), car as Omit<Car, 'id'>);
        if (car.driver_name) {
          await participate(parseInt(eventId), {
            name: car.driver_name,
            status: 'going',
            car_id: createdCar.id
          });
        }
      }
      setIsCarFormOpen(false);
      setSelectedCar(null);
      fetchData();
      fetchParticipants();
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

  const handleEditDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsDonationFormOpen(true);
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

  const handleEditParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsParticipantDialogOpen(true);
  };

  const handleDeleteParticipant = async (participant: Participant) => {
    if (!eventId) return;
    if (window.confirm(translations.common.confirmDelete)) {
      try {
        await deleteParticipant(parseInt(eventId), participant.id);
        fetchParticipants();
      } catch (err) {}
    }
  };

  const handleSaveParticipant = async (data: { name: string; status: string; car_id?: number }) => {
    if (!eventId) return;
    try {
      if (selectedParticipant) {
        await updateParticipant(parseInt(eventId), selectedParticipant.id, data);
      } else {
        await participate(parseInt(eventId), data);
      }
      setIsParticipantDialogOpen(false);
      setSelectedParticipant(null);
      fetchParticipants();
    } catch (err) {
      console.error('Error saving participant:', err);
    }
  };

  const handleRandomizeAssignment = async (fullyRandom = false) => {
    if (!eventId) return;
    const unassigned = participants.filter(p => !p.car_id);
    const unassignedDonations = donations.filter(d => !d.car_id);
    const carsWithSeats = cars.map(car => ({
      ...car,
      assigned: participants.filter(p => p.car_id === car.id).length,
    }));
    
    let pool = [...unassigned];
    if (fullyRandom) {
      pool = pool.sort(() => Math.random() - 0.5);
    }
    let poolIndex = 0;
    for (const car of carsWithSeats) {
      for (let seat = car.assigned; seat < car.seats && poolIndex < pool.length; seat++) {
        const participant = pool[poolIndex];
        await updateParticipant(parseInt(eventId), participant.id, { car_id: car.id });
        poolIndex++;
      }
    }

    let donationPool = [...unassignedDonations];
    if (fullyRandom) {
      donationPool = donationPool.sort(() => Math.random() - 0.5);
    }
    let donationIndex = 0;
    for (const car of cars) {
      if (donationIndex < donationPool.length) {
        const donation = donationPool[donationIndex];
        await updateDonation(parseInt(eventId), donation.id, { car_id: car.id });
        donationIndex++;
      }
    }
    fetchData();
    fetchParticipants();
  };

  const handleRemoveAllBackSeats = async () => {
    if (!eventId) return;
    for (const car of cars) {
      const driverIds = participants.filter(p => p.car_id === car.id && p.name === car.driver_name).map(p => p.id);
      await cleanCarSeats(parseInt(eventId), car.id, driverIds);
    }
    fetchParticipants();
  };

  const handleRemoveAllDonations = async () => {
    if (!eventId) return;
    for (const car of cars) {
      const carDonations = donations.filter(d => d.car_id === car.id);
      for (const donation of carDonations) {
        await updateDonation(parseInt(eventId), donation.id, { car_id: null });
      }
    }
    fetchData();
  };

  const handleRemoveParticipant = async (participantId: number) => {
    if (!eventId) return;
    try {
      await updateParticipant(parseInt(eventId), participantId, { car_id: undefined });
      fetchParticipants();
    } catch (err) {
      console.error('Error removing participant from car:', err);
    }
  };

  const handleUpdateDonationSettings = async (types: string[], units: string[]) => {
    if (!eventId) return;
    try {
      await updateDonationSettings(parseInt(eventId), { types, units });
      setDonationTypes(types);
      setDonationUnits(units);
    } catch (err) {
      console.error('Error updating donation settings:', err);
    }
  };

  if (loading) return <LoadingState message={translations.events.loading} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!event) return null;

  return (
    <Container sx={{ py: 4, width: '100%', maxWidth: '100%' }}>
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

      <EventSummary 
        cars={cars}
        participants={participants}
        donations={donations}
      />

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
              onRemoveParticipant={handleRemoveParticipant}
              participants={participants}
            />
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {activeTab === 0 && (
              <>
                {/* <Button
                  variant="outlined"
                  startIcon={<ShuffleIcon />}
                  onClick={() => handleRandomizeAssignment(false)}
                >
                  {translations.cars.randomizeOrder}
                </Button> */}
                <Button
                  variant="outlined"
                  startIcon={<CasinoIcon />}
                  onClick={() => handleRandomizeAssignment(true)}
                >
                  {translations.cars.randomizeFull}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveAllBackSeats}
                >
                  {translations.cars.removeBackSeats}
                </Button>
              </>
            )}
            {activeTab === 1 && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveAllDonations}
              >
                {translations.donations.removeAll}
              </Button>
            )}
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Participantes" />
              <Tab label="Doações" />
            </Tabs>
          </Box>
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && (
              <ParticipationBox
                participants={participants}
                cars={cars}
                onAddParticipant={() => {
                  setSelectedParticipant(null);
                  setIsParticipantDialogOpen(true);
                }}
                onEditParticipant={handleEditParticipant}
                onDeleteParticipant={handleDeleteParticipant}
              />
            )}
            {activeTab === 1 && (
              <DonationBox
                donations={donations}
                cars={cars}
                onAddDonation={() => {
                  setSelectedDonation(null);
                  setIsDonationFormOpen(true);
                }}
                onEditDonation={handleEditDonation}
                onDeleteDonation={handleDeleteDonation}
              />
            )}
          </Box>
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
        cars={cars}
        types={donationTypes}
        units={donationUnits}
        onUpdateSettings={handleUpdateDonationSettings}
      />
      <ParticipantDialog
        open={isParticipantDialogOpen}
        onClose={() => {
          setIsParticipantDialogOpen(false);
          setSelectedParticipant(null);
        }}
        onSave={handleSaveParticipant}
        participant={selectedParticipant || undefined}
        cars={cars}
        participants={participants}
        onRemoveParticipant={handleRemoveParticipant}
      />
    </Container>
  );
}; 