import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CalorieDisplayProps {
  totalCalories: number;
  goalCalories?: number;
}

export const CalorieDisplay: React.FC<CalorieDisplayProps> = ({ 
  totalCalories, 
  goalCalories = 2000 
}) => {
  const progressPercentage = Math.min((totalCalories / goalCalories) * 100, 100);
  const isOverGoal = totalCalories > goalCalories;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Today's Calories</Text>
      <Text style={[styles.total, isOverGoal && styles.overGoal]}>
        {totalCalories.toLocaleString()}
      </Text>
      
      {goalCalories > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` },
                isOverGoal && styles.progressOverGoal
              ]} 
            />
          </View>
          <Text style={styles.goalText}>
            Goal: {goalCalories.toLocaleString()} cal
          </Text>
        </View>
      )}
      
      {isOverGoal && (
        <Text style={styles.warningText}>
          Over daily goal by {(totalCalories - goalCalories).toLocaleString()} cal
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  total: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  overGoal: {
    color: '#e74c3c',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  progressOverGoal: {
    backgroundColor: '#e74c3c',
  },
  goalText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  warningText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginTop: 8,
  },
});
