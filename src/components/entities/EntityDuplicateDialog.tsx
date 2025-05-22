import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { EntityType as Entity } from '../../types';
import { translations } from '../../translations/pt';

interface EntityDuplicateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entity: Entity;
}

export const EntityDuplicateDialog: React.FC<EntityDuplicateDialogProps> = ({
  open,
  onClose,
  onConfirm,
  entity,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{translations.entities.duplicateTitle}</DialogTitle>
      <DialogContent>
        <Typography>
          {translations.entities.duplicateConfirmation}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translations.common.cancel}</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          {translations.common.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 