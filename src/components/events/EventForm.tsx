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
import { useParams } from "react-router-dom";
import { Event, EventFormData } from "../../types";
import { isSameMonth } from "date-fns";
import { translations } from '../../translations/pt';
import { useEventManagement } from "../../hooks/useEventManagement";

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
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    date: new Date(),
    entityId: parseInt(entityId || "0")
  });
  const { loading, handleCreateEvent, handleUpdateEvent } = useEventManagement(parseInt(entityId || "0"));

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        location: initialData.location,
        date: new Date(initialData.date),
        entityId: initialData.entityId
      });
    } else if (defaultDate) {
      setFormData(prev => ({
        ...prev,
        date: defaultDate
      }));
    }
  }, [initialData, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !entityId) return;

    const success = initialData
      ? await handleUpdateEvent(initialData.id, formData)
      : await handleCreateEvent(formData);

    if (success) {
      onEventCreated();
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      date: new Date(),
      entityId: parseInt(entityId || "0")
    });
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate && isSameMonth(newDate, currentMonth)) {
      setFormData(prev => ({
        ...prev,
        date: newDate
      }));
    }
  };

  const handleTimeChange = (newTime: Date | null) => {
    if (newTime && formData.date) {
      const updated = new Date(formData.date);
      updated.setHours(newTime.getHours());
      updated.setMinutes(newTime.getMinutes());
      setFormData(prev => ({
        ...prev,
        date: updated
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {initialData ? translations.common.edit : translations.common.create} {translations.events.title}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
            <TextField
              label={translations.forms.event.title}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <TextField
              label={translations.forms.event.description}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={4}
            />
            <TextField
              label={translations.forms.event.location}
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
            <DatePicker
              label={translations.forms.event.date}
              value={formData.date}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: { required: true }
              }}
              shouldDisableDate={(date) => !isSameMonth(date, currentMonth)}
            />
            <TimePicker
              label={translations.forms.event.time}
              value={formData.date}
              onChange={handleTimeChange}
              format="HH:mm"
              slotProps={{
                textField: { required: true }
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
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !formData.date}
          >
            {initialData ? translations.common.save : translations.common.create}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
