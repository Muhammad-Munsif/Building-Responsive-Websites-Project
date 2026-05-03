
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
})();
