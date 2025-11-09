// Authentication JavaScript for BlueCred with Firebase
// Make sure Firebase SDK is loaded before this script

// Initialize Firebase (will be set after Firebase SDK loads)
let auth, db, analytics;

// Initialize Firebase when SDK is ready
function initializeFirebase() {
  try {
    // Get config from firebase-config.js (loaded as script before this file)
    // Check window.firebaseConfig first (set by firebase-config.js)
    const config = window.firebaseConfig;
    
    if (!config) {
      console.error('❌ Firebase config not found! Make sure firebase-config.js is loaded before auth.js');
      console.error('   Check that firebase-config.js script tag comes before auth.js in HTML');
      showError('loginEmail', 'Firebase configuration missing. Please contact administrator.');
      return false;
    }
    
    if (!config.apiKey || config.apiKey === "YOUR_API_KEY_HERE") {
      console.error('❌ Firebase not configured! Please set up firebase-config.js with your actual config');
      showError('loginEmail', 'Firebase configuration missing. Please contact administrator.');
      return false;
    }

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    // Initialize services
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Initialize Analytics if available
    if (firebase.analytics && typeof firebase.analytics !== 'undefined') {
      try {
        analytics = firebase.analytics();
        console.log('📊 Analytics initialized');
      } catch (error) {
        console.warn('Analytics initialization skipped:', error);
      }
    }

    console.log('✅ Firebase initialized successfully');
    console.log('📊 Firestore database:', db);
    console.log('🔐 Authentication service:', auth);
    console.log('📈 Analytics:', analytics ? 'enabled' : 'not available');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    showError('loginEmail', 'Firebase initialization failed. Please refresh the page.');
    return false;
  }
}

// Tab switching functionality
function switchTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const successMessage = document.getElementById('successMessage');
  const industryContactInfo = document.getElementById('industryContactInfo');
  const regularSignupForm = document.getElementById('regularSignupForm');

  // Hide success message
  successMessage.classList.remove('show');

  if (tab === 'login') {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  } else {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    
    // Check if this is industry flow - show contact info instead of signup form
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const registryType = localStorage.getItem('bluecred_registry_type');
    
    if ((type === 'industry' || registryType === 'industry') && industryContactInfo && regularSignupForm) {
      industryContactInfo.style.display = 'block';
      regularSignupForm.style.display = 'none';
    } else if (industryContactInfo && regularSignupForm) {
      industryContactInfo.style.display = 'none';
      regularSignupForm.style.display = 'block';
    }
  }

  // Clear all form errors
  clearErrors();
  
  // Replace feather icons after tab switch
  setTimeout(() => feather.replace(), 100);
}

// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  const icon = button.querySelector('i');

  if (input.type === 'password') {
    input.type = 'text';
    icon.setAttribute('data-feather', 'eye-off');
  } else {
    input.type = 'password';
    icon.setAttribute('data-feather', 'eye');
  }
  
  feather.replace();
}

// Clear all error messages
function clearErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  const errorInputs = document.querySelectorAll('.form-input.error');
  
  errorMessages.forEach(msg => {
    msg.classList.remove('show');
    msg.textContent = '';
  });
  
  errorInputs.forEach(input => {
    input.classList.remove('error');
  });
}

// Show error message
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(inputId + 'Error');
  
  if (input) {
    input.classList.add('error');
  }
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password strength
function validatePassword(password) {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return {
    valid: minLength && hasUpperCase && hasLowerCase && hasNumber,
    errors: {
      minLength: !minLength ? 'Password must be at least 8 characters' : null,
      hasUpperCase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      hasLowerCase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      hasNumber: !hasNumber ? 'Password must contain at least one number' : null
    }
  };
}

