import React from 'react';
import { Fab, useTheme, SxProps, Theme } from '@mui/material';

interface MobileActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  sx?: SxProps<Theme>;
}

export const MobileActionButton: React.FC<MobileActionButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <Fab 
      color="primary" 
      aria-label={ariaLabel}
      onClick={onClick}
      sx={{ 
        position: 'fixed', 
        bottom: 16, 
        right: 16,
        zIndex: 1000,
        boxShadow: theme.shadows[8],
        ...sx
      }}
    >
      {icon}
    </Fab>
  );
}; 