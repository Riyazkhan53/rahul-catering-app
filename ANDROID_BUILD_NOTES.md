# Android Build Configuration - Capacitor 8.x

## Recent Updates (2026-02-15)

### ✅ Capacitor Versions Aligned
- **@capacitor/core**: `^8.0.0`
- **@capacitor/cli**: `^8.1.0` (upgraded from 7.4.4)
- **@capacitor/android**: `^8.0.0`
- **@capacitor/filesystem**: `^8.1.2`
- **@capacitor/share**: `^8.0.1`

All Capacitor packages are now on version 8.x for consistency and Android Studio compatibility.

---

## PDF Download Implementation

### Updated savePdf.js (`frontend/src/utils/savePdf.js`)

**Key Changes:**
1. **Directory Change**: Using `Directory.Documents` instead of `Directory.Cache`
   - Better persistence on Android
   - Files survive app cache clearing
   
2. **Filename Sanitization**: Removes special characters to prevent file system errors
   ```javascript
   const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
   ```

3. **Chunked Base64 Encoding**: Handles large PDF files efficiently
   - 32KB chunk processing
   - Prevents memory issues with large files

4. **Better Error Handling**: Try-catch with detailed error messages

5. **Return Values**: Returns success status and file URI for verification

---

## Android Configuration Updates

### 1. AndroidManifest.xml (`android/app/src/main/AndroidManifest.xml`)

Added storage permissions for Android 11+ and Android 13+:
```xml
<!-- For Android 11 and below -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />

<!-- For Android 13+ (API 33+) -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
```

**Note**: `maxSdkVersion="32"` ensures old permissions don't apply to Android 13+

---

### 2. file_paths.xml (`android/app/src/main/res/xml/file_paths.xml`)

Added paths for Documents directory:
```xml
<files-path name="files" path="." />
<external-files-path name="external_files" path="." />
<external-files-path name="documents" path="Documents/" />
```

This allows FileProvider to share PDF files from the Documents directory.

---

## Building for Android

### Prerequisites
- Android Studio Arctic Fox or later
- Android SDK 33+ (for latest features)
- Gradle 8.x

### Build Steps

1. **Build Web Assets**
   ```bash
   cd frontend
   npm run build
   ```

2. **Sync Capacitor**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

4. **Build APK/AAB**
   - In Android Studio: Build > Build Bundle(s) / APK(s)
   - Or via command line:
     ```bash
     cd android
     ./gradlew assembleRelease
     ```

---

## Testing PDF Generation on Android

### Test Scenarios

1. **Quotation PDF**
   - Navigate to Invoice & Billing > Create Quotation
   - Fill in customer and event details
   - Add dishes and services
   - Click "Generate Quotation PDF"
   - Verify PDF opens in share sheet

2. **Event Menu Plan PDF**
   - Navigate to Invoice & Billing > Event Menu Plan
   - Fill event details
   - Add multiple days with sessions
   - Add menu items in categories
   - Click "Generate Menu Plan PDF"
   - Verify PDF opens in share sheet

### Expected Behavior on Android
- PDF is written to app's Documents directory
- Native Android share sheet opens
- User can save to Downloads, share via WhatsApp, etc.
- No permission errors in logcat

---

## Debugging Tips

### View Capacitor Logs
```bash
npx cap run android -l
```

### Check Plugin Registration
In Android Studio Logcat, filter for "Capacitor" to see plugin initialization:
```
Capacitor: Loading app at http://localhost...
Capacitor: Registering plugin: Filesystem
Capacitor: Registering plugin: Share
```

### Common Issues

1. **Permission Denied**
   - Ensure AndroidManifest.xml has correct permissions
   - Check file_paths.xml includes Documents directory
   - Verify FileProvider is configured

2. **File Not Found**
   - Check Capacitor sync completed successfully
   - Verify base64 encoding is correct
   - Check filename doesn't contain invalid characters

3. **Share Failed**
   - Ensure Share plugin version matches Capacitor core
   - Check FileProvider authorities match package name
   - Verify file URI is accessible

---

## Version Compatibility

### Minimum Requirements
- **Android SDK**: API 24+ (Android 7.0)
- **Target SDK**: API 34 (Android 14)
- **Capacitor**: 8.0.0+

### Tested On
- Android 11 (API 30)
- Android 12 (API 31)
- Android 13 (API 33)
- Android 14 (API 34)

---

## Performance Optimizations

1. **Chunked Base64 Encoding**: Prevents memory overflow with large PDFs
2. **Documents Directory**: Faster than external storage
3. **File Sanitization**: Prevents filesystem errors
4. **Native Share**: Uses Android's built-in share sheet (no custom UI needed)

---

## Security Considerations

1. **Scoped Storage**: App uses scoped storage (Android 10+)
2. **FileProvider**: Secure file sharing between apps
3. **No External Storage**: Files stay in app-private directory
4. **User Controlled**: User decides where to save via share sheet

---

## Future Improvements

- [ ] Add progress indicator for large PDF generation
- [ ] Implement PDF preview before save
- [ ] Add option to email PDF directly
- [ ] Support dark mode in PDF letterhead
- [ ] Compress PDFs before saving (reduce file size)

---

## Support

If Android build fails:
1. Check `npx cap doctor` output
2. Verify all Capacitor plugins are v8.x
3. Clean Android build: `cd android && ./gradlew clean`
4. Invalidate Android Studio caches: File > Invalidate Caches / Restart
5. Re-sync: `npx cap sync android`

---

**Last Updated**: February 15, 2026
**Capacitor Version**: 8.1.0
**Build Status**: ✅ Ready for Android Studio
