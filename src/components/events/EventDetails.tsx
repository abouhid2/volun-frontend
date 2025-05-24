import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Tabs, 
  Tab, 
  Paper,
  Divider,
  Chip,
  Stack,
  Tooltip,
  Fab,
  useTheme,
  useMediaQuery,
  alpha,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Shuffle as ShuffleIcon, 
  Casino as CasinoIcon, 
  Comment as CommentIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event, Car, Participant, Donation, Comment, Inventory } from '../../types';
import { getEvent, getCars, createCar, updateCar, deleteCar, getDonations, createDonation, updateDonation, deleteDonation, getParticipants, participate, updateParticipant, deleteParticipant, cleanCarSeats, getDonationSettings, updateDonationSettings, duplicateEvent, getComments, createComment, updateComment, deleteComment, getInventories } from '../../services/api';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { translations } from '../../translations/pt';
import { EventForm } from './EventForm';
import { CarForm } from './cars/CarForm';
import { DonationForm } from './donations/DonationForm';
import { EventInfoBox } from './EventInfoBox';
import { DonationBox } from './donations/DonationBox';
import { CarBox } from './cars/CarBox';
import { ParticipationBox } from './participants/ParticipationBox';
import { ParticipantDialog } from './participants/ParticipantDialog';
import { EventSummary } from './EventSummary';
import { EventDuplicateDialog } from './EventDuplicateDialog';
import { CommentsBox } from './comments/CommentsBox';
import { useAuth } from '../../hooks/useAuth';
import { CarList } from './cars/CarList';

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
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchData = async () => {
    if (!entityId || !eventId) return;

    try {
      setLoading(true);
      const [eventData, carsData, donationsData, participantsData, donationSettingsData, commentsData] = await Promise.all([
        getEvent(parseInt(entityId), parseInt(eventId)),
        getCars(parseInt(eventId)),
        getDonations(parseInt(eventId)),
        getParticipants(parseInt(eventId)),
        getDonationSettings(parseInt(eventId)),
        getComments(parseInt(eventId))
      ]);

      setEvent(eventData);
      setCars(carsData);
      setDonations(donationsData);
      setParticipants(participantsData);
      setDonationTypes(donationSettingsData?.types || []);
      setDonationUnits(donationSettingsData?.units || []);
      setComments(commentsData);
      setError(null);
      
      // Fetch inventory items
      if (entityId) {
        fetchInventories();
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventories = async () => {
    if (!entityId) return;
    
    try {
      const inventoryItems = await getInventories(parseInt(entityId));
      setInventories(inventoryItems);
    } catch (err) {
      console.error('Error fetching inventories:', err);
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
      fetchInventories();
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
        fetchInventories();
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
    const unassigned = participants.filter(p => !p.car_id && p.status === 'going');
    const unassignedDonations = donations.filter(d => !d.car_id);
    const carsWithSeats = cars.map(car => ({
      ...car,
      assigned: participants.filter(p => p.car_id === car.id).length,
      availableSeats: car.seats - participants.filter(p => p.car_id === car.id).length
    }));
    
    let pool = [...unassigned];
    if (fullyRandom) {
      pool = pool.sort(() => Math.random() - 0.5);
    }

    for (const participant of pool) {
      const availableCars = carsWithSeats.filter(car => car.availableSeats > 0);
      if (availableCars.length === 0) break;

      const carWithMostSeats = availableCars.reduce((prev, current) => 
        current.availableSeats > prev.availableSeats ? current : prev
      );

      await updateParticipant(parseInt(eventId), participant.id, { car_id: carWithMostSeats.id });
      carWithMostSeats.assigned++;
      carWithMostSeats.availableSeats--;
    }

    let donationPool = [...unassignedDonations];
    if (fullyRandom) {
      donationPool = donationPool.sort(() => Math.random() - 0.5);
    }

    const carsWithDonations = carsWithSeats.sort((a, b) => b.assigned - a.assigned);
    let donationIndex = 0;
    for (const car of carsWithDonations) {
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

  const handleDuplicate = async (data: {
    title: string;
    description: string;
    date: Date;
    location: string;
    keepParticipants: boolean;
    keepCars: boolean;
    keepDonations: boolean;
  }) => {
    if (!entityId || !eventId) return;
    try {
      const duplicatedEvent = await duplicateEvent(parseInt(entityId), parseInt(eventId), {
        ...data,
        date: new Date(data.date).toISOString(),
        keepParticipants: data.keepParticipants,
        keepCars: data.keepCars,
        keepDonations: data.keepDonations,
      });
      navigate(`/entities/${entityId}/events/${duplicatedEvent.id}`);
    } catch (err) {
      console.error('Error duplicating event:', err);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!eventId) return;
    try {
      const newComment = await createComment(parseInt(eventId), content);
      setComments([newComment, ...comments]);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleUpdateComment = async (commentId: number, content: string) => {
    if (!eventId) return;
    try {
      const updatedComment = await updateComment(parseInt(eventId), commentId, content);
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!eventId) return;
    if (window.confirm(translations.common.confirmDelete)) {
      try {
        await deleteComment(parseInt(eventId), commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  if (loading) return <LoadingState message={translations.events.loading} />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!event) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ mr: 2, color: 'primary.main' }}
            size="medium"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight={600} color="text.primary">
            {event.title}
          </Typography>
          <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
            {user?.id === event?.user_id && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setIsDuplicateDialogOpen(true)}
                  size="small"
                >
                  {translations.events.duplicateTitle}
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => setIsFormOpen(true)}
                  size="small"
                >
                  {translations.common.edit}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Event Info Section */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
            <EventIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body1">
              {format(new Date(event.date), 'dd/MM/yyyy', { locale: ptBR })}
            </Typography>
          </Box>
          {event.location && (
            <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
              <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body1">{event.location}</Typography>
            </Box>
          )}
        </Box>

        {/* Restore the EventSummary component */}
        <EventSummary
          cars={cars}
          participants={participants}
          donations={donations}
        />

        {event.description && (
          <Box sx={{ mt: 3, color: "text.secondary" }}>
            <Typography variant="body1">{event.description}</Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Main Content Area */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
        {/* Left Column - Cars */}
        <Box sx={{ flex: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {translations.cars.title}
            </Typography>
            <Tooltip title={translations.cars.addButton}>
              <IconButton 
                color="primary"
                onClick={() => {
                  setSelectedCar(null);
                  setIsCarFormOpen(true);
                }}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box sx={{ 
            bgcolor: alpha(theme.palette.background.paper, 0.6), 
            borderRadius: 1,
            p: 2
          }}>
            {/* Use CarList directly to avoid the Paper and duplicate header from CarBox */}
            <CarList
              cars={cars}
              onEditCar={(car) => {
                setSelectedCar(car);
                setIsCarFormOpen(true);
              }}
              onDeleteCar={handleDeleteCar}
              onRemoveParticipant={handleRemoveParticipant}
              onRemoveDonation={(donationId) => {
                if (!eventId) return;
                updateDonation(parseInt(eventId), donationId, { car_id: null });
                fetchData();
              }}
              participants={participants}
              donations={donations}
              activeTab={activeTab}
            />
          </Box>
        </Box>

        {/* Right Column - Tabs */}
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                '& .MuiTab-root': { 
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  minWidth: 0,
                  px: 3,
                  py: 1.5,
                }
              }}
            >
              <Tab label={translations.events.participants} />
              <Tab label={translations.donations.title} />
              <Tab label={translations.events.comments.title} />
            </Tabs>
            
            <Box sx={{ p: 3, position: 'relative' }}>
              {activeTab === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<CasinoIcon />}
                        onClick={() => handleRandomizeAssignment(true)}
                        size="small"
                        color="primary"
                      >
                        {translations.cars.randomizeFull}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleRemoveAllBackSeats}
                        size="small"
                        color="error"
                      >
                        {translations.cars.removeBackSeats}
                      </Button>
                    </Stack>
                    <Tooltip title={translations.events.addParticipant}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => {
                          setSelectedParticipant(null);
                          setIsParticipantDialogOpen(true);
                        }}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        <PersonAddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <List sx={{ mt: 0, pt: 0 }}>
                    {participants.length === 0 ? (
                      <ListItem>
                        <ListItemText primary={translations.events.noParticipants} />
                      </ListItem>
                    ) : (
                      participants.sort((a, b) => a.id - b.id).map((participant, index) => {
                        const car = cars.find(car => car.id === participant.car_id);
                        return (
                          <ListItem 
                            key={participant.id} 
                            secondaryAction={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {participant.status && (
                                  <Chip 
                                    size="small" 
                                    label={translations.events.status[participant.status as keyof typeof translations.events.status] || participant.status}
                                    color={participant.status === 'going' ? 'success' : 
                                          participant.status === 'not_going' ? 'error' : 
                                          participant.status === 'maybe' ? 'warning' : 'default'}
                                  />
                                )}
                                <IconButton size="small" onClick={() => handleEditParticipant(participant)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDeleteParticipant(participant)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            }
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography component="span" sx={{ minWidth: '24px' }}>
                                    {index + 1}.
                                  </Typography>
                                  <Typography component="span">
                                    {participant.name || `ID: ${participant.id}`}
                                  </Typography>
                                </Box>
                              }
                              secondary={car ? `${translations.cars.car}: ${car.driver_name}` : undefined}
                            />
                          </ListItem>
                        );
                      })
                    )}
                  </List>
                </>
              )}
              {activeTab === 1 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRemoveAllDonations}
                      size="small"
                    >
                      {translations.donations.removeAll}
                    </Button>
                    <Tooltip title={translations.donations.addButton}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => {
                          setSelectedDonation(null);
                          setIsDonationFormOpen(true);
                        }}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {/* Custom Donation List */}
                  <List sx={{ mt: 0, pt: 0 }}>
                    {donations.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="Nenhuma doação ainda" />
                      </ListItem>
                    ) : (
                      donations.sort((a, b) => a.id - b.id).map((donation, index) => {
                        const car = cars.find(car => car.id === donation.car_id);
                        return (
                          <ListItem 
                            key={donation.id} 
                            secondaryAction={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton size="small" onClick={() => handleEditDonation(donation)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDeleteDonation(donation.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            }
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography component="span" sx={{ minWidth: '24px' }}>
                                    {index + 1}.
                                  </Typography>
                                  <Typography component="span">
                                    {donation.donation_type} ({donation.quantity} {donation.unit})
                                  </Typography>
                                </Box>
                              }
                              secondary={car ? `${translations.donations.assignedTo} ${car.driver_name}` : undefined}
                            />
                          </ListItem>
                        );
                      })
                    )}
                  </List>
                </>
              )}
              {activeTab === 2 && (
                <CommentsBox
                  comments={comments}
                  onAddComment={handleAddComment}
                  onUpdateComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Dialogs */}
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
      
      <EventDuplicateDialog
        open={isDuplicateDialogOpen}
        onClose={() => setIsDuplicateDialogOpen(false)}
        onConfirm={handleDuplicate}
        event={event}
      />
    </Container>
  );
}; 