# Quick Start Guide - Android Build

## ✅ Status: Ready for Android Studio

All Capacitor packages are updated to v8.1.0 and properly configured.

---

## Open Project in Android Studio

```bash
cd frontend
npx cap open android
```

This will launch Android Studio with the Android project.

---

## Build APK

### Option 1: Android Studio GUI
1. Open project: `npx cap open android`
2. Wait for Gradle sync to complete
3. Build > Build Bundle(s) / APK(s) > Build APK(s)
4. APK location: `android/app/build/outputs/apk/release/`

### Option 2: Command Line
```bash
cd frontend/android
./gradlew assembleRelease
```

### Option 3: Debug Build (for testing)
```bash
cd frontend/android
./gradlew assembleDebug
```

---

## Test PDF Download Features

1. **Quotation PDF**
   - Invoice & Billing > Create Quotation
   - Fill details and add items
   - Click "Generate Quotation PDF"
   - PDF should open in Android share sheet

2. **Menu Plan PDF**
   - Invoice & Billing > Event Menu Plan
   - Configure days and sessions
   - Add menu items
   - Click "Generate Menu Plan PDF"
   - PDF should open in Android share sheet

---

## Troubleshooting

### If build fails with "Plugin not found"
```bash
cd frontend
npm install
npx cap sync android
```

### If Gradle sync fails
1. File > Invalidate Caches / Restart in Android Studio
2. Or delete: `android/.gradle` and `android/build`
3. Re-sync: Build > Clean Project > Rebuild Project

### If PDF download doesn't work
1. Check permissions in AndroidManifest.xml
2. Check Logcat for errors (filter: "Capacitor")
3. Verify plugins are loaded: Look for "Registering plugin: Filesystem"

---

## System Requirements

- **Java**: JDK 17 or higher
- **Android Studio**: Giraffe (2022.3.1) or later
- **Gradle**: 8.0+
- **Android SDK**: API 34 (Android 14)
- **Min SDK**: API 24 (Android 7.0)

---

## Verification Checklist

✅ Capacitor core: v8.1.0  
✅ Capacitor CLI: v8.1.0  
✅ Capacitor Android: v8.1.0  
✅ Filesystem plugin: v8.1.2  
✅ Share plugin: v8.0.1  
✅ Android permissions configured  
✅ FileProvider paths configured  
✅ Build successful  
✅ Capacitor sync completed  

---

## Next Steps

1. Open in Android Studio: `npx cap open android`
2. Let Gradle sync complete (first time takes 5-10 minutes)
3. Connect Android device or start emulator
4. Click Run ▶️ button in Android Studio
5. Test PDF generation features

---

**Note**: If you need to rebuild web assets before Android build:
```bash
cd frontend
npm run build
npx cap sync android
```

---

For detailed information, see: `ANDROID_BUILD_NOTES.md`
