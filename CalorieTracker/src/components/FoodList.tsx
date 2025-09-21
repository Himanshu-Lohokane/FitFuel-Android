import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { FoodEntry } from '../services/storageService';
import { formatTime } from '../utils/dateUtils';
import { validateCalorieInput } from '../services/errorHandler';

interface FoodListProps {
  entries: FoodEntry[];
  onEditEntry: (entry: FoodEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const FoodList: React.FC<FoodListProps> = ({ 
  entries, 
  onEditEntry, 
  onDeleteEntry,
  onRefresh,
  refreshing = false
}) => {
  const handleDeleteEntry = (entry: FoodEntry) => {
    Alert.alert(
      'Delete Food Entry',
      `Are you sure you want to delete "${entry.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteEntry(entry.id)
        }
      ]
    );
  };

  const handleEditEntry = (entry: FoodEntry) => {
    Alert.prompt(
      'Edit Calories',
      `Edit calories for "${entry.name}":`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: (calorieText?: string) => {
            const validation = validateCalorieInput(calorieText || '');
            if (validation.isValid && validation.calories) {
              onEditEntry({ ...entry, calories: validation.calories });
            } else {
              Alert.alert('Error', validation.error || 'Please enter a valid calorie amount');
            }
          }
        }
      ],
      'plain-text',
      entry.calories.toString(),
      'numeric'
    );
  };

  const renderFoodEntry = ({ item }: { item: FoodEntry }) => (
    <TouchableOpacity 
      style={styles.entryItem}
      onPress={() => handleEditEntry(item)}
      onLongPress={() => handleDeleteEntry(item)}
    >
      <View style={styles.entryContent}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.entryTime}>
          {formatTime(new Date(item.timestamp))}
        </Text>
      </View>
      <View style={styles.calorieContainer}>
        <Text style={styles.calorieAmount}>{item.calories}</Text>
        <Text style={styles.calorieUnit}>cal</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        No food entries yet today
      </Text>
      <Text style={styles.emptyStateSubtext}>
        Add your first food item above to get started!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Today's Foods</Text>
      <Text style={styles.headerSubtitle}>
        {entries.length} item{entries.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={entries}
        renderItem={renderFoodEntry}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>
          💡 Tap to edit • Long press to delete
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  list: {
    flex: 1,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
    backgroundColor: '#fff',
  },
  entryContent: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  entryTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  calorieContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  calorieAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  calorieUnit: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: -2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 20,
  },
  helpContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  helpText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
