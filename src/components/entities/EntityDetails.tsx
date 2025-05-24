import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, IconButton, Paper, CardMedia } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { EntityDuplicateDialog } from './EntityDuplicateDialog';
import { duplicateEntity, getEntity } from '../../services/api';
import { translations } from '../../translations/pt';
import { EntityType as Entity } from '../../types';
import { PictureUpload } from '../common/PictureUpload';
import { PictureService } from '../../services/picture.service';
import { Picture } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const EntityDetails: React.FC = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [coverPicture, setCoverPicture] = useState<Picture | null>(null);
  const [loadingPicture, setLoadingPicture] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { translations } = useLanguage();

  useEffect(() => {
    const loadEntity = async () => {
      if (!entityId) return;
      try {
        const entityData = await getEntity(parseInt(entityId));
        setEntity(entityData as Entity);
        
        // Load entity pictures
        try {
          const pictures = await PictureService.getPictures('entity', parseInt(entityId));
          if (pictures && pictures.length > 0) {
            setCoverPicture(pictures[0]);
          }
        } catch (error) {
          console.error('Error loading entity pictures:', error);
        }
      } catch (error) {
        console.error('Error loading entity:', error);
      }
    };
    
    loadEntity();
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
  
  const handleCoverPictureUpload = async (file: File) => {
    if (!entityId) return;
    
    try {
      setLoadingPicture(true);
      const picture = await PictureService.uploadEntityCoverPicture(parseInt(entityId), file);
      setCoverPicture(picture);
      setSuccessMessage(translations.pictureUpload.uploadSuccess);
    } catch (error) {
      setErrorMessage(translations.pictureUpload.uploadError);
      console.error('Error uploading cover picture:', error);
    } finally {
      setLoadingPicture(false);
    }
  };
  
  const handleDeleteCoverPicture = async () => {
    if (!entityId || !coverPicture) return;
    
    try {
      setLoadingPicture(true);
      await PictureService.deletePicture('entity', parseInt(entityId), coverPicture.id);
      setCoverPicture(null);
      setSuccessMessage(translations.pictureUpload.deleteSuccess);
    } catch (error) {
      setErrorMessage(translations.pictureUpload.deleteError);
      console.error('Error deleting cover picture:', error);
    } finally {
      setLoadingPicture(false);
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

      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        {coverPicture ? (
          <CardMedia
            component="img"
            height="300"
            image={coverPicture.image_url}
            alt={entity.name}
          />
        ) : (
          <Box 
            sx={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#f5f5f5'
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {translations.pictureUpload.coverPicture}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {translations.pictureUpload.coverPicture}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '500px' }}>
            <PictureUpload 
              onUpload={handleCoverPictureUpload}
              buttonText={translations.pictureUpload.upload}
            />
            
            {coverPicture && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDeleteCoverPicture}
                disabled={loadingPicture}
              >
                {translations.common.delete}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <EntityDuplicateDialog
        open={isDuplicateDialogOpen}
        onClose={() => setIsDuplicateDialogOpen(false)}
        onConfirm={handleDuplicate}
        entity={entity}
      />
    </Container>
  );
}; 