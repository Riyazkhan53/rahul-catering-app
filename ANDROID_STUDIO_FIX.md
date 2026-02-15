# 🔧 Android Studio Configuration for Java 21

## Current Status
✅ **Command Line Build**: Working perfectly  
⚠️ **Android Studio**: Needs Gradle JDK configuration

---

## The Issue

Android Studio uses its own JDK settings which override `gradle.properties`. You need to manually configure Android Studio to use Java 21 for the Gradle daemon.

---

## Solution: Configure Android Studio's Gradle JDK

### Method 1: Via Settings (Recommended)

1. **Open Android Studio**
   - Open the project: `frontend/android`

2. **Open Gradle Settings**
   - **Mac**: `Android Studio > Settings > Build, Execution, Deployment > Build Tools > Gradle`
   - **Windows/Linux**: `File > Settings > Build, Execution, Deployment > Build Tools > Gradle`
   - **Quick way**: Press `Cmd+,` (Mac) or `Ctrl+Alt+S` (Win/Linux), then search "gradle jdk"

3. **Set Gradle JDK to Java 21**
   - Find the "Gradle JDK" dropdown
   - If "openjdk-21" is listed: Select it
   - If NOT listed: Click "Add JDK..." or "Download JDK..."

4. **Add Java 21 Path**
   - Click "Add JDK..."
   - Navigate to: `/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`
   - Click "Open" or "OK"
   - Select the newly added "openjdk-21 version 21.0.10"

5. **Apply Changes**
   - Click "Apply"
   - Click "OK"

6. **Sync and Rebuild**
   - `File > Sync Project with Gradle Files`
   - `Build > Clean Project`
   - `Build > Rebuild Project`

---

### Method 2: Via Build Error Panel (Quickest)

If you see the build error in Android Studio:

1. Look at the **Build Output** panel (bottom of IDE)
2. The error message should have a link: "**Learn more about toolchain auto-detection**"
3. Near the error, you might see: "**Open Gradle Settings**" or "**Configure**"
4. Click it → it will open Gradle settings directly
5. Change "Gradle JDK" to Java 21 (see Method 1, step 4)

---

### Method 3: Edit IDE Configuration File

**For Advanced Users**

1. Close Android Studio completely
2. Edit the IDE configuration:
   ```bash
   # Mac/Linux
   nano ~/.gradle/gradle.properties
   
   # Or create project-specific (already done)
   nano ~/Desktop/Riyaz/Rahul_Catering_App/frontend/android/gradle.properties
   ```

3. Ensure these lines exist:
   ```properties
   org.gradle.java.home=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
   ```

4. Reopen Android Studio

---

## Verify Configuration

### In Android Studio

After configuration, check:

1. **Gradle Sync**
   - `File > Sync Project with Gradle Files`
   - Should complete without Java version errors

2. **Build**
   - `Build > Rebuild Project`
   - Should build successfully

3. **Check Gradle JDK Version**
   - Open `Settings > Build Tools > Gradle`
   - "Gradle JDK" should show: `openjdk-21 version 21.0.10` or similar

---

## Troubleshooting

### Issue: "openjdk-21" Not in Dropdown

**Solution**:
1. Click "Add JDK..."
2. Navigate to: `/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`
3. If path doesn't exist, install Java 21:
   ```bash
   brew install openjdk@21
   ```

---

### Issue: Build Still Fails with "Cannot find Java installation"

**Solution**:
1. **Invalidate Caches**
   - `File > Invalidate Caches / Restart...`
   - Select "Invalidate and Restart"

2. **After restart**:
   - Re-check Gradle JDK setting
   - Sync project again

3. **If still fails**, try command line:
   ```bash
   cd frontend/android
   ./gradlew clean
   ./gradlew assembleDebug
   ```
   - If command line works, it's definitely an Android Studio JDK setting issue

---

### Issue: Gradle Daemon Error

**Solution**:
1. Kill all Gradle daemons:
   ```bash
   ./gradlew --stop
   ```

2. Restart Android Studio

3. Sync project again

---

### Issue: Multiple Java Versions Causing Conflict

**Solution**:
1. Check installed Java versions:
   ```bash
   /usr/libexec/java_home -V
   ```

2. Set JAVA_HOME temporarily:
   ```bash
   export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
   ```

3. Launch Android Studio from terminal:
   ```bash
   open -a "Android Studio"
   ```

---

## Alternative: Use Command Line + Android Studio for Editing Only

If Android Studio configuration is too complex, you can:

1. **Build via Terminal**:
   ```bash
   cd frontend/android
   ./gradlew assembleDebug
   ```

2. **Install on Device via Terminal**:
   ```bash
   ./gradlew installDebug
   ```

3. **Use Android Studio** only for:
   - Code editing
   - Layout preview
   - Debugging (still works with command-line builds)

---

## Quick Reference

### Java 21 Location
```
/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
```

### Verify Java 21 Installation
```bash
/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home/bin/java -version
```

Expected output:
```
openjdk version "21.0.10"
OpenJDK Runtime Environment Homebrew (build 21.0.10)
OpenJDK 64-Bit Server VM Homebrew (build 21.0.10, mixed mode, sharing)
```

---

## Command Line Build Commands (Always Work)

```bash
# Clean build
cd frontend/android
./gradlew clean

# Debug APK
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug

# Build and install
./gradlew clean assembleDebug installDebug
```

---

## Success Indicators

✅ Gradle Sync completes without errors  
✅ "Build android: failed" changes to "BUILD SUCCESSFUL"  
✅ APK generated in `app/build/outputs/apk/debug/`  
✅ No "Java installation" errors in Build Output  

---

## Still Having Issues?

Run the configuration helper script:
```bash
cd /Users/riyazkhan43/Desktop/Riyaz/Rahul_Catering_App
./configure_android_studio.sh
```

This will verify Java 21 installation and provide step-by-step instructions.

---

**Remember**: Command line builds already work perfectly! Android Studio just needs to be told to use the same Java 21 that the command line is using.
