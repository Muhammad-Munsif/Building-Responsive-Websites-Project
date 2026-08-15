 <script>
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

                // --- User name ---
                const savedUser = localStorage.getItem("user");
                let userName = "Guest";
                let userInitial = "G";
                if (savedUser) {
                    try {
                        const user = JSON.parse(savedUser);
                        userName = user.name || "Guest";
                        userInitial = userName.charAt(0).toUpperCase();
                    } catch (e) { }
                }
                document.querySelectorAll("#userNameDisplay, #userNameDisplay2").forEach(el => el.textContent = userName);
                document.getElementById("userAvatar").textContent = userInitial;

                // --- Logout ---
                document.getElementById("logoutBtn").addEventListener("click", function () {
                    if (confirm("Are you sure you want to logout?")) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "index.html";
                    }
                });

                // --- Sidebar navigation (panel switching) ---
                const navItems = document.querySelectorAll('.sidebar .nav-item');
                const panels = {
                    dashboard: document.getElementById('panel-dashboard'),
                    users: document.getElementById('panel-users'),
                    orders: document.getElementById('panel-orders'),
                    analytics: document.getElementById('panel-analytics'),
                    reports: document.getElementById('panel-reports'),
                    settings: document.getElementById('panel-settings'),
                    support: document.getElementById('panel-support')
                };
                const pageTitle = document.getElementById('pageTitle');
                const pageSubtitle = document.getElementById('pageSubtitle');
                const exportBtn = document.getElementById('exportBtn');
                const actionBtn = document.getElementById('actionBtn');

                const panelTitles = {
                    dashboard: { title: 'Dashboard', subtitle: 'Overview of your business metrics.', action: 'New' },
                    users: { title: 'Users', subtitle: 'Manage all users and their permissions.', action: 'Add User' },
                    orders: { title: 'Orders', subtitle: 'Track and manage all orders.', action: 'New Order' },
                    analytics: { title: 'Analytics', subtitle: 'Detailed insights and performance metrics.', action: 'Export Data' },
                    reports: { title: 'Reports', subtitle: 'Generate and export detailed reports.', action: 'Generate' },
                    settings: { title: 'Settings', subtitle: 'Configure your account and preferences.', action: 'Save' },
                    support: { title: 'Support', subtitle: 'Get help and submit support tickets.', action: 'New Ticket' }
                };

                function switchPanel(panelId) {
                    // hide all panels
                    Object.values(panels).forEach(p => { if (p) p.classList.remove('active'); });
                    // show selected
                    if (panels[panelId]) panels[panelId].classList.add('active');
                    // update nav active state
                    navItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.dataset.panel === panelId) item.classList.add('active');
                    });
                    // update page header
                    const info = panelTitles[panelId] || panelTitles.dashboard;
                    pageTitle.textContent = info.title;
                    pageSubtitle.innerHTML = `Welcome back, <strong>${userName}</strong> — ${info.subtitle}`;
                    if (exportBtn) exportBtn.innerHTML = `<i class="fas fa-download"></i> Export`;
                    if (actionBtn) actionBtn.innerHTML = `<i class="fas fa-plus"></i> ${info.action}`;
                    // close mobile sidebar
                    closeSidebar();
                }

                navItems.forEach(item => {
                    item.addEventListener('click', function () {
                        const panel = this.dataset.panel;
                        if (panel) switchPanel(panel);
                    });
                });

                // --- Sidebar toggle (mobile) ---
                const sidebar = document.getElementById("sidebar");
                const overlay = document.getElementById("sidebarOverlay");
                const mobileToggle = document.getElementById("mobileToggle");

                function closeSidebar() {
                    sidebar.classList.remove("open");
                    overlay.classList.remove("active");
                }

                mobileToggle.addEventListener("click", function () {
                    sidebar.classList.toggle("open");
                    overlay.classList.toggle("active");
                });

                overlay.addEventListener("click", closeSidebar);

                window.addEventListener("resize", function () {
                    if (window.innerWidth >= 993) closeSidebar();
                });

                // --- animate bars ---
                setTimeout(() => {
                    document.querySelectorAll('.bar').forEach((bar, i) => {
                        const heights = [55, 75, 45, 85, 65, 50, 90];
                        bar.style.height = heights[i] + '%';
                    });
                }, 300);
            });
        })();
    </script>