import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Container, Box, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { Entity } from '../types';
import { API_CONFIG } from '../config/api';
import { EntityForm } from './EntityForm';
import { deleteEntity } from '../services/api';

const DEFAULT_LOGO = "https://placehold.co/200x200";

export const EntityList = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchEntities = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching entities from:', `${API_CONFIG.baseURL}/entities`);
      const response = await axios.get<Entity[]>(`${API_CONFIG.baseURL}/entities`);
      console.log('Entities response:', response.data);
      setEntities(response.data);
    } catch (error: any) {
      console.error('Error fetching entities:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        baseURL: API_CONFIG.baseURL
      });
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to load organizations. Please check if the backend server is running on ' + API_CONFIG.baseURL
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('EntityList mounted, API base URL:', API_CONFIG.baseURL);
    fetchEntities();
  }, []);

  const handleEntityClick = (entityId: number) => {
    navigate(`/events/${entityId}`);
  };

  const handleEdit = (e: React.MouseEvent, entity: Entity) => {
    e.stopPropagation();
    setSelectedEntity(entity);
    setIsFormOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, entityId: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteEntity(entityId);
        fetchEntities();
      } catch (error) {
        console.error('Error deleting entity:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEntity(undefined);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Organizations
        </Typography>
        <Button variant="contained" onClick={() => setIsFormOpen(true)}>
          Create Organization
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {entities.map((entity) => (
          <Card key={entity.id} sx={{ height: '100%', position: 'relative' }}>
            <CardActionArea onClick={() => handleEntityClick(entity.id)}>
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
            </CardActionArea>
            <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 1 }}>
              <IconButton size="small" onClick={(e) => handleEdit(e, entity)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={(e) => handleDelete(e, entity.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      <EntityForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmitSuccess={fetchEntities}
        initialData={selectedEntity}
      />
    </Container>
  );
}; 