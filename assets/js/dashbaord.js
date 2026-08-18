
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        // --- Theme ---
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

        // --- User ---
        const savedUser = localStorage.getItem("user");
        let userName = "Guest";
        let userInitial = "G";
        if (savedUser) {
            try { const user = JSON.parse(savedUser); userName = user.name || "Guest"; userInitial = userName.charAt(0).toUpperCase(); } catch (e) { }
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

        // --- Sidebar navigation ---
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
        const actionBtn = document.getElementById('actionBtn');
        const actionLabel = document.getElementById('actionLabel');
        const exportBtn = document.getElementById('exportBtn');

        const panelConfig = {
            dashboard: { title: 'Dashboard', subtitle: 'Overview of your business metrics.', action: 'Add New' },
            users: { title: 'Users', subtitle: 'Manage all users and their permissions.', action: 'Add User' },
            orders: { title: 'Orders', subtitle: 'Track and manage all orders.', action: 'Add Order' },
            analytics: { title: 'Analytics', subtitle: 'Detailed insights and performance metrics.', action: 'Export' },
            reports: { title: 'Reports', subtitle: 'Generate and export detailed reports.', action: 'New Report' },
            settings: { title: 'Settings', subtitle: 'Configure your account and preferences.', action: 'Save' },
            support: { title: 'Support', subtitle: 'Get help and submit support tickets.', action: 'New Ticket' }
        };

        let currentPanel = 'dashboard';

        function switchPanel(panelId) {
            currentPanel = panelId;
            Object.values(panels).forEach(p => { if (p) p.classList.remove('active'); });
            if (panels[panelId]) panels[panelId].classList.add('active');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.panel === panelId) item.classList.add('active');
            });
            const info = panelConfig[panelId] || panelConfig.dashboard;
            pageTitle.textContent = info.title;
            pageSubtitle.innerHTML = `Welcome back, <strong>${userName}</strong> — ${info.subtitle}`;
            if (exportBtn) {
                if (panelId === 'analytics') {
                    exportBtn.innerHTML = `<i class="fas fa-download"></i> Export Data`;
                    exportBtn.style.display = 'inline-flex';
                } else {
                    exportBtn.style.display = 'none';
                }
            }
            if (actionBtn) {
                actionBtn.innerHTML = `<i class="fas fa-plus"></i> ${info.action}`;
                actionLabel.textContent = info.action;
                if (panelId === 'dashboard' || panelId === 'analytics' || panelId === 'settings') {
                    actionBtn.removeAttribute('data-bs-toggle');
                    actionBtn.removeAttribute('data-bs-target');
                    actionBtn.onclick = function () {
                        if (panelId === 'analytics') alert('📊 Exporting analytics data...');
                        else if (panelId === 'settings') alert('💾 Settings saved!');
                        else alert('📊 Dashboard overview exported!');
                    };
                } else {
                    actionBtn.setAttribute('data-bs-toggle', 'modal');
                    actionBtn.setAttribute('data-bs-target', '#addModal');
                    actionBtn.onclick = null;
                }
            }
            closeSidebar();
        }

        navItems.forEach(item => {
            item.addEventListener('click', function () {
                const panel = this.dataset.panel;
                if (panel) switchPanel(panel);
            });
        });

        // --- ADD MODAL ---
        const modalFields = document.getElementById('modalFields');
        const addForm = document.getElementById('addForm');
        const addFeedback = document.getElementById('addFormFeedback');
        const addSubmitBtn = document.getElementById('addSubmitBtn');
        const modalTitle = document.getElementById('addModalTitle');
        const addModal = new bootstrap.Modal(document.getElementById('addModal'));

        // Function to set modal fields based on mode
        function setAddMode(mode) {
            let fields = '';
            let title = 'Add New';
            let submitText = 'Add Record';

            switch (mode) {
                case 'user':
                    title = 'Add New User';
                    submitText = 'Add User';
                    fields = `
                <div class="mb-3"><label class="form-label fw-semibold">Full Name</label><input type="text" class="form-control form-control-custom" id="userName" placeholder="John Doe" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Email</label><input type="email" class="form-control form-control-custom" id="userEmail" placeholder="john@example.com" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Role</label>
                  <select class="form-control form-control-custom" id="userRole"><option value="Admin">Admin</option><option value="Editor">Editor</option><option value="Viewer">Viewer</option></select>
                </div>
                <div class="mb-3"><label class="form-label fw-semibold">Status</label>
                  <select class="form-control form-control-custom" id="userStatus"><option value="Active">Active</option><option value="Pending">Pending</option><option value="Inactive">Inactive</option></select>
                </div>
              `;
                    break;
                case 'order':
                    title = 'Add New Order';
                    submitText = 'Add Order';
                    fields = `
                <div class="mb-3"><label class="form-label fw-semibold">Customer Name</label><input type="text" class="form-control form-control-custom" id="orderCustomer" placeholder="John Doe" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Amount ($)</label><input type="number" step="0.01" class="form-control form-control-custom" id="orderAmount" placeholder="99.99" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Status</label>
                  <select class="form-control form-control-custom" id="orderStatus"><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select>
                </div>
              `;
                    break;
                case 'report':
                    title = 'Generate New Report';
                    submitText = 'Generate Report';
                    fields = `
                <div class="mb-3"><label class="form-label fw-semibold">Report Name</label><input type="text" class="form-control form-control-custom" id="reportName" placeholder="Q2 Sales Report" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Type</label>
                  <select class="form-control form-control-custom" id="reportType"><option value="Sales">Sales</option><option value="Analytics">Analytics</option><option value="Financial">Financial</option><option value="Operations">Operations</option></select>
                </div>
              `;
                    break;
                default:
                    fields = `<div class="mb-3"><label class="form-label fw-semibold">Name</label><input type="text" class="form-control form-control-custom" placeholder="Enter name" required></div>`;
            }

            modalTitle.textContent = title;
            modalFields.innerHTML = fields;
            addSubmitBtn.innerHTML = `<i class="fas fa-plus"></i> ${submitText}`;
            addSubmitBtn.dataset.mode = mode;
            addFeedback.innerHTML = '';
        }

        // Handle all Add buttons - using event delegation
        document.addEventListener('click', function (e) {
            const btn = e.target.closest('.add-btn');
            if (btn) {
                const mode = btn.dataset.mode || 'user';
                setAddMode(mode);
                addModal.show();
            }
        });

        // Also handle the main action button for non-dashboard panels
        actionBtn.addEventListener('click', function (e) {
            // If the button has data-bs-toggle, it will open modal automatically
            // Otherwise, handle the click here
            if (!this.hasAttribute('data-bs-toggle')) {
                // handled by onclick
            }
        });

        // Form submission
        addForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const mode = addSubmitBtn.dataset.mode || 'user';
            let name = '';
            let message = '';

            switch (mode) {
                case 'user':
                    name = document.getElementById('userName')?.value || 'User';
                    message = `✅ User "${name}" added successfully!`;
                    let count = parseInt(document.getElementById('userCount').textContent) || 0;
                    document.getElementById('userCount').textContent = count + 1;
                    document.getElementById('statTotalUsers').textContent = count + 1;
                    document.getElementById('statNewUsers').textContent = (parseInt(document.getElementById('statNewUsers').textContent) || 0) + 1;
                    const tbody = document.getElementById('userTableBody');
                    const row = document.createElement('tr');
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                    row.innerHTML = `<td><div class="d-flex align-items-center gap-2"><span class="user-avatar-sm" style="background:var(--gradient-prime);">${initials}</span> ${name}</div></td>
                <td>${document.getElementById('userEmail')?.value || 'user@example.com'}</td>
                <td>${document.getElementById('userRole')?.value || 'Viewer'}</td>
                <td><span class="badge-status ${(document.getElementById('userStatus')?.value || 'Active').toLowerCase()}">${document.getElementById('userStatus')?.value || 'Active'}</span></td>
                <td>Today</td>
                <td class="text-end"><a href="#" class="text-primary" style="text-decoration:none;font-weight:500;">Edit</a></td>`;
                    tbody.prepend(row);
                    // Update dashboard
                    document.getElementById('dashUsers').textContent = document.getElementById('statTotalUsers').textContent;
                    break;
                case 'order':
                    const customer = document.getElementById('orderCustomer')?.value || 'Customer';
                    message = `✅ Order for "${customer}" added successfully!`;
                    let oCount = parseInt(document.getElementById('orderCount').textContent) || 0;
                    document.getElementById('orderCount').textContent = oCount + 1;
                    document.getElementById('statTotalOrders').textContent = oCount + 1;
                    document.getElementById('statPendingOrders').textContent = (parseInt(document.getElementById('statPendingOrders').textContent) || 0) + 1;
                    const oTbody = document.getElementById('orderTableBody');
                    const oRow = document.createElement('tr');
                    const orderNum = '#' + (1284 + oCount);
                    oRow.innerHTML = `<td><strong>${orderNum}</strong></td>
                <td>${customer}</td>
                <td>$${document.getElementById('orderAmount')?.value || '0.00'}</td>
                <td><span class="badge-status ${(document.getElementById('orderStatus')?.value || 'Pending').toLowerCase()}">${document.getElementById('orderStatus')?.value || 'Pending'}</span></td>
                <td>Today</td>
                <td class="text-end"><a href="#" class="text-primary" style="text-decoration:none;font-weight:500;">View</a></td>`;
                    oTbody.prepend(oRow);
                    document.getElementById('dashOrders').textContent = document.getElementById('statTotalOrders').textContent;
                    break;
                case 'report':
                    const rName = document.getElementById('reportName')?.value || 'Report';
                    message = `✅ Report "${rName}" generated successfully!`;
                    let rCount = parseInt(document.getElementById('reportCount').textContent) || 0;
                    document.getElementById('reportCount').textContent = rCount + 1;
                    document.getElementById('statTotalReports').textContent = rCount + 1;
                    const rTbody = document.getElementById('reportTableBody');
                    const rRow = document.createElement('tr');
                    rRow.innerHTML = `<td>${rName}</td>
                <td>${document.getElementById('reportType')?.value || 'General'}</td>
                <td>Today</td>
                <td><span class="badge-status pending">Processing</span></td>
                <td class="text-end"><span class="text-muted" style="font-size:0.8rem;">Generating...</span></td>`;
                    rTbody.prepend(rRow);
                    break;
                default:
                    message = '✅ Record added successfully!';
            }

            addFeedback.innerHTML = `<span style="color:var(--success);">${message}</span>`;
            addForm.reset();

            setTimeout(() => {
                addFeedback.innerHTML = '';
                addModal.hide();
            }, 1500);
        });

        // --- Sidebar toggle ---
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

        // --- Export ---
        exportBtn?.addEventListener('click', function () {
            if (currentPanel === 'analytics') {
                alert('📊 Exporting analytics data as CSV...');
            } else {
                alert('📄 Exporting current view data...');
            }
        });

        // --- initial panel ---
        switchPanel('dashboard');
    });
})();
