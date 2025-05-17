import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography, 
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useHabits } from '../contexts/HabitsContext';
import EditHabitForm from './EditHabitForm';

function HabitList() {
  const { habits, deleteHabit } = useHabits();
  const [editingHabit, setEditingHabit] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  const handleEditClick = (habit) => {
    setEditingHabit(habit);
  };

  const handleEditClose = () => {
    setEditingHabit(null);
  };

  const handleDeleteClick = (habit) => {
    setHabitToDelete(habit);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
    }
    setDeleteConfirmOpen(false);
    setHabitToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setHabitToDelete(null);
  };

  if (habits.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ py: 4 }}>
        No habits added yet. Click the + button to add your first habit.
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Your Habits
      </Typography>
      <List>
        {habits.map((habit, index) => (
          <React.Fragment key={habit.id}>
            {index > 0 && <Divider component="li" />}
            <ListItem>
              <ListItemText 
                primary={habit.name} 
                secondary={
                  <>
                    <Chip 
                      size="small" 
                      label={habit.type === 'boolean' ? 'Yes/No' : 'Number'} 
                      color={habit.type === 'boolean' ? 'primary' : 'secondary'}
                      sx={{ mr: 1, mt: 0.5 }}
                    />
                    {habit.description}
                  </>
                } 
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(habit)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(habit)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      {editingHabit && (
        <EditHabitForm 
          open={Boolean(editingHabit)} 
          onClose={handleEditClose} 
          habit={editingHabit} 
        />
      )}

      <Dialog
        open={deleteConfirmOpen}
        onClose={cancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{habitToDelete?.name}"? This will also delete all tracking data for this habit.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HabitList;
