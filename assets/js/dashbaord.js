
document.addEventListener("DOMContentLoaded", function () {

    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    if (localStorage.getItem("nexus-theme") === "dark") {
        body.setAttribute("data-theme", "dark");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
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

    // --- MOBILE SIDEBAR ---
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    function toggleSidebar() {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
    }
    if (mobileToggle) mobileToggle.addEventListener("click", toggleSidebar);
    if (overlay) overlay.addEventListener("click", toggleSidebar);

    // --- CHART.JS ---
    const ctx = document.getElementById('visitorsChart')?.getContext('2d');
    if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(67, 97, 238, 0.25)');
        gradient.addColorStop(1, 'rgba(67, 97, 238, 0.01)');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Visitors',
                    data: [120, 190, 150, 210, 180, 280, 240],
                    backgroundColor: gradient,
                    borderColor: '#4361ee',
                    borderWidth: 2.5,
                    tension: 0.4,
                    pointBackgroundColor: '#4361ee',
                    pointRadius: 3,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { display: true, color: 'rgba(0,0,0,0.04)', drawBorder: false } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- Dynamic Data Updates ---
    function updateStats() {
        const users = document.getElementById('totalUsers');
        const orders = document.getElementById('totalOrders');
        const revenue = document.getElementById('totalRevenue');
        const rating = document.getElementById('totalRatings');
        if (users) users.textContent = (1284 + Math.floor(Math.random() * 20) - 5).toLocaleString();
        if (orders) orders.textContent = (347 + Math.floor(Math.random() * 10) - 3).toLocaleString();
        if (revenue) revenue.textContent = '$' + (48290 + Math.floor(Math.random() * 300) - 100).toLocaleString();
        if (rating) rating.textContent = (4.8 + (Math.random() * 0.2 - 0.1)).toFixed(1);
    }
    setInterval(updateStats, 8000);

    // --- Add demo user ---
    function addDemoUser() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        const names = ['Maria Santos', 'David Chen', 'Laura Wilson', 'Tom Harris', 'Anna Kowalski'];
        const roles = ['Admin', 'Manager', 'Developer', 'Designer', 'Marketing'];
        const statuses = ['active', 'pending', 'inactive'];
        const name = names[Math.floor(Math.random() * names.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const joined = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const email = name.toLowerCase().replace(' ', '.') + '@nexus.com';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${name}</td>
          <td>${email}</td>
          <td>${role}</td>
          <td>${joined}</td>
          <td><span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
        `;
        tbody.appendChild(tr);
        const countEl = document.getElementById('userCount');
        if (countEl) countEl.textContent = tbody.querySelectorAll('tr').length;
    }
    setInterval(addDemoUser, 12000);

    // --- Add demo order ---
    function addDemoOrder() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;
        const customers = ['Lisa Park', 'Mike Johnson', 'Sofia Garcia', 'Ryan Lee', 'Emma Watson'];
        const amounts = [49.99, 79.00, 149.50, 25.00, 399.00, 59.99, 89.00];
        const statuses = ['active', 'pending', 'inactive'];
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const amount = amounts[Math.floor(Math.random() * amounts.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const orderNum = '#' + (1024 + tbody.querySelectorAll('tr').length + 1);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${orderNum}</td>
          <td>${customer}</td>
          <td>$${amount.toFixed(2)}</td>
          <td><span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
        `;
        tbody.appendChild(tr);
        while (tbody.querySelectorAll('tr').length > 8) {
            tbody.removeChild(tbody.querySelector('tr'));
        }
    }
    setInterval(addDemoOrder, 10000);

});
