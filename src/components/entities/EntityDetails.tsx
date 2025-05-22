import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { EntityDuplicateDialog } from './EntityDuplicateDialog';
import { duplicateEntity } from '../../services/api';
import { translations } from '../../translations/pt';
import { EntityType as Entity } from '../../types';

export const EntityDetails: React.FC = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDuplicate = async () => {
    if (!entityId) return;
    try {
      const duplicatedEntity = await duplicateEntity(parseInt(entityId));
      navigate(`/entities/${duplicatedEntity.id}`);
    } catch (err) {
      console.error('Error duplicating entity:', err);
    }
  };

  if (!entity) return null;

  return (
    <Container sx={{ py: 4, width: '100%', maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {entity.name}
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setIsDuplicateDialogOpen(true)}
          >
            {translations.entities.duplicateTitle}
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsFormOpen(true)}
          >
            {translations.common.edit}
          </Button>
        </Box>
      </Box>

      <EntityDuplicateDialog
        open={isDuplicateDialogOpen}
        onClose={() => setIsDuplicateDialogOpen(false)}
        onConfirm={handleDuplicate}
        entity={entity}
      />
    </Container>
  );
}; 