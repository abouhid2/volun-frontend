import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Button,
  Tooltip,
  TextField,
  alpha,
  useTheme,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Request, RequestFormValues } from '../../types';
import { translations } from '../../translations/pt';
import { RequestForm } from './RequestForm';
import { useAuth } from '../../hooks/useAuth';

interface RequestsBoxProps {
  entityId: number;
  requests: Request[];
  onAddRequest: (request: RequestFormValues) => void;
  onUpdateRequest: (requestId: number, request: RequestFormValues) => void;
  onDeleteRequest: (requestId: number) => void;
  onApproveRequest: (requestId: number) => void;
  onRejectRequest: (requestId: number) => void;
}

export const RequestsBox: React.FC<RequestsBoxProps> = ({
  entityId,
  requests,
  onAddRequest,
  onUpdateRequest,
  onDeleteRequest,
  onApproveRequest,
  onRejectRequest
}) => {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const theme = useTheme();

  const handleEditRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsRequestFormOpen(true);
  };

  const handleSubmitRequest = (requestData: RequestFormValues) => {
    if (selectedRequest) {
      onUpdateRequest(selectedRequest.id, requestData);
    } else {
      onAddRequest(requestData);
    }
    setIsRequestFormOpen(false);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = (request: Request) => {
    if (window.confirm(translations.common.confirmDelete)) {
      onDeleteRequest(request.id);
    }
  };

  const handleFulfillToggle = (requestId: number, fulfilled: boolean) => {
    if (!fulfilled) {
      onApproveRequest(requestId);
    }
  };

  const filteredRequests = requests.filter(request =>
    request.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.item_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (request.notes && request.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder={`${translations.common.search}...`}
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '250px' }}
        />
        <Tooltip title={translations.requests.addButton}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setSelectedRequest(null);
              setIsRequestFormOpen(true);
            }}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {filteredRequests.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
          <Typography>{translations.requests.noRequests}</Typography>
        </Box>
      ) : (
        <List>
          {filteredRequests.map((request) => (
            <ListItem
              key={request.id}
              sx={{
                py: 1.5,
                px: 1.5,
                mb: 1,
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'block'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title={translations.requests.fulfilled}>
                    <Checkbox
                      checked={request.fulfilled}
                      onChange={() => handleFulfillToggle(request.id, request.fulfilled)}
                      color="success"
                    />
                  </Tooltip>
                  <Typography variant="body1" fontWeight={500}>
                    {request.item_name} 
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title={translations.common.edit}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditRequest(request)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={translations.common.delete}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteRequest(request)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {request.quantity} {translations.donations.units[request.unit as keyof typeof translations.donations.units]} - {request.item_type}
              </Typography>
              {request.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {request.notes}
                </Typography>
              )}
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                {translations.requests.requestedBy}: {request.requested_by || translations.common.anonymous} • {translations.requests.requestedOn}: {format(new Date(request.requested_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}

      <RequestForm
        open={isRequestFormOpen}
        onClose={() => {
          setIsRequestFormOpen(false);
          setSelectedRequest(null);
        }}
        onSubmit={handleSubmitRequest}
        selectedRequest={selectedRequest || undefined}
      />
    </Box>
  );
}; 