import { useState, useCallback } from 'react';
import { Car } from '../types';
import { createCar, updateCar, deleteCar, cleanCarSeats } from '../services/api';
import { translations } from '../translations/pt';

export const useCarManagement = (eventId: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCar = useCallback(async (data: Omit<Car, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const carData = {
        ...data,
        event_id: eventId
      };
      const car = await createCar(eventId, carData);
      return car;
    } catch (err) {
      setError(translations.cars.createError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleUpdateCar = useCallback(async (carId: number, data: Partial<Car>) => {
    try {
      setLoading(true);
      setError(null);
      await updateCar(eventId, carId, data);
      return true;
    } catch (err) {
      setError(translations.cars.updateError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleDeleteCar = useCallback(async (carId: number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCar(eventId, carId);
      return true;
    } catch (err) {
      setError(translations.cars.deleteError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleCleanCarSeats = useCallback(async (carId: number, driverIds: number[]) => {
    try {
      setLoading(true);
      setError(null);
      await cleanCarSeats(eventId, carId, driverIds);
      return true;
    } catch (err) {
      setError(translations.cars.cleanError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  return {
    loading,
    error,
    handleCreateCar,
    handleUpdateCar,
    handleDeleteCar,
    handleCleanCarSeats,
  };
}; 