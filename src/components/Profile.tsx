import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  Snackbar,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { AuthService, UpdateProfileData } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { useLanguage } from '../context/LanguageContext';
import { PictureUpload } from './common/PictureUpload';
import { PictureService } from '../services/picture.service';
import { Picture } from '../types';

export const Profile: React.FC = () => {
  const { translations } = useLanguage();
  const currentUser = AuthService.getCurrentUser();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    telephone: currentUser?.telephone || '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState<Picture | null>(null);
  const [loadingPicture, setLoadingPicture] = useState(false);

  useEffect(() => {
    const loadUserDetails = async () => {
      if (currentUser?.id) {
        try {
          setLoadingProfile(true);
          const userDetails = await UserService.getById(currentUser.id);
          setFormData(prev => ({
            ...prev,
            name: userDetails.name || prev.name,
            email: userDetails.email || prev.email,
            telephone: userDetails.telephone || prev.telephone
          }));
          
          // Load user pictures
          try {
            const pictures = await PictureService.getPictures('user', currentUser.id);
            if (pictures && pictures.length > 0) {
              setProfilePicture(pictures[0]);
            }
          } catch (error) {
            console.error('Error loading user pictures:', error);
          }
        } catch (error) {
          console.error('Error loading user details:', error);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setLoadingProfile(false);
      }
    };

    loadUserDetails();
  }, [currentUser?.id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const updateData: UpdateProfileData = {
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone
      };
      
      await AuthService.updateProfile(updateData);
      setSuccessMessage(translations.profile.updateSuccess);
    } catch (error) {
      setErrorMessage(translations.profile.updateError);
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      setErrorMessage(translations.profile.passwordsDoNotMatch);
      return;
    }
    
    try {
      setLoading(true);
      const updateData: UpdateProfileData = {
        current_password: formData.current_password,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };
      
      await AuthService.updateProfile(updateData);
      setSuccessMessage(translations.profile.updateSuccess);
      setFormData(prev => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: ''
      }));
    } catch (error) {
      setErrorMessage(translations.profile.updateError);
      console.error('Update password error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfilePictureUpload = async (file: File) => {
    if (!currentUser?.id) return;
    
    try {
      setLoadingPicture(true);
      const picture = await PictureService.uploadUserProfilePicture(currentUser.id, file);
      setProfilePicture(picture);
      setSuccessMessage(translations.pictureUpload.uploadSuccess);
    } catch (error) {
      setErrorMessage(translations.pictureUpload.uploadError);
      console.error('Error uploading profile picture:', error);
    } finally {
      setLoadingPicture(false);
    }
  };
  
  const handleDeleteProfilePicture = async () => {
    if (!currentUser?.id || !profilePicture) return;
    
    try {
      setLoadingPicture(true);
      await PictureService.deletePicture('user', currentUser.id, profilePicture.id);
      setProfilePicture(null);
      setSuccessMessage(translations.pictureUpload.deleteSuccess);
    } catch (error) {
      setErrorMessage(translations.pictureUpload.deleteError);
      console.error('Error deleting profile picture:', error);
    } finally {
      setLoadingPicture(false);
    }
  };
  
  const handleCloseAlert = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  if (!currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">
          {translations.events.unauthorized}
        </Typography>
      </Box>
    );
  }

  if (loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {translations.profile.title}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {translations.pictureUpload.profilePicture}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3, alignItems: 'center' }}>
          <Avatar 
            src={profilePicture?.image_url} 
            alt={formData.name}
            sx={{ width: 120, height: 120 }}
          />
          
          <Box sx={{ flex: 1 }}>
            <PictureUpload 
              onUpload={handleProfilePictureUpload}
              buttonText={translations.pictureUpload.upload}
            />
            
            {profilePicture && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDeleteProfilePicture}
                disabled={loadingPicture}
                sx={{ mt: 1 }}
              >
                {translations.common.delete}
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          {translations.profile.editProfile}
        </Typography>
        
        <form onSubmit={handleBasicInfoSubmit}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              label={translations.profile.nameLabel}
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={translations.profile.emailLabel}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label={translations.profile.telephoneLabel}
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              margin="normal"
              autoComplete="tel"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {translations.profile.saveChanges}
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {translations.profile.changePassword}
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <form onSubmit={handlePasswordSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label={translations.profile.currentPasswordLabel}
              name="current_password"
              type="password"
              value={formData.current_password}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              label={translations.profile.newPasswordLabel}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={translations.profile.confirmPasswordLabel}
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {translations.profile.saveChanges}
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={successMessage ? "success" : "error"}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 