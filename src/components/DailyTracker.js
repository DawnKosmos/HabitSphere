import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Divider,
  Box,
  IconButton,
  Switch,
  TextField,
  Paper,
  Button,
  FormControlLabel,
  Checkbox,
  Chip
} from '@mui/material';
import { format, addDays, subDays, isToday, isFuture } from 'date-fns';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TodayIcon from '@mui/icons-material/Today';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useHabits } from '../contexts/HabitsContext';
import HabitStreak from './HabitStreak';

function DailyTracker() {
  const { habits, trackHabit, getHabitEntry, getDayEntries } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };
  
  const handleNextDay = () => {
    // Don't allow tracking future days
    if (!isFuture(addDays(selectedDate, 1))) {
      setSelectedDate(prev => addDays(prev, 1));
    }
  };
  
  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };
  
  const handleBooleanToggle = (habitId, currentValue) => {
    // Toggle between true, false, and null (not set)
    let newValue;
    if (currentValue === true) {
      newValue = false;
    } else if (currentValue === false) {
      newValue = null;
    } else {
      newValue = true;
    }
    trackHabit(habitId, newValue, selectedDate);
  };
  
  const handleNumberChange = (habitId, value) => {
    const numValue = value === '' ? null : Number(value);
    trackHabit(habitId, numValue, selectedDate);
  };
  
  const dayEntries = getDayEntries(selectedDate);
  const isSelectedDateToday = isToday(selectedDate);
  const isFutureDate = isFuture(selectedDate);
  
  if (habits.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ py: 4 }}>
        No habits added yet. Click the + button to add your first habit.
      </Typography>
    );
  }
  
  // Helper function to render the status of a boolean habit
  const renderBooleanStatus = (value) => {
    if (value === true) {
      return (
        <Chip 
          icon={<CheckCircleIcon />} 
          label="Yes" 
          color="success" 
          size="small" 
          variant="outlined"
          sx={{ minWidth: '80px' }}
        />
      );
    } else if (value === false) {
      return (
        <Chip 
          icon={<CancelIcon />} 
          label="No" 
          color="error" 
          size="small" 
          variant="outlined"
          sx={{ minWidth: '80px' }}
        />
      );
    } else {
      return (
        <Chip 
          label="Not set" 
          color="default" 
          size="small" 
          variant="outlined"
          sx={{ minWidth: '80px' }}
        />
      );
    }
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePrevDay}>
          <ArrowBackIosIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography variant="h6">
            {isSelectedDateToday ? 'Today' : format(selectedDate, 'EEEE, MMM d, yyyy')}
          </Typography>
        </Box>
        <IconButton onClick={handleNextDay} disabled={isFutureDate}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      
      {!isSelectedDateToday && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Button 
            startIcon={<TodayIcon />} 
            variant="outlined" 
            onClick={handleTodayClick}
          >
            Go to Today
          </Button>
        </Box>
      )}
      
      <Paper elevation={1} sx={{ mb: 2, p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Track your habits for {isSelectedDateToday ? 'today' : format(selectedDate, 'MMM d')}
        </Typography>
        
        <List>
          {habits.map((habit, index) => {
            const value = dayEntries[habit.id] !== undefined ? dayEntries[habit.id] : null;
            
            return (
              <React.Fragment key={habit.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography component="span">{habit.name}</Typography>
                        {isSelectedDateToday && (
                          <Box sx={{ ml: 1 }}>
                            <HabitStreak habitId={habit.id} />
                          </Box>
                        )}
                      </Box>
                    }
                    secondary={habit.description} 
                  />
                  <Box>
                    {habit.type === 'boolean' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {renderBooleanStatus(value)}
                        <IconButton 
                          onClick={() => handleBooleanToggle(habit.id, value)}
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <TodayIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <TextField
                        type="number"
                        value={value === null ? '' : value}
                        onChange={(e) => handleNumberChange(habit.id, e.target.value)}
                        InputProps={{
                          inputProps: { min: 0 },
                          sx: { width: '80px' }
                        }}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      </Paper>
    </>
  );
}

export default DailyTracker;
