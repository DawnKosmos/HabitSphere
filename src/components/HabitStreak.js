import React, { useMemo } from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { format, subDays, isToday, differenceInDays } from 'date-fns';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useHabits } from '../contexts/HabitsContext';

function HabitStreak({ habitId }) {
  const { getHabitEntry } = useHabits();
  
  const streak = useMemo(() => {
    if (!habitId) return 0;
    
    let currentStreak = 0;
    let day = new Date();
    
    // If today doesn't have an entry yet, check yesterday
    if (!getHabitEntry(habitId, day) && !isToday(day)) {
      day = subDays(day, 1);
    }
    
    // Count consecutive days with entries
    while (getHabitEntry(habitId, day) !== null) {
      currentStreak++;
      day = subDays(day, 1);
    }
    
    return currentStreak;
  }, [habitId, getHabitEntry]);
  
  // Find the longest streak
  const longestStreak = useMemo(() => {
    if (!habitId) return 0;
    
    let maxStreak = 0;
    let currentStreak = 0;
    let day = new Date();
    
    // Go back up to 365 days to find the longest streak
    for (let i = 0; i < 365; i++) {
      const entry = getHabitEntry(habitId, day);
      
      if (entry !== null) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
      
      day = subDays(day, 1);
    }
    
    return maxStreak;
  }, [habitId, getHabitEntry]);
  
  if (streak === 0) {
    return null;
  }
  
  return (
    <Tooltip title={`Longest streak: ${longestStreak} days`} arrow>
      <Chip
        icon={<LocalFireDepartmentIcon />}
        label={`${streak} day${streak !== 1 ? 's' : ''}`}
        color={streak >= 7 ? 'error' : streak >= 3 ? 'warning' : 'default'}
        size="small"
        variant="outlined"
        sx={{ 
          fontWeight: 'bold',
          '& .MuiChip-icon': { 
            color: streak >= 7 ? 'error.main' : streak >= 3 ? 'warning.main' : 'action.active' 
          }
        }}
      />
    </Tooltip>
  );
}

export default HabitStreak;
