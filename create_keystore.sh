#!/bin/bash

# Rahul Catering App - Keystore Generator
# This script creates a signing key for releasing the Android app

echo "🔐 Creating Android Release Keystore"
echo "===================================="
echo ""

KEYSTORE_DIR="/Users/riyazkhan43/Desktop/Riyaz/Rahul_Catering_App/frontend/android/app"
KEYSTORE_FILE="$KEYSTORE_DIR/rahul-catering-release.keystore"

# Check if keystore already exists
if [ -f "$KEYSTORE_FILE" ]; then
    echo "⚠️  Keystore already exists at:"
    echo "   $KEYSTORE_FILE"
    echo ""
    read -p "Do you want to create a NEW keystore? This will replace the old one. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled. Existing keystore preserved."
        exit 0
    fi
    echo "⚠️  Creating new keystore (old one will be backed up)..."
    mv "$KEYSTORE_FILE" "$KEYSTORE_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

echo ""
echo "📋 Keystore Information:"
echo "========================"
echo ""
echo "You'll be asked for several pieces of information."
echo "Remember the passwords - you'll need them for every release!"
echo ""

# Prompt for passwords
echo "Enter a KEYSTORE password (minimum 6 characters):"
echo "💡 Suggestion: Use something memorable like 'RahulCatering2026'"
read -s KEYSTORE_PASS
echo ""
echo "Confirm KEYSTORE password:"
read -s KEYSTORE_PASS_CONFIRM
echo ""

if [ "$KEYSTORE_PASS" != "$KEYSTORE_PASS_CONFIRM" ]; then
    echo "❌ Passwords don't match!"
    exit 1
fi

echo ""
echo "Enter a KEY password (can be the same as keystore password):"
read -s KEY_PASS
echo ""
echo "Confirm KEY password:"
read -s KEY_PASS_CONFIRM
echo ""

if [ "$KEY_PASS" != "$KEY_PASS_CONFIRM" ]; then
    echo "❌ Passwords don't match!"
    exit 1
fi

echo ""
echo "🔨 Generating keystore..."
echo ""

# Generate keystore
keytool -genkey -v \
    -keystore "$KEYSTORE_FILE" \
    -alias rahul-catering-key \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$KEYSTORE_PASS" \
    -keypass "$KEY_PASS" \
    -dname "CN=Rahul Catering, OU=Catering Services, O=Rahul Catering, L=Unknown, ST=Unknown, C=IN"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Keystore created successfully!"
    echo ""
    echo "📄 Keystore Details:"
    echo "   Location: $KEYSTORE_FILE"
    echo "   Alias: rahul-catering-key"
    echo "   Validity: 27 years"
    echo ""
    echo "🔐 IMPORTANT - Save These Credentials:"
    echo "======================================"
    echo "Keystore Password: $KEYSTORE_PASS"
    echo "Key Password: $KEY_PASS"
    echo "Keystore Path: $KEYSTORE_FILE"
    echo "Key Alias: rahul-catering-key"
    echo ""
    
    # Save credentials to a file
    CRED_FILE="$KEYSTORE_DIR/keystore-credentials.txt"
    cat > "$CRED_FILE" << EOF
Rahul Catering App - Keystore Credentials
==========================================

IMPORTANT: Keep this file secure and backup in a safe location!
If you lose these credentials, you cannot update the app on Play Store.

Keystore File: $KEYSTORE_FILE
Key Alias: rahul-catering-key
Keystore Password: $KEYSTORE_PASS
Key Password: $KEY_PASS

Created: $(date)
Validity: 27 years (until $(date -v+27y +%Y-%m-%d 2>/dev/null || date -d "+27 years" +%Y-%m-%d 2>/dev/null || echo "2053"))

To sign APK manually:
----------------------
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \\
    -keystore $KEYSTORE_FILE \\
    -storepass $KEYSTORE_PASS \\
    -keypass $KEY_PASS \\
    app-release-unsigned.apk rahul-catering-key

To verify signature:
--------------------
jarsigner -verify -verbose -certs app-release-unsigned.apk
EOF
    
    echo "💾 Credentials saved to: $CRED_FILE"
    echo ""
    echo "⚠️  BACKUP THESE FILES:"
    echo "   1. $KEYSTORE_FILE"
    echo "   2. $CRED_FILE"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Configure build.gradle to use this keystore"
    echo "   2. Run: ./gradlew assembleRelease"
    echo ""
else
    echo "❌ Failed to create keystore"
    exit 1
fi
