
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

  // ---- DOM elements ----
  const loginBtn = document.getElementById('loginBtn');
  const loginModalEl = document.getElementById('loginModal');
  const signupModalEl = document.getElementById('signupModal');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignupLink = document.getElementById('showSignupLink');
  const showLoginLink = document.getElementById('showLoginLink');
  const loginMessage = document.getElementById('loginMessage');
  const signupMessage = document.getElementById('signupMessage');

  // Bootstrap modal instances
  let loginModal, signupModal;
  if (loginModalEl) loginModal = new bootstrap.Modal(loginModalEl);
  if (signupModalEl) signupModal = new bootstrap.Modal(signupModalEl);

  // ---- Helper: show error/success messages ----
  function showMessage(element, text, isError = true) {
    if (!element) return;
    element.innerHTML = text;
    element.style.color = isError ? '#ef476f' : '#06d6a0';
    setTimeout(() => {
      if (element.innerHTML === text) element.innerHTML = '';
    }, 4000);
  }

  // ---- Login button click ----
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      // Check if already logged in
      const token = localStorage.getItem('token');
      if (token) {
        alert('You are already logged in!');
        return;
      }
      if (loginModal) loginModal.show();
    });
  }

  // ---- Switch between modals ----
  if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) loginModal.hide();
      if (signupModal) signupModal.show();
    });
  }
  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (signupModal) signupModal.hide();
      if (loginModal) loginModal.show();
    });
  }

  // ---- LOGIN SUBMIT ----
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!email || !password) {
        showMessage(loginMessage, '❌ Please fill all fields', true);
        return;
      }

      // Disable button to prevent double submit
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Logging in...';

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Save token and user info
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          showMessage(loginMessage, '✅ Login successful! Redirecting...', false);
          // Update UI
          if (loginBtn) loginBtn.innerHTML = `<i class="fas fa-user-check"></i> Dashboard`;
          setTimeout(() => {
            if (loginModal) loginModal.hide();
            window.location.reload(); // or just update UI without reload
          }, 1500);
        } else {
          showMessage(loginMessage, `❌ ${data.message || 'Login failed'}`, true);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showMessage(loginMessage, '❌ Cannot connect to server. Is backend running on port 5000?', true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // ---- SIGNUP SUBMIT ----
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;

      if (!name || !email || !password) {
        showMessage(signupMessage, '❌ All fields are required', true);
        return;
      }
      if (password.length < 6) {
        showMessage(signupMessage, '❌ Password must be at least 6 characters', true);
        return;
      }

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Creating account...';

      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          showMessage(signupMessage, '✅ Account created! Logging in...', false);
          if (loginBtn) loginBtn.innerHTML = `<i class="fas fa-user-check"></i> Dashboard`;
          setTimeout(() => {
            if (signupModal) signupModal.hide();
            window.location.reload();
          }, 1500);
        } else {
          showMessage(signupMessage, `❌ ${data.message || 'Registration failed'}`, true);
        }
      } catch (error) {
        console.error(error);
        showMessage(signupMessage, '❌ Server unreachable. Make sure backend is running.', true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // ---- Restore session on page load ----
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  if (token && savedUser && loginBtn) {
    try {
      const user = JSON.parse(savedUser);
      loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${user.name || 'Dashboard'}`;
    } catch (e) { }
  }

  // ---- Theme Toggle ----
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const body = document.body;
      const currentTheme = body.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('nexus-theme', 'light');
      } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('nexus-theme', 'dark');
      }
    });
    const savedTheme = localStorage.getItem('nexus-theme');
    if (savedTheme === 'dark') document.body.setAttribute('data-theme', 'dark');
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }
});
