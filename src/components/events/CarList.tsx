import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { Car, Participant, Donation } from '../../types';
import { translations } from '../../translations/pt';
import { useDrop } from 'react-dnd';
import { useDrag } from 'react-dnd';

interface CarListProps {
  cars: Car[];
  onEditCar: (car: Car) => void;
  onDeleteCar: (carId: number) => void;
  onRemoveParticipant: (participantId: number) => void;
  onRemoveDonation: (donationId: number) => void;
  participants?: Participant[];
  donations?: Donation[];
  activeTab: number;
  onDropParticipant: (carId: number, seatIndex: number, participant: Participant) => void;
}

const Seat = ({
  carId,
  seatIndex,
  participant,
  isDriver,
  onDropParticipant,
  onRemoveParticipant
}: {
  carId: number;
  seatIndex: number;
  participant?: Participant;
  isDriver?: boolean;
  onDropParticipant: (carId: number, seatIndex: number, participant: Participant) => void;
  onRemoveParticipant: (participantId: number) => void;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'PARTICIPANT',
    drop: (item: any) => {
      if (item.participant) {
        onDropParticipant(carId, seatIndex, item.participant);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'PARTICIPANT',
    item: participant ? { participant } : {},
    canDrag: !!participant,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref));
  if (participant) {
    return (
      <Box
        ref={ref}
        sx={{
          p: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: isDriver ? 'primary.light' : 'action.selected',
          fontWeight: isDriver ? 'bold' : 'normal',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: isDragging ? 0.5 : 1,
          outline: isOver ? '2px solid #1976d2' : undefined
        }}
      >
        <span>
          {participant.name} {isDriver ? `(${translations.cars.driver})` : ''}
        </span>
        {!isDriver && (
          <IconButton 
            size="small" 
            onClick={() => onRemoveParticipant(participant.id)}
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  }
  return (
    <Box
      ref={ref}
      sx={{
        p: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: isOver ? 'action.hover' : 'background.paper',
        outline: isOver ? '2px solid #1976d2' : undefined
      }}
    >
      {`${translations.cars.seat} ${seatIndex + 1}`}
    </Box>
  );
};

export const CarList: React.FC<CarListProps> = ({ 
  cars, 
  onEditCar, 
  onDeleteCar, 
  onRemoveParticipant,
  onRemoveDonation,
  participants = [],
  donations = [],
  activeTab,
  onDropParticipant
}) => {
  const sortedCars = [...cars].sort((a, b) => a.id - b.id);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
      {sortedCars.map((car, carIndex) => {
        const carParticipants = participants.filter(p => p.car_id === car.id);
        const carDonations = donations.filter(d => d.car_id === car.id);
        const driver = carParticipants.find(p => p.name === car.driver_name);
        const others = carParticipants.filter(p => p.name !== car.driver_name);
        const seatsArr = [driver, ...others].slice(0, car.seats);

        return (
          <Paper key={car.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {carIndex + 1}.
                </Typography>
                <Typography variant="subtitle1">
                  {car.driver_name || translations.cars.unknownDriver}
                </Typography>
              </Box>
              <Box>
                <IconButton size="small" onClick={() => onEditCar(car)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onDeleteCar(car.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {activeTab === 0 ? (
                Array.from({ length: car.seats }, (_, i) => {
                  const participant = seatsArr[i];
                  const isDriver = participant && participant.name === car.driver_name;
                  return (
                    <Seat
                      key={i}
                      carId={car.id}
                      seatIndex={i}
                      participant={participant}
                      isDriver={isDriver}
                      onDropParticipant={onDropParticipant}
                      onRemoveParticipant={onRemoveParticipant}
                    />
                  );
                })
              ) : (
                carDonations.map((donation, index) => (
                  <Box
                    key={donation.id}
                    sx={{
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'action.selected',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="body2">
                        {donation.donation_type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {donation.quantity} {donation.unit}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => onRemoveDonation(donation.id)}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}; 