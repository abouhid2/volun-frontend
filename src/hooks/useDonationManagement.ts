import { useState, useCallback } from 'react';
import { Donation, DonationSettings } from '../types';
import { createDonation, updateDonation, deleteDonation, getDonationSettings, updateDonationSettings } from '../services/api';
import { translations } from '../translations/pt';
import { useAuth } from './useAuth';

export const useDonationManagement = (eventId: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<DonationSettings>({ id: 0, event_id: eventId, types: [], units: [] });
  const { user } = useAuth();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDonationSettings(eventId);
      setSettings(data);
      return data;
    } catch (err) {
      setError(translations.donations.settingsError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleCreateDonation = useCallback(async (data: Omit<Donation, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const donationData = {
        ...data,
        event_id: eventId,
        user_id: user?.id || 0,
        description: data.description || ''
      };
      const donation = await createDonation(eventId, donationData);
      return donation;
    } catch (err) {
      setError(translations.donations.createError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventId, user]);

  const handleUpdateDonation = useCallback(async (donationId: number, data: Partial<Donation>) => {
    try {
      setLoading(true);
      setError(null);
      await updateDonation(eventId, donationId, data);
      return true;
    } catch (err) {
      setError(translations.donations.updateError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleDeleteDonation = useCallback(async (donationId: number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDonation(eventId, donationId);
      return true;
    } catch (err) {
      setError(translations.donations.deleteError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleUpdateSettings = useCallback(async (newSettings: DonationSettings) => {
    try {
      setLoading(true);
      setError(null);
      await updateDonationSettings(eventId, newSettings);
      setSettings(newSettings);
      return true;
    } catch (err) {
      setError(translations.donations.settingsError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  return {
    loading,
    error,
    settings,
    fetchSettings,
    handleCreateDonation,
    handleUpdateDonation,
    handleDeleteDonation,
    handleUpdateSettings,
  };
}; 