import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayDateString, getYesterdayDateString } from '../utils/dateUtils';

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
}

export interface DayData {
  [date: string]: FoodEntry[];
}

const STORAGE_KEY = 'calorie_tracker_data';

/**
 * Storage service for managing local data persistence
 * Keeps only today and yesterday's data for minimal storage usage
 */
class StorageService {
  /**
   * Get all stored data
   */
  async getAllData(): Promise<DayData> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading data:', error);
      return {};
    }
  }

  /**
   * Get today's food entries
   */
  async getTodaysEntries(): Promise<FoodEntry[]> {
    const allData = await this.getAllData();
    const today = getTodayDateString();
    return allData[today] || [];
  }

  /**
   * Add a new food entry for today
   */
  async addFoodEntry(foodEntry: Omit<FoodEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const allData = await this.getAllData();
      const today = getTodayDateString();
      
      const newEntry: FoodEntry = {
        ...foodEntry,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };

      if (!allData[today]) {
        allData[today] = [];
      }
      
      allData[today].push(newEntry);
      
      // Clean up old data (keep only today and yesterday)
      await this.cleanupOldData(allData);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('Error saving food entry:', error);
      throw error;
    }
  }

  /**
   * Update an existing food entry
   */
  async updateFoodEntry(entryId: string, updates: Partial<FoodEntry>): Promise<void> {
    try {
      const allData = await this.getAllData();
      const today = getTodayDateString();
      
      if (allData[today]) {
        const entryIndex = allData[today].findIndex(entry => entry.id === entryId);
        if (entryIndex !== -1) {
          allData[today][entryIndex] = { ...allData[today][entryIndex], ...updates };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
        }
      }
    } catch (error) {
      console.error('Error updating food entry:', error);
      throw error;
    }
  }

  /**
   * Delete a food entry
   */
  async deleteFoodEntry(entryId: string): Promise<void> {
    try {
      const allData = await this.getAllData();
      const today = getTodayDateString();
      
      if (allData[today]) {
        allData[today] = allData[today].filter(entry => entry.id !== entryId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
      }
    } catch (error) {
      console.error('Error deleting food entry:', error);
      throw error;
    }
  }

  /**
   * Calculate today's total calories
   */
  async getTodaysTotalCalories(): Promise<number> {
    const todaysEntries = await this.getTodaysEntries();
    return todaysEntries.reduce((total, entry) => total + entry.calories, 0);
  }

  /**
   * Clean up old data, keeping only today and yesterday
   */
  private async cleanupOldData(allData: DayData): Promise<void> {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    
    // Remove all dates except today and yesterday
    Object.keys(allData).forEach(date => {
      if (date !== today && date !== yesterday) {
        delete allData[date];
      }
    });
  }

  /**
   * Perform cleanup on app startup
   */
  async performStartupCleanup(): Promise<void> {
    try {
      const allData = await this.getAllData();
      await this.cleanupOldData(allData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error('Error during startup cleanup:', error);
    }
  }

  /**
   * Clear all data (for testing/reset purposes)
   */
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();

// Export geminiClient for easy access
export { geminiClient } from './geminiClient';
