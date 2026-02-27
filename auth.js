/* ===== auth.js – Authentication Page ===== */

const AuthPage = (() => {
    let mode = 'login'; // 'login' | 'signup'

    function render() {
        const user = Store.getCurrentUser();
        if (user) { window.location.hash = '#/dashboard'; return; }

        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="auth-page page-enter">
        <div class="card auth-card">
          <div style="text-align:center;margin-bottom:var(--space-4)">
            <span style="font-size:2.5rem">📚</span>
          </div>
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to access your academic resources</p>

          <div class="tabs auth-tabs">
            <button class="tab ${mode === 'login' ? 'active' : ''}" id="tab-login">Log In</button>
            <button class="tab ${mode === 'signup' ? 'active' : ''}" id="tab-signup">Sign Up</button>
          </div>

          <form class="auth-form" id="auth-form">
            <div class="signup-fields" style="display:${mode === 'signup' ? 'flex' : 'none'};flex-direction:column;gap:var(--space-5)">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="auth-name" placeholder="Your full name" autocomplete="name" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">University</label>
                  <input type="text" class="form-input" id="auth-university" placeholder="e.g. IIT University" />
                </div>
                <div class="form-group">
                  <label class="form-label">Department</label>
                  <select class="form-select" id="auth-department">
                    <option value="">Select dept.</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Academic Email</label>
              <input type="email" class="form-input" id="auth-email" placeholder="you@university.edu" autocomplete="email" required />
              <span class="form-error hidden" id="email-error"></span>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="auth-password" placeholder="Your password" autocomplete="current-password" required />
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width:100%" id="auth-submit">
              ${mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div class="auth-footer">
            ${mode === 'login'
                ? "Don't have an account? <a href='#' id='switch-to-signup'>Sign up</a>"
                : "Already have an account? <a href='#' id='switch-to-login'>Log in</a>"
            }
          </div>

          <div style="margin-top:var(--space-6);padding:var(--space-4);background:rgba(6,182,212,0.08);border-radius:var(--radius-md);border:1px solid rgba(6,182,212,0.2)">
            <p style="font-size:var(--fs-xs);color:var(--accent-secondary);font-weight:var(--fw-semibold);margin-bottom:var(--space-2)">🔑 Demo Account</p>
            <p style="font-size:var(--fs-xs);color:var(--text-muted)">Email: <strong>ananya@university.edu</strong><br/>Password: <strong>demo123</strong></p>
          </div>
        </div>
      </div>
    `;

        bindEvents();
    }

    function bindEvents() {
        document.getElementById('tab-login').addEventListener('click', () => { mode = 'login'; render(); });
        document.getElementById('tab-signup').addEventListener('click', () => { mode = 'signup'; render(); });

        const switchSignup = document.getElementById('switch-to-signup');
        const switchLogin = document.getElementById('switch-to-login');
        if (switchSignup) switchSignup.addEventListener('click', (e) => { e.preventDefault(); mode = 'signup'; render(); });
        if (switchLogin) switchLogin.addEventListener('click', (e) => { e.preventDefault(); mode = 'login'; render(); });

        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value.trim();
            const password = document.getElementById('auth-password').value;
            const emailError = document.getElementById('email-error');

            if (!email || !password) {
                Helpers.showToast('Please fill in all fields', 'error');
                return;
            }

            if (mode === 'signup') {
                // Validate academic email
                if (!email.match(/@.*\.edu$/i) && !email.includes('@university.')) {
                    emailError.textContent = 'Please use an academic email (e.g., @university.edu)';
                    emailError.classList.remove('hidden');
                    return;
                }
                emailError.classList.add('hidden');

                const name = document.getElementById('auth-name').value.trim();
                const university = document.getElementById('auth-university').value.trim();
                const department = document.getElementById('auth-department').value;

                if (!name) { Helpers.showToast('Please enter your name', 'error'); return; }

                // Check existing
                if (Store.findUser(email)) {
                    Helpers.showToast('Account already exists. Please log in.', 'error');
                    return;
                }

                const newUser = {
                    id: Helpers.generateId(),
                    name, email, password, university, department,
                    bio: '', joinedAt: new Date().toISOString()
                };

                Store.addUser(newUser);
                Store.setCurrentUser(newUser);
                Navbar.updateAuthUI();
                Helpers.showToast(`Welcome, ${name}! 🎉`, 'success');
                window.location.hash = '#/dashboard';
            } else {
                // Login
                const user = Store.findUser(email);
                if (!user || user.password !== password) {
                    Helpers.showToast('Invalid email or password', 'error');
                    return;
                }

                Store.setCurrentUser(user);
                Navbar.updateAuthUI();
                Helpers.showToast(`Welcome back, ${user.name}! 👋`, 'success');
                window.location.hash = '#/dashboard';
            }
        });
    }

    return { render };
})();
