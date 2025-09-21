import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl
} from 'react-native';
import { CalorieDisplay } from './src/components/CalorieDisplay';
import { FoodInput } from './src/components/FoodInput';
import { FoodList } from './src/components/FoodList';
import { Settings } from './src/components/Settings';
import { storageService, FoodEntry, geminiClient } from './src/services/storageService';

export default function App() {
  const [todaysEntries, setTodaysEntries] = useState<FoodEntry[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [goalCalories, setGoalCalories] = useState(2000);

  useEffect(() => {
    loadTodaysData();
    performStartupCleanup();
    initializeGeminiKey();
  }, []);

  const initializeGeminiKey = async () => {
    try {
      // Pre-configure the Gemini API key
      await geminiClient.setApiKey('AIzaSyD5uHFqnC7n8M-4HUR3Oh19MnoRQpHdmtk');
    } catch (error) {
      console.log('Gemini key initialization failed:', error);
    }
  };

  const performStartupCleanup = async () => {
    try {
      await storageService.performStartupCleanup();
    } catch (error) {
      console.error('Error during startup cleanup:', error);
    }
  };

  const loadTodaysData = async () => {
    try {
      const entries = await storageService.getTodaysEntries();
      const totalCal = await storageService.getTodaysTotalCalories();
      const totalProt = await storageService.getTodaysTotalProtein();
      
      setTodaysEntries(entries);
      setTotalCalories(totalCal);
      setTotalProtein(totalProt);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = async (name: string, calories: number, protein: number) => {
    try {
      await storageService.addFoodEntry({ name, calories, protein });
      await loadTodaysData(); // Refresh data
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert('Error', 'Failed to add food item. Please try again.');
    }
  };

  const handleEditEntry = async (updatedEntry: FoodEntry) => {
    try {
      await storageService.updateFoodEntry(updatedEntry.id, updatedEntry);
      await loadTodaysData(); // Refresh data
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', 'Failed to update food item. Please try again.');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await storageService.deleteFoodEntry(entryId);
      await loadTodaysData(); // Refresh data
    } catch (error) {
      console.error('Error deleting entry:', error);
      Alert.alert('Error', 'Failed to delete food item. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTodaysData();
    setRefreshing(false);
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your food entries. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearAllData();
              await loadTodaysData();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.appTitle}>Calorie Tracker</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

        <CalorieDisplay 
          totalCalories={totalCalories} 
          totalProtein={totalProtein}
          goalCalories={goalCalories} 
        />

      <FoodInput 
        onAddFood={handleAddFood}
        disabled={false}
      />

      <FoodList
        entries={todaysEntries}
        onEditEntry={handleEditEntry}
        onDeleteEntry={handleDeleteEntry}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Debug button - remove in production */}
      {__DEV__ && (
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={handleClearAllData}
        >
          <Text style={styles.debugButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  settingsButton: {
    padding: 8,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  debugButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
