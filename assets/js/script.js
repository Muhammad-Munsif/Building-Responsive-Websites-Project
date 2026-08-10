<script>
    (function () {
      document.addEventListener("DOMContentLoaded", function () {
        // --- Theme Toggle (fully functional) ---
        const themeToggle = document.getElementById("themeToggle");
        const body = document.body;
        // load saved theme
        if (localStorage.getItem("nexus-theme") === "dark") {
          body.setAttribute("data-theme", "dark");
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        themeToggle.addEventListener("click", function () {
          if (body.getAttribute("data-theme") === "dark") {
            body.removeAttribute("data-theme");
            localStorage.setItem("nexus-theme", "light");
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
          } else {
            body.setAttribute("data-theme", "dark");
            localStorage.setItem("nexus-theme", "dark");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
          }
        });

        // --- Login / Auth (fully functional) ---
        const loginBtn = document.getElementById("loginBtn");
        const loginModalEl = document.getElementById("loginModal");
        const signupModalEl = document.getElementById("signupModal");
        let loginModal = loginModalEl ? new bootstrap.Modal(loginModalEl) : null;
        let signupModal = signupModalEl ? new bootstrap.Modal(signupModalEl) : null;

        // restore session
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user && loginBtn) {
          try {
            const u = JSON.parse(user);
            loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${u.name}`;
            loginBtn.classList.add("logged-in");
          } catch (e) { }
        }

        loginBtn.addEventListener("click", function () {
          if (localStorage.getItem("token")) {
            if (confirm("Logout?")) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
              loginBtn.classList.remove("logged-in");
              window.location.reload();
            }
          } else {
            if (loginModal) loginModal.show();
          }
        });

        // switch modals
        const showSignupLink = document.getElementById("showSignupLink");
        const showLoginLink = document.getElementById("showLoginLink");
        if (showSignupLink) showSignupLink.addEventListener("click", function (e) {
          e.preventDefault();
          loginModal?.hide();
          signupModal?.show();
        });
        if (showLoginLink) showLoginLink.addEventListener("click", function (e) {
          e.preventDefault();
          signupModal?.hide();
          loginModal?.show();
        });

        // --- Login form ---
        const loginForm = document.getElementById("loginForm");
        const loginMessage = document.getElementById("loginMessage");
        if (loginForm) {
          loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();
            if (!email || !password) {
              loginMessage.innerHTML = '<span style="color:#ef476f;">All fields required</span>';
              return;
            }
            const btn = loginForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = "Logging in...";
            try {
              const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
              });
              const data = await res.json();
              if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                loginMessage.innerHTML = '<span style="color:#06d6a0;">Login successful!</span>';
                loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${data.user.name}`;
                loginBtn.classList.add("logged-in");
                setTimeout(() => {
                  loginModal?.hide();
                  window.location.reload();
                }, 800);
              } else {
                loginMessage.innerHTML = `<span style="color:#ef476f;">${data.message}</span>`;
              }
            } catch (err) {
              loginMessage.innerHTML = '<span style="color:#ef476f;">Server error. Is backend running?</span>';
            }
            btn.disabled = false;
            btn.innerHTML = orig;
          });
        }

        // --- Signup form ---
        const signupForm = document.getElementById("signupForm");
        const signupMessage = document.getElementById("signupMessage");
        if (signupForm) {
          signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value;
            if (!name || !email || !password) {
              signupMessage.innerHTML = '<span style="color:#ef476f;">All fields required</span>';
              return;
            }
            if (password.length < 6) {
              signupMessage.innerHTML = '<span style="color:#ef476f;">Password min 6 characters</span>';
              return;
            }
            const btn = signupForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = "Creating...";
            try {
              const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
              });
              const data = await res.json();
              if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                signupMessage.innerHTML = '<span style="color:#06d6a0;">Account created!</span>';
                loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${data.user.name}`;
                loginBtn.classList.add("logged-in");
                setTimeout(() => {
                  signupModal?.hide();
                  window.location.reload();
                }, 800);
              } else {
                signupMessage.innerHTML = `<span style="color:#ef476f;">${data.message}</span>`;
              }
            } catch (err) {
              signupMessage.innerHTML = '<span style="color:#ef476f;">Server error</span>';
            }
            btn.disabled = false;
            btn.innerHTML = orig;
          });
        }

        // --- FAQ Accordion ---
        document.querySelectorAll(".faq-question").forEach(function (q) {
          q.addEventListener("click", function () {
            const parent = q.closest(".faq-item");
            parent.classList.toggle("active");
          });
        });

        // --- Back to Top ---
        const backTop = document.getElementById("backToTop");
        window.addEventListener("scroll", function () {
          if (backTop) {
            backTop.classList.toggle("visible", window.scrollY > 500);
          }
        });
        if (backTop) {
          backTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        }

        // --- Mobile Menu Toggle (fixed) ---
        const mobileToggle = document.getElementById("mobileToggle");
        const mainNav = document.getElementById("mainNav");
        if (mobileToggle && mainNav) {
          mobileToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            mainNav.classList.toggle("active");
          });
          // close menu when clicking a link
          document.querySelectorAll(".main-nav a").forEach(function (a) {
            a.addEventListener("click", function () {
              mainNav.classList.remove("active");
            });
          });
          // close menu when clicking outside
          document.addEventListener("click", function (e) {
            if (window.innerWidth <= 768) {
              if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mainNav.classList.remove("active");
              }
            }
          });
        }

        // --- Scroll Reveal ---
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .team-card, .pricing-card').forEach(el => observer.observe(el));

        // --- Contact Form (demo) ---
        const contactForm = document.getElementById("quickContact");
        const formFeedback = document.getElementById("formFeedback");
        if (contactForm) {
          contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            formFeedback.innerHTML = '<span style="color:var(--success);">✓ Message sent! We\'ll get back to you soon.</span>';
            contactForm.reset();
            setTimeout(() => { formFeedback.innerHTML = ''; }, 4000);
          });
        }
      });
    })();
  </script>