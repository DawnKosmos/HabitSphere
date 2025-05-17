import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, Paper, Box, AppBar, Toolbar, Typography, IconButton, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import TodayIcon from '@mui/icons-material/Today';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from './contexts/ThemeContext';
import HabitList from './components/HabitList';
import AddHabitForm from './components/AddHabitForm';
import DailyTracker from './components/DailyTracker';
import HabitStats from './components/HabitStats';
import Settings from './components/Settings';
import Welcome from './components/Welcome';

function App() {
  const { darkMode } = useTheme();
  const [view, setView] = useState('today');
  const [formOpen, setFormOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if this is the first time the user is using the app
    const welcomeCompleted = localStorage.getItem('welcomeCompleted');
    if (!welcomeCompleted) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeCompleted', 'true');
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#90caf9',
          },
          secondary: {
            main: '#f48fb1',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [darkMode],
  );

  const handleAddClick = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showWelcome ? (
        <Welcome onComplete={handleWelcomeComplete} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Habit Tracker
              </Typography>
              <IconButton color="inherit" aria-label="add habit" onClick={handleAddClick}>
                <AddIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Container maxWidth="sm" sx={{ flexGrow: 1, py: 2 }}>
            <Paper elevation={3} sx={{ p: 2, minHeight: 'calc(100vh - 168px)' }}>
              {view === 'today' && <DailyTracker />}
              {view === 'habits' && <HabitList />}
              {view === 'stats' && <HabitStats />}
              {view === 'settings' && <Settings />}
            </Paper>
          </Container>

          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={view}
              onChange={(event, newValue) => {
                setView(newValue);
              }}
            >
              <BottomNavigationAction label="Today" value="today" icon={<TodayIcon />} />
              <BottomNavigationAction label="Habits" value="habits" icon={<FormatListBulletedIcon />} />
              <BottomNavigationAction label="Stats" value="stats" icon={<BarChartIcon />} />
              <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
            </BottomNavigation>
          </Paper>
        </Box>
      )}

      <AddHabitForm open={formOpen} onClose={handleCloseForm} />
    </ThemeProvider>
  );
}

export default App;
