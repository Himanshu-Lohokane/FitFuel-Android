import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Switch,
  ActivityIndicator
} from 'react-native';
import { geminiClient } from '../services/geminiClient';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [goalCalories, setGoalCalories] = useState('2000');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const hasKey = await geminiClient.hasApiKey();
      setHasApiKey(hasKey);
      
      if (hasKey) {
        // Don't load the actual key for security, just show placeholder
        setApiKey('••••••••••••••••');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    // If showing placeholder, don't save
    if (apiKey === '••••••••••••••••') {
      return;
    }

    setIsLoading(true);

    try {
      await geminiClient.setApiKey(apiKey.trim());
      
      // Test the API key
      const isValid = await geminiClient.testConnection();
      
      if (isValid) {
        setHasApiKey(true);
        setApiKey('••••••••••••••••');
        Alert.alert('Success', 'API key saved and tested successfully!');
      } else {
        await geminiClient.removeApiKey();
        Alert.alert('Error', 'Invalid API key. Please check and try again.');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveApiKey = async () => {
    Alert.alert(
      'Remove API Key',
      'Are you sure you want to remove your Gemini API key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await geminiClient.removeApiKey();
              setHasApiKey(false);
              setApiKey('');
              Alert.alert('Success', 'API key removed successfully');
            } catch (error) {
              console.error('Error removing API key:', error);
              Alert.alert('Error', 'Failed to remove API key');
            }
          }
        }
      ]
    );
  };

  const handleClearApiKey = () => {
    if (apiKey === '••••••••••••••••') {
      setApiKey('');
      setHasApiKey(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gemini API Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gemini API</Text>
          <Text style={styles.sectionDescription}>
            Configure your Gemini API key for automatic calorie estimation. 
            Get your free API key from Google AI Studio.
          </Text>

          <View style={styles.apiKeyContainer}>
            <TextInput
              style={[styles.input, hasApiKey && styles.inputWithKey]}
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChangeText={setApiKey}
              onFocus={handleClearApiKey}
              secureTextEntry={!showApiKey && hasApiKey}
              editable={!isLoading}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            {hasApiKey && (
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowApiKey(!showApiKey)}
              >
                <Text style={styles.eyeButtonText}>
                  {showApiKey ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {hasApiKey ? (
              <TouchableOpacity 
                style={[styles.button, styles.removeButton]}
                onPress={handleRemoveApiKey}
                disabled={isLoading}
              >
                <Text style={styles.removeButtonText}>Remove API Key</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveApiKey}
                disabled={isLoading || !apiKey.trim()}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save API Key</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[styles.statusText, hasApiKey ? styles.statusConnected : styles.statusDisconnected]}>
              {hasApiKey ? '✓ Connected' : '⚠️ Offline Mode'}
            </Text>
          </View>
        </View>

        {/* Daily Goal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Calorie Goal</Text>
          <Text style={styles.sectionDescription}>
            Set your daily calorie target (default: 2000 calories)
          </Text>

          <TextInput
            style={styles.input}
            placeholder="2000"
            value={goalCalories}
            onChangeText={setGoalCalories}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.infoText}>
            Simple Calorie Tracker v1.0{'\n'}
            Built with React Native & Expo
          </Text>
          <Text style={styles.infoText}>
            Your data is stored locally on your device and is completely private.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 16,
  },
  apiKeyContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputWithKey: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusConnected: {
    color: '#27ae60',
  },
  statusDisconnected: {
    color: '#f39c12',
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 8,
  },
});
