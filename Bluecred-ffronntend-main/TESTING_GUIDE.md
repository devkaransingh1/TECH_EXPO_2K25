# Testing Guide: Verify Firestore Data Storage

This guide will help you test and verify that data is being stored in Firebase Firestore.

## 📧 Which Gmail Account is Used?

The Gmail account used is the **one you used to create your Firebase project**:
- Go to [Firebase Console](https://console.firebase.google.com/)
- Check the account in the top-right corner
- This is the account that has access to your Firebase project

**Note**: The Gmail account for Firebase Console access is different from user accounts created in your app. Users sign up with their own emails in your app.

## 🧪 Step-by-Step Testing Process

### Step 1: Set Up Firebase (If Not Done)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Gmail account
3. Create a project (if you haven't already)
4. Enable Authentication and Firestore (see FIREBASE_SETUP.md)

### Step 2: Configure Your Project

1. Copy `firebase-config.template.js` to `firebase-config.js`
2. Get your Firebase config from Firebase Console:
   - Project Settings > General > Your apps > Web app
3. Paste your config into `firebase-config.js`

### Step 3: Test Sign Up

1. Open `auth.html` in your browser
2. Click on **Sign Up** tab
3. Fill in the form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com` (use a real email you can access)
   - Company: `Test Company` (optional)
   - Password: `Test1234` (must have uppercase, lowercase, number, 8+ chars)
   - Confirm Password: `Test1234`
4. Check "I agree to Terms"
5. Click **Create Account**

### Step 4: Verify in Firebase Console

#### Check Authentication:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** in left menu
4. Click **Users** tab
5. You should see:
   - Email: `test@example.com`
   - User UID: (a long string
   - Provider: `password`

#### Check Firestore Database:
1. In Firebase Console, click **Firestore Database**
2. Click **Data** tab
3. You should see collections:
   - `users` collection
   - `sessions` collection

4. Click on `users` collection
5. You should see a document with your user's UID
6. Click on that document to see:
   ```
   firstName: "Test"
   lastName: "User"
   email: "test@example.com"
   company: "Test Company"
   createdAt: (timestamp)
   updatedAt: (timestamp)
   ```

5. Click on `sessions` collection
6. You should see a document with:
   ```
   userId: (your user UID)
   email: "test@example.com"
   loginTime: (timestamp)
   userAgent: (browser info)
   isSignup: true
   ```

### Step 5: Test Login

1. In your browser, click **Logout** (if logged in)
2. Go to `auth.html`
3. Click **Login** tab
4. Enter:
   - Email: `test@example.com`
   - Password: `Test1234`
5. Click **Sign In**
6. Should redirect to `registry.html`

### Step 6: Verify New Session Created

1. Go back to Firebase Console
2. Check `sessions` collection
3. You should see a NEW document with:
   - `isSignup: false` (or missing, meaning it's a login)
   - `loginTime: (new timestamp)`

## 🔍 Browser Console Testing

Open browser DevTools (F12) to see real-time logs:

1. Open `auth.html`
2. Press F12 to open DevTools
3. Go to **Console** tab
4. You'll see:
   - `✅ Firebase initialized successfully` (when page loads)
   - Any errors if Firebase isn't configured
   - Login/signup success messages

## 📊 Visual Verification Checklist

After signing up, verify in Firebase Console:

- [ ] User appears in **Authentication > Users**
- [ ] User document exists in **Firestore > users** collection
- [ ] Session document exists in **Firestore > sessions** collection
- [ ] All fields are correct (name, email, company)
- [ ] Timestamps are present

## 🐛 Troubleshooting

### "Firebase not configured" error
- Check that `firebase-config.js` exists
- Verify config has your actual Firebase keys (not placeholders)
- Check browser console for specific errors

### User created but no Firestore data
- Check Firestore security rules
- Make sure rules allow authenticated users to write
- Check browser console for permission errors

### Can't see data in Firebase Console
- Refresh the page
- Make sure you're looking at the correct project
- Check that Firestore is enabled (not Realtime Database)

## 🎯 Quick Test Script

You can also test directly in browser console:

1. Open `auth.html`
2. Open DevTools Console (F12)
3. After Firebase loads, type:
   ```javascript
   // Check if Firebase is initialized
   console.log('Firebase:', typeof firebase !== 'undefined');
   console.log('Auth:', firebase.auth());
   console.log('Firestore:', firebase.firestore());
   
   // Check current user (after login)
   firebase.auth().onAuthStateChanged(user => {
     if (user) {
       console.log('Logged in user:', user.email);
       console.log('User UID:', user.uid);
     }
   });
   ```

## 📝 Expected Data Structure

### In Firestore `users` collection:
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "company": "Test Company",
  "createdAt": "2025-01-XX...",
  "updatedAt": "2025-01-XX...",
  "emailVerified": false
}
```

### In Firestore `sessions` collection:
```json
{
  "userId": "abc123...",
  "email": "test@example.com",
  "loginTime": "2025-01-XX...",
  "userAgent": "Mozilla/5.0...",
  "isSignup": true
}
```

## ✅ Success Indicators

You'll know it's working when:
1. ✅ No errors in browser console
2. ✅ User appears in Firebase Authentication
3. ✅ Data appears in Firestore `users` collection
4. ✅ Session appears in Firestore `sessions` collection
5. ✅ Can login with created credentials
6. ✅ Redirects to registry.html after login

---

**Need Help?** Check browser console for error messages!

