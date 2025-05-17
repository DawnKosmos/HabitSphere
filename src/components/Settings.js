import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DeleteIcon from '@mui/icons-material/Delete';
import BackupIcon from '@mui/icons-material/Backup';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits } from '../contexts/HabitsContext';
import localforage from 'localforage';

function Settings() {
  const { darkMode, toggleTheme } = useTheme();
  const { habits, loading } = useHabits();
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  
  const handleExportData = () => {
    const exportData = async () => {
      try {
        const habits = await localforage.getItem('habits') || [];
        const entries = await localforage.getItem('habitEntries') || {};
        
        const dataStr = JSON.stringify({ habits, entries });
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `habit-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      } catch (error) {
        console.error('Error exporting data:', error);
        alert('Failed to export data. Please try again.');
      }
    };
    
    exportData();
  };
  
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (data.habits && Array.isArray(data.habits) && data.entries && typeof data.entries === 'object') {
            await localforage.setItem('habits', data.habits);
            await localforage.setItem('habitEntries', data.entries);
            alert('Data imported successfully! Please refresh the app.');
            window.location.reload();
          } else {
            alert('Invalid backup file format.');
          }
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Failed to import data. Please check the file format.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };
  
  const handleResetData = () => {
    setResetDialogOpen(true);
  };
  
  const confirmReset = async () => {
    try {
      await localforage.clear();
      setResetDialogOpen(false);
      alert('All data has been reset. The app will now refresh.');
      window.location.reload();
    } catch (error) {
      console.error('Error resetting data:', error);
      alert('Failed to reset data. Please try again.');
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      
      <Paper elevation={1} sx={{ mb: 3 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
            <Switch
              edge="end"
              checked={darkMode}
              onChange={toggleTheme}
              inputProps={{
                'aria-labelledby': 'dark-mode-switch',
              }}
            />
          </ListItem>
        </List>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Data Management
      </Typography>
      
      <Paper elevation={1}>
        <List>
          <ListItem>
            <ListItemIcon>
              <BackupIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Export Data" 
              secondary="Save your habits and tracking data as a backup file"
            />
            <Button 
              variant="outlined" 
              onClick={handleExportData}
              disabled={loading || habits.length === 0}
              startIcon={<DownloadIcon />}
            >
              Export
            </Button>
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Import Data" 
              secondary="Restore your habits and tracking data from a backup file"
            />
            <Button 
              variant="outlined" 
              onClick={handleImportData}
              disabled={loading}
              startIcon={<BackupIcon />}
            >
              Import
            </Button>
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Reset All Data" 
              secondary="Delete all habits and tracking data (cannot be undone)"
            />
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleResetData}
              disabled={loading}
              startIcon={<DeleteIcon />}
            >
              Reset
            </Button>
          </ListItem>
        </List>
      </Paper>
      
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      >
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset all data? This will delete all your habits and tracking history. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmReset} color="error">
            Reset All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;
