import React, { useState, useRef } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useLanguage } from '../../context/LanguageContext';

interface PictureUploadProps {
  onUpload: (file: File) => Promise<void>;
  buttonText?: string;
  variant?: 'text' | 'outlined' | 'contained';
}

export const PictureUpload: React.FC<PictureUploadProps> = ({
  onUpload,
  buttonText,
  variant = 'contained'
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { translations } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        setError(translations.pictureUpload.invalidFileType);
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(translations.pictureUpload.noFileSelected);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(translations.pictureUpload.uploadError);
      console.error('Error uploading picture:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleBrowseClick}
          disabled={loading}
        >
          {translations.pictureUpload.browse}
        </Button>
        
        {selectedFile && (
          <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedFile.name}
          </Typography>
        )}
      </Box>
      
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      
      <Button
        variant={variant}
        color="primary"
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
      >
        {buttonText || translations.pictureUpload.upload}
      </Button>
    </Box>
  );
}; 