// ============================================================
// NEXUS - Unified JavaScript
// Shared functionality for index.html and dashboard.html
// ============================================================

document.addEventListener("DOMContentLoaded", function() {

    // ============================================================
    // THEME TOGGLE (Shared)
    // ============================================================
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    if (themeToggle) {
        // Load saved theme
        if (localStorage.getItem("nexus-theme") === "dark") {
            body.setAttribute("data-theme", "dark");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        themeToggle.addEventListener("click", function() {
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
    }

    // ============================================================
    // LOGIN / AUTH (Shared)
    // ============================================================
    const loginBtn = document.getElementById("loginBtn");
    const loginModalEl = document.getElementById("loginModal");
    const signupModalEl = document.getElementById("signupModal");
    let loginModal = loginModalEl ? new bootstrap.Modal(loginModalEl) : null;
    let signupModal = signupModalEl ? new bootstrap.Modal(signupModalEl) : null;

    // Restore session
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (loginBtn) {
        if (token && savedUser) {
            try {
                const user = JSON.parse(savedUser);
                loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${user.name}`;
                loginBtn.classList.add("logged-in");
            } catch (e) {}
        }

        loginBtn.addEventListener("click", function() {
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
    }

    // Switch modals
    const showSignupLink = document.getElementById("showSignupLink");
    const showLoginLink = document.getElementById("showLoginLink");

    if (showSignupLink) {
        showSignupLink.addEventListener("click", function(e) {
            e.preventDefault();
            loginModal?.hide();
            signupModal?.show();
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener("click", function(e) {
            e.preventDefault();
            signupModal?.hide();
            loginModal?.show();
        });
    }

    // ============================================================
    // LOGIN FORM
    // ============================================================
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (loginForm) {
        loginForm.addEventListener("submit", async function(e) {
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
                    if (loginBtn) {
                        loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${data.user.name}`;
                        loginBtn.classList.add("logged-in");
                    }
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

    // ============================================================
    // SIGNUP FORM
    // ============================================================
    const signupForm = document.getElementById("signupForm");
    const signupMessage = document.getElementById("signupMessage");

    if (signupForm) {
        signupForm.addEventListener("submit", async function(e) {
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
                    if (loginBtn) {
                        loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${data.user.name}`;
                        loginBtn.classList.add("logged-in");
                    }
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

    // ============================================================
    // FAQ ACCORDION (Landing Page)
    // ============================================================
    document.querySelectorAll(".faq-item").forEach(function(item) {
        const question = item.querySelector(".faq-question");
        if (question) {
            question.addEventListener("click", function() {
                document.querySelectorAll(".faq-item").forEach(function(other) {
                    if (other !== item && other.classList.contains("active")) {
                        other.classList.remove("active");
                    }
                });
                item.classList.toggle("active");
            });
        }
    });

    // ============================================================
    // BACK TO TOP (Shared)
    // ============================================================
    const backTop = document.getElementById("backToTop");

    if (backTop) {
        window.addEventListener("scroll", function() {
            backTop.classList.toggle("visible", window.scrollY > 500);
        });

        backTop.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ============================================================
    // MOBILE MENU TOGGLE (Shared)
    // ============================================================
    const mobileToggle = document.getElementById("mobileToggle");
    const mainNav = document.getElementById("mainNav");

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener("click", function(e) {
            e.stopPropagation();
            mainNav.classList.toggle("active");
        });

        document.querySelectorAll(".main-nav a").forEach(function(a) {
            a.addEventListener("click", function() {
                mainNav.classList.remove("active");
            });
        });

        document.addEventListener("click", function(e) {
            if (window.innerWidth <= 768) {
                if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                    mainNav.classList.remove("active");
                }
            }
        });
    }

    // ============================================================
    // SCROLL REVEAL (Landing Page)
    // ============================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .team-card, .pricing-card')
        .forEach(el => observer.observe(el));

    // ============================================================
    // CONTACT FORM (Landing Page)
    // ============================================================
    const contactForm = document.getElementById("quickContact");
    const formFeedback = document.getElementById("formFeedback");

    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            formFeedback.innerHTML =
                '<span style="color:var(--success);">✓ Message sent! We\'ll get back to you soon.</span>';
            contactForm.reset();
            setTimeout(() => { formFeedback.innerHTML = ''; }, 4000);
        });
    }

    // ============================================================
    // SMOOTH SCROLL (Landing Page)
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ============================================================
    // DASHBOARD LOGOUT
    // ============================================================
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "index.html";
            }
        });
    }

    // ============================================================
    // DASHBOARD USER DISPLAY
    // ============================================================
    const userAvatar = document.getElementById("userAvatar");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const userNameDisplay2 = document.getElementById("userNameDisplay2");

    if (savedUser && userNameDisplay) {
        try {
            const user = JSON.parse(savedUser);
            const name = user.name || "Guest";
            const initial = name.charAt(0).toUpperCase();
            if (userAvatar) userAvatar.textContent = initial;
            if (userNameDisplay) userNameDisplay.textContent = name;
            if (userNameDisplay2) userNameDisplay2.textContent = name;
        } catch (e) {}
    }

    // ============================================================
    // DASHBOARD - DATA STORE
    // ============================================================
    const DB = {
        getUsers() {
            return JSON.parse(localStorage.getItem('nexus_users')) || [];
        },
        setUsers(users) {
            localStorage.setItem('nexus_users', JSON.stringify(users));
        },
        getOrders() {
            return JSON.parse(localStorage.getItem('nexus_orders')) || [];
        },
        setOrders(orders) {
            localStorage.setItem('nexus_orders', JSON.stringify(orders));
        },
        getReports() {
            return JSON.parse(localStorage.getItem('nexus_reports')) || [];
        },
        setReports(reports) {
            localStorage.setItem('nexus_reports', JSON.stringify(reports));
        },
        getNextId(collection) {
            const key = `nexus_${collection}_nextId`;
            let id = parseInt(localStorage.getItem(key)) || 1;
            localStorage.setItem(key, id + 1);
            return id;
        },
        init() {
            if (this.getUsers().length === 0) {
                this.setUsers([
                    { id: 1, name: 'John Doe', email: 'john@nexus.digital', role: 'Admin', status: 'Active',
                        joined: 'Jan 15, 2025' },
                    { id: 2, name: 'Sarah Miles', email: 'sarah@nexus.digital', role: 'Editor', status: 'Active',
                        joined: 'Feb 3, 2025' },
                    { id: 3, name: 'Alex Kim', email: 'alex@nexus.digital', role: 'Viewer', status: 'Pending',
                        joined: 'Mar 10, 2025' },
                    { id: 4, name: 'Elena Rios', email: 'elena@nexus.digital', role: 'Editor', status: 'Inactive',
                        joined: 'Apr 22, 2025' }
                ]);
                localStorage.setItem('nexus_users_nextId', 5);
            }
            if (this.getOrders().length === 0) {
                this.setOrders([
                    { id: 1284, customer: 'John Doe', amount: 245.00, status: 'Completed',
                        date: 'Today, 2:30 PM' },
                    { id: 1283, customer: 'Sarah Miles', amount: 89.50, status: 'Pending',
                        date: 'Today, 11:15 AM' },
                    { id: 1282, customer: 'Alex Kim', amount: 1250.00, status: 'Completed',
                        date: 'Yesterday, 4:45 PM' },
                    { id: 1281, customer: 'Elena Rios', amount: 430.00, status: 'Cancelled',
                        date: 'Yesterday, 9:20 AM' }
                ]);
                localStorage.setItem('nexus_orders_nextId', 1285);
            }
            if (this.getReports().length === 0) {
                this.setReports([
                    { id: 1, name: 'Q1 Sales Summary', type: 'Sales', generated: 'Apr 1, 2025',
                        status: 'Ready' },
                    { id: 2, name: 'User Growth Report', type: 'Analytics', generated: 'Mar 28, 2025',
                        status: 'Ready' },
                    { id: 3, name: 'Revenue Breakdown', type: 'Financial', generated: '—', status: 'Generating' },
                    { id: 4, name: 'Customer Feedback', type: 'Survey', generated: 'Mar 25, 2025',
                        status: 'Ready' },
                    { id: 5, name: 'Inventory Status', type: 'Operations', generated: '—', status: 'Failed' }
                ]);
                localStorage.setItem('nexus_reports_nextId', 6);
            }
            this.updateUI();
        },
        updateUI() {
            if (typeof renderUsers === 'function') renderUsers();
            if (typeof renderOrders === 'function') renderOrders();
            if (typeof renderReports === 'function') renderReports();
            if (typeof updateStats === 'function') updateStats();
            if (typeof updateBadges === 'function') updateBadges();
            if (typeof updateCharts === 'function') updateCharts();
        }
    };

    // ============================================================
    // DASHBOARD - Toast Notifications
    // ============================================================
    window.showToast = function(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle' };
        toast.innerHTML =
            `<i class="fas ${icons[type] || icons.success}"></i><span>${message}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
        container.appendChild(toast);
        setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
    };

    // ============================================================
    // DASHBOARD - Sort State
    // ============================================================
    const sortState = {
        user: { key: 'name', asc: true },
        order: { key: 'id', asc: true },
        report: { key: 'name', asc: true }
    };

    // ============================================================
    // DASHBOARD - Render Functions
    // ============================================================
    function getStatusBadge(status) {
        const classes = {
            'active': 'active',
            'pending': 'pending',
            'inactive': 'inactive',
            'completed': 'completed',
            'cancelled': 'cancelled',
            'generating': 'generating',
            'ready': 'ready',
            'failed': 'failed'
        };
        return `<span class="badge-status ${classes[status.toLowerCase()] || 'pending'}">${status}</span>`;
    }

    window.renderUsers = function() {
        const users = DB.getUsers();
        const search = document.getElementById('userSearch')?.value?.toLowerCase() || '';
        const filter = document.getElementById('userFilter')?.value || 'all';
        const tbody = document.getElementById('userTableBody');
        if (!tbody) return;

        let filtered = users.filter(u => {
            const matchSearch = u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
            const matchFilter = filter === 'all' || u.status.toLowerCase() === filter;
            return matchSearch && matchFilter;
        });

        const sort = sortState.user;
        filtered.sort((a, b) => {
            let valA = a[sort.key] || '',
                valB = b[sort.key] || '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sort.asc ? -1 : 1;
            if (valA > valB) return sort.asc ? 1 : -1;
            return 0;
        });

        if (filtered.length === 0) {
            tbody.innerHTML =
                `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-users"></i><h5>No users found</h5><p>Try adjusting your search or filter criteria.</p><button class="btn btn-primary btn-sm rounded-pill" onclick="openAddModal('user')" style="background:var(--gradient-prime);border:none;"><i class="fas fa-plus"></i> Add User</button></div></td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(user => `
            <tr class="record-enter">
                <td><div class="d-flex align-items-center gap-2"><span class="user-avatar-sm" style="background:var(--gradient-prime);">${user.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</span>${user.name}</div></td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${getStatusBadge(user.status)}</td>
                <td>${user.joined}</td>
                <td class="text-end"><div class="action-btn-group">
                    <button class="btn-sm btn-edit" onclick="editRecord('user', ${user.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-sm btn-delete" onclick="deleteRecord('user', ${user.id})"><i class="fas fa-trash"></i></button>
                </div></td>
            </tr>
        `).join('');
    };

    window.renderOrders = function() {
        const orders = DB.getOrders();
        const search = document.getElementById('orderSearch')?.value?.toLowerCase() || '';
        const filter = document.getElementById('orderFilter')?.value || 'all';
        const tbody = document.getElementById('orderTableBody');
        if (!tbody) return;

        let filtered = orders.filter(o => {
            const matchSearch = o.customer.toLowerCase().includes(search) || String(o.id).includes(search);
            const matchFilter = filter === 'all' || o.status.toLowerCase() === filter;
            return matchSearch && matchFilter;
        });

        const sort = sortState.order;
        filtered.sort((a, b) => {
            let valA = a[sort.key] || '',
                valB = b[sort.key] || '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sort.asc ? -1 : 1;
            if (valA > valB) return sort.asc ? 1 : -1;
            return 0;
        });

        if (filtered.length === 0) {
            tbody.innerHTML =
                `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-shopping-cart"></i><h5>No orders found</h5><p>Try adjusting your search or filter criteria.</p><button class="btn btn-primary btn-sm rounded-pill" onclick="openAddModal('order')" style="background:var(--gradient-prime);border:none;"><i class="fas fa-plus"></i> Add Order</button></div></td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(order => `
            <tr class="record-enter">
                <td><strong>#${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>$${order.amount.toFixed(2)}</td>
                <td>${getStatusBadge(order.status)}</td>
                <td>${order.date}</td>
                <td class="text-end"><div class="action-btn-group">
                    <button class="btn-sm btn-edit" onclick="editRecord('order', ${order.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-sm btn-delete" onclick="deleteRecord('order', ${order.id})"><i class="fas fa-trash"></i></button>
                </div></td>
            </tr>
        `).join('');
    };

    window.renderReports = function() {
        const reports = DB.getReports();
        const search = document.getElementById('reportSearch')?.value?.toLowerCase() || '';
        const filter = document.getElementById('reportFilter')?.value || 'all';
        const tbody = document.getElementById('reportTableBody');
        if (!tbody) return;

        let filtered = reports.filter(r => {
            const matchSearch = r.name.toLowerCase().includes(search) || r.type.toLowerCase().includes(search);
            const matchFilter = filter === 'all' || r.status.toLowerCase() === filter;
            return matchSearch && matchFilter;
        });

        const sort = sortState.report;
        filtered.sort((a, b) => {
            let valA = a[sort.key] || '',
                valB = b[sort.key] || '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sort.asc ? -1 : 1;
            if (valA > valB) return sort.asc ? 1 : -1;
            return 0;
        });

        if (filtered.length === 0) {
            tbody.innerHTML =
                `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-file-alt"></i><h5>No reports found</h5><p>Try adjusting your search or filter criteria.</p><button class="btn btn-primary btn-sm rounded-pill" onclick="openAddModal('report')" style="background:var(--gradient-prime);border:none;"><i class="fas fa-plus"></i> New Report</button></div></td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(report => `
            <tr class="record-enter">
                <td>${report.name}</td>
                <td>${report.type}</td>
                <td>${report.generated}</td>
                <td>${getStatusBadge(report.status)}</td>
                <td class="text-end"><div class="action-btn-group">
                    ${report.status === 'Ready' ? `<button class="btn-sm btn-view" onclick="showToast('📄 Downloading ${report.name}...', 'success')"><i class="fas fa-download"></i></button>` : ''}
                    ${report.status === 'Generating' ? `<span class="text-muted" style="font-size:0.7rem;">Processing...</span>` : ''}
                    <button class="btn-sm btn-delete" onclick="deleteRecord('report', ${report.id})"><i class="fas fa-trash"></i></button>
                </div></td>
            </tr>
        `).join('');
    };

    // ============================================================
    // DASHBOARD - Filter & Sort
    // ============================================================
    window.filterTable = function(type) {
        switch (type) {
            case 'user':
                renderUsers();
                break;
            case 'order':
                renderOrders();
                break;
            case 'report':
                renderReports();
                break;
        }
    };

    window.sortTable = function(type, key) {
        if (sortState[type]) {
            if (sortState[type].key === key) {
                sortState[type].asc = !sortState[type].asc;
            } else {
                sortState[type].key = key;
                sortState[type].asc = true;
            }
        }
        filterTable(type);
    };

    // ============================================================
    // DASHBOARD - Stats & Badges
    // ============================================================
    window.updateStats = function() {
        const users = DB.getUsers();
        const orders = DB.getOrders();
        const reports = DB.getReports();

        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === 'Active').length;
        const pendingUsers = users.filter(u => u.status === 'Pending').length;
        const newUsers = users.filter(u => u.joined === 'Today').length;

        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        const completedOrders = orders.filter(o => o.status === 'Completed').length;
        const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

        const totalReports = reports.length;
        const readyReports = reports.filter(r => r.status === 'Ready').length;
        const generatingReports = reports.filter(r => r.status === 'Generating').length;
        const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);

        const el = (id) => document.getElementById(id);
        if (el('statTotalUsers')) el('statTotalUsers').textContent = totalUsers;
        if (el('statActiveUsers')) el('statActiveUsers').textContent = activeUsers;
        if (el('statPendingUsers')) el('statPendingUsers').textContent = pendingUsers;
        if (el('statNewUsers')) el('statNewUsers').textContent = newUsers;
        if (el('statTotalOrders')) el('statTotalOrders').textContent = totalOrders;
        if (el('statPendingOrders')) el('statPendingOrders').textContent = pendingOrders;
        if (el('statCompletedOrders')) el('statCompletedOrders').textContent = completedOrders;
        if (el('statCancelledOrders')) el('statCancelledOrders').textContent = cancelledOrders;
        if (el('statTotalReports')) el('statTotalReports').textContent = totalReports;
        if (el('statReadyReports')) el('statReadyReports').textContent = readyReports;
        if (el('statGeneratingReports')) el('statGeneratingReports').textContent = generatingReports;
        if (el('dashUsers')) el('dashUsers').textContent = totalUsers;
        if (el('dashOrders')) el('dashOrders').textContent = totalOrders;
        if (el('dashRevenue')) el('dashRevenue').textContent = `$${totalRevenue.toFixed(0)}`;
    };

    window.updateBadges = function() {
        const el = (id) => document.getElementById(id);
        if (el('userCount')) el('userCount').textContent = DB.getUsers().length;
        if (el('orderCount')) el('orderCount').textContent = DB.getOrders().length;
        if (el('reportCount')) el('reportCount').textContent = DB.getReports().length;
    };

    // ============================================================
    // DASHBOARD - CRUD Operations
    // ============================================================
    window.addUser = function(data) {
        const users = DB.getUsers();
        users.push({ id: DB.getNextId('users'), ...data, joined: 'Today' });
        DB.setUsers(users);
        DB.updateUI();
        showToast(`✅ User "${data.name}" added!`, 'success');
        addActivity(`New user <strong>${data.name}</strong> registered`);
    };

    window.updateUser = function(id, data) {
        const users = DB.getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return showToast('User not found!', 'error');
        users[idx] = { ...users[idx], ...data };
        DB.setUsers(users);
        DB.updateUI();
        showToast(`✅ User "${data.name}" updated!`, 'success');
    };

    window.deleteUser = function(id) {
        if (!confirm('Delete this user?')) return;
        const users = DB.getUsers(),
            user = users.find(u => u.id === id);
        DB.setUsers(users.filter(u => u.id !== id));
        DB.updateUI();
        showToast(`🗑️ User "${user?.name}" deleted!`, 'warning');
        addActivity(`User <strong>${user?.name}</strong> deleted`);
    };

    window.addOrder = function(data) {
        const orders = DB.getOrders();
        orders.push({ id: DB.getNextId('orders'), ...data, amount: parseFloat(data.amount),
            date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        DB.setOrders(orders);
        DB.updateUI();
        showToast(`✅ Order for "${data.customer}" added!`, 'success');
        addActivity(`Order <strong>#${orders[orders.length - 1].id}</strong> created`);
    };

    window.updateOrder = function(id, data) {
        const orders = DB.getOrders();
        const idx = orders.findIndex(o => o.id === id);
        if (idx === -1) return showToast('Order not found!', 'error');
        orders[idx] = { ...orders[idx], ...data, amount: parseFloat(data.amount) };
        DB.setOrders(orders);
        DB.updateUI();
        showToast(`✅ Order #${id} updated!`, 'success');
    };

    window.deleteOrder = function(id) {
        if (!confirm('Delete this order?')) return;
        const orders = DB.getOrders(),
            order = orders.find(o => o.id === id);
        DB.setOrders(orders.filter(o => o.id !== id));
        DB.updateUI();
        showToast(`🗑️ Order #${id} deleted!`, 'warning');
    };

    window.addReport = function(data) {
        const reports = DB.getReports();
        const newReport = { id: DB.getNextId('reports'), ...data, generated: 'Today', status: 'Generating' };
        reports.push(newReport);
        DB.setReports(reports);
        DB.updateUI();
        showToast(`📄 "${data.name}" generating...`, 'warning');
        addActivity(`Report <strong>${data.name}</strong> generating`);
        setTimeout(() => {
            const r = DB.getReports();
            const idx = r.findIndex(x => x.id === newReport.id);
            if (idx !== -1) {
                r[idx].status = 'Ready';
                DB.setReports(r);
                renderReports();
                updateStats();
                showToast(`✅ "${data.name}" ready!`, 'success');
                addActivity(`Report <strong>${data.name}</strong> completed`);
            }
        }, 2000);
    };

    window.deleteReport = function(id) {
        if (!confirm('Delete this report?')) return;
        const reports = DB.getReports(),
            report = reports.find(r => r.id === id);
        DB.setReports(reports.filter(r => r.id !== id));
        DB.updateUI();
        showToast(`🗑️ Report "${report?.name}" deleted!`, 'warning');
    };

    window.deleteRecord = function(mode, id) {
        if (mode === 'user') deleteUser(id);
        else if (mode === 'order') deleteOrder(id);
        else if (mode === 'report') deleteReport(id);
    };

    // ============================================================
    // DASHBOARD - Activity Feed
    // ============================================================
    function addActivity(text) {
        const feed = document.getElementById('activityFeed');
        if (!feed) return;
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML =
            `<span class="activity-dot primary"></span><div class="activity-content"><div class="text">${text}</div><div class="time">Just now</div></div>`;
        feed.prepend(item);
        while (feed.children.length > 10) feed.removeChild(feed.lastChild);
    }

    // ============================================================
    // DASHBOARD - Modal
    // ============================================================
    let editId = null;

    window.openAddModal = function(mode, data = null) {
        editId = data?.id || null;
        const isEdit = data !== null;
        const modalTitle = document.getElementById('addModalTitle');
        const fields = document.getElementById('modalFields');
        const submitBtn = document.getElementById('addSubmitBtn');
        const feedback = document.getElementById('addFormFeedback');

        let html = '',
            title = 'Add New',
            submitText = 'Add Record';

        if (mode === 'user') {
            title = isEdit ? 'Edit User' : 'Add New User';
            submitText = isEdit ? 'Update User' : 'Add User';
            html = `
                <input type="hidden" id="editId" value="${isEdit ? data.id : ''}">
                <div class="mb-3"><label class="form-label fw-semibold">Full Name</label><input type="text" class="form-control form-control-custom" id="userName" value="${isEdit ? data.name : ''}" placeholder="John Doe" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Email</label><input type="email" class="form-control form-control-custom" id="userEmail" value="${isEdit ? data.email : ''}" placeholder="john@example.com" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Role</label>
                    <select class="form-control form-control-custom" id="userRole">
                        <option value="Admin" ${isEdit && data.role === 'Admin' ? 'selected' : ''}>Admin</option>
                        <option value="Editor" ${isEdit && data.role === 'Editor' ? 'selected' : ''}>Editor</option>
                        <option value="Viewer" ${isEdit && data.role === 'Viewer' ? 'selected' : ''}>Viewer</option>
                    </select>
                </div>
                <div class="mb-3"><label class="form-label fw-semibold">Status</label>
                    <select class="form-control form-control-custom" id="userStatus">
                        <option value="Active" ${isEdit && data.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Pending" ${isEdit && data.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Inactive" ${isEdit && data.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            `;
        } else if (mode === 'order') {
            title = isEdit ? 'Edit Order' : 'Add New Order';
            submitText = isEdit ? 'Update Order' : 'Add Order';
            html = `
                <input type="hidden" id="editId" value="${isEdit ? data.id : ''}">
                <div class="mb-3"><label class="form-label fw-semibold">Customer Name</label><input type="text" class="form-control form-control-custom" id="orderCustomer" value="${isEdit ? data.customer : ''}" placeholder="John Doe" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Amount ($)</label><input type="number" step="0.01" class="form-control form-control-custom" id="orderAmount" value="${isEdit ? data.amount : ''}" placeholder="99.99" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Status</label>
                    <select class="form-control form-control-custom" id="orderStatus">
                        <option value="Pending" ${isEdit && data.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Completed" ${isEdit && data.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${isEdit && data.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            `;
        } else if (mode === 'report') {
            title = isEdit ? 'Edit Report' : 'Generate New Report';
            submitText = isEdit ? 'Update Report' : 'Generate Report';
            html = `
                <input type="hidden" id="editId" value="${isEdit ? data.id : ''}">
                <div class="mb-3"><label class="form-label fw-semibold">Report Name</label><input type="text" class="form-control form-control-custom" id="reportName" value="${isEdit ? data.name : ''}" placeholder="Q2 Sales Report" required></div>
                <div class="mb-3"><label class="form-label fw-semibold">Type</label>
                    <select class="form-control form-control-custom" id="reportType">
                        <option value="Sales" ${isEdit && data.type === 'Sales' ? 'selected' : ''}>Sales</option>
                        <option value="Analytics" ${isEdit && data.type === 'Analytics' ? 'selected' : ''}>Analytics</option>
                        <option value="Financial" ${isEdit && data.type === 'Financial' ? 'selected' : ''}>Financial</option>
                        <option value="Operations" ${isEdit && data.type === 'Operations' ? 'selected' : ''}>Operations</option>
                    </select>
                </div>
            `;
        }

        modalTitle.textContent = title;
        fields.innerHTML = html;
        submitBtn.innerHTML = `<i class="fas ${isEdit ? 'fa-save' : 'fa-plus'}"></i> ${submitText}`;
        submitBtn.dataset.mode = mode;
        feedback.innerHTML = '';
        new bootstrap.Modal(document.getElementById('addModal')).show();
    };

    window.editRecord = function(mode, id) {
        let data = null;
        if (mode === 'user') data = DB.getUsers().find(u => u.id === id);
        else if (mode === 'order') data = DB.getOrders().find(o => o.id === id);
        else if (mode === 'report') data = DB.getReports().find(r => r.id === id);
        if (data) openAddModal(mode, data);
        else showToast('Record not found!', 'error');
    };

    // Form submit handler
    const addForm = document.getElementById('addForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const mode = this.querySelector('#addSubmitBtn').dataset.mode || 'user';
            const editId = document.getElementById('editId')?.value;
            const feedback = document.getElementById('addFormFeedback');

            if (mode === 'user') {
                const name = document.getElementById('userName')?.value.trim();
                const email = document.getElementById('userEmail')?.value.trim();
                const role = document.getElementById('userRole')?.value;
                const status = document.getElementById('userStatus')?.value;
                if (!name || !email) { feedback.innerHTML =
                    '<span style="color:var(--danger);">All fields required!</span>'; return; }
                if (editId) updateUser(parseInt(editId), { name, email, role, status });
                else addUser({ name, email, role, status });
            } else if (mode === 'order') {
                const customer = document.getElementById('orderCustomer')?.value.trim();
                const amount = document.getElementById('orderAmount')?.value;
                const status = document.getElementById('orderStatus')?.value;
                if (!customer || !amount) { feedback.innerHTML =
                    '<span style="color:var(--danger);">All fields required!</span>'; return; }
                if (editId) updateOrder(parseInt(editId), { customer, amount, status });
                else addOrder({ customer, amount, status });
            } else if (mode === 'report') {
                const name = document.getElementById('reportName')?.value.trim();
                const type = document.getElementById('reportType')?.value;
                if (!name) { feedback.innerHTML = '<span style="color:var(--danger);">Report name required!</span>';
                    return; }
                if (editId) {
                    const reports = DB.getReports();
                    const idx = reports.findIndex(r => r.id === parseInt(editId));
                    if (idx !== -1) {
                        reports[idx] = { ...reports[idx], name, type };
                        DB.setReports(reports);
                        DB.updateUI();
                        showToast(`✅ Report updated!`, 'success');
                    }
                } else addReport({ name, type });
            }

            feedback.innerHTML = '';
            this.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
            if (modal) modal.hide();
            DB.updateUI();
        });
    }

    // ============================================================
    // DASHBOARD - Charts (requires Chart.js)
    // ============================================================
    let userChartInstance = null,
        orderChartInstance = null;

    function initCharts() {
        if (typeof Chart === 'undefined') return;

        const ctx1 = document.getElementById('userGrowthChart')?.getContext('2d');
        if (ctx1) {
            if (userChartInstance) userChartInstance.destroy();
            const users = DB.getUsers();
            userChartInstance = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Users',
                        data: [12, 19, 25, 32, 38, users.length || 45],
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#4361ee',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'var(--border-light)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const ctx2 = document.getElementById('orderStatusChart')?.getContext('2d');
        if (ctx2) {
            if (orderChartInstance) orderChartInstance.destroy();
            const orders = DB.getOrders();
            const completed = orders.filter(o => o.status === 'Completed').length || 1;
            const pending = orders.filter(o => o.status === 'Pending').length || 1;
            const cancelled = orders.filter(o => o.status === 'Cancelled').length || 1;
            orderChartInstance = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Pending', 'Cancelled'],
                    datasets: [{
                        data: [completed, pending, cancelled],
                        backgroundColor: ['#06d6a0', '#ffbe0b', '#ef476f'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { usePointStyle: true, pointStyle: 'circle', padding: 20 }
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    }

    window.updateCharts = function() {
        if (typeof Chart === 'undefined') return;
        if (userChartInstance) {
            const users = DB.getUsers();
            userChartInstance.data.datasets[0].data = [12, 19, 25, 32, 38, users.length || 45];
            userChartInstance.update();
        }
        if (orderChartInstance) {
            const orders = DB.getOrders();
            const completed = orders.filter(o => o.status === 'Completed').length || 1;
            const pending = orders.filter(o => o.status === 'Pending').length || 1;
            const cancelled = orders.filter(o => o.status === 'Cancelled').length || 1;
            orderChartInstance.data.datasets[0].data = [completed, pending, cancelled];
            orderChartInstance.update();
        }
    };

    // ============================================================
    // DASHBOARD - Sidebar Navigation
    // ============================================================
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
        analytics: { title: 'Analytics', subtitle: 'Detailed insights and performance metrics.',
            action: 'Export Data' },
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
        if (pageTitle) pageTitle.textContent = info.title;
        const userName = document.getElementById('userNameDisplay2')?.textContent || 'Guest';
        if (pageSubtitle) pageSubtitle.innerHTML = `Welcome back, <strong>${userName}</strong> — ${info.subtitle}`;
        if (exportBtn) {
            if (panelId === 'analytics' || panelId === 'dashboard') {
                exportBtn.style.display = 'inline-flex';
                exportBtn.innerHTML = `<i class="fas fa-download"></i> Export`;
                exportBtn.onclick = () => showToast('📊 Data exported!', 'success');
            } else {
                exportBtn.style.display = 'none';
            }
        }
        if (actionBtn) {
            const modeMap = { users: 'user', orders: 'order', reports: 'report' };
            const mode = modeMap[panelId] || null;
            if (mode) {
                actionBtn.style.display = 'inline-flex';
                actionBtn.innerHTML = `<i class="fas fa-plus"></i> ${info.action}`;
                actionBtn.onclick = () => openAddModal(mode);
            } else if (panelId === 'dashboard') {
                actionBtn.style.display = 'inline-flex';
                actionBtn.innerHTML = `<i class="fas fa-plus"></i> ${info.action}`;
                actionBtn.onclick = () => showToast('📊 Dashboard refreshed!', 'success');
            } else if (panelId === 'analytics') {
                actionBtn.style.display = 'inline-flex';
                actionBtn.innerHTML = `<i class="fas fa-download"></i> ${info.action}`;
                actionBtn.onclick = () => showToast('📊 Analytics exported!', 'success');
            } else if (panelId === 'settings') {
                actionBtn.style.display = 'inline-flex';
                actionBtn.innerHTML = `<i class="fas fa-save"></i> ${info.action}`;
                actionBtn.onclick = () => showToast('💾 Settings saved!', 'success');
            } else {
                actionBtn.style.display = 'none';
            }
            if (actionLabel) actionLabel.textContent = info.action;
        }
        closeSidebar();
    }

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const panel = this.dataset.panel;
            if (panel) switchPanel(panel);
        });
    });

    // ============================================================
    // DASHBOARD - Sidebar Toggle (mobile)
    // ============================================================
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const mobileToggleBtn = document.getElementById('mobileToggle');

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    if (mobileToggleBtn && sidebar && overlay) {
        mobileToggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', closeSidebar);
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 993) closeSidebar();
        });
    }

    // ============================================================
    // DASHBOARD - Export
    // ============================================================
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showToast('📊 Data exported successfully!', 'success');
        });
    }

    // ============================================================
    // INIT
    // ============================================================
    // Only initialize DB and charts if on dashboard page
    if (document.getElementById('panel-dashboard')) {
        DB.init();
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                initCharts();
            }
        }, 500);

        // Set initial panel
        if (pageTitle) switchPanel('dashboard');
    }

});