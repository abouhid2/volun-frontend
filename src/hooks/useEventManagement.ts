import { useState, useCallback } from 'react';
import { Event, EventFormData, DuplicateEventData } from '../types';
import { createEvent, updateEvent, deleteEvent, duplicateEvent } from '../services/api';
import { translations } from '../translations/pt';
import { AuthService } from '../services/auth.service';

export const useEventManagement = (entityId: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateEvent = useCallback(async (data: EventFormData) => {
    try {
      setLoading(true);
      setError(null);
      const eventData = {
        ...data,
        date: typeof data.date === 'string' ? data.date : data.date.toISOString(),
        user_id: AuthService.getCurrentUser()?.id,
        cars: [],
        donations: [],
        total_participants: 0,
        total_cars: 0,
        total_donations: 0
      };
      await createEvent(eventData);
      return true;
    } catch (err) {
      setError(translations.events.createError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateEvent = useCallback(async (eventId: number, data: EventFormData) => {
    try {
      setLoading(true);
      setError(null);
      const eventData = {
        ...data,
        date: typeof data.date === 'string' ? data.date : data.date.toISOString(),
        userId: AuthService.getCurrentUser()?.id
      };
      await updateEvent(entityId, eventId, eventData);
      return true;
    } catch (err) {
      setError(translations.events.updateError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  const handleDeleteEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteEvent(entityId, eventId);
      return true;
    } catch (err) {
      setError(translations.events.deleteError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  const handleDuplicateEvent = useCallback(async (eventId: number, data: DuplicateEventData) => {
    try {
      setLoading(true);
      setError(null);
      const eventData = {
        ...data,
        date: data.date.toISOString(),
        userId: AuthService.getCurrentUser()?.id
      };
      const duplicatedEvent = await duplicateEvent(entityId, eventId, eventData);
      return duplicatedEvent;
    } catch (err) {
      setError(translations.events.duplicateError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  return {
    loading,
    error,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleDuplicateEvent,
  };
}; 