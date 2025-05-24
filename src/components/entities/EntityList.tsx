import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useMediaQuery, 
  useTheme,
  Container
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { EntityType as Entity } from '../../types';
import { API_CONFIG } from '../../config/api';
import { EntityForm } from './EntityForm';
import { deleteEntity } from '../../services/api';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { AuthRequiredAlert } from '../common/AuthRequiredAlert';
import { MobileActionButton } from '../common/MobileActionButton';
import { useLanguage } from '../../context/LanguageContext';
import { EntityCard } from './EntityCard';
import { EntityListHeader } from './EntityListHeader';
import { EntityGridLayout } from './EntityGridLayout';

export const EntityList = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { isAuthenticated, showAuthAlert, setShowAuthAlert, checkAuth } = useAuthCheck();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchEntities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Entity[]>(`${API_CONFIG.baseURL}/entities`);
      setEntities(response.data);
    } catch (error: any) {
      console.error('Error fetching entities:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        `${translations.organizations.loadError} ${API_CONFIG.baseURL}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const handleEntityClick = (entityId: number) => {
    navigate(`/entities/${entityId}/events`);
  };

  const handleEdit = (e: React.MouseEvent, entity: Entity) => {
    e.stopPropagation();
    checkAuth(() => {
      setSelectedEntity(entity);
      setIsFormOpen(true);
    });
  };

  const handleDelete = async (e: React.MouseEvent, entityId: number) => {
    e.stopPropagation();
    checkAuth(async () => {
      if (window.confirm(translations.common.confirmDelete)) {
        try {
          await deleteEntity(entityId);
          fetchEntities();
        } catch (error) {
          console.error('Error deleting entity:', error);
        }
      }
    });
  };

  const handleCreateClick = () => {
    checkAuth(() => setIsFormOpen(true));
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEntity(undefined);
  };

  const renderEntity = (entity: Entity, index: number) => (
    <EntityCard
      entity={entity}
      isAuthenticated={isAuthenticated}
      onCardClick={() => handleEntityClick(entity.id)}
      onEdit={(e) => handleEdit(e, entity)}
      onDelete={(e) => handleDelete(e, entity.id)}
    />
  );

  if (loading) {
    return <LoadingState message={translations.organizations.loading} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchEntities} />;
  }

  return (
    <Container maxWidth="xl">
      <EntityListHeader 
        entitiesCount={entities.length} 
        isMobile={isMobile} 
        onCreateClick={handleCreateClick}
      />

      <EntityGridLayout 
        entities={entities}
        renderEntity={renderEntity}
      />

      <EntityForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmitSuccess={fetchEntities}
        initialData={selectedEntity}
      />

      <AuthRequiredAlert 
        open={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
      />

      {isMobile && (
        <MobileActionButton
          icon={<AddIcon />}
          onClick={handleCreateClick}
          ariaLabel={translations.common.create}
        />
      )}
    </Container>
  );
}; 