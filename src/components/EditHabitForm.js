import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from '@mui/material';
import { useHabits } from '../contexts/HabitsContext';

function EditHabitForm({ open, onClose, habit }) {
  const { updateHabit } = useHabits();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('boolean');
  const [nameError, setNameError] = useState('');

  // Set initial values when habit changes
  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setDescription(habit.description || '');
      setType(habit.type || 'boolean');
    }
  }, [habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setNameError('Habit name is required');
      return;
    }

    // Update habit
    updateHabit(habit.id, {
      name: name.trim(),
      description: description.trim(),
      type
    });

    // Reset form and close
    onClose();
  };

  const handleClose = () => {
    setNameError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Habit</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Habit Name"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setNameError('');
            }}
            error={!!nameError}
            helperText={nameError}
            required
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
          />
          <Box mt={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Tracking Type</FormLabel>
              <RadioGroup
                row
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <FormControlLabel 
                  value="boolean" 
                  control={<Radio />} 
                  label="Yes/No" 
                />
                <FormControlLabel 
                  value="number" 
                  control={<Radio />} 
                  label="Number" 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditHabitForm;
