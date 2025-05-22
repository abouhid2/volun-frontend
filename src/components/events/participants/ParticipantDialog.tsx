import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { translations } from '../../../translations/pt';
import { Car, Participant } from '../../../types';

interface ParticipantDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; status: string; car_id?: number }) => void;
  onRemoveParticipant?: (participantId: number) => void;
  participant?: Participant;
  cars: Car[];
  participants: Participant[];
}

export const ParticipantDialog: React.FC<ParticipantDialogProps> = ({
  open,
  onClose,
  onSave,
  onRemoveParticipant,
  participant,
  cars,
  participants
}) => {
  const [name, setName] = React.useState(participant?.name || '');
  const [status, setStatus] = React.useState(participant?.status || 'going');
  const [carId, setCarId] = React.useState(participant?.car_id ? String(participant.car_id) : '');

  React.useEffect(() => {
    if (participant) {
      setName(participant.name);
      setStatus(participant.status || 'going');
      setCarId(participant.car_id ? String(participant.car_id) : '');
    } else {
      setName('');
      setStatus('going');
      setCarId('');
    }
  }, [participant]);

  const handleStatusChange = (newStatus: 'going' | 'not_going' | 'maybe') => {
    setStatus(newStatus);
  };

  const handleSave = () => {
    if (status === 'not_going' && participant?.id && onRemoveParticipant) {
      onRemoveParticipant(participant.id);
    }
    onSave({
      name,
      status,
      car_id: status === 'not_going' ? undefined : (carId ? parseInt(carId) : undefined)
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {participant ? translations.common.edit : translations.events.addParticipant}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={translations.forms.event.title}
          type="text"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>{translations.events.status.title}</InputLabel>
          <Select
            value={status}
            label={translations.events.status.title}
            onChange={e => handleStatusChange(e.target.value as 'going' | 'not_going' | 'maybe')}
          >
            <MenuItem value="going">{translations.events.status.going}</MenuItem>
            <MenuItem value="not_going">{translations.events.status.not_going}</MenuItem>
            <MenuItem value="maybe">{translations.events.status.maybe}</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>{translations.cars.title}</InputLabel>
          <Select
            value={carId}
            label={translations.cars.title}
            onChange={e => setCarId(e.target.value)}
            disabled={status === 'not_going'}
          >
            <MenuItem value="">{translations.cars.noCar}</MenuItem>
            {cars.map(car => {
              const assignedCount = participants.filter(p => p.car_id === car.id).length;
              const isFull = assignedCount >= car.seats;
              return (
                <MenuItem key={car.id} value={car.id} disabled={isFull}>
                  {car.driver_name} {isFull ? `(${translations.cars.full})` : ''}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translations.common.cancel}</Button>
        <Button onClick={handleSave} variant="contained">{translations.common.save}</Button>
      </DialogActions>
    </Dialog>
  );
}; 