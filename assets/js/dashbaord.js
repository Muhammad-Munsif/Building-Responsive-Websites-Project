
        (function () {
            document.addEventListener("DOMContentLoaded", function () {
                // --- Theme toggle ---
                const themeToggle = document.getElementById("themeToggle");
                const body = document.body;
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

                // --- Display user name (simulated) ---
                const userNameEl = document.getElementById("userNameDisplay");
                const savedUser = localStorage.getItem("user");
                if (savedUser) {
                    try {
                        const user = JSON.parse(savedUser);
                        userNameEl.textContent = user.name || "User";
                    } catch (e) { }
                } else {
                    // fallback: if no user in storage, show a placeholder
                    userNameEl.textContent = "Guest";
                }

                // --- Logout ---
                document.getElementById("logoutBtn").addEventListener("click", function () {
                    if (confirm("Are you sure you want to logout?")) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "index.html"; // redirect to main page
                    }
                });

                // --- animate bars on load ---
                const bars = document.querySelectorAll('.bar');
                setTimeout(() => {
                    bars.forEach((bar, i) => {
                        const heights = [55, 75, 45, 85, 65, 50, 90];
                        bar.style.height = heights[i] + '%';
                        bar.style.opacity = '1';
                    });
                }, 400);
            });
        })();
    