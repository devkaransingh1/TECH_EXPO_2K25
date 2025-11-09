class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: linear-gradient(to right, #BEE9FF, #DFF8F0);
          padding: 1.5rem 0;
          margin-top: 3rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-content {
            flex-direction: row;
            text-align: left;
          }
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-bg {
          position: relative;
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          background: linear-gradient(to bottom right, #2563EB, #22C55E);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon {
          color: white;
          width: 1rem;
          height: 1rem;
        }

        .brand-text {
          font-size: 0.875rem;
          color: #0F172A;
        }

        .contact-area {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .contact-area {
            justify-content: flex-end;
          }
        }

        .email {
          color: #0F172A;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .email:hover {
          color: #2563EB;
        }

        .socials {
          display: flex;
          gap: 0.75rem;
        }

        .socials a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #0F172A;
          transition: color 0.3s ease;
        }

        .socials a:hover {
          color: #2563EB;
        }

        svg {
          width: 20px;
          height: 20px;
        }
      </style>

      <footer>
        <div class="container">
          <div class="footer-content">
            
            <!-- Logo + Copyright -->
            <div class="logo-area">
              <div class="logo-bg">
                <svg xmlns="http://www.w3.org/2000/svg" class="logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <p class="brand-text">BlueCred © 2025 BlueCred. All rights reserved.</p>
            </div>

            <!-- Contact + Social -->
            <div class="contact-area">
              <a href="mailto:contact@bluecred.io" class="email">contact@bluecred.io</a>
              <div class="socials">
                <a href="#" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("custom-footer", CustomFooter);
