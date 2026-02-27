/* ===== landing.js – Landing Page ===== */

const LandingPage = (() => {
    function render() {
        const app = document.getElementById('app');
        const resources = Store.getResources();
        const users = Store.getUsers();
        const reviews = Store.getReviews();

        // Top rated resources
        const topResources = Store.searchResources({ sortBy: 'rating' }).slice(0, 4);

        app.innerHTML = `
      <div class="page-enter">
        <!-- Hero -->
        <section class="landing-hero">
          <div class="hero-content">
            <div class="hero-badge">🎓 Built for Students, by Students</div>
            <h1 class="hero-title">
              Your Academic<br/>
              <span class="text-gradient">Knowledge Hub</span>
            </h1>
            <p class="hero-subtitle">
              Upload, discover, and collaborate on academic resources. Notes, quizzes, assignments — all organized by your courses and rated by your peers.
            </p>
            <div class="hero-actions">
              <a href="#/browse" class="btn btn-primary btn-lg">🔍 Browse Resources</a>
              <a href="#/auth" class="btn btn-secondary btn-lg">🚀 Get Started Free</a>
            </div>
            <div class="hero-stats">
              <div>
                <div class="hero-stat-value">${resources.length}+</div>
                <div class="hero-stat-label">Resources</div>
              </div>
              <div>
                <div class="hero-stat-value">${users.length}+</div>
                <div class="hero-stat-label">Students</div>
              </div>
              <div>
                <div class="hero-stat-value">${reviews.length}+</div>
                <div class="hero-stat-label">Reviews</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="features-section">
          <div class="container">
            <div class="features-header">
              <h2 class="section-title">Everything You Need to <span class="text-gradient">Excel</span></h2>
              <p class="section-subtitle" style="margin:var(--space-3) auto 0">A complete platform for academic resource sharing and collaboration.</p>
            </div>
            <div class="grid grid-3">
              <div class="card feature-card">
                <div class="feature-icon">📚</div>
                <h3 class="feature-title">Smart Repository</h3>
                <p class="feature-desc">Upload and organize notes, quizzes, and assignments by department, course code, and semester.</p>
              </div>
              <div class="card feature-card">
                <div class="feature-icon">🔍</div>
                <h3 class="feature-title">Advanced Search</h3>
                <p class="feature-desc">Find exactly what you need with powerful keyword search, filters, and community-driven popularity rankings.</p>
              </div>
              <div class="card feature-card">
                <div class="feature-icon">⭐</div>
                <h3 class="feature-title">Quality Ratings</h3>
                <p class="feature-desc">Community-driven ratings and reviews ensure you always get the best study materials.</p>
              </div>
              <div class="card feature-card">
                <div class="feature-icon">🔀</div>
                <h3 class="feature-title">Git Collaboration</h3>
                <p class="feature-desc">Propose corrections via pull requests. Teachers approve changes in a transparent workflow.</p>
              </div>
              <div class="card feature-card">
                <div class="feature-icon">💬</div>
                <h3 class="feature-title">Discussion Forums</h3>
                <p class="feature-desc">Threaded discussions under every resource. Ask questions, get answers, collaborate in real-time.</p>
              </div>
              <div class="card feature-card">
                <div class="feature-icon">📊</div>
                <h3 class="feature-title">Progress Tracker</h3>
                <p class="feature-desc">Mark resources as Read or Understood. Track your learning journey with visual progress indicators.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Top Resources -->
        <section class="features-section" style="padding-top:0">
          <div class="container">
            <div class="features-header">
              <h2 class="section-title">🔥 Trending <span class="text-gradient">Resources</span></h2>
              <p class="section-subtitle" style="margin:var(--space-3) auto 0">Top-rated materials from the community.</p>
            </div>
            <div class="resource-grid" id="landing-top-resources"></div>
            <div style="text-align:center;margin-top:var(--space-10)">
              <a href="#/browse" class="btn btn-secondary btn-lg">View All Resources →</a>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section style="padding:var(--space-20) var(--space-6);text-align:center">
          <div class="container">
            <div class="card" style="max-width:700px;margin:0 auto;padding:var(--space-12);background:var(--gradient-card);border-color:var(--border-hover)">
              <h2 style="font-size:var(--fs-3xl);font-weight:var(--fw-extrabold);margin-bottom:var(--space-4)">Ready to <span class="text-gradient">Contribute?</span></h2>
              <p style="color:var(--text-secondary);margin-bottom:var(--space-8);max-width:460px;margin-left:auto;margin-right:auto">Join the community, share your knowledge, and help fellow students succeed.</p>
              <a href="#/auth" class="btn btn-primary btn-lg">Create Free Account</a>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="site-footer">
          <div class="container">
            <div class="footer-logo">
              <span style="font-size:1.4rem">📚</span>
              <span style="font-weight:var(--fw-extrabold);font-size:var(--fs-lg)">Academic<span class="text-gradient">Hub</span></span>
            </div>
            <p class="footer-text">Built with ❤️ for students everywhere. Share knowledge, grow together.</p>
            <div class="footer-links">
              <a href="#/browse" class="footer-link">Browse</a>
              <a href="#/upload" class="footer-link">Upload</a>
              <a href="#/collaborate" class="footer-link">Collaborate</a>
              <a href="#/dashboard" class="footer-link">Dashboard</a>
            </div>
          </div>
        </footer>
      </div>
    `;

        // Render top resource cards
        const grid = document.getElementById('landing-top-resources');
        topResources.forEach(r => grid.appendChild(ResourceCard.create(r)));
    }

    return { render };
})();
