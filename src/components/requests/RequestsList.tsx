import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  useTheme,
  alpha
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Request, RequestFormValues } from '../../types';
import { getRequests, createRequest, updateRequest, deleteRequest, approveRequest, rejectRequest } from '../../services/api';
import { translations } from '../../translations/pt';
import { RequestForm } from './RequestForm';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';

export const RequestsList: React.FC = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const theme = useTheme();
  
  useEffect(() => {
    fetchRequests();
  }, [entityId]);
  
  const fetchRequests = async () => {
    if (!entityId) return;
    
    try {
      setLoading(true);
      // Note: This is just a placeholder. You'll need to create an API endpoint to get all requests for an entity
      // For now, we'll assume the API returns all requests
      const data = await getRequests(parseInt(entityId));
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddRequest = async (requestData: RequestFormValues) => {
    if (!entityId) return;
    try {
      // Note: This is just a placeholder. You'll need to create an API endpoint to create requests for an entity
      const newRequest = await createRequest(parseInt(entityId), requestData);
      setRequests([newRequest, ...requests]);
      setIsRequestFormOpen(false);
    } catch (err) {
      console.error('Error adding request:', err);
    }
  };
  
  const handleUpdateRequest = async (requestId: number, requestData: RequestFormValues) => {
    if (!entityId) return;
    try {
      // Note: This is just a placeholder. You'll need to create an API endpoint to update requests
      const updatedRequest = await updateRequest(parseInt(entityId), requestId, requestData);
      setRequests(requests.map(request => 
        request.id === requestId ? updatedRequest : request
      ));
      setIsRequestFormOpen(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };
  
  const handleDeleteRequest = async (requestId: number) => {
    if (!entityId) return;
    
    if (window.confirm(translations.common.confirmDelete)) {
      try {
        // Note: This is just a placeholder. You'll need to create an API endpoint to delete requests
        await deleteRequest(parseInt(entityId), requestId);
        setRequests(requests.filter(request => request.id !== requestId));
      } catch (err) {
        console.error('Error deleting request:', err);
      }
    }
  };
  
  const handleApproveRequest = async (requestId: number) => {
    if (!entityId) return;
    try {
      // Note: This is just a placeholder. You'll need to create an API endpoint to approve requests
      const approvedRequest = await approveRequest(parseInt(entityId), requestId);
      setRequests(requests.map(request => 
        request.id === requestId ? approvedRequest : request
      ));
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };
  
  const handleRejectRequest = async (requestId: number) => {
    if (!entityId) return;
    try {
      // Note: This is just a placeholder. You'll need to create an API endpoint to reject requests
      const rejectedRequest = await rejectRequest(parseInt(entityId), requestId);
      setRequests(requests.map(request => 
        request.id === requestId ? rejectedRequest : request
      ));
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.item_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.notes && request.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filterStatus === 'all' || 
      request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  if (loading) return <LoadingState message={translations.common.loading} />;
  if (error) return <ErrorState message={error} onRetry={fetchRequests} />;
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(`/entities/${entityId}`)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {translations.requests.title}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, maxWidth: '500px' }}>
          <TextField
            placeholder={translations.common.search}
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{translations.common.filter}</InputLabel>
            <Select
              value={filterStatus}
              label={translations.common.filter}
              onChange={(e) => setFilterStatus(e.target.value as string)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="all">{translations.common.all}</MenuItem>
              <MenuItem value="pending">{translations.requests.status.pending}</MenuItem>
              <MenuItem value="approved">{translations.requests.status.approved}</MenuItem>
              <MenuItem value="rejected">{translations.requests.status.rejected}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedRequest(null);
            setIsRequestFormOpen(true);
          }}
        >
          {translations.requests.addButton}
        </Button>
      </Box>
      
      {filteredRequests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">{translations.requests.noRequests}</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{translations.requests.itemName}</TableCell>
                <TableCell>{translations.requests.itemType}</TableCell>
                <TableCell>{translations.requests.quantity}</TableCell>
                <TableCell>{translations.requests.status.title}</TableCell>
                <TableCell>{translations.requests.requestedBy}</TableCell>
                <TableCell>{translations.requests.requestedOn}</TableCell>
                <TableCell align="right">{translations.common.actions}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.item_name}</TableCell>
                  <TableCell>{request.item_type}</TableCell>
                  <TableCell>
                    {request.quantity} {translations.donations.units[request.unit as keyof typeof translations.donations.units]}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={translations.requests.status[request.status as keyof typeof translations.requests.status]}
                      color={getStatusColor(request.status)}
                    />
                  </TableCell>
                  <TableCell>{request.user?.name || translations.common.anonymous}</TableCell>
                  <TableCell>
                    {format(new Date(request.requested_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {request.status === 'pending' && (
                        <>
                          <Tooltip title={translations.requests.approve}>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={translations.requests.reject}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title={translations.common.edit}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsRequestFormOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={translations.common.delete}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <RequestForm
        open={isRequestFormOpen}
        onClose={() => {
          setIsRequestFormOpen(false);
          setSelectedRequest(null);
        }}
        onSubmit={(requestData) => {
          if (selectedRequest) {
            handleUpdateRequest(selectedRequest.id, requestData);
          } else {
            handleAddRequest(requestData);
          }
        }}
        selectedRequest={selectedRequest || undefined}
      />
    </Container>
  );
}; 