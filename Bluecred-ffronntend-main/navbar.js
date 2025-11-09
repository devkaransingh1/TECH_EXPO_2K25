class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid #E6F1EE;
          transition: all 0.3s ease;
        }

        header {
          padding: 1rem 0;
        }

        .container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .logo-circle {
          position: relative;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(to bottom right, #0F2C3D, #22C55E);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon {
          color: white;
          width: 1.5rem;
          height: 1.5rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(to right, #0F2C3D, #22C55E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          position: relative;
        }

        .nav-links {
          display: none;
          gap: 1.75rem;
        }

        .user-section {
          display: none;
          align-items: center;
          gap: 0.75rem;
          position: absolute;
          right: 0;
          top: 0;
        }

        .user-section.show {
          display: flex;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1rem;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(34, 197, 94, 0.08));
          border-radius: 0.875rem;
          border: 1.5px solid rgba(37, 99, 235, 0.15);
          backdrop-filter: blur(10px);
        }

        .user-avatar {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563EB, #22C55E);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.75rem;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .user-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6B7280;
          line-height: 1.2;
          display: none;
        }

        .company-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0F2C3D;
          line-height: 1.2;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #2563EB, #22C55E);
          color: white;
          border: none;
          border-radius: 0.875rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
          position: relative;
          overflow: hidden;
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .logout-btn:hover::before {
          left: 100%;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .logout-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .logout-icon {
          width: 1.125rem;
          height: 1.125rem;
          stroke-width: 2.5;
        }

        @media (min-width: 640px) {
          .user-name {
            display: block;
          }
          .company-name {
            max-width: 200px;
          }
        }

        @media (min-width: 768px) {
          .company-name {
            max-width: 250px;
          }
        }

        .nav-links a {
          font-weight: 500;
          color: #0F172A;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .nav-links a:hover {
          color: #2563EB;
        }

        .nav-links a.active {
          color: #22C55E;
          font-weight: 600;
        }

        .cta {
          background: linear-gradient(to right, #22C55E, #19A84B);
          color: white;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 9999px;
          font-weight: 500;
          box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .cta:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(34, 197, 94, 0.4);
        }

        /* Mobile menu */
        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
        }

        .menu-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: #0F172A;
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          text-align: center;
          gap: 1rem;
          background: white;
          border-top: 1px solid #E6F1EE;
          padding: 1rem 0;
          margin-top: 0.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .mobile-menu.show {
          display: flex;
        }

        .mobile-menu a {
          color: #0F172A;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .mobile-menu a:hover {
          color: #2563EB;
        }

        .mobile-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(to right, #2563EB, #22C55E);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }

        .mobile-logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }

        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
          .menu-toggle {
            display: none;
          }
          .mobile-menu {
            display: none !important;
          }
        }
      </style>

      <header>
        <div class="container">
          <!-- Logo -->
          <div class="logo">
            <div class="logo-circle">
              <svg xmlns="http://www.w3.org/2000/svg" class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
            </div>
            <h1 class="logo-text">BlueCred</h1>
          </div>

          <!-- Nav Links -->
          <nav>
            <div class="nav-links">
              <a href="index.html">Home</a>
              <a href="dashboard.html">Dashboard</a>
              <a href="registry-selection.html">Registry</a>
              <a href="cni.html">CNI</a>
            </div>
            <button class="menu-toggle" aria-label="Toggle Menu">
              <svg xmlns="http://www.w3.org/2000/svg" class="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="#get-started" class="cta" id="getStartedBtn">Get Started</a>
            
            <!-- User Section (shown when logged in) -->
            <div class="user-section" id="userSection">
              <div class="user-info">
                <div class="user-avatar" id="userAvatar">U</div>
                <div class="user-details">
                  <span class="company-name" id="companyName">Company</span>
                  <span class="user-name" id="userName">User</span>
                </div>
              </div>
              <button class="logout-btn" id="logoutBtn" onclick="handleLogout()">
                <svg xmlns="http://www.w3.org/2000/svg" class="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </nav>

          <!-- Mobile Menu -->
          <div class="mobile-menu">
            <a href="index.html">Home</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="registry-selection.html">Registry</a>
            <a href="cni.html">CNI</a>
            <button class="mobile-logout-btn" id="mobileLogoutBtn" onclick="handleLogout()" style="display: none;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>
    `;

    // JS Interactivity (menu toggle + active highlight)
    const mobileMenu = this.shadowRoot.querySelector(".mobile-menu");
    const toggleBtn = this.shadowRoot.querySelector(".menu-toggle");
    const navLinks = this.shadowRoot.querySelectorAll(".nav-links a, .mobile-menu a");
    const userSection = this.shadowRoot.querySelector("#userSection");
    const getStartedBtn = this.shadowRoot.querySelector("#getStartedBtn");
    const userAvatar = this.shadowRoot.querySelector("#userAvatar");
    const userName = this.shadowRoot.querySelector("#userName");
    const companyName = this.shadowRoot.querySelector("#companyName");
    const mobileLogoutBtn = this.shadowRoot.querySelector("#mobileLogoutBtn");

    toggleBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("show");
    });

    // Highlight current page
    const current = window.location.pathname.split("/").pop();
    navLinks.forEach(link => {
      if (link.getAttribute("href") === current) {
        link.classList.add("active");
      }
    });

    // Check authentication status and show/hide user section
    async function checkAuthStatus() {
      let isAuthenticated = false;
      let userData = null;
      
      // First, check Firebase Auth state (most reliable)
      if (typeof firebase !== 'undefined' && firebase.auth) {
        try {
          const auth = firebase.auth();
          const currentFirebaseUser = auth.currentUser;
          
          if (currentFirebaseUser) {
            isAuthenticated = true;
            
            // Try to get user data from Firestore if not in localStorage
            const storedUser = localStorage.getItem('bluecred_current_user');
            if (storedUser) {
              try {
                userData = JSON.parse(storedUser);
              } catch (e) {
                console.warn('Error parsing stored user data:', e);
              }
            }
            
            // If no localStorage data, fetch from Firestore
            if (!userData && firebase.firestore) {
              try {
                const db = firebase.firestore();
                const userDoc = await db.collection('users').doc(currentFirebaseUser.uid).get();
                
                if (userDoc.exists) {
                  const firestoreData = userDoc.data();
                  userData = {
                    uid: currentFirebaseUser.uid,
                    email: currentFirebaseUser.email,
                    name: (firestoreData.firstName || '') + ' ' + (firestoreData.lastName || ''),
                    company: firestoreData.company || '',
                    loginTime: new Date().toISOString()
                  };
                  
                  // Store in localStorage for future use
                  localStorage.setItem('bluecred_current_user', JSON.stringify(userData));
                } else {
                  // Fallback to Firebase Auth data
                  userData = {
                    uid: currentFirebaseUser.uid,
                    email: currentFirebaseUser.email,
                    name: currentFirebaseUser.displayName || currentFirebaseUser.email?.split('@')[0] || 'User',
                    company: '',
                    loginTime: new Date().toISOString()
                  };
                }
              } catch (error) {
                console.warn('Error fetching user data from Firestore:', error);
                // Fallback to Firebase Auth data
                userData = {
                  uid: currentFirebaseUser.uid,
                  email: currentFirebaseUser.email,
                  name: currentFirebaseUser.displayName || currentFirebaseUser.email?.split('@')[0] || 'User',
                  company: '',
                  loginTime: new Date().toISOString()
                };
              }
            }
          }
        } catch (error) {
          console.warn('Error checking Firebase Auth:', error);
        }
      }
      
      // Fallback: Check localStorage if Firebase Auth not available
      if (!isAuthenticated) {
        const storedUser = localStorage.getItem('bluecred_current_user');
        if (storedUser) {
          try {
            userData = JSON.parse(storedUser);
            isAuthenticated = true;
          } catch (e) {
            console.error('Error parsing stored user data:', e);
          }
        }
      }
      
      // Update UI based on authentication status
      if (isAuthenticated && userData) {
        // Show user section
        if (userSection) {
          userSection.classList.add("show");
        }
        
        // Hide "Get Started" button
        if (getStartedBtn) {
          getStartedBtn.style.display = "none";
        }
        
        // Show mobile logout button
        if (mobileLogoutBtn) {
          mobileLogoutBtn.style.display = "flex";
        }
        
        // Update company name (from Firestore, stored in localStorage)
        if (companyName) {
          if (userData.company && userData.company.trim() !== '') {
            companyName.textContent = userData.company;
          } else {
            // If no company, show user's name instead
            companyName.textContent = userData.name ? userData.name.split(' ')[0] : 'User';
          }
        }
        
        // Update user name (first name or email username)
        if (userName) {
          if (userData.name) {
            userName.textContent = userData.name.split(' ')[0]; // First name only
          } else if (userData.email) {
            userName.textContent = userData.email.split('@')[0]; // Email username
          } else {
            userName.textContent = 'User';
          }
        }
        
        // Update avatar with first letter of company name or user name
        if (userAvatar) {
          let firstLetter = 'U';
          if (userData.company && userData.company.trim() !== '') {
            firstLetter = userData.company.charAt(0).toUpperCase();
          } else if (userData.name) {
            firstLetter = userData.name.charAt(0).toUpperCase();
          } else if (userData.email) {
            firstLetter = userData.email.charAt(0).toUpperCase();
          }
          userAvatar.textContent = firstLetter;
        }
      } else {
        // Hide user section
        if (userSection) {
          userSection.classList.remove("show");
        }
        
        // Show "Get Started" button
        if (getStartedBtn) {
          getStartedBtn.style.display = "block";
        }
        
        // Hide mobile logout button
        if (mobileLogoutBtn) {
          mobileLogoutBtn.style.display = "none";
        }
      }
    }

    // Check auth status on load
    checkAuthStatus();
    
    // Listen for Firebase Auth state changes
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        firebase.auth().onAuthStateChanged((user) => {
          checkAuthStatus();
        });
      } catch (error) {
        console.warn('Could not set up Firebase Auth listener:', error);
      }
    }
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for custom auth status change event
    window.addEventListener('authStatusChanged', checkAuthStatus);
    
    // Also check periodically (in case of same-tab logout)
    setInterval(checkAuthStatus, 2000);
  }
}

// Global logout function (accessible from shadow DOM)
window.handleLogout = async function() {
  // Clear user session from localStorage
  localStorage.removeItem('bluecred_current_user');
  
  // Sign out from Firebase if available
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      await firebase.auth().signOut();
      console.log('✅ Signed out from Firebase');
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }
  }
  
  // Dispatch custom event to update navbar immediately
  window.dispatchEvent(new CustomEvent('authStatusChanged'));
  
  // Show logout message
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(to right, #2563EB, #22C55E);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  message.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Logged out successfully
  `;
  document.body.appendChild(message);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Remove message after 2 seconds
  setTimeout(() => {
    message.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => message.remove(), 300);
  }, 2000);
  
  // Redirect to home page
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
};

customElements.define("custom-navbar", CustomNavbar);
