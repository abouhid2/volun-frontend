import React from 'react';
import { styled } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
}

const LogoContainer = styled('img', {
  shouldForwardProp: (prop) => prop !== 'size'
})<{ size: 'small' | 'medium' | 'large' }>(({ theme, size }) => {
  const sizes = {
    small: {
      width: '40px',
      height: '40px',
    },
    medium: {
      width: '80px',
      height: '80px',
    },
    large: {
      width: '120px',
      height: '120px',
    }
  };
  
  return {
    ...sizes[size],
  };
});

export const Logo: React.FC<LogoProps> = ({ size = 'medium', sx }) => {
  const { translations } = useLanguage();
  
  return (
    <LogoContainer 
      src="/volun-logo.png" 
      alt={translations.home.title}
      size={size}
      sx={sx}
    />
  );
}; 