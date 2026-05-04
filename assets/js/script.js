
(function () {
  // Theme toggle
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const setTheme = (theme) => {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  };
  const saved = localStorage.getItem('nexus-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = body.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      try {
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } catch (err) { }
    });
  });

  // Intersection observer for fade-up animations
  const faders = document.querySelectorAll('.fade-up-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });
  faders.forEach(el => observer.observe(el));

  // Back to top button
  const backTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (backTop) {
      if (window.scrollY > 500) {
        backTop.classList.add('visible');
      } else {
        backTop.classList.remove('visible');
      }
    }
  });

  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    }
  });

  // Contact form validation
  const contactForm = document.getElementById('quickContact');
  const feedback = document.getElementById('formFeedback');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const msg = document.getElementById('contactMsg').value.trim();

      if (!name || !email || !msg) {
        if (feedback) {
          feedback.style.color = '#ef476f';
          feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> all fields are required.';
        }
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        if (feedback) {
          feedback.style.color = '#ef476f';
          feedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> enter a valid email.';
        }
        return;
      }
      if (feedback) {
        feedback.style.color = '#06d6a0';
        feedback.innerHTML = '<i class="fas fa-check-circle"></i> message sent (demo). we’ll reply soon.';
      }
      contactForm.reset();
      setTimeout(() => { if (feedback) feedback.innerHTML = ''; }, 3000);
    });
  }

  // Auth state
  let authToken = localStorage.getItem('token');
  let currentUser = null;

  // Helper to update UI based on login status
  function updateAuthUI() {
    const userSpan = document.getElementById('userNameDisplay');
    if (authToken && currentUser) {
      userSpan.innerText = `👋 ${currentUser.name}`;
    } else {
      userSpan.innerText = '';
    }

  }

  // Show modals
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
  const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));

  document.getElementById('loginBtn').addEventListener('click', () => {
    if (authToken) {
      // Already logged in – could redirect to profile page (optional)
      alert(`Welcome back, ${currentUser?.name || 'User'}!`);
    } else {
      loginModal.show();
    }
  });

  document.getElementById('showSignupFromLogin').addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.hide();
    signupModal.show();
  });

  document.getElementById('showLoginFromSignup').addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.hide();
    loginModal.show();
  });

  // LOGIN submit
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        messageDiv.innerHTML = '<span style="color: #06d6a0;">Login successful! Redirecting...</span>';
        updateAuthUI();
        setTimeout(() => {
          loginModal.hide();
          location.reload(); // or update page dynamically
        }, 1000);
      } else {
        messageDiv.innerHTML = `<span style="color: #ef476f;">${data.message}</span>`;
      }
    } catch (error) {
      messageDiv.innerHTML = '<span style="color: #ef476f;">Server error. Is backend running?</span>';
    }
  });

  // SIGNUP submit
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const messageDiv = document.getElementById('signupMessage');

    if (password.length < 6) {
      messageDiv.innerHTML = '<span style="color: #ef476f;">Password must be at least 6 characters.</span>';
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        messageDiv.innerHTML = '<span style="color: #06d6a0;">Account created! Logging in...</span>';
        updateAuthUI();
        setTimeout(() => {
          signupModal.hide();
          location.reload();
        }, 1000);
      } else {
        messageDiv.innerHTML = `<span style="color: #ef476f;">${data.message}</span>`;
      }
    } catch (error) {
      messageDiv.innerHTML = '<span style="color: #ef476f;">Server error. Please try again.</span>';
    }
  });

  // Restore session on page load
  if (localStorage.getItem('token')) {
    authToken = localStorage.getItem('token');
    currentUser = JSON.parse(localStorage.getItem('user'));
    updateAuthUI();
  }
})();
