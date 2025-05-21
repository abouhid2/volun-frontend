import { useState, useCallback } from 'react';
import { Participant, ParticipantFormData } from '../types/events';
import { participate, updateParticipant, deleteParticipant } from '../services/api';
import { translations } from '../translations/pt';

export const useParticipantManagement = (eventId: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddParticipant = useCallback(async (data: ParticipantFormData) => {
    try {
      setLoading(true);
      setError(null);
      const participant = await participate(eventId, data);
      return participant;
    } catch (err) {
      setError(translations.events.participantError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleUpdateParticipant = useCallback(async (participantId: number, data: ParticipantFormData) => {
    try {
      setLoading(true);
      setError(null);
      await updateParticipant(eventId, participantId, data);
      return true;
    } catch (err) {
      setError(translations.events.participantError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleDeleteParticipant = useCallback(async (participantId: number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteParticipant(eventId, participantId);
      return true;
    } catch (err) {
      setError(translations.events.participantError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  return {
    loading,
    error,
    handleAddParticipant,
    handleUpdateParticipant,
    handleDeleteParticipant,
  };
}; 