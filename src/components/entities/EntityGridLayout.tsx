import React from 'react';
import { Box, Grow } from '@mui/material';
import { EntityType as Entity } from '../../types';

interface EntityGridLayoutProps {
  entities: Entity[];
  renderEntity: (entity: Entity, index: number) => React.ReactNode;
}

export const EntityGridLayout: React.FC<EntityGridLayoutProps> = ({
  entities,
  renderEntity
}) => {
  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)', 
          lg: 'repeat(4, 1fr)' 
        }, 
        gap: 3,
        mb: 4
      }}
    >
      {entities.map((entity, index) => (
        <Grow
          key={entity.id}
          in={true}
          timeout={(index + 1) * 100}
        >
          <div>
            {renderEntity(entity, index)}
          </div>
        </Grow>
      ))}
    </Box>
  );
}; 