#!/bin/bash

# Android Studio - Gradle JDK Configuration Helper
# This script helps configure Android Studio to use Java 21

echo "🔧 Android Studio Gradle JDK Configuration"
echo "=========================================="
echo ""

# Check if Java 21 is installed
JAVA21_PATH="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"

if [ -d "$JAVA21_PATH" ]; then
    echo "✅ Java 21 found at: $JAVA21_PATH"
    
    # Verify Java version
    if [ -x "$JAVA21_PATH/bin/java" ]; then
        JAVA_VERSION=$("$JAVA21_PATH/bin/java" -version 2>&1 | head -n 1)
        echo "   Version: $JAVA_VERSION"
    fi
else
    echo "❌ Java 21 not found at expected location"
    echo "   Please install: brew install openjdk@21"
    exit 1
fi

echo ""
echo "📋 Manual Steps for Android Studio:"
echo "=========================================="
echo ""
echo "1. Open Android Studio"
echo "2. Go to: File > Settings (or Android Studio > Preferences on Mac)"
echo "3. Navigate to: Build, Execution, Deployment > Build Tools > Gradle"
echo "4. Under 'Gradle JDK', click the dropdown"
echo "5. Select 'Add JDK...' if Java 21 is not listed"
echo "6. Browse to: $JAVA21_PATH"
echo "7. Click 'OK' to select"
echo "8. Make sure 'Gradle JDK' is set to 'openjdk-21 version 21'"
echo "9. Click 'Apply' and 'OK'"
echo "10. File > Sync Project with Gradle Files"
echo "11. Build > Clean Project"
echo "12. Build > Rebuild Project"
echo ""
echo "OR use the quick path:"
echo "=========================================="
echo ""
echo "In Android Studio bottom panel, if you see build error:"
echo "1. Click on 'Build Output' tab"
echo "2. Look for the error about Java installation"
echo "3. Click 'Configure' or 'Open Gradle Settings' link if available"
echo "4. Set Gradle JDK to Java 21 at: $JAVA21_PATH"
echo ""
echo "Alternative - Set via IDE Settings:"
echo "=========================================="
echo ""
echo "Press: Cmd + , (Mac) or Ctrl + Alt + S (Windows/Linux)"
echo "Search for: 'gradle jdk'"
echo "Change to Java 21"
echo ""
echo "✅ Configuration complete!"
echo ""
echo "After configuring, sync and rebuild:"
echo "  File > Sync Project with Gradle Files"
echo "  Build > Rebuild Project"
echo ""
