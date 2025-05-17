import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  LinearProgress, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Chip
} from '@mui/material';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, subWeeks } from 'date-fns';
import { useHabits } from '../contexts/HabitsContext';

function HabitStats() {
  const { habits, getDayEntries } = useHabits();
  
  const stats = useMemo(() => {
    if (habits.length === 0) return null;
    
    const today = new Date();
    const lastWeekStart = startOfWeek(subWeeks(today, 1));
    const lastWeekEnd = endOfWeek(subWeeks(today, 1));
    const thisWeekStart = startOfWeek(today);
    const thisWeekEnd = endOfWeek(today);
    
    // Get all days in the current and last week
    const lastWeekDays = eachDayOfInterval({ start: lastWeekStart, end: lastWeekEnd });
    const thisWeekDays = eachDayOfInterval({ 
      start: thisWeekStart, 
      end: isWithinInterval(today, { start: thisWeekStart, end: thisWeekEnd }) ? today : thisWeekEnd 
    });
    
    // Calculate completion rates for each habit
    const habitStats = habits.map(habit => {
      // Last week stats
      const lastWeekEntries = lastWeekDays.map(day => {
        const entries = getDayEntries(day);
        return entries[habit.id] !== undefined;
      });
      const lastWeekCompletionRate = lastWeekEntries.filter(Boolean).length / lastWeekDays.length;
      
      // This week stats
      const thisWeekEntries = thisWeekDays.map(day => {
        const entries = getDayEntries(day);
        return entries[habit.id] !== undefined;
      });
      const thisWeekCompletionRate = thisWeekEntries.filter(Boolean).length / thisWeekDays.length;
      
      // Calculate trend (positive if this week is better than last)
      const trend = thisWeekCompletionRate - lastWeekCompletionRate;
      
      return {
        habit,
        lastWeekCompletionRate,
        thisWeekCompletionRate,
        trend
      };
    });
    
    return habitStats;
  }, [habits, getDayEntries]);
  
  if (!stats || habits.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ py: 4 }}>
        Start tracking your habits to see statistics here.
      </Typography>
    );
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Weekly Progress
      </Typography>
      
      <List>
        {stats.map((stat, index) => (
          <React.Fragment key={stat.habit.id}>
            {index > 0 && <Divider component="li" />}
            <ListItem>
              <ListItemText
                primary={stat.habit.name}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="textSecondary">
                        This week:
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(stat.thisWeekCompletionRate * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={stat.thisWeekCompletionRate * 100} 
                      sx={{ mb: 1, height: 8, borderRadius: 4 }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        size="small" 
                        label={stat.trend > 0 ? 'Improving' : stat.trend < 0 ? 'Declining' : 'Steady'} 
                        color={stat.trend > 0 ? 'success' : stat.trend < 0 ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default HabitStats;
