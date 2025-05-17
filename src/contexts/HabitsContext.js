import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import localforage from 'localforage';

const HabitsContext = createContext();

export function useHabits() {
  return useContext(HabitsContext);
}

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState({});

  // Load habits from storage on mount
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await localforage.getItem('habits');
        if (storedHabits) {
          setHabits(storedHabits);
        }

        const storedEntries = await localforage.getItem('habitEntries');
        if (storedEntries) {
          setEntries(storedEntries);
        }
      } catch (error) {
        console.error('Error loading habits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, []);

  // Save habits to storage whenever they change
  useEffect(() => {
    if (!loading) {
      localforage.setItem('habits', habits);
    }
  }, [habits, loading]);

  // Save entries to storage whenever they change
  useEffect(() => {
    if (!loading) {
      localforage.setItem('habitEntries', entries);
    }
  }, [entries, loading]);

  // Add a new habit
  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  // Delete a habit
  const deleteHabit = (habitId) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId));
    
    // Also remove all entries for this habit
    setEntries((prevEntries) => {
      const newEntries = { ...prevEntries };
      Object.keys(newEntries).forEach((date) => {
        if (newEntries[date][habitId]) {
          delete newEntries[date][habitId];
        }
      });
      return newEntries;
    });
  };

  // Update a habit
  const updateHabit = (habitId, updatedHabit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, ...updatedHabit } : habit
      )
    );
  };

  // Track a habit for a specific day
  const trackHabit = (habitId, value, date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    setEntries((prevEntries) => {
      const newEntries = { ...prevEntries };
      if (!newEntries[dateStr]) {
        newEntries[dateStr] = {};
      }
      newEntries[dateStr][habitId] = value;
      return newEntries;
    });
  };

  // Get habit entry for a specific day
  const getHabitEntry = (habitId, date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries[dateStr]?.[habitId] ?? null;
  };

  // Get all entries for a specific day
  const getDayEntries = (date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries[dateStr] || {};
  };

  const value = {
    habits,
    loading,
    addHabit,
    deleteHabit,
    updateHabit,
    trackHabit,
    getHabitEntry,
    getDayEntries,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
}
