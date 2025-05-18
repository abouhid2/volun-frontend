import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { createEvent } from "../services/api";

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onEventCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    try {
      setLoading(true);
      await createEvent({
        title,
        description,
        date: date.toISOString(),
      });
      onEventCreated();
      onClose();
      setTitle("");
      setDescription("");
      setDate(null);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Event</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 400,
            }}
          >
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              required
            />
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading || !date}>
            Create Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
