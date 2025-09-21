# 🚀 How to Run the Simple Calorie Tracker

## Prerequisites (First Time Setup)

### 1. Install Node.js
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Choose the LTS version (recommended: v20.19.4 or higher)
- Verify installation: Open Command Prompt and run `node --version`

### 2. Install Expo CLI
```bash
npm install -g @expo/cli
```

### 3. Install Expo Go App on Your Phone
- **Android**: Download "Expo Go" from Google Play Store
- **iOS**: Download "Expo Go" from App Store

## Running the Project

### Step 1: Navigate to Project Directory
```bash
cd "D:\HIMANSHU\Projects\Calorie counter android\CalorieTracker"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm start
```
or
```bash
npx expo start
```

### Step 4: Connect Your Phone
1. **QR Code Method (Recommended)**:
   - Open Expo Go app on your phone
   - Scan the QR code that appears in your terminal/browser
   - The app will load on your phone

2. **Manual Connection**:
   - Make sure your phone and computer are on the same WiFi network
   - In Expo Go, tap "Enter URL manually"
   - Enter the URL shown in your terminal (e.g., `exp://192.168.1.100:8081`)

## What You'll See

### Main Screen
- **Large calorie counter** at the top showing today's total
- **Input field** to add food items
- **List of today's foods** below the input
- **Settings button** (⚙️) in the top right

### Adding Food Items
1. Type a food item (e.g., "apple", "chicken breast", "2 eggs")
2. Tap "Add"
3. The app will:
   - Check offline database first (instant)
   - Try Gemini AI if available (1-3 seconds)
   - Ask for manual entry if not found
4. Confirm the calories and tap "Add"

### Managing Entries
- **Tap** any food item to edit its calories
- **Long press** any food item to delete it
- **Pull down** the food list to refresh

### Settings
- Tap the ⚙️ icon to access settings
- Your Gemini API key is **already pre-configured**
- You can change your daily calorie goal (default: 2000)

## Troubleshooting

### Common Issues

#### "Cannot find module" errors
```bash
# Clean and reinstall dependencies
rm -rf node_modules
npm install
```

#### "Metro bundler" issues
```bash
# Clear Metro cache
npx expo start --clear
```

#### Phone can't connect
1. Make sure both devices are on the same WiFi
2. Try turning off Windows Firewall temporarily
3. Use the manual URL method instead of QR code

#### App crashes or won't load
1. Check the terminal for error messages
2. Try restarting the development server
3. Make sure you're in the correct directory

### Development Commands

```bash
# Start with cache cleared
npx expo start --clear

# Start in tunnel mode (if local network doesn't work)
npx expo start --tunnel

# Start for web browser
npx expo start --web

# Start for Android emulator (if you have Android Studio)
npx expo start --android

# Start for iOS simulator (Mac only)
npx expo start --ios
```

## Project Structure

```
CalorieTracker/
├── App.tsx                 # Main app component
├── src/
│   ├── components/         # UI components
│   │   ├── CalorieDisplay.tsx
│   │   ├── FoodInput.tsx
│   │   ├── FoodList.tsx
│   │   └── Settings.tsx
│   ├── services/           # Business logic
│   │   ├── storageService.ts
│   │   ├── geminiClient.ts
│   │   └── offlineFoods.ts
│   └── utils/              # Helper functions
│       └── dateUtils.ts
├── assets/                 # Images and icons
├── package.json           # Dependencies
└── app.json              # Expo configuration
```

## Features Already Working

✅ **Gemini AI Integration**: Your API key is pre-configured
✅ **Offline Mode**: Works without internet using built-in food database
✅ **Local Storage**: All data saved on your device
✅ **Smart Estimation**: Automatic calorie estimation with fallbacks
✅ **Edit/Delete**: Tap to edit, long press to delete
✅ **Daily Tracking**: Progress bar and daily totals
✅ **Privacy**: 100% local data, no cloud sync

## Testing the App

### Test Offline Mode
1. Turn off your phone's internet
2. Try adding "apple" - should work instantly from offline database
3. Try adding "pizza" - should ask for manual calorie entry

### Test Gemini AI
1. Turn internet back on
2. Try adding "sushi roll" - should use Gemini AI for estimation
3. Confirm or edit the estimated calories

### Test Data Persistence
1. Add several food items
2. Close and reopen the app
3. Your data should still be there

## Building for Production

### Android APK
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview
```

### iOS App (Mac only)
```bash
eas build --platform ios --profile preview
```

## Support

If you encounter any issues:

1. **Check the terminal output** for error messages
2. **Restart the development server** with `npx expo start --clear`
3. **Verify your Node.js version** with `node --version`
4. **Make sure you're in the right directory** (`CalorieTracker` folder)

## Quick Start Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Expo CLI installed (`expo --version`)
- [ ] Expo Go app installed on phone
- [ ] In correct directory (`CalorieTracker`)
- [ ] Dependencies installed (`npm install`)
- [ ] Development server started (`npm start`)
- [ ] Phone connected via QR code or URL
- [ ] App loads on phone successfully

**🎉 You're ready to start tracking calories!**

---

**Your Gemini API key is already configured, so you can immediately start using AI-powered calorie estimation!**
