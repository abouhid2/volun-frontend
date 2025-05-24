import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  alpha,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon, 
  Business as BusinessIcon 
} from '@mui/icons-material';
import { useLanguage } from '../../context/LanguageContext';

interface EntityListHeaderProps {
  entitiesCount: number;
  isMobile: boolean;
  onCreateClick: () => void;
}

export const EntityListHeader: React.FC<EntityListHeaderProps> = ({
  entitiesCount,
  isMobile,
  onCreateClick
}) => {
  const theme = useTheme();
  const { translations } = useLanguage();

  return (
    <Box 
      component={Paper} 
      elevation={0}
      sx={{ 
        p: { xs: 2, md: 4 }, 
        mb: 4, 
        borderRadius: 2,
        background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.paper, 0.8)})`,
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <BusinessIcon fontSize="large" color="primary" />
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {translations.organizations.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {entitiesCount} {entitiesCount === 1 ? 'organização encontrada' : 'organizações encontradas'}
          </Typography>
        </Box>
      </Box>
      
      {!isMobile && (
        <Button 
          variant="contained" 
          onClick={onCreateClick}
          startIcon={<AddIcon />}
          size="large"
          sx={{ 
            borderRadius: 8,
            px: 3,
            py: 1,
            boxShadow: theme.shadows[4],
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[8]
            }
          }}
        >
          {translations.organizations.createButton}
        </Button>
      )}
    </Box>
  );
}; 