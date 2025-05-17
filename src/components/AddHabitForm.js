import React, { useState } from 'react';
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

function AddHabitForm({ open, onClose }) {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('boolean');
  const [nameError, setNameError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setNameError('Habit name is required');
      return;
    }

    // Create new habit
    addHabit({
      name: name.trim(),
      description: description.trim(),
      type
    });

    // Reset form and close
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('boolean');
    setNameError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Habit</DialogTitle>
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
          <Button type="submit" variant="contained" color="primary">Add Habit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddHabitForm;
