import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Button,
  Tooltip,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { EntityType as Entity } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { AuthService } from '../../services/auth.service';

const DEFAULT_LOGO = "/volun-logo.png";

interface EntityCardProps {
  entity: Entity;
  isAuthenticated: boolean;
  onCardClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  isAuthenticated,
  onCardClick,
  onEdit,
  onDelete
}) => {
  const theme = useTheme();
  const { translations } = useLanguage();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
        },
        position: 'relative',
        bgcolor: 'background.paper'
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 180,
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box 
          component="img"
          src={entity.logo || DEFAULT_LOGO}
          alt={entity.name}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = DEFAULT_LOGO;
          }}
          sx={{
            height: '70%',
            width: 'auto',
            maxWidth: '70%',
            objectFit: 'contain',
            objectPosition: 'center',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}
        />
        {isAuthenticated && entity.user_id === AuthService.getCurrentUser()?.id && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              display: 'flex',
              gap: 1
            }}
          >
            <Tooltip title={translations.common.edit}>
              <IconButton 
                size="small" 
                onClick={onEdit}
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={translations.common.delete}>
              <IconButton 
                size="small" 
                onClick={onDelete}
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardMedia>
      
      <CardContent sx={{ flexGrow: 1, pt: 3, px: 3, pb: 2 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          fontWeight="bold"
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {entity.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            minHeight: '4.5em'
          }}
        >
          {entity.description}
        </Typography>
      </CardContent>
      
      <Divider />
      
      <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="text"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={onCardClick}
          sx={{ 
            fontWeight: 'medium',
            transition: 'all 0.2s',
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.1),
              transform: 'translateX(4px)'
            }
          }}
        >
          {translations.common.viewDetails}
        </Button>
      </Box>
    </Card>
  );
}; 