import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { participate, unparticipate } from "../../../services/api";
import { AuthService } from "../../../services/auth.service";

interface ParticipantButtonProps {
  eventId: number;
  isParticipating: boolean;
  onParticipationChange: () => void;
}

export const ParticipantButton: React.FC<ParticipantButtonProps> = ({
  eventId,
  isParticipating,
  onParticipationChange,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const user = AuthService.getCurrentUser();

  const handleParticipate = async () => {
    if (user) {
      await participate(eventId, { name: user.name });
      onParticipationChange();
      return;
    }
    setOpen(true);
  };

  const handleAnonymousParticipate = async () => {
    if (!name.trim()) return;
    await participate(eventId, { name: name.trim() });
    onParticipationChange();
    setOpen(false);
    setName('');
  };

  const handleUnparticipate = async () => {
    await unparticipate(eventId);
    onParticipationChange();
  };

  return (
    <>
      {isParticipating ? (
        <Button variant="outlined" color="error" onClick={handleUnparticipate}>
          Cancel Participation
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleParticipate}>
          Participate
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Enter Your Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAnonymousParticipate} disabled={!name.trim()}>
            Participate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 