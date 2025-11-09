# Firebase Setup Guide for BlueCred

This guide will help you set up Firebase Authentication and Firestore Database for the BlueCred project.

## 📋 Prerequisites

1. A Google account
2. A web browser
3. Basic understanding of web development

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `bluecred` (or your preferred name)
4. Click **Continue**
5. (Optional) Enable Google Analytics - you can skip this
6. Click **Create project**
7. Wait for project creation (takes ~30 seconds)
8. Click **Continue**

## 🔐 Step 2: Enable Authentication

1. In Firebase Console, click **Authentication** in the left menu
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Enable **Email/Password** (toggle ON)
6. Click **Save**

## 💾 Step 3: Create Firestore Database

1. In Firebase Console, click **Firestore Database** in the left menu
2. Click **Create database**
3. Select **Start in test mode** (for development)
   - ⚠️ **Note**: We'll add security rules later
4. Choose a location (select closest to your users)
5. Click **Enable**

## 🔑 Step 4: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. Register app:
   - App nickname: `BlueCred Web`
   - (Optional) Check "Also set up Firebase Hosting"
   - Click **Register app**
6. Copy the `firebaseConfig` object that appears

## 📝 Step 5: Configure Your Project

1. Copy `firebase-config.template.js` to `firebase-config.js`:
   ```bash
   cp firebase-config.template.js firebase-config.js
   ```

2. Open `firebase-config.js` and replace the placeholder values with your actual Firebase config:

   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // Your actual API key
     authDomain: "your-project.firebaseapp.com",     // Your actual domain
     projectId: "your-project-id",                      // Your actual project ID
     storageBucket: "your-project.appspot.com",       // Your actual bucket
     messagingSenderId: "123456789",                  // Your actual sender ID
     appId: "1:123456789:web:abcdef123456"            // Your actual app ID
   };
   ```

3. **⚠️ IMPORTANT**: Make sure `firebase-config.js` is in `.gitignore` (it already is)

## 🔒 Step 6: Set Up Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click on **Rules** tab
3. Copy the contents of `firestore.rules` file from this project
4. Paste it into the Firebase Console rules editor
5. Click **Publish**

### Security Rules Overview:
- Users can only read/write their own data
- Carbon credits and projects are publicly readable
- Only authenticated users can create new records
- Only creators can update/delete their records

## ✅ Step 7: Test Your Setup

1. Open `auth.html` in your browser
2. Try creating a new account
3. Check Firebase Console:
   - **Authentication** > **Users** - should show your new user
   - **Firestore Database** > **Data** - should show a `users` collection with your data

## 🎯 Step 8: Verify Everything Works

1. **Sign Up Test**:
   - Create a new account
   - Check if user appears in Firebase Authentication
   - Check if user data appears in Firestore `users` collection

2. **Login Test**:
   - Log out
   - Log in with the same credentials
   - Should redirect to `registry.html`

3. **Logout Test**:
   - Click logout button
   - Should redirect to home page
   - Should not be able to access `registry.html` without login

## 📁 Project Structure

```
Bluecred-ffronntend-main/
├── .gitignore              ✅ Protects sensitive files
├── firebase-config.js      ⚠️ Your actual config (not in git)
├── firebase-config.template.js  ✅ Template (safe to commit)
├── firestore.rules         ✅ Security rules
├── auth.html               ✅ Login/signup page
├── auth.js                 ✅ Firebase authentication logic
└── FIREBASE_SETUP.md       ✅ This file
```

## 🔒 Security Best Practices

1. **Never commit `firebase-config.js`** with real credentials to GitHub
2. **Always use security rules** - don't leave Firestore in test mode
3. **Enable App Check** (optional but recommended for production)
4. **Use environment variables** for production deployments
5. **Regularly review** your security rules

## 🐛 Troubleshooting

### Error: "Firebase not configured"
- Make sure `firebase-config.js` exists and has your actual config
- Check browser console for specific errors

### Error: "Permission denied"
- Check Firestore security rules
- Make sure user is authenticated
- Verify rules are published

### Error: "Email already in use"
- User already exists - try logging in instead
- Or delete user from Firebase Console > Authentication

### Can't access Firestore
- Make sure Firestore is enabled in Firebase Console
- Check that security rules allow your operation
- Verify you're authenticated

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Firebase Console for any error messages
3. Verify all steps were completed correctly
4. Make sure Firebase services are enabled

---

**✅ Setup Complete!** Your BlueCred project is now using Firebase for secure authentication and data storage.

