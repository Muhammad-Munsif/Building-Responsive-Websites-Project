
    (function() {
      // theme management
      const body = document.body;
      const themeToggle = document.getElementById('themeToggle');
      const themeIcon = document.getElementById('themeIcon');

      function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('nexus-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }

      function toggleTheme() {
        const current = body.getAttribute('data-theme') || 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
      }

      // load saved theme
      const saved = localStorage.getItem('nexus-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved) {
        setTheme(saved);
      } else {
        setTheme(prefersDark ? 'dark' : 'light');
      }

      themeToggle.addEventListener('click', toggleTheme);

      // mobile menu
      const mobileToggle = document.getElementById('mobileToggle');
      const mainNav = document.getElementById('mainNav');
      mobileToggle.addEventListener('click', (e) => {
        mainNav.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      });

      // close mobile on link click
      document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('active');
          mobileToggle.querySelector('i').classList.add('fa-bars');
          mobileToggle.querySelector('i').classList.remove('fa-times');
        });
      });

      // smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      // intersection observer for fade-up
      const faders = document.querySelectorAll('.fade-up-on-scroll');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      faders.forEach(el => observer.observe(el));

      // header hide on scroll (optional)
      let lastScroll = 0;
      const header = document.querySelector('.main-header');
      window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > lastScroll && current > 100) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
        lastScroll = current;
      });
    })();
  