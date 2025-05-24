import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { EntityType as Entity } from '../../types';
import { API_CONFIG } from '../../config/api';
import { EntityForm } from './EntityForm';
import { deleteEntity } from '../../services/api';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { AuthRequiredAlert } from '../common/AuthRequiredAlert';
import { useLanguage } from '../../context/LanguageContext';
import { AuthService } from '../../services/auth.service';

const DEFAULT_LOGO = "https://placehold.co/200x200";

export const EntityList = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { isAuthenticated, showAuthAlert, setShowAuthAlert, checkAuth } = useAuthCheck();

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

  if (loading) {
    return <LoadingState message={translations.organizations.loading} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchEntities} />;
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h2">
          {translations.organizations.title}
        </Typography>
        <Button variant="contained" onClick={handleCreateClick}>
          {translations.organizations.createButton}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {entities.map((entity) => (
          <Card key={entity.id} sx={{ height: '100%', position: 'relative' }}>
            <Box onClick={() => handleEntityClick(entity.id)} sx={{ cursor: 'pointer' }}>
              <CardMedia
                component="img"
                height="140"
                image={entity.logo || DEFAULT_LOGO}
                alt={entity.name}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = DEFAULT_LOGO;
                }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {entity.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {entity.description}
                </Typography>
              </CardContent>
            </Box>
            {isAuthenticated && entity.user_id === AuthService.getCurrentUser()?.id && (
              <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 1 }}>
                <IconButton size="small" onClick={(e) => handleEdit(e, entity)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={(e) => handleDelete(e, entity.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Card>
        ))}
      </Box>

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
    </>
  );
}; 