/* ===== router.js – Hash-based SPA Router ===== */
const Router = (() => {
    function getRoute() {
        const hash = window.location.hash.replace('#', '') || '/';
        return hash;
    }

    function navigate() {
        const route = getRoute();
        const app = document.getElementById('app');

        // Parse route
        if (route === '/' || route === '') {
            Navbar.updateActiveLink('/');
            LandingPage.render();
        } else if (route === '/auth') {
            Navbar.updateActiveLink('/auth');
            AuthPage.render();
        } else if (route === '/browse') {
            Navbar.updateActiveLink('/browse');
            BrowsePage.render();
        } else if (route.startsWith('/resource/')) {
            Navbar.updateActiveLink('/browse');
            const id = route.replace('/resource/', '');
            ResourceDetailPage.render(id);
        } else if (route === '/upload') {
            Navbar.updateActiveLink('/upload');
            UploadPage.render();
        } else if (route === '/dashboard') {
            Navbar.updateActiveLink('/dashboard');
            DashboardPage.render();
        } else if (route === '/collaborate') {
            Navbar.updateActiveLink('/collaborate');
            CollaborationPage.render();
        } else {
            // 404
            Navbar.updateActiveLink('');
            app.innerHTML = `
        <div class="page-enter" style="min-height:60vh;display:flex;align-items:center;justify-content:center">
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <p class="empty-state-title">Page Not Found</p>
            <p class="empty-state-text">The page you're looking for doesn't exist.</p>
            <a href="#/" class="btn btn-primary" style="margin-top:var(--space-4)">Go Home</a>
          </div>
        </div>
      `;
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function init() {
        window.addEventListener('hashchange', navigate);
        navigate();
    }

    return { init, navigate };
})();
