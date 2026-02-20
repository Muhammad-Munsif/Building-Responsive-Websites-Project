
    (function() {
      // theme
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
      themeToggle.addEventListener('click', () => {
        const current = body.getAttribute('data-theme') || 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
      });

      // mobile menu
      const mobileToggle = document.getElementById('mobileToggle');
      const mainNav = document.getElementById('mainNav');
      mobileToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      });
      document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('active');
          const icon = mobileToggle.querySelector('i');
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        });
      });

      // smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      // intersection observer (reveal on scroll)
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

      // header hide on scroll + back to top
      let lastScroll = 0;
      const header = document.querySelector('.main-header');
      const backTop = document.getElementById('backToTop');
      window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > lastScroll && current > 150) header.style.transform = 'translateY(-100%)';
        else header.style.transform = 'translateY(0)';
        lastScroll = current;

        // back to top visibility
        if (current > 600) backTop.classList.add('visible');
        else backTop.classList.remove('visible');
      });

      backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    })();
