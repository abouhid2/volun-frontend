import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { translations } from '../../translations/pt';
import { getEntity, getInventories, createInventory, deleteInventory } from '../../services/api';
import { Inventory, InventoryFormValues } from '../../types';

interface SimpleEntity {
  id: number;
  name: string;
}

export const InventoryList: React.FC = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<SimpleEntity | null>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [formValues, setFormValues] = useState<InventoryFormValues>({
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
      if (!entityId) return;
      
      try {
        setLoading(true);
        const [entityData, inventoriesData] = await Promise.all([
          getEntity(parseInt(entityId)),
          getInventories(parseInt(entityId))
        ]);
        
        setEntity({ id: entityData.id, name: entityData.name });
        setInventories(inventoriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entityId]);

  const handleOpenDialog = () => {
    setFormValues({
      item_name: '',
      item_type: '',
      quantity: 0,
      unit: '',
      notes: ''
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedInventory(null);
    setIsDeleteDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === 'quantity' ? parseFloat(value) : value
    });
  };

  const handleCreateInventory = async () => {
    if (!entityId) return;
    
    try {
      const newInventory = await createInventory(parseInt(entityId), formValues);
      setInventories([...inventories, newInventory]);
      setIsDialogOpen(false);
      setSnackbar({
        open: true,
        message: translations.inventory.addSuccess,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error creating inventory item:', err);
      setSnackbar({
        open: true,
        message: translations.inventory.addError,
        severity: 'error'
      });
    }
  };

  const handleDeleteInventory = async () => {
    if (!entityId || !selectedInventory) return;
    
    try {
      await deleteInventory(parseInt(entityId), selectedInventory.id);
      setInventories(inventories.filter(inv => inv.id !== selectedInventory.id));
      setIsDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: translations.inventory.deleteSuccess,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      setSnackbar({
        open: true,
        message: translations.inventory.deleteError,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !entity) {
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
        <IconButton onClick={() => navigate(`/entities/${entityId}`)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {translations.inventory.title} - {entity.name}
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          {translations.inventory.addItem}
        </Button>
      </Box>

      {inventories.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {translations.inventory.noItems}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            {translations.inventory.addItem}
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{translations.inventory.itemName}</TableCell>
                <TableCell>{translations.inventory.itemType}</TableCell>
                <TableCell align="right">{translations.inventory.quantity}</TableCell>
                <TableCell>{translations.inventory.unit}</TableCell>
                <TableCell>{translations.inventory.notes}</TableCell>
                <TableCell align="center">{translations.common.edit}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventories.map((inventory) => (
                <TableRow key={inventory.id}>
                  <TableCell>{inventory.item_name}</TableCell>
                  <TableCell>{inventory.item_type}</TableCell>
                  <TableCell align="right">{inventory.quantity}</TableCell>
                  <TableCell>{inventory.unit}</TableCell>
                  <TableCell>{inventory.notes || '-'}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => navigate(`/entities/${entityId}/inventory/${inventory.id}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="secondary"
                        onClick={() => handleOpenDeleteDialog(inventory)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Inventory Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{translations.inventory.addItem}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="item_name"
              label={translations.inventory.itemName}
              name="item_name"
              value={formValues.item_name}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="item_type"
              label={translations.inventory.itemType}
              name="item_type"
              select
              value={formValues.item_type}
              onChange={handleInputChange}
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
              id="quantity"
              label={translations.inventory.quantity}
              name="quantity"
              type="number"
              value={formValues.quantity}
              onChange={handleInputChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="unit"
              label={translations.inventory.unit}
              name="unit"
              select
              value={formValues.unit}
              onChange={handleInputChange}
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
              value={formValues.notes}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{translations.common.cancel}</Button>
          <Button onClick={handleCreateInventory} variant="contained">
            {translations.common.create}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{translations.common.confirmDelete}</DialogTitle>
        <DialogContent>
          <Typography>
            {`${translations.common.confirmDelete} ${selectedInventory?.item_name}`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>{translations.common.cancel}</Button>
          <Button onClick={handleDeleteInventory} color="error">
            {translations.common.delete}
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

      {/* Floating Action Button for adding inventory */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}; 