<script>
        // ============================================================
        // DATA STORE
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
                        {
                            id: 1283, customer: 'Sarah Miles', amount: 89.50, status: 'Pending',
                            date: 'Today, 11:15 AM'
                        },
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
                initCharts();
            },
            updateUI() {
                renderUsers();
                renderOrders();
                renderReports();
                updateStats();
                updateBadges();
                updateCharts();
            }
        };

        // ============================================================
        // TOAST
        // ============================================================
        function showToast(message, type = 'success') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast-notification ${type}`;
            const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle' };
            toast.innerHTML =
                `<i class="fas ${icons[type] || icons.success}"></i><span>${message}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
            container.appendChild(toast);
            setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
        }

        // ============================================================
        // SORT STATE
        // ============================================================
        const sortState = {
            user: { key: 'name', asc: true }, order: { key: 'id', asc: true }, report: {
                key: 'name',
                asc: true
            }
        };
        const selectedItems = { user: [], order: [] };

        // ============================================================
        // RENDER FUNCTIONS
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

        function renderUsers() {
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
                    `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-users"></i><h5>No users found</h5><p>Try adjusting your search or filter criteria.</p><button class="btn btn-primary btn-sm rounded-pill" onclick="openAddModal('user')" style="background:var(--gradient-prime);border:none;"><i class="fas fa-plus"></i> Add User</button></div></td></tr>`;
                return;
            }

            tbody.innerHTML = filtered.map(user => `
                <tr class="record-enter ${selectedItems.user.includes(user.id) ? 'selected' : ''}">
                    <td><input type="checkbox" class="row-checkbox" data-type="user" data-id="${user.id}" ${selectedItems.user.includes(user.id) ? 'checked' : ''} onchange="toggleSelect('user', ${user.id}, this.checked)"></td>
                    <td><div class="d-flex align-items-center gap-2"><span class="user-avatar-sm" style="background:var(--gradient-prime);">${user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>${user.name}</div></td>
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
            document.getElementById('userSelectedInfo').textContent = selectedItems.user.length ?
                `${selectedItems.user.length} selected` : '';
        }

        function renderOrders() {
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
                    `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-shopping-cart"></i><h5>No orders found</h5><p>Try adjusting your search or filter criteria.</p><button class="btn btn-primary btn-sm rounded-pill" onclick="openAddModal('order')" style="background:var(--gradient-prime);border:none;"><i class="fas fa-plus"></i> Add Order</button></div></td></tr>`;
                return;
            }

            tbody.innerHTML = filtered.map(order => `
                <tr class="record-enter ${selectedItems.order.includes(order.id) ? 'selected' : ''}">
                    <td><input type="checkbox" class="row-checkbox" data-type="order" data-id="${order.id}" ${selectedItems.order.includes(order.id) ? 'checked' : ''} onchange="toggleSelect('order', ${order.id}, this.checked)"></td>
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
            document.getElementById('orderSelectedInfo').textContent = selectedItems.order.length ?
                `${selectedItems.order.length} selected` : '';
        }

        function renderReports() {
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
        }

        // ============================================================
        // FILTER, SORT, SELECT
        // ============================================================
        function filterTable(type) {
            switch (type) {
                case 'user':
                    renderUsers(); break; case 'order':
                    renderOrders(); break; case 'report':
                    renderReports(); break;
            }
        }

        function sortTable(type, key) {
            if (sortState[type]) {
                if (sortState[type].key === key) sortState[type].asc = !sortState[type].asc;
                else {
                    sortState[type].key = key;
                    sortState[type].asc = true;
                }
            }
            filterTable(type);
        }

        function toggleSelect(type, id, checked) {
            const arr = selectedItems[type];
            if (checked) { if (!arr.includes(id)) arr.push(id); } else {
                const idx = arr.indexOf(id); if (idx > -1) arr
                    .splice(idx, 1);
            }
            updateBulkActions(type);
            filterTable(type);
        }

        function toggleAllCheckboxes(type) {
            const checkboxes = document.querySelectorAll(`#${type}TableBody .row-checkbox`);
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            const ids = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
            selectedItems[type] = allChecked ? [] : ids;
            updateBulkActions(type);
            filterTable(type);
        }

        function updateBulkActions(type) {
            const count = selectedItems[type].length;
            const bulk = document.getElementById(`bulkActions${type.charAt(0).toUpperCase() + type.slice(1)}`);
            const countEl = document.getElementById(`selectedCount${type.charAt(0).toUpperCase() + type.slice(1)}`);
            if (bulk) bulk.classList.toggle('show', count > 0);
            if (countEl) countEl.textContent = count;
            const info = document.getElementById(`${type}SelectedInfo`);
            if (info) info.textContent = count ? `${count} selected` : '';
        }

        function clearSelection(type) {
            selectedItems[type] = [];
            updateBulkActions(type);
            filterTable(type);
        }

        function bulkDelete(type) {
            const ids = selectedItems[type];
            if (!ids.length) return;
            if (!confirm(`Delete ${ids.length} selected ${type}${ids.length > 1 ? 's' : ''}?`)) return;
            const data = DB[`get${type.charAt(0).toUpperCase() + type.slice(1)}s`]();
            const filtered = data.filter(item => !ids.includes(item.id));
            DB[`set${type.charAt(0).toUpperCase() + type.slice(1)}s`](filtered);
            selectedItems[type] = [];
            DB.updateUI();
            showToast(`🗑️ ${ids.length} ${type}${ids.length > 1 ? 's' : ''} deleted!`, 'warning');
            updateBulkActions(type);
        }

        // ============================================================
        // STATS & BADGES
        // ============================================================
        function updateStats() {
            const users = DB.getUsers(),
                orders = DB.getOrders(),
                reports = DB.getReports();
            const totalUsers = users.length,
                activeUsers = users.filter(u => u.status === 'Active').length,
                pendingUsers = users.filter(u => u.status === 'Pending').length,
                newUsers = users.filter(u => u.joined === 'Today').length;
            const totalOrders = orders.length,
                pendingOrders = orders.filter(o => o.status === 'Pending').length,
                completedOrders = orders.filter(o => o.status === 'Completed').length,
                cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
            const totalReports = reports.length,
                readyReports = reports.filter(r => r.status === 'Ready').length,
                generatingReports = reports.filter(r => r.status === 'Generating').length;
            const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);

            document.getElementById('statTotalUsers').textContent = totalUsers;
            document.getElementById('statActiveUsers').textContent = activeUsers;
            document.getElementById('statPendingUsers').textContent = pendingUsers;
            document.getElementById('statNewUsers').textContent = newUsers;
            document.getElementById('statTotalOrders').textContent = totalOrders;
            document.getElementById('statPendingOrders').textContent = pendingOrders;
            document.getElementById('statCompletedOrders').textContent = completedOrders;
            document.getElementById('statCancelledOrders').textContent = cancelledOrders;
            document.getElementById('statTotalReports').textContent = totalReports;
            document.getElementById('statReadyReports').textContent = readyReports;
            document.getElementById('statGeneratingReports').textContent = generatingReports;
            document.getElementById('dashUsers').textContent = totalUsers;
            document.getElementById('dashOrders').textContent = totalOrders;
            document.getElementById('dashRevenue').textContent = `$${totalRevenue.toFixed(0)}`;
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
            users.push({ id: DB.getNextId('users'), ...data, joined: 'Today' });
            DB.setUsers(users);
            DB.updateUI();
            showToast(`✅ User "${data.name}" added!`, 'success');
            addActivity(`New user <strong>${data.name}</strong> registered`);
        }

        function updateUser(id, data) {
            const users = DB.getUsers();
            const idx = users.findIndex(u => u.id === id);
            if (idx === -1) return showToast('User not found!', 'error');
            users[idx] = { ...users[idx], ...data };
            DB.setUsers(users);
            DB.updateUI();
            showToast(`✅ User "${data.name}" updated!`, 'success');
        }

        function deleteUser(id) {
            if (!confirm('Delete this user?')) return;
            const users = DB.getUsers(),
                user = users.find(u => u.id === id);
            DB.setUsers(users.filter(u => u.id !== id));
            DB.updateUI();
            showToast(`🗑️ User "${user?.name}" deleted!`, 'warning');
            addActivity(`User <strong>${user?.name}</strong> deleted`);
        }

        function addOrder(data) {
            const orders = DB.getOrders();
            orders.push({
                id: DB.getNextId('orders'), ...data, amount: parseFloat(data.amount),
                date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            DB.setOrders(orders);
            DB.updateUI();
            showToast(`✅ Order for "${data.customer}" added!`, 'success');
            addActivity(`Order <strong>#${orders[orders.length - 1].id}</strong> created`);
        }

        function updateOrder(id, data) {
            const orders = DB.getOrders();
            const idx = orders.findIndex(o => o.id === id);
            if (idx === -1) return showToast('Order not found!', 'error');
            orders[idx] = { ...orders[idx], ...data, amount: parseFloat(data.amount) };
            DB.setOrders(orders);
            DB.updateUI();
            showToast(`✅ Order #${id} updated!`, 'success');
        }

        function deleteOrder(id) {
            if (!confirm('Delete this order?')) return;
            const orders = DB.getOrders(),
                order = orders.find(o => o.id === id);
            DB.setOrders(orders.filter(o => o.id !== id));
            DB.updateUI();
            showToast(`🗑️ Order #${id} deleted!`, 'warning');
        }

        function addReport(data) {
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
        }

        function deleteReport(id) {
            if (!confirm('Delete this report?')) return;
            const reports = DB.getReports(),
                report = reports.find(r => r.id === id);
            DB.setReports(reports.filter(r => r.id !== id));
            DB.updateUI();
            showToast(`🗑️ Report "${report?.name}" deleted!`, 'warning');
        }

        function deleteRecord(mode, id) {
            if (mode === 'user') deleteUser(id);
            else if (mode === 'order') deleteOrder(id);
            else if (mode === 'report') deleteReport(id);
        }

        // ============================================================
        // ACTIVITY
        // ============================================================
        function addActivity(text) {
            const feed = document.getElementById('activityFeed');
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML =
                `<span class="activity-dot primary"></span><div class="activity-content"><div class="text">${text}</div><div class="time">Just now</div></div>`;
            feed.prepend(item);
            while (feed.children.length > 10) feed.removeChild(feed.lastChild);
        }

        // ============================================================
        // MODAL
        // ============================================================
        let editId = null;

        function openAddModal(mode, data = null) {
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
        }

        function editRecord(mode, id) {
            let data = null;
            if (mode === 'user') data = DB.getUsers().find(u => u.id === id);
            else if (mode === 'order') data = DB.getOrders().find(o => o.id === id);
            else if (mode === 'report') data = DB.getReports().find(r => r.id === id);
            if (data) openAddModal(mode, data);
            else showToast('Record not found!', 'error');
        }

        // Form submit
        document.getElementById('addForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const mode = this.querySelector('#addSubmitBtn').dataset.mode || 'user';
            const editId = document.getElementById('editId')?.value;
            const feedback = document.getElementById('addFormFeedback');

            if (mode === 'user') {
                const name = document.getElementById('userName')?.value.trim();
                const email = document.getElementById('userEmail')?.value.trim();
                const role = document.getElementById('userRole')?.value;
                const status = document.getElementById('userStatus')?.value;
                if (!name || !email) {
                    feedback.innerHTML = '<span style="color:var(--danger);">All fields required!</span>';
                    return;
                }
                if (editId) updateUser(parseInt(editId), { name, email, role, status });
                else addUser({ name, email, role, status });
            } else if (mode === 'order') {
                const customer = document.getElementById('orderCustomer')?.value.trim();
                const amount = document.getElementById('orderAmount')?.value;
                const status = document.getElementById('orderStatus')?.value;
                if (!customer || !amount) {
                    feedback.innerHTML = '<span style="color:var(--danger);">All fields required!</span>';
                    return;
                }
                if (editId) updateOrder(parseInt(editId), { customer, amount, status });
                else addOrder({ customer, amount, status });
            } else if (mode === 'report') {
                const name = document.getElementById('reportName')?.value.trim();
                const type = document.getElementById('reportType')?.value;
                if (!name) { feedback.innerHTML = '<span style="color:var(--danger);">Report name required!</span>'; return; }
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

        // ============================================================
        // CHARTS
        // ============================================================
        let userChartInstance = null,
            orderChartInstance = null;

        function initCharts() {
            // User Growth Chart
            const ctx1 = document.getElementById('userGrowthChart')?.getContext('2d');
            if (ctx1) {
                if (userChartInstance) userChartInstance.destroy();
                userChartInstance = new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Users',
                            data: [12, 19, 25, 32, 38, 45],
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

            // Order Status Chart
            const ctx2 = document.getElementById('orderStatusChart')?.getContext('2d');
            if (ctx2) {
                if (orderChartInstance) orderChartInstance.destroy();
                const orders = DB.getOrders();
                const completed = orders.filter(o => o.status === 'Completed').length;
                const pending = orders.filter(o => o.status === 'Pending').length;
                const cancelled = orders.filter(o => o.status === 'Cancelled').length;
                orderChartInstance = new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: ['Completed', 'Pending', 'Cancelled'],
                        datasets: [{
                            data: [completed || 1, pending || 1, cancelled || 1],
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

        function updateCharts() {
            if (userChartInstance) {
                const users = DB.getUsers();
                const counts = [12, 19, 25, 32, 38, users.length];
                userChartInstance.data.datasets[0].data = counts;
                userChartInstance.update();
            }
            if (orderChartInstance) {
                const orders = DB.getOrders();
                const completed = orders.filter(o => o.status === 'Completed').length;
                const pending = orders.filter(o => o.status === 'Pending').length;
                const cancelled = orders.filter(o => o.status === 'Cancelled').length;
                orderChartInstance.data.datasets[0].data = [completed || 1, pending || 1, cancelled || 1];
                orderChartInstance.update();
            }
        }

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
                actionLabel.textContent = info.action;
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
        // THEME
        // ============================================================
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('nexus-theme');
        const theme = savedTheme || (prefersDark.matches ? 'dark' : 'light');

        function applyTheme(t) {
            body.setAttribute('data-theme', t);
            localStorage.setItem('nexus-theme', t);
            themeToggle.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
        applyTheme(theme);

        themeToggle.addEventListener('click', () => {
            applyTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });

        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('nexus-theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        // ============================================================
        // USER & LOGOUT
        // ============================================================
        const savedUser = localStorage.getItem('user');
        let userName = 'Guest',
            userInitial = 'G';
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
            if (confirm('Logout?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
        });

        // ============================================================
        // SIDEBAR TOGGLE
        // ============================================================
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mobileToggle = document.getElementById('mobileToggle');

        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', closeSidebar);
        window.addEventListener('resize', () => { if (window.innerWidth >= 993) closeSidebar(); });

        // ============================================================
        // SESSION MANAGEMENT
        // ============================================================
        let sessionTimer = null,
            warningTimer = null;

        function resetSessionTimer() {
            clearTimeout(sessionTimer);
            clearTimeout(warningTimer);
            document.getElementById('sessionWarning').style.display = 'none';
            sessionTimer = setTimeout(() => {
                document.getElementById('sessionWarning').style.display = 'block';
                warningTimer = setTimeout(() => {
                    document.getElementById('sessionWarning').style.display = 'none';
                    showToast('⏰ Session expired. Please login again.', 'warning');
                }, 30000);
            }, 25 * 60 * 1000);
        }

        ['click', 'keydown', 'mousemove', 'scroll'].forEach(event => {
            document.addEventListener(event, resetSessionTimer);
        });
        resetSessionTimer();

        document.getElementById('sessionWarning').addEventListener('click', function () {
            this.style.display = 'none';
            clearTimeout(warningTimer);
            resetSessionTimer();
            showToast('⏰ Session extended!', 'success');
        });

        // ============================================================
        // EXPORT
        // ============================================================
        document.getElementById('exportBtn')?.addEventListener('click', function () {
            showToast('📊 Data exported successfully!', 'success');
        });

        // ============================================================
        // INIT
        // ============================================================
        DB.init();
        switchPanel('dashboard');
    </script>