// Handle Login Form Submission with Firebase
async function handleLogin(event) {
  event.preventDefault();
  clearErrors();

  if (!auth || !db) {
    if (!initializeFirebase()) return;
  }

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const loginBtn = document.getElementById('loginBtn');

  // Validation
  let isValid = true;

  if (!email) {
    showError('loginEmail', 'Email is required');
    isValid = false;
  } else if (!validateEmail(email)) {
    showError('loginEmail', 'Please enter a valid email address');
    isValid = false;
  }

  if (!password) {
    showError('loginPassword', 'Password is required');
    isValid = false;
  } else if (password.length < 6) {
    showError('loginPassword', 'Password must be at least 6 characters');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Disable button during submission
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i data-feather="loader" class="inline w-4 h-4 mr-2 animate-spin"></i> Signing in...';
  feather.replace();

  try {
    // Sign in with Firebase Auth
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      
      console.log('📖 Fetching user data from Firestore...');
      console.log('   Collection: users');
      console.log('   Document ID:', user.uid);
      console.log('   Document exists:', userDoc.exists);
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log('✅ User data retrieved:', userData);
      
      // Store session in localStorage (for navbar display)
      localStorage.setItem('bluecred_current_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: userData.firstName + ' ' + userData.lastName,
        company: userData.company || '',
        loginTime: new Date().toISOString()
      }));

      // Log session to Firestore
      const loginSessionData = {
        userId: user.uid,
        email: user.email,
        loginTime: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent
      };
      
      const loginSessionRef = await db.collection('sessions').add(loginSessionData);
      
      console.log('✅ Login session logged to Firestore:');
      console.log('   Collection: sessions');
      console.log('   Document ID:', loginSessionRef.id);
      console.log('📝 Check Firebase Console > Firestore Database > sessions collection');

      // Log analytics event
      if (analytics) {
        try {
          analytics.logEvent('login', { method: 'email' });
        } catch (e) {
          console.warn('Analytics event failed:', e);
        }
      }

      // Show success message
      showSuccess('Login successful! Redirecting to Registry...');

      // Redirect to registry after 1.5 seconds
      // Check if user came from industry flow
      const registryType = localStorage.getItem('bluecred_registry_type');
      if (registryType === 'industry') {
        setTimeout(() => {
          window.location.href = 'registry.html';
        }, 1500);
      } else {
        // For non-industry users, redirect to selection page
        setTimeout(() => {
          window.location.href = 'registry-selection.html';
        }, 1500);
      }
    } else {
      throw new Error('User data not found in database');
    }
  } catch (error) {
    // Re-enable button
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i data-feather="log-in" class="inline w-4 h-4 mr-2"></i> Sign In';
    feather.replace();

    // Handle Firebase errors
    let errorMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        showError('loginEmail', errorMessage);
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        showError('loginPassword', errorMessage);
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        showError('loginEmail', errorMessage);
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        showError('loginEmail', errorMessage);
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        showError('loginPassword', errorMessage);
        break;
      default:
        errorMessage = error.message || 'Login failed. Please try again.';
        showError('loginPassword', errorMessage);
    }
    
    console.error('Login error:', error);
  }
}

