import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, IconButton, Card, CardContent } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Inventory as InventoryIcon, Event as EventIcon, Receipt as RequestIcon } from '@mui/icons-material';
import { EntityDuplicateDialog } from './EntityDuplicateDialog';
import { duplicateEntity, getEntity } from '../../services/api';
import { translations } from '../../translations/pt';
import { EntityType as Entity } from '../../types';

// Create a SimpleEntity type that has the same properties as Entity
// but doesn't require all the fields to be present
interface SimpleEntity {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  user_id?: number;
}

export const EntityDetails: React.FC = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<SimpleEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEntity = async () => {
      if (!entityId) return;
      
      try {
        setLoading(true);
        const data = await getEntity(parseInt(entityId));
        setEntity(data as SimpleEntity);
        setError(null);
      } catch (err) {
        console.error('Error fetching entity:', err);
        setError('Failed to load entity');
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [entityId]);

  const handleDuplicate = async () => {
    if (!entityId) return;
    try {
      const duplicatedEntity = await duplicateEntity(parseInt(entityId));
      navigate(`/entities/${duplicatedEntity.id}`);
    } catch (err) {
      console.error('Error duplicating entity:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography>{translations.common.loading}</Typography>
      </Container>
    );
  }

  if (error || !entity) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          {translations.common.tryAgain}
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, width: '100%', maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {entity.name}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 3,
          mb: 4 
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translations.forms.organization.description}
            </Typography>
            <Typography variant="body1">
              {entity.description || 'No description provided'}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translations.forms.organization.address}
            </Typography>
            <Typography variant="body1">
              {entity.address || 'No address provided'}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {translations.forms.organization.phone}
            </Typography>
            <Typography variant="body1">
              {entity.phone || 'No phone provided'}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {translations.forms.organization.email}
            </Typography>
            <Typography variant="body1">
              {entity.email || 'No email provided'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 3
        }}
      >
        <Card 
          sx={{ 
            cursor: 'pointer', 
            transition: 'transform 0.2s', 
            '&:hover': { transform: 'scale(1.02)' } 
          }}
          onClick={() => navigate(`/entities/${entity.id}/events`)}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 4 }}>
            <EventIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" align="center">
              {translations.events.title}
            </Typography>
          </CardContent>
        </Card>
        <Card 
          sx={{ 
            cursor: 'pointer', 
            transition: 'transform 0.2s', 
            '&:hover': { transform: 'scale(1.02)' } 
          }}
          onClick={() => navigate(`/entities/${entity.id}/inventory`)}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 4 }}>
            <InventoryIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" align="center">
              {translations.inventory.title}
            </Typography>
          </CardContent>
        </Card>
        <Card 
          sx={{ 
            cursor: 'pointer', 
            transition: 'transform 0.2s', 
            '&:hover': { transform: 'scale(1.02)' } 
          }}
          onClick={() => navigate(`/entities/${entity.id}/requests`)}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 4 }}>
            <RequestIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" align="center">
              {translations.requests.title}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <EntityDuplicateDialog
        open={isDuplicateDialogOpen}
        onClose={() => setIsDuplicateDialogOpen(false)}
        onConfirm={handleDuplicate}
        entity={entity as Entity}
      />
    </Container>
  );
}; 