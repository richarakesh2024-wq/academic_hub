/* ===== navbar.js – Navigation Component ===== */

const Navbar = (() => {
    function init() {
        const hamburger = document.getElementById('nav-hamburger');
        const navLinks = document.getElementById('nav-links');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });

        updateAuthUI();
    }

    function updateActiveLink(route) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            link.classList.toggle('active', linkRoute === route);
        });
    }

    function updateAuthUI() {
        const container = document.getElementById('nav-actions');
        const user = Store.getCurrentUser();

        if (user) {
            const color = Helpers.getAvatarColor(user.name);
            const initials = Helpers.getInitials(user.name);
            container.innerHTML = `
        <a href="#/upload" class="btn btn-primary btn-sm">
          <span>✚</span> Upload
        </a>
        <div class="nav-user-menu" id="nav-user-menu">
          <button class="nav-avatar-btn" id="nav-avatar-btn">
            <div class="avatar avatar-sm" style="background:${color}">${initials}</div>
          </button>
          <div class="nav-dropdown hidden" id="nav-dropdown">
            <div class="nav-dropdown-header">
              <strong>${Helpers.escapeHtml(user.name)}</strong>
              <span class="nav-dropdown-email">${Helpers.escapeHtml(user.email)}</span>
            </div>
            <div class="nav-dropdown-divider"></div>
            <a href="#/dashboard" class="nav-dropdown-item">📊 Dashboard</a>
            <button class="nav-dropdown-item nav-logout-btn" id="nav-logout-btn">🚪 Logout</button>
          </div>
        </div>
      `;

            // Avatar click
            const avatarBtn = document.getElementById('nav-avatar-btn');
            const dropdown = document.getElementById('nav-dropdown');
            avatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });

            document.addEventListener('click', () => dropdown.classList.add('hidden'));

            // Logout
            document.getElementById('nav-logout-btn').addEventListener('click', () => {
                Store.logout();
                updateAuthUI();
                window.location.hash = '#/';
                Helpers.showToast('Logged out successfully', 'info');
            });
        } else {
            container.innerHTML = `
        <a href="#/auth" class="btn btn-secondary btn-sm">Log In</a>
        <a href="#/auth" class="btn btn-primary btn-sm">Sign Up</a>
      `;
        }
    }

    return { init, updateActiveLink, updateAuthUI };
})();
