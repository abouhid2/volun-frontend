import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { translations } from '../../translations/pt';
import {
  getEntity,
  getInventory,
  getInventoryTransactions,
  addStock,
  consumeStock,
  updateInventory,
  getEvents
} from '../../services/api';
import { Inventory, InventoryTransaction, Event, InventoryFormValues, UseStockFormValues } from '../../types';

interface SimpleEntity {
  id: number;
  name: string;
}

export const InventoryDetails: React.FC = () => {
  const { entityId, inventoryId } = useParams<{ entityId: string; inventoryId: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<SimpleEntity | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUseDialogOpen, setIsUseDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [addFormValues, setAddFormValues] = useState({ quantity: 0, notes: '' });
  const [useFormValues, setUseFormValues] = useState<UseStockFormValues>({
    inventory_id: 0,
    event_id: undefined,
    quantity: 0,
    notes: ''
  });
  const [editFormValues, setEditFormValues] = useState<InventoryFormValues>({
    item_name: '',
    item_type: '',
    quantity: 0,
    unit: '',
    notes: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!entityId || !inventoryId) return;
      
      try {
        setLoading(true);
        const [entityData, inventoryData, transactionsData, eventsData] = await Promise.all([
          getEntity(parseInt(entityId)),
          getInventory(parseInt(entityId), parseInt(inventoryId)),
          getInventoryTransactions(parseInt(entityId), parseInt(inventoryId)),
          getEvents(parseInt(entityId))
        ]);
        
        setEntity({ id: entityData.id, name: entityData.name });
        setInventory(inventoryData);
        setTransactions(transactionsData);
        setEvents(eventsData);
        
        setEditFormValues({
          item_name: inventoryData.item_name,
          item_type: inventoryData.item_type,
          quantity: inventoryData.quantity,
          unit: inventoryData.unit,
          notes: inventoryData.notes || ''
        });
        
        setUseFormValues({
          inventory_id: inventoryData.id,
          event_id: undefined,
          quantity: 0,
          notes: ''
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entityId, inventoryId]);

  const handleOpenAddDialog = () => {
    setAddFormValues({ quantity: 0, notes: '' });
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleOpenUseDialog = () => {
    setUseFormValues({
      inventory_id: inventory?.id || 0,
      event_id: undefined,
      quantity: 0,
      notes: ''
    });
    setIsUseDialogOpen(true);
  };

  const handleCloseUseDialog = () => {
    setIsUseDialogOpen(false);
  };

  const handleOpenEditDialog = () => {
    if (inventory) {
      setEditFormValues({
        item_name: inventory.item_name,
        item_type: inventory.item_type,
        quantity: inventory.quantity,
        unit: inventory.unit,
        notes: inventory.notes || ''
      });
    }
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddFormValues({
      ...addFormValues,
      [name]: name === 'quantity' ? parseFloat(value) : value
    });
  };

  const handleUseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUseFormValues({
      ...useFormValues,
      [name]: name === 'quantity' ? parseFloat(value) : value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormValues({
      ...editFormValues,
      [name]: name === 'quantity' ? parseFloat(value) : value
    });
  };

  const handleAddStock = async () => {
    if (!entityId || !inventoryId || !inventory) return;
    
    try {
      const transaction = await addStock(
        parseInt(entityId),
        parseInt(inventoryId),
        addFormValues.quantity,
        addFormValues.notes
      );
      
      // Update inventory and transactions
      if (inventory) {
        setInventory({
          ...inventory,
          quantity: inventory.quantity + addFormValues.quantity
        });
      }
      setTransactions([transaction, ...transactions]);
      setIsAddDialogOpen(false);
      setSnackbar({
        open: true,
        message: translations.inventory.addSuccess,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error adding stock:', err);
      setSnackbar({
        open: true,
        message: translations.inventory.addError,
        severity: 'error'
      });
    }
  };

  const handleUseStock = async () => {
    if (!entityId || !inventory || useFormValues.quantity <= 0) return;
    
    // Check if there's enough stock
    if (inventory.quantity < useFormValues.quantity) {
      setSnackbar({
        open: true,
        message: translations.inventory.insufficientStock,
        severity: 'error'
      });
      return;
    }
    
    try {
      const transaction = await consumeStock(parseInt(entityId), useFormValues);
      
      // Update inventory and transactions
      if (inventory) {
        setInventory({
          ...inventory,
          quantity: inventory.quantity - useFormValues.quantity
        });
      }
      setTransactions([transaction, ...transactions]);
      setIsUseDialogOpen(false);
      setSnackbar({
        open: true,
        message: translations.inventory.useSuccess,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error using stock:', err);
      setSnackbar({
        open: true,
        message: translations.inventory.useError,
        severity: 'error'
      });
    }
  };

  const handleUpdateInventory = async () => {
    if (!entityId || !inventoryId) return;
    
    try {
      const updatedInventory = await updateInventory(
        parseInt(entityId),
        parseInt(inventoryId),
        editFormValues
      );
      
      setInventory(updatedInventory);
      setIsEditDialogOpen(false);
      setSnackbar({
        open: true,
        message: translations.inventory.updateSuccess,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating inventory:', err);
      setSnackbar({
        open: true,
        message: translations.inventory.updateError,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !entity || !inventory) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          {translations.common.tryAgain}
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(`/entities/${entityId}/inventory`)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {inventory.item_name}
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpenEditDialog}
          >
            {translations.common.edit}
          </Button>
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 3,
          mb: 4 
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translations.inventory.itemType}
            </Typography>
            <Typography variant="body1">
              {translations.donations.types[inventory.item_type as keyof typeof translations.donations.types] || inventory.item_type}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {translations.inventory.notes}
            </Typography>
            <Typography variant="body1">
              {inventory.notes || '-'}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translations.inventory.quantity}
            </Typography>
            <Typography variant="h4" color="primary">
              {inventory.quantity} {translations.donations.units[inventory.unit as keyof typeof translations.donations.units] || inventory.unit}
            </Typography>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
                color="success"
              >
                {translations.inventory.transactionTypes.addition}
              </Button>
              <Button
                variant="contained"
                startIcon={<RemoveIcon />}
                onClick={handleOpenUseDialog}
                color="error"
                disabled={inventory.quantity <= 0}
              >
                {translations.inventory.transactionTypes.deduction}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        {translations.inventory.transactionHistory}
      </Typography>

      {transactions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>
            {translations.inventory.noTransactions}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{translations.inventory.transactionType}</TableCell>
                <TableCell align="right">{translations.inventory.quantity}</TableCell>
                <TableCell>{translations.inventory.notes}</TableCell>
                <TableCell>{translations.inventory.usedBy}</TableCell>
                <TableCell>{translations.inventory.usedOn}</TableCell>
                <TableCell>{translations.common.edit}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Chip
                      label={translations.inventory.transactionTypes[transaction.transaction_type as keyof typeof translations.inventory.transactionTypes]}
                      color={transaction.transaction_type === 'addition' ? 'success' : transaction.transaction_type === 'deduction' ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{transaction.quantity}</TableCell>
                  <TableCell>{transaction.notes || '-'}</TableCell>
                  <TableCell>
                    {transaction.user?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {transaction.event ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon fontSize="small" sx={{ mr: 1 }} />
                        {transaction.event.title}
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(transaction.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Stock Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{translations.inventory.transactionTypes.addition}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="quantity"
              label={translations.inventory.quantity}
              name="quantity"
              type="number"
              value={addFormValues.quantity}
              onChange={handleAddInputChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              label={translations.inventory.notes}
              name="notes"
              multiline
              rows={3}
              value={addFormValues.notes}
              onChange={handleAddInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>{translations.common.cancel}</Button>
          <Button 
            onClick={handleAddStock} 
            variant="contained"
            disabled={addFormValues.quantity <= 0}
          >
            {translations.common.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Use Stock Dialog */}
      <Dialog open={isUseDialogOpen} onClose={handleCloseUseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{translations.inventory.transactionTypes.deduction}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="quantity"
              label={translations.inventory.quantity}
              name="quantity"
              type="number"
              value={useFormValues.quantity}
              onChange={handleUseInputChange}
              inputProps={{ min: 0, max: inventory.quantity, step: 0.01 }}
              helperText={`${translations.inventory.available}: ${inventory.quantity}`}
            />
            <TextField
              margin="normal"
              fullWidth
              select
              id="event_id"
              label={translations.inventory.eventSelection}
              name="event_id"
              value={useFormValues.event_id || ''}
              onChange={handleUseInputChange}
            >
              <MenuItem value="">{translations.inventory.noEvent}</MenuItem>
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              label={translations.inventory.notes}
              name="notes"
              multiline
              rows={3}
              value={useFormValues.notes}
              onChange={handleUseInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUseDialog}>{translations.common.cancel}</Button>
          <Button 
            onClick={handleUseStock} 
            variant="contained"
            disabled={useFormValues.quantity <= 0 || useFormValues.quantity > inventory.quantity}
          >
            {translations.inventory.confirmUseStock}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Inventory Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{translations.inventory.editItem}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="item_name"
              label={translations.inventory.itemName}
              name="item_name"
              value={editFormValues.item_name}
              onChange={handleEditInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="item_type"
              label={translations.inventory.itemType}
              name="item_type"
              select
              value={editFormValues.item_type}
              onChange={handleEditInputChange}
            >
              {Object.entries(translations.donations.types).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              id="unit"
              label={translations.inventory.unit}
              name="unit"
              select
              value={editFormValues.unit}
              onChange={handleEditInputChange}
            >
              {Object.entries(translations.donations.units).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              label={translations.inventory.notes}
              name="notes"
              multiline
              rows={3}
              value={editFormValues.notes}
              onChange={handleEditInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>{translations.common.cancel}</Button>
          <Button onClick={handleUpdateInventory} variant="contained">
            {translations.common.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 