// Handle Signup Form Submission with Firebase
async function handleSignup(event) {
  event.preventDefault();
  clearErrors();

  if (!auth || !db) {
    if (!initializeFirebase()) return;
  }

  const firstName = document.getElementById('signupFirstName').value.trim();
  const lastName = document.getElementById('signupLastName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const company = document.getElementById('signupCompany').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const signupBtn = document.getElementById('signupBtn');

  // Validation
  let isValid = true;

  if (!firstName) {
    showError('signupFirstName', 'First name is required');
    isValid = false;
  }

  if (!lastName) {
    showError('signupLastName', 'Last name is required');
    isValid = false;
  }

  if (!email) {
    showError('signupEmail', 'Email is required');
    isValid = false;
  } else if (!validateEmail(email)) {
    showError('signupEmail', 'Please enter a valid email address');
    isValid = false;
  }

  if (!password) {
    showError('signupPassword', 'Password is required');
    isValid = false;
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      const firstError = Object.values(passwordValidation.errors).find(e => e !== null);
      showError('signupPassword', firstError);
      isValid = false;
    }
  }

  if (!confirmPassword) {
    showError('signupConfirmPassword', 'Please confirm your password');
    isValid = false;
  } else if (password !== confirmPassword) {
    showError('signupConfirmPassword', 'Passwords do not match');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Disable button during submission
  signupBtn.disabled = true;
  signupBtn.innerHTML = '<i data-feather="loader" class="inline w-4 h-4 mr-2 animate-spin"></i> Creating account...';
  feather.replace();

  try {
    // Create user with Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Save user data to Firestore
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      company: company || '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      emailVerified: false
    };
    
    await db.collection('users').doc(user.uid).set(userData);
    
    // Log success for testing
    console.log('✅ User data saved to Firestore:');
    console.log('   Collection: users');
    console.log('   Document ID:', user.uid);
    console.log('   Data:', { ...userData, createdAt: 'timestamp', updatedAt: 'timestamp' });
    console.log('📝 Check Firebase Console > Firestore Database > users collection');

    // Store session in localStorage (for navbar display)
    localStorage.setItem('bluecred_current_user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: firstName + ' ' + lastName,
      company: company || '',
      loginTime: new Date().toISOString()
    }));

    // Log session to Firestore
    const sessionData = {
      userId: user.uid,
      email: user.email,
      loginTime: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent,
      isSignup: true
    };
    
    const sessionRef = await db.collection('sessions').add(sessionData);
    
    // Log success for testing
    console.log('✅ Session logged to Firestore:');
    console.log('   Collection: sessions');
    console.log('   Document ID:', sessionRef.id);
    console.log('   Data:', { ...sessionData, loginTime: 'timestamp' });
    console.log('📝 Check Firebase Console > Firestore Database > sessions collection');

    // Send email verification (optional)
    try {
      await user.sendEmailVerification();
      console.log('Email verification sent');
    } catch (emailError) {
      console.warn('Could not send verification email:', emailError);
    }

    // Log analytics event
    if (analytics) {
      try {
        analytics.logEvent('sign_up', { method: 'email' });
      } catch (e) {
        console.warn('Analytics event failed:', e);
      }
    }

    // Show success message
    showSuccess('Account created successfully! Redirecting to Registry...');

    // Redirect to registry after 1.5 seconds
    // Check if user came from industry flow
    const registryType = localStorage.getItem('bluecred_registry_type');
    if (registryType === 'industry') {
      setTimeout(() => {
        window.location.href = 'registry.html';
      }, 1500);
    } else {
      // For non-industry users, redirect to selection page
      setTimeout(() => {
        window.location.href = 'registry-selection.html';
      }, 1500);
    }
  } catch (error) {
    // Re-enable button
    signupBtn.disabled = false;
    signupBtn.innerHTML = '<i data-feather="user-plus" class="inline w-4 h-4 mr-2"></i> Create Account';
    feather.replace();

    // Handle Firebase errors
    let errorMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered. Please sign in instead.';
        showError('signupEmail', errorMessage);
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        showError('signupEmail', errorMessage);
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
        showError('signupEmail', errorMessage);
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please use a stronger password.';
        showError('signupPassword', errorMessage);
        break;
      default:
        errorMessage = error.message || 'Signup failed. Please try again.';
        showError('signupEmail', errorMessage);
    }
    
    console.error('Signup error:', error);
  }
}

// Show success message
function showSuccess(message) {
  const successMessage = document.getElementById('successMessage');
  const successText = document.getElementById('successText');
  
  successText.textContent = message;
  successMessage.classList.add('show');
  
  // Replace feather icon
  setTimeout(() => feather.replace(), 100);
}

// Social login handlers (for future implementation)
function socialLogin(provider) {
  if (!auth) {
    if (!initializeFirebase()) return;
  }

  showSuccess(`Redirecting to ${provider} login...`);
  
  // TODO: Implement OAuth providers
  // Example for Google:
  // const provider = new firebase.auth.GoogleAuthProvider();
  // auth.signInWithPopup(provider).then(...)
  
  setTimeout(() => {
    alert(`Social login with ${provider} will be implemented soon. Please use email/password login for now.`);
  }, 500);
}

// Social signup handlers (for future implementation)
function socialSignup(provider) {
  if (!auth) {
    if (!initializeFirebase()) return;
  }

  showSuccess(`Redirecting to ${provider} signup...`);
  
  // TODO: Implement OAuth providers
  setTimeout(() => {
    alert(`Social signup with ${provider} will be implemented soon. Please use email/password signup for now.`);
  }, 500);
}

// Check if user is already logged in
function checkAuthStatus() {
  if (!auth) {
    if (!initializeFirebase()) return;
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in, check registry type
      const registryType = localStorage.getItem('bluecred_registry_type');
      if (registryType === 'industry') {
        window.location.href = 'registry.html';
      } else {
        window.location.href = 'registry-selection.html';
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Firebase SDK to load
  if (typeof firebase !== 'undefined') {
    initializeFirebase();
    checkAuthStatus();
  } else {
    console.error('Firebase SDK not loaded! Make sure Firebase scripts are included before auth.js');
  }
  
  // Add loading animation for buttons
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);
});
