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
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { createEvent, updateEvent } from "../../services/api";
import { useParams } from "react-router-dom";
import { Event } from "../../types";
import { isSameMonth } from "date-fns";
import { translations } from '../../translations/pt';

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onEventCreated: () => void;
  initialData?: Event;
  defaultDate?: Date | null;
  currentMonth: Date;
  onDelete?: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onEventCreated,
  initialData,
  defaultDate,
  currentMonth,
  onDelete
}) => {
  const { entityId } = useParams<{ entityId: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLocation(initialData.location);
      const eventDate = new Date(initialData.date);
      setDate(eventDate);
      setTime(eventDate);
    } else if (defaultDate) {
      setDate(defaultDate);
      setTime(defaultDate);
    }
  }, [initialData, defaultDate]);

  useEffect(() => {
    if (!initialData && defaultDate && !date) {
      setDate(defaultDate);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !entityId || !time) return;

    try {
      setLoading(true);
      const eventData = {
        title,
        description,
        date: (() => {
          const d = new Date(date);
          d.setHours(time.getHours());
          d.setMinutes(time.getMinutes());
          d.setSeconds(0);
          d.setMilliseconds(0);
          return d.toISOString();
        })(),
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
    setTime(null);
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate && isSameMonth(newDate, currentMonth)) {
      setDate(newDate);
      if (time) {
        const updated = new Date(newDate);
        updated.setHours(time.getHours());
        updated.setMinutes(time.getMinutes());
        setTime(updated);
      }
    }
  };

  const handleTimeChange = (newTime: Date | null) => {
    if (newTime && date) {
      const updated = new Date(date);
      updated.setHours(newTime.getHours());
      updated.setMinutes(newTime.getMinutes());
      setTime(updated);
    } else {
      setTime(newTime);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? translations.common.edit + ' ' + translations.events.title : translations.common.create + ' ' + translations.events.title}</DialogTitle>
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
              label={translations.forms.event.title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label={translations.forms.event.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              label={translations.forms.event.location}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <DatePicker
              label={translations.forms.event.date}
              value={date}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  required: true
                }
              }}
              shouldDisableDate={(date) => !isSameMonth(date, currentMonth)}
            />
            <TimePicker
              label={translations.forms.event.time || 'Horário'}
              value={time}
              onChange={handleTimeChange}
              format="HH:mm"
              slotProps={{
                textField: {
                  required: true
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {initialData && onDelete && (
            <Button onClick={onDelete} color="error" variant="outlined">
              {translations.common.delete}
            </Button>
          )}
          <Button onClick={onClose}>{translations.common.cancel}</Button>
          <Button type="submit" variant="contained" disabled={loading || !date || !time}>
            {initialData ? translations.common.save : translations.common.create}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
