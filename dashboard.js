/* ===== dashboard.js – User Dashboard ===== */
const DashboardPage = (() => {
    let activeTab = 'uploads';

    function render() {
        const user = Store.getCurrentUser();
        if (!user) { window.location.hash = '#/auth'; return; }
        const app = document.getElementById('app');
        const allRes = Store.getResources();
        const myUploads = allRes.filter(r => r.authorId === user.id);
        const myDl = Store.getDownloadsForUser(user.id);
        const myProgress = Store.getProgressForUser(user.id);
        const myRevs = Store.getReviews().filter(r => myUploads.some(u => u.id === r.resourceId));
        const avgR = myRevs.length ? (myRevs.reduce((s, r) => s + r.rating, 0) / myRevs.length).toFixed(1) : '—';
        const col = Helpers.getAvatarColor(user.name);
        const ini = Helpers.getInitials(user.name);
        const rc = myProgress.filter(p => p.status === 'read').length;
        const uc = myProgress.filter(p => p.status === 'understood').length;
        const pp = allRes.length ? Math.round(((rc + uc) / allRes.length) * 100) : 0;

        app.innerHTML = `<div class="dashboard-page page-enter">
      <div class="card dashboard-profile">
        <div class="avatar avatar-xl" style="background:${col}">${ini}</div>
        <div class="dashboard-profile-info">
          <h1 class="dashboard-profile-name">${Helpers.escapeHtml(user.name)}</h1>
          <p class="dashboard-profile-email">${Helpers.escapeHtml(user.email)}</p>
          ${user.department ? `<p style="font-size:var(--fs-sm);color:var(--text-muted);margin-top:4px">${Helpers.escapeHtml(user.department)} · ${Helpers.escapeHtml(user.university || '')}</p>` : ''}
          ${user.bio ? `<p style="font-size:var(--fs-sm);color:var(--text-secondary);margin-top:8px">${Helpers.escapeHtml(user.bio)}</p>` : ''}
        </div>
      </div>

      <div class="dashboard-stats">
        <div class="card stat-card"><div class="stat-value">${myUploads.length}</div><div class="stat-label">Uploads</div></div>
        <div class="card stat-card"><div class="stat-value">${myDl.length}</div><div class="stat-label">Downloads</div></div>
        <div class="card stat-card"><div class="stat-value">${avgR}</div><div class="stat-label">Avg Rating</div></div>
        <div class="card stat-card"><div class="stat-value">${pp}%</div><div class="stat-label">Progress</div></div>
      </div>

      <div class="card" style="margin-bottom:var(--space-8);padding:var(--space-6)">
        <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:var(--space-4)">📊 Learning Progress</h3>
        <div style="display:flex;gap:var(--space-8);flex-wrap:wrap;margin-bottom:var(--space-4)">
          <span style="font-size:var(--fs-sm);color:var(--text-secondary)">📖 Read: ${rc}</span>
          <span style="font-size:var(--fs-sm);color:var(--text-secondary)">✅ Understood: ${uc}</span>
          <span style="font-size:var(--fs-sm);color:var(--text-muted)">📄 Remaining: ${allRes.length - myProgress.length}</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pp}%"></div></div>
      </div>

      <div class="tabs dashboard-tabs">
        <button class="tab ${activeTab === 'uploads' ? 'active' : ''}" data-tab="uploads">📤 My Uploads</button>
        <button class="tab ${activeTab === 'downloads' ? 'active' : ''}" data-tab="downloads">⬇ Downloads</button>
        <button class="tab ${activeTab === 'tracker' ? 'active' : ''}" data-tab="tracker">📊 Tracker</button>
      </div>
      <div class="dashboard-content" id="dashboard-content"></div>
    </div>`;
        renderTab(user); bindEvents(user);
    }

    function renderTab(user) {
        const c = document.getElementById('dashboard-content');
        if (activeTab === 'uploads') {
            const ups = Store.getResources().filter(r => r.authorId === user.id);
            if (!ups.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p class="empty-state-title">No uploads yet</p><a href="#/upload" class="btn btn-primary" style="margin-top:16px">Upload Resource</a></div>'; return; }
            c.innerHTML = '<div class="resource-grid"></div>';
            ups.forEach(r => c.querySelector('.resource-grid').appendChild(ResourceCard.create(r)));
        } else if (activeTab === 'downloads') {
            const dls = Store.getDownloadsForUser(user.id);
            if (!dls.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⬇</div><p class="empty-state-title">No downloads yet</p><a href="#/browse" class="btn btn-primary" style="margin-top:16px">Browse</a></div>'; return; }
            c.innerHTML = '<div class="resource-grid"></div>';
            dls.map(d => Store.getResourceById(d.resourceId)).filter(Boolean).forEach(r => c.querySelector('.resource-grid').appendChild(ResourceCard.create(r)));
        } else if (activeTab === 'tracker') {
            const allRes = Store.getResources();
            const prog = Store.getProgressForUser(user.id);
            c.innerHTML = '<div style="display:flex;flex-direction:column;gap:12px">' + allRes.map(r => {
                const p = prog.find(x => x.resourceId === r.id);
                const st = p ? p.status : 'unread';
                return `<div class="progress-tracker-card">
          <div class="file-icon ${Helpers.getFileIconClass(r.type)}">${Helpers.getFileIcon(r.type)}</div>
          <div class="progress-tracker-info">
            <div class="progress-tracker-title">${Helpers.escapeHtml(r.title)}</div>
            <div class="progress-tracker-course">${Helpers.escapeHtml(r.courseCode)}</div>
          </div>
          <div class="progress-tracker-status">
            <button class="progress-status-btn ${st === 'read' ? 'active-read' : ''}" data-resource="${r.id}" data-status="read">📖 Read</button>
            <button class="progress-status-btn ${st === 'understood' ? 'active-understood' : ''}" data-resource="${r.id}" data-status="understood">✅ Understood</button>
          </div></div>`;
            }).join('') + '</div>';
            c.querySelectorAll('.progress-status-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const rid = btn.dataset.resource, status = btn.dataset.status;
                    Store.setProgress(user.id, rid, status);
                    const card = btn.closest('.progress-tracker-card');
                    card.querySelectorAll('.progress-status-btn').forEach(b => b.classList.remove('active-read', 'active-understood'));
                    btn.classList.add(status === 'read' ? 'active-read' : 'active-understood');
                    Helpers.showToast(`Marked as ${status}`, 'info');
                });
            });
        }
    }

    function bindEvents(user) {
        document.querySelectorAll('.dashboard-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeTab = tab.dataset.tab;
                document.querySelectorAll('.dashboard-tabs .tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active'); renderTab(user);
            });
        });
    }
    return { render };
})();
