import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  ImageList, 
  ImageListItem, 
  Button,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { PictureService } from '../../services/picture.service';
import { Picture } from '../../types';
import { PictureUpload } from '../common/PictureUpload';
import { useLanguage } from '../../context/LanguageContext';

interface EventPicturesProps {
  eventId: number;
}

export const EventPictures: React.FC<EventPicturesProps> = ({ eventId }) => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { translations } = useLanguage();

  useEffect(() => {
    loadPictures();
  }, [eventId]);

  const loadPictures = async () => {
    try {
      setLoading(true);
      const eventPictures = await PictureService.getPictures('event', eventId);
      setPictures(eventPictures);
    } catch (error) {
      console.error('Error loading event pictures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = async (file: File) => {
    try {
      setLoadingUpload(true);
      const picture = await PictureService.uploadEventPicture(eventId, file);
      setPictures(prev => [...prev, picture]);
      setSuccessMessage(translations.pictureUpload.uploadSuccess);
    } catch (error) {
      setErrorMessage(translations.pictureUpload.uploadError);
      console.error('Error uploading picture:', error);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDeletePicture = async (picture: Picture) => {
    try {
      await PictureService.deletePicture('event', eventId, picture.id);
      setPictures(prev => prev.filter(p => p.id !== picture.id));
      if (selectedPicture?.id === picture.id) {
        setSelectedPicture(null);
      }
      setSuccessMessage(translations.pictureUpload.deleteSuccess);
    } catch (error) {
      setErrorMessage(translations.pictureUpload.deleteError);
      console.error('Error deleting picture:', error);
    }
  };

  const handlePictureClick = (picture: Picture) => {
    setSelectedPicture(picture);
  };

  const handleCloseDialog = () => {
    setSelectedPicture(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {translations.pictureUpload.eventPictures}
      </Typography>

      <Box sx={{ mb: 3, maxWidth: '500px' }}>
        <PictureUpload 
          onUpload={handlePictureUpload}
          buttonText={translations.pictureUpload.upload}
          variant="contained"
        />
      </Box>

      {pictures.length > 0 ? (
        <ImageList cols={3} gap={8}>
          {pictures.map((picture) => (
            <ImageListItem 
              key={picture.id} 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                '&:hover .picture-actions': {
                  opacity: 1,
                },
              }}
              onClick={() => handlePictureClick(picture)}
            >
              <img
                src={picture.image_url}
                alt="Event"
                loading="lazy"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Box 
                className="picture-actions"
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0, 
                  p: 0.5, 
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  bgcolor: 'rgba(0,0,0,0.5)',
                }}
              >
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePicture(picture);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Nenhuma imagem disponível
        </Typography>
      )}

      <Dialog 
        open={!!selectedPicture} 
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        {selectedPicture && (
          <DialogContent sx={{ p: 1, position: 'relative' }}>
            <IconButton
              onClick={handleCloseDialog}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={selectedPicture.image_url}
              alt="Event"
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </DialogContent>
        )}
      </Dialog>
    </Paper>
  );
}; 