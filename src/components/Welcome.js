import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TodayIcon from '@mui/icons-material/Today';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Welcome({ onComplete }) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    localStorage.setItem('welcomeCompleted', 'true');
    if (onComplete) onComplete();
  };

  const steps = [
    {
      label: 'Welcome to Habit Tracker',
      description: (
        <Box>
          <Typography paragraph>
            This app helps you build and maintain good habits by tracking them daily.
          </Typography>
          <Typography paragraph>
            Whether you want to drink more water, exercise regularly, or read every day,
            Habit Tracker makes it easy to stay on track.
          </Typography>
        </Box>
      ),
    },
    {
      label: 'How It Works',
      description: (
        <Box>
          <List>
            <ListItem>
              <ListItemIcon>
                <AddCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Create Habits" 
                secondary="Add habits you want to track with yes/no or numeric responses" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TodayIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Track Daily" 
                secondary="Check off your habits each day to build streaks" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BarChartIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="View Progress" 
                secondary="See your improvement over time with statistics" 
              />
            </ListItem>
          </List>
        </Box>
      ),
    },
    {
      label: 'Get Started',
      description: (
        <Box>
          <Typography paragraph>
            You're all set! Click the button below to start building better habits.
          </Typography>
          <Typography paragraph>
            Tip: This app works offline and can be installed on your home screen
            for a better experience.
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Habit Tracker
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              {step.description}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleComplete : handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Get Started' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}

export default Welcome;
