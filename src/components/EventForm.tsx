import React, { useState, useEffect } from "react";
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
import { createEvent, updateEvent } from "../services/api";
import { useParams } from "react-router-dom";
import { Event } from "../types";

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onEventCreated: () => void;
  initialData?: Event;
  defaultDate?: Date | null;
}

export const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onEventCreated,
  initialData,
  defaultDate
}) => {
  const { entityId } = useParams<{ entityId: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLocation(initialData.location);
      setDate(new Date(initialData.date));
    } else if (defaultDate) {
      setDate(defaultDate);
    }
  }, [initialData, defaultDate]);

  useEffect(() => {
    if (!initialData && defaultDate && !date) {
      setDate(defaultDate);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !entityId) return;

    try {
      setLoading(true);
      const eventData = {
        title,
        description,
        date: date.toISOString(),
        location,
        entityId: parseInt(entityId)
      };

      if (initialData) {
        await updateEvent(parseInt(entityId), initialData.id, eventData);
      } else {
        await createEvent(eventData);
      }
      
      onEventCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setDate(null);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Event' : 'Create New Event'}</DialogTitle>
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
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
            {initialData ? 'Update' : 'Create'} Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
