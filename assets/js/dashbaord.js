<script>
        // ============================================================
        // DATA STORE (localStorage)
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
            // Initialize with sample data if empty
            init() {
                if (this.getUsers().length === 0) {
                    this.setUsers([
                        {
                            id: 1, name: 'John Doe', email: 'john@nexus.digital', role: 'Admin', status: 'Active',
                            joined: 'Jan 15, 2025'
                        },
                        {
                            id: 2, name: 'Sarah Miles', email: 'sarah@nexus.digital', role: 'Editor', status: 'Active',
                            joined: 'Feb 3, 2025'
                        },
                        {
                            id: 3, name: 'Alex Kim', email: 'alex@nexus.digital', role: 'Viewer', status: 'Pending',
                            joined: 'Mar 10, 2025'
                        },
                        {
                            id: 4, name: 'Elena Rios', email: 'elena@nexus.digital', role: 'Editor', status: 'Inactive',
                            joined: 'Apr 22, 2025'
                        }
                    ]);
                    localStorage.setItem('nexus_users_nextId', 5);
                }
                if (this.getOrders().length === 0) {
                    this.setOrders([
                        {
                            id: 1284, customer: 'John Doe', amount: 245.00, status: 'Completed',
                            date: 'Today, 2:30 PM'
                        },
                        { id: 1283, customer: 'Sarah Miles', amount: 89.50, status: 'Pending', date: 'Today, 11:15 AM' },
                        {
                            id: 1282, customer: 'Alex Kim', amount: 1250.00, status: 'Completed',
                            date: 'Yesterday, 4:45 PM'
                        },
                        {
                            id: 1281, customer: 'Elena Rios', amount: 430.00, status: 'Cancelled',
                            date: 'Yesterday, 9:20 AM'
                        }
                    ]);
                    localStorage.setItem('nexus_orders_nextId', 1285);
                }
                if (this.getReports().length === 0) {
                    this.setReports([
                        {
                            id: 1, name: 'Q1 Sales Summary', type: 'Sales', generated: 'Apr 1, 2025',
                            status: 'Ready'
                        },
                        {
                            id: 2, name: 'User Growth Report', type: 'Analytics', generated: 'Mar 28, 2025',
                            status: 'Ready'
                        },
                        { id: 3, name: 'Revenue Breakdown', type: 'Financial', generated: '—', status: 'Generating' },
                        {
                            id: 4, name: 'Customer Feedback', type: 'Survey', generated: 'Mar 25, 2025',
                            status: 'Ready'
                        },
                        { id: 5, name: 'Inventory Status', type: 'Operations', generated: '—', status: 'Failed' }
                    ]);
                    localStorage.setItem('nexus_reports_nextId', 6);
                }
                this.updateUI();
            },
            updateUI() {
                renderUsers();
                renderOrders();
                renderReports();
                updateStats();
                updateBadges();
            }
        };

        // ============================================================
        // TOAST NOTIFICATIONS
        // ============================================================
        function showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast-notification ${type}`;
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle'
            };
            toast.innerHTML = `
                <i class="fas ${icons[type] || icons.success}"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
            `;
            container.appendChild(toast);
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 4000);
        }

        // ============================================================
        // RENDER FUNCTIONS
        // ============================================================
        function renderUsers() {
            const users = DB.getUsers();
            const tbody = document.getElementById('userTableBody');
            if (!tbody) return;
            if (users.length === 0) {
                tbody.innerHTML =
                    `<tr><td colspan="6" class="text-center text-muted py-4">No users found. Click "Add User" to create one.</td></tr>`;
                return;
            }
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td><div class="d-flex align-items-center gap-2">
                        <span class="user-avatar-sm" style="background:var(--gradient-prime);">${user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                        ${user.name}
                    </div></td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td><span class="badge-status ${user.status.toLowerCase()}">${user.status}</span></td>
                    <td>${user.joined}</td>
                    <td class="text-end">
                        <div class="action-btn-group">
                            <button class="btn-sm btn-edit" onclick="editRecord('user', ${user.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn-sm btn-delete" onclick="deleteRecord('user', ${user.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function renderOrders() {
            const orders = DB.getOrders();
            const tbody = document.getElementById('orderTableBody');
            if (!tbody) return;
            if (orders.length === 0) {
                tbody.innerHTML =
                    `<tr><td colspan="6" class="text-center text-muted py-4">No orders found. Click "Add Order" to create one.</td></tr>`;
                return;
            }
            tbody.innerHTML = orders.map(order => `
                <tr>
                    <td><strong>#${order.id}</strong></td>
                    <td>${order.customer}</td>
                    <td>$${order.amount.toFixed(2)}</td>
                    <td><span class="badge-status ${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${order.date}</td>
                    <td class="text-end">
                        <div class="action-btn-group">
                            <button class="btn-sm btn-edit" onclick="editRecord('order', ${order.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn-sm btn-delete" onclick="deleteRecord('order', ${order.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function renderReports() {
            const reports = DB.getReports();
            const tbody = document.getElementById('reportTableBody');
            if (!tbody) return;
            if (reports.length === 0) {
                tbody.innerHTML =
                    `<tr><td colspan="5" class="text-center text-muted py-4">No reports found. Click "New Report" to create one.</td></tr>`;
                return;
            }
            tbody.innerHTML = reports.map(report => `
                <tr>
                    <td>${report.name}</td>
                    <td>${report.type}</td>
                    <td>${report.generated}</td>
                    <td><span class="badge-status ${report.status.toLowerCase()}">${report.status}</span></td>
                    <td class="text-end">
                        <div class="action-btn-group">
                            ${report.status === 'Ready' ? `<button class="btn-sm btn-edit" onclick="showToast('Downloading ${report.name}...', 'success')"><i class="fas fa-download"></i></button>` : ''}
                            <button class="btn-sm btn-delete" onclick="deleteRecord('report', ${report.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        // ============================================================
        // STATS & BADGES
        // ============================================================
        function updateStats() {
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

            // Update stat cards
            document.getElementById('statTotalUsers').textContent = totalUsers;
            document.getElementById('statActiveUsers').textContent = activeUsers;
            document.getElementById('statPendingUsers').textContent = pendingUsers;
            document.getElementById('statNewUsers').textContent = newUsers;

            document.getElementById('statTotalOrders').textContent = totalOrders;
            document.getElementById('statPendingOrders').textContent = pendingOrders;
            document.getElementById('statCompletedOrders').textContent = completedOrders;
            document.getElementById('statCancelledOrders').textContent = cancelledOrders;

            document.getElementById('statTotalReports').textContent = totalReports;

            // Dashboard summary
            document.getElementById('dashUsers').textContent = totalUsers;
            document.getElementById('dashOrders').textContent = totalOrders;
        }

        function updateBadges() {
            document.getElementById('userCount').textContent = DB.getUsers().length;
            document.getElementById('orderCount').textContent = DB.getOrders().length;
            document.getElementById('reportCount').textContent = DB.getReports().length;
        }

        // ============================================================
        // CRUD OPERATIONS
        // ============================================================
        function addUser(data) {
            const users = DB.getUsers();
            const newUser = {
                id: DB.getNextId('users'),
                name: data.name,
                email: data.email,
                role: data.role,
                status: data.status,
                joined: 'Today'
            };
            users.push(newUser);
            DB.setUsers(users);
            DB.updateUI();
            showToast(`✅ User "${data.name}" added successfully!`, 'success');
            addActivity(`New user <strong>${data.name}</strong> registered`);
        }

        function updateUser(id, data) {
            const users = DB.getUsers();
            const index = users.findIndex(u => u.id === id);
            if (index === -1) return showToast('User not found!', 'error');
            users[index] = { ...users[index], ...data };
            DB.setUsers(users);
            DB.updateUI();
            showToast(`✅ User "${data.name}" updated successfully!`, 'success');
            addActivity(`User <strong>${data.name}</strong> updated`);
        }

        function deleteUser(id) {
            if (!confirm('Are you sure you want to delete this user?')) return;
            const users = DB.getUsers();
            const user = users.find(u => u.id === id);
            const filtered = users.filter(u => u.id !== id);
            DB.setUsers(filtered);
            DB.updateUI();
            showToast(`🗑️ User "${user?.name || 'Unknown'}" deleted!`, 'warning');
            addActivity(`User <strong>${user?.name || 'Unknown'}</strong> deleted`);
        }

        function addOrder(data) {
            const orders = DB.getOrders();
            const newOrder = {
                id: DB.getNextId('orders'),
                customer: data.customer,
                amount: parseFloat(data.amount),
                status: data.status,
                date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            orders.push(newOrder);
            DB.setOrders(orders);
            DB.updateUI();
            showToast(`✅ Order for "${data.customer}" added successfully!`, 'success');
            addActivity(`Order <strong>#${newOrder.id}</strong> created for ${data.customer}`);
        }

        function updateOrder(id, data) {
            const orders = DB.getOrders();
            const index = orders.findIndex(o => o.id === id);
            if (index === -1) return showToast('Order not found!', 'error');
            orders[index] = { ...orders[index], ...data, amount: parseFloat(data.amount) };
            DB.setOrders(orders);
            DB.updateUI();
            showToast(`✅ Order #${id} updated successfully!`, 'success');
        }

        function deleteOrder(id) {
            if (!confirm('Are you sure you want to delete this order?')) return;
            const orders = DB.getOrders();
            const order = orders.find(o => o.id === id);
            const filtered = orders.filter(o => o.id !== id);
            DB.setOrders(filtered);
            DB.updateUI();
            showToast(`🗑️ Order #${id} deleted!`, 'warning');
            addActivity(`Order <strong>#${id}</strong> deleted`);
        }

        function addReport(data) {
            const reports = DB.getReports();
            const newReport = {
                id: DB.getNextId('reports'),
                name: data.name,
                type: data.type,
                generated: 'Today',
                status: 'Processing'
            };
            reports.push(newReport);
            DB.setReports(reports);
            DB.updateUI();
            showToast(`✅ Report "${data.name}" generated successfully!`, 'success');
            addActivity(`New report <strong>${data.name}</strong> generated`);
            // Auto-complete after 2 seconds
            setTimeout(() => {
                const reports2 = DB.getReports();
                const idx = reports2.findIndex(r => r.id === newReport.id);
                if (idx !== -1) {
                    reports2[idx].status = 'Ready';
                    DB.setReports(reports2);
                    renderReports();
                    showToast(`📄 Report "${data.name}" is now ready!`, 'success');
                }
            }, 2000);
        }

        function deleteReport(id) {
            if (!confirm('Are you sure you want to delete this report?')) return;
            const reports = DB.getReports();
            const report = reports.find(r => r.id === id);
            const filtered = reports.filter(r => r.id !== id);
            DB.setReports(filtered);
            DB.updateUI();
            showToast(`🗑️ Report "${report?.name || 'Unknown'}" deleted!`, 'warning');
        }

        // ============================================================
        // ACTIVITY FEED
        // ============================================================
        function addActivity(text) {
            const feed = document.getElementById('activityFeed');
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <span class="activity-dot primary"></span>
                <div class="activity-content">
                    <div class="text">${text}</div>
                    <div class="time">Just now</div>
                </div>
            `;
            feed.prepend(item);
            // Keep only last 10 items
            while (feed.children.length > 10) {
                feed.removeChild(feed.lastChild);
            }
        }

        // ============================================================
        // MODAL HANDLING
        // ============================================================
        let editMode = null;
        let editId = null;

        function openAddModal(mode, data = null) {
            editMode = mode;
            editId = data?.id || null;

            const modalTitle = document.getElementById('addModalTitle');
            const modalFields = document.getElementById('modalFields');
            const addSubmitBtn = document.getElementById('addSubmitBtn');
            const addFeedback = document.getElementById('addFormFeedback');

            let fields = '';
            let title = 'Add New';
            let submitText = 'Add Record';

            const isEdit = data !== null;

            switch (mode) {
                case 'user':
                    title = isEdit ? 'Edit User' : 'Add New User';
                    submitText = isEdit ? 'Update User' : 'Add User';
                    fields = `
                        <div class="mb-3"><label class="form-label fw-semibold">Full Name</label><input type="text" class="form-control form-control-custom" id="userName" placeholder="John Doe" value="${isEdit ? data.name : ''}" required></div>
                        <div class="mb-3"><label class="form-label fw-semibold">Email</label><input type="email" class="form-control form-control-custom" id="userEmail" placeholder="john@example.com" value="${isEdit ? data.email : ''}" required></div>
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
                    break;
                case 'order':
                    title = isEdit ? 'Edit Order' : 'Add New Order';
                    submitText = isEdit ? 'Update Order' : 'Add Order';
                    fields = `
                        <div class="mb-3"><label class="form-label fw-semibold">Customer Name</label><input type="text" class="form-control form-control-custom" id="orderCustomer" placeholder="John Doe" value="${isEdit ? data.customer : ''}" required></div>
                        <div class="mb-3"><label class="form-label fw-semibold">Amount ($)</label><input type="number" step="0.01" class="form-control form-control-custom" id="orderAmount" placeholder="99.99" value="${isEdit ? data.amount : ''}" required></div>
                        <div class="mb-3"><label class="form-label fw-semibold">Status</label>
                            <select class="form-control form-control-custom" id="orderStatus">
                                <option value="Pending" ${isEdit && data.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Completed" ${isEdit && data.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                <option value="Cancelled" ${isEdit && data.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                    `;
                    break;
                case 'report':
                    title = isEdit ? 'Edit Report' : 'Generate New Report';
                    submitText = isEdit ? 'Update Report' : 'Generate Report';
                    fields = `
                        <div class="mb-3"><label class="form-label fw-semibold">Report Name</label><input type="text" class="form-control form-control-custom" id="reportName" placeholder="Q2 Sales Report" value="${isEdit ? data.name : ''}" required></div>
                        <div class="mb-3"><label class="form-label fw-semibold">Type</label>
                            <select class="form-control form-control-custom" id="reportType">
                                <option value="Sales" ${isEdit && data.type === 'Sales' ? 'selected' : ''}>Sales</option>
                                <option value="Analytics" ${isEdit && data.type === 'Analytics' ? 'selected' : ''}>Analytics</option>
                                <option value="Financial" ${isEdit && data.type === 'Financial' ? 'selected' : ''}>Financial</option>
                                <option value="Operations" ${isEdit && data.type === 'Operations' ? 'selected' : ''}>Operations</option>
                            </select>
                        </div>
                    `;
                    break;
                default:
                    fields = `<div class="mb-3"><label class="form-label fw-semibold">Name</label><input type="text" class="form-control form-control-custom" placeholder="Enter name" required></div>`;
            }

            modalTitle.textContent = title;
            modalFields.innerHTML = fields;
            addSubmitBtn.innerHTML = `<i class="fas ${isEdit ? 'fa-save' : 'fa-plus'}"></i> ${submitText}`;
            addFeedback.innerHTML = '';
            document.getElementById('addModal').dataset.mode = mode;
            document.getElementById('addModal').dataset.editId = editId || '';
            const modal = new bootstrap.Modal(document.getElementById('addModal'));
            modal.show();
        }

        function editRecord(mode, id) {
            let data = null;
            switch (mode) {
                case 'user':
                    data = DB.getUsers().find(u => u.id === id);
                    break;
                case 'order':
                    data = DB.getOrders().find(o => o.id === id);
                    break;
                case 'report':
                    data = DB.getReports().find(r => r.id === id);
                    break;
            }
            if (data) openAddModal(mode, data);
            else showToast('Record not found!', 'error');
        }

        function deleteRecord(mode, id) {
            switch (mode) {
                case 'user':
                    deleteUser(id);
                    break;
                case 'order':
                    deleteOrder(id);
                    break;
                case 'report':
                    deleteReport(id);
                    break;
            }
        }

        // ============================================================
        // FORM SUBMISSION
        // ============================================================
        document.getElementById('addForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const modal = document.getElementById('addModal');
            const mode = modal.dataset.mode || 'user';
            const editId = modal.dataset.editId ? parseInt(modal.dataset.editId) : null;
            const feedback = document.getElementById('addFormFeedback');

            let result = { success: false, message: '' };

            switch (mode) {
                case 'user': {
                    const name = document.getElementById('userName')?.value.trim();
                    const email = document.getElementById('userEmail')?.value.trim();
                    const role = document.getElementById('userRole')?.value;
                    const status = document.getElementById('userStatus')?.value;
                    if (!name || !email) {
                        feedback.innerHTML = '<span style="color:var(--danger);">All fields are required!</span>';
                        return;
                    }
                    if (editId) {
                        updateUser(editId, { name, email, role, status });
                    } else {
                        addUser({ name, email, role, status });
                    }
                    result.success = true;
                    break;
                }
                case 'order': {
                    const customer = document.getElementById('orderCustomer')?.value.trim();
                    const amount = document.getElementById('orderAmount')?.value;
                    const status = document.getElementById('orderStatus')?.value;
                    if (!customer || !amount) {
                        feedback.innerHTML = '<span style="color:var(--danger);">All fields are required!</span>';
                        return;
                    }
                    if (editId) {
                        updateOrder(editId, { customer, amount, status });
                    } else {
                        addOrder({ customer, amount, status });
                    }
                    result.success = true;
                    break;
                }
                case 'report': {
                    const name = document.getElementById('reportName')?.value.trim();
                    const type = document.getElementById('reportType')?.value;
                    if (!name) {
                        feedback.innerHTML = '<span style="color:var(--danger);">Report name is required!</span>';
                        return;
                    }
                    if (editId) {
                        const reports = DB.getReports();
                        const idx = reports.findIndex(r => r.id === editId);
                        if (idx !== -1) {
                            reports[idx] = { ...reports[idx], name, type };
                            DB.setReports(reports);
                            DB.updateUI();
                            showToast(`✅ Report updated successfully!`, 'success');
                        }
                    } else {
                        addReport({ name, type });
                    }
                    result.success = true;
                    break;
                }
                default: {
                    const name = document.getElementById('modalName')?.value.trim();
                    if (!name) {
                        feedback.innerHTML = '<span style="color:var(--danger);">Name is required!</span>';
                        return;
                    }
                    showToast(`✅ Record "${name}" added!`, 'success');
                    result.success = true;
                }
            }

            if (result.success) {
                feedback.innerHTML = '';
                this.reset();
                const bsModal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
                if (bsModal) bsModal.hide();
                DB.updateUI();
            }
        });

        // ============================================================
        // SIDEBAR NAVIGATION
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
            analytics: {
                title: 'Analytics', subtitle: 'Detailed insights and performance metrics.',
                action: 'Export Data'
            },
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
            const userName = document.getElementById('userNameDisplay2').textContent;
            pageSubtitle.innerHTML = `Welcome back, <strong>${userName}</strong> — ${info.subtitle}`;
            if (exportBtn) {
                if (panelId === 'analytics') {
                    exportBtn.innerHTML = `<i class="fas fa-download"></i> Export Data`;
                    exportBtn.style.display = 'inline-flex';
                    exportBtn.onclick = function () { showToast('📊 Exporting analytics data as CSV...', 'success'); };
                } else {
                    exportBtn.style.display = 'none';
                }
            }
            if (actionBtn) {
                actionBtn.innerHTML = `<i class="fas fa-plus"></i> ${info.action}`;
                actionLabel.textContent = info.action;
                const modeMap = {
                    users: 'user',
                    orders: 'order',
                    reports: 'report'
                };
                const mode = modeMap[panelId] || null;
                if (mode) {
                    actionBtn.setAttribute('data-bs-toggle', 'modal');
                    actionBtn.setAttribute('data-bs-target', '#addModal');
                    actionBtn.onclick = function () { openAddModal(mode); };
                } else if (panelId === 'dashboard') {
                    actionBtn.onclick = function () { showToast('📊 Dashboard overview exported!', 'success'); };
                    actionBtn.removeAttribute('data-bs-toggle');
                    actionBtn.removeAttribute('data-bs-target');
                } else if (panelId === 'analytics') {
                    actionBtn.onclick = function () { showToast('📊 Exporting analytics data...', 'success'); };
                    actionBtn.removeAttribute('data-bs-toggle');
                    actionBtn.removeAttribute('data-bs-target');
                } else if (panelId === 'settings') {
                    actionBtn.onclick = function () { showToast('💾 Settings saved!', 'success'); };
                    actionBtn.removeAttribute('data-bs-toggle');
                    actionBtn.removeAttribute('data-bs-target');
                } else {
                    actionBtn.onclick = null;
                    actionBtn.removeAttribute('data-bs-toggle');
                    actionBtn.removeAttribute('data-bs-target');
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

        // ============================================================
        // THEME TOGGLE
        // ============================================================
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        if (localStorage.getItem('nexus-theme') === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        themeToggle.addEventListener('click', function () {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('nexus-theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('nexus-theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });

        // ============================================================
        // USER DISPLAY & LOGOUT
        // ============================================================
        const savedUser = localStorage.getItem('user');
        let userName = 'Guest';
        let userInitial = 'G';
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                userName = user.name || 'Guest';
                userInitial = userName.charAt(0).toUpperCase();
            } catch (e) { }
        }
        document.querySelectorAll('#userNameDisplay, #userNameDisplay2').forEach(el => el.textContent = userName);
        document.getElementById('userAvatar').textContent = userInitial;

        document.getElementById('logoutBtn').addEventListener('click', function () {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
        });

        // ============================================================
        // SIDEBAR TOGGLE (mobile)
        // ============================================================
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mobileToggle = document.getElementById('mobileToggle');

        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }

        mobileToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', closeSidebar);
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 993) closeSidebar();
        });

        // ============================================================
        // ANIMATE BARS
        // ============================================================
        setTimeout(() => {
            document.querySelectorAll('.bar').forEach((bar, i) => {
                const heights = [55, 75, 45, 85, 65, 50, 90];
                bar.style.height = heights[i] + '%';
            });
        }, 300);

        // ============================================================
        // INIT
        // ============================================================
        DB.init();
        switchPanel('dashboard');
    </script>