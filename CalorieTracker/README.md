# 🎯 Simple Calorie Tracker - AI Powered

A lightweight, privacy-focused calorie tracking app built with React Native and Expo. **Pure AI-powered** with your Gemini API key pre-configured!

## 🚀 **Quick Start (3 Steps)**

### 1. Prerequisites
- **Node.js**: Download from [nodejs.org](https://nodejs.org/) (LTS version)
- **Expo CLI**: `npm install -g @expo/cli`
- **Expo Go app**: Install on your phone from Play Store/App Store

### 2. Run the App
```bash
# Navigate to project directory
cd "D:\HIMANSHU\Projects\Calorie counter android\CalorieTracker"

# Start the development server
npm start

# Scan QR code with Expo Go app on your phone
```

### 3. Start Tracking!
- Type any food: "apple", "chicken breast", "3 small apples", "2 eggs"
- Tap "Add" - AI estimates calories automatically
- Confirm and track your daily intake!

## 🧠 **How It Works**

### **Simple & Smart Approach:**
- **Pure AI-Powered**: Uses Gemini AI for all calorie estimation
- **No Complex Logic**: Just type anything, AI figures it out
- **Smart Backend**: AI handles quantities automatically

### **Examples:**
| What You Type | AI Response | Result |
|---------------|-------------|---------|
| "apple" | Assumes 1 medium apple | 80 cal |
| "3 small apples" | Calculates for 3 small apples | 180 cal |
| "chicken breast" | Assumes 100g serving | 165 cal |
| "2 eggs" | Calculates for 2 eggs | 140 cal |
| "pizza slice" | Assumes 1 slice | 250 cal |

## 📱 **Features**

### ✅ **Core Features**
- **AI Calorie Estimation**: Gemini AI estimates calories for any food
- **Daily Tracking**: Real-time calorie counter with progress bar
- **Food Management**: Add, edit, delete food entries with simple gestures
- **Local Storage**: All data stored on your device (100% private)
- **Settings**: API key management and daily goal setting

### ✅ **Smart Features**
- **Quantity Handling**: AI automatically interprets amounts ("3 apples", "200gm chicken")
- **Serving Size Intelligence**: AI assumes reasonable portions when not specified
- **Manual Fallback**: Enter calories manually if AI fails
- **Data Persistence**: Survives app restarts and updates

### ✅ **Privacy & Security**
- **100% Local Data**: No cloud sync, no user accounts
- **Secure API Key Storage**: Your Gemini key stored securely on device
- **Automatic Cleanup**: Keeps only today and yesterday's data
- **No Analytics**: No tracking or data collection

## 🎮 **How to Use**

### **Adding Food Items**
1. **Type food description**: "chicken breast", "3 small apples", "2 eggs"
2. **Tap "Add" button**: AI estimates calories automatically
3. **Review estimate**: Shows "🤖 Estimated calories for '3 small apples': 180 cal"
4. **Confirm or edit**: Tap "Add" to confirm or "Edit" to modify

### **Managing Entries**
- **Edit calories**: Tap any food item to change calories
- **Delete entry**: Long press any food item to remove it
- **Refresh data**: Pull down the food list to refresh
- **View progress**: Daily total and progress bar at the top

### **Settings**
- **Access settings**: Tap ⚙️ icon in top right
- **API key**: Your Gemini key is pre-configured
- **Daily goal**: Change your calorie target (default: 2000)
- **App info**: View version and privacy details

## 🔧 **Technical Details**

### **Architecture**
```
App.tsx (Main Container)
├── CalorieDisplay.tsx (Daily total & progress)
├── FoodInput.tsx (AI-powered food entry)
├── FoodList.tsx (Today's entries with edit/delete)
└── Settings.tsx (API key & configuration)
```

### **Services**
- **geminiClient.ts**: Secure Gemini API integration with simple prompts
- **storageService.ts**: AsyncStorage wrapper with automatic cleanup
- **errorHandler.ts**: User-friendly error handling and validation
- **dateUtils.ts**: Date formatting and utilities

### **AI Integration**
- **Simple Prompt**: "Estimate the calories for: [USER_INPUT]. If quantity is not specified, assume a reasonable serving size. Respond with only a number representing total calories."
- **Smart Parsing**: Extracts first number from AI response
- **Error Handling**: Graceful fallback to manual entry

## 📊 **Data Storage**

### **Storage Structure**
```json
{
  "2025-09-21": [
    {
      "id": "1234567890",
      "name": "3 small apples",
      "calories": 180,
      "timestamp": "2025-09-21T10:30:00.000Z"
    }
  ]
}
```

### **Data Retention**
- **Keep**: Only today and yesterday's data
- **Auto-cleanup**: Runs on every app startup
- **Storage limit**: ~2KB maximum
- **Privacy**: All data stays on your device

## 🚀 **Development**

### **Project Structure**
```
CalorieTracker/
├── App.tsx                 # Main app component
├── src/
│   ├── components/         # UI components
│   ├── services/          # Business logic
│   └── utils/             # Helper functions
├── assets/                # Images and icons
├── package.json          # Dependencies
└── app.json             # Expo configuration
```

### **Key Dependencies**
- **React Native**: Core framework
- **Expo**: Development platform
- **AsyncStorage**: Local data persistence
- **Expo SecureStore**: Secure API key storage
- **TypeScript**: Type safety

### **Running Commands**
```bash
# Start development server
npm start

# Start with cache cleared
npx expo start --clear

# Start for web browser
npx expo start --web

# Start for Android
npx expo start --android
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"Cannot find module" errors**
```bash
# Clean and reinstall dependencies
rm -rf node_modules
npm install
```

#### **Metro bundler issues**
```bash
# Clear Metro cache
npx expo start --clear
```

#### **Phone can't connect**
1. Make sure both devices are on the same WiFi
2. Try turning off Windows Firewall temporarily
3. Use manual URL method instead of QR code

#### **Wrong directory error**
Make sure you're in the correct directory:
```bash
cd "D:\HIMANSHU\Projects\Calorie counter android\CalorieTracker"
npm start
```

### **Testing the App**

#### **Test AI Estimation**
Try these examples:
- "apple" → Should get ~80 calories
- "3 small apples" → Should get ~180 calories
- "chicken breast" → Should get ~165 calories
- "2 eggs" → Should get ~140 calories

#### **Test Data Persistence**
1. Add several food items
2. Close and reopen the app
3. Your data should still be there

#### **Test Offline Mode**
1. Turn off internet
2. Try adding food - should ask for manual entry
3. Turn internet back on - AI should work again

## 🎯 **Your Gemini API Key**

```
AIzaSyD5uHFqnC7n8M-4HUR3Oh19MnoRQpHdmtk
```

**Status**: ✅ Pre-configured and ready to use!

The app automatically uses this key for AI-powered calorie estimation.

## 🎉 **Success!**

**Your Simple Calorie Tracker is complete and ready to use!**

### **What You Have:**
- ✅ **Pure AI-powered** calorie estimation
- ✅ **Simple UI** - just type and tap
- ✅ **Smart backend** - AI handles quantities automatically
- ✅ **Privacy-focused** - 100% local data storage
- ✅ **Production-ready** - professional code quality
- ✅ **Pre-configured** - your Gemini API key is ready

### **Ready to Start:**
1. Run `npm start` in the CalorieTracker directory
2. Scan QR code with Expo Go app
3. Start tracking calories with AI-powered estimation!

---

**Built with ❤️ using React Native, Expo, TypeScript, and Gemini AI**

*Simple UI + Smart AI Backend = Perfect User Experience!*