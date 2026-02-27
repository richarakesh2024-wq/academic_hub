/* ===== collaboration.js – Git-style Collaboration Page ===== */
const CollaborationPage = (() => {
    function render() {
        const user = Store.getCurrentUser();
        const app = document.getElementById('app');
        const prs = Store.getPullRequests();
        const openPrs = prs.filter(p => p.status === 'open');
        const mergedPrs = prs.filter(p => p.status === 'merged');
        const closedPrs = prs.filter(p => p.status === 'closed');

        app.innerHTML = `
      <div class="collab-page page-enter">
        <div class="collab-header">
          <h1 class="section-title">🔀 <span class="text-gradient">Collaboration</span> Hub</h1>
          <p class="section-subtitle">Propose corrections and improvements via pull requests. Teachers can review and approve changes.</p>
          ${user ? `<button class="btn btn-primary" id="new-pr-btn" style="margin-top:var(--space-4)">✚ New Proposal</button>` : `<p style="margin-top:var(--space-4);font-size:var(--fs-sm);color:var(--text-muted)"><a href="#/auth">Log in</a> to create proposals.</p>`}
        </div>

        <div class="tabs" style="margin-bottom:var(--space-6)">
          <button class="tab active" data-filter="open">🟢 Open (${openPrs.length})</button>
          <button class="tab" data-filter="merged">🟣 Merged (${mergedPrs.length})</button>
          <button class="tab" data-filter="closed">🔴 Closed (${closedPrs.length})</button>
        </div>

        <div id="pr-list"></div>
      </div>
    `;

        renderPRList('open', prs);
        bindEvents(user, prs);
    }

    function renderPRList(filter, allPrs) {
        const container = document.getElementById('pr-list');
        const prs = allPrs.filter(p => p.status === filter);

        if (!prs.length) {
            container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">${filter === 'open' ? '📭' : '📂'}</div><p class="empty-state-title">No ${filter} proposals</p></div>`;
            return;
        }

        container.innerHTML = prs.map(pr => {
            const statusBadge = pr.status === 'open' ? '<span class="badge badge-success">Open</span>'
                : pr.status === 'merged' ? '<span class="badge badge-primary">Merged</span>'
                    : '<span class="badge badge-danger">Closed</span>';

            const diffHtml = buildDiff(pr.originalContent || '', pr.proposedContent || '');
            const user = Store.getCurrentUser();
            const isTeacher = user && user.role === 'teacher';

            return `
        <div class="card pr-card">
          <div class="pr-card-header">
            <div>
              <div class="pr-card-title">${Helpers.escapeHtml(pr.title)}</div>
              <div class="pr-card-meta">
                ${statusBadge}
                <span style="margin-left:8px">by <strong>${Helpers.escapeHtml(pr.authorName)}</strong></span>
                <span> · ${Helpers.formatDate(pr.createdAt)}</span>
                ${pr.mergedAt ? `<span> · Merged ${Helpers.formatDate(pr.mergedAt)}</span>` : ''}
              </div>
            </div>
          </div>
          <p class="pr-card-desc">${Helpers.escapeHtml(pr.description)}</p>
          <p style="font-size:var(--fs-xs);color:var(--text-muted);margin-bottom:var(--space-3)">📄 ${Helpers.escapeHtml(pr.resourceTitle || '')}</p>
          <details style="margin-bottom:var(--space-4)">
            <summary style="cursor:pointer;font-size:var(--fs-sm);color:var(--text-accent);font-weight:600;padding:var(--space-2) 0">View Diff</summary>
            <div class="diff-view" style="margin-top:var(--space-3)">${diffHtml}</div>
          </details>
          ${pr.status === 'open' && isTeacher ? `
            <div class="pr-card-actions">
              <button class="btn btn-success btn-sm pr-action-btn" data-id="${pr.id}" data-action="merge">✅ Approve & Merge</button>
              <button class="btn btn-danger btn-sm pr-action-btn" data-id="${pr.id}" data-action="close">❌ Close</button>
            </div>
          ` : ''}
          ${pr.status === 'open' && !isTeacher ? `
            <p style="font-size:var(--fs-xs);color:var(--text-muted)">⏳ Waiting for teacher review</p>
          ` : ''}
        </div>
      `;
        }).join('');
    }

    function buildDiff(original, proposed) {
        const origLines = original.split('\n');
        const propLines = proposed.split('\n');
        let html = '';
        const maxLen = Math.max(origLines.length, propLines.length);
        let i = 0, j = 0;

        // Simple line-by-line diff
        while (i < origLines.length || j < propLines.length) {
            const oLine = i < origLines.length ? origLines[i] : null;
            const pLine = j < propLines.length ? propLines[j] : null;

            if (oLine === pLine) {
                html += `<div class="diff-line context"><span class="diff-line-num">${j + 1}</span> ${Helpers.escapeHtml(oLine || '')}</div>`;
                i++; j++;
            } else if (oLine !== null && !propLines.includes(oLine)) {
                html += `<div class="diff-line removed"><span class="diff-line-num">-</span>- ${Helpers.escapeHtml(oLine)}</div>`;
                i++;
            } else if (pLine !== null && !origLines.includes(pLine)) {
                html += `<div class="diff-line added"><span class="diff-line-num">+</span>+ ${Helpers.escapeHtml(pLine)}</div>`;
                j++;
            } else {
                html += `<div class="diff-line context"><span class="diff-line-num">${j + 1}</span> ${Helpers.escapeHtml(pLine || oLine || '')}</div>`;
                i++; j++;
            }
        }
        return html;
    }

    function bindEvents(user, prs) {
        // Tab filters
        document.querySelectorAll('.collab-page .tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.collab-page .tabs .tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderPRList(tab.dataset.filter, prs);
                bindPRActions(prs);
            });
        });

        bindPRActions(prs);

        // New PR button
        const newBtn = document.getElementById('new-pr-btn');
        if (newBtn) {
            newBtn.addEventListener('click', () => {
                const resources = Store.getResources();
                Modal.open(`
          <h3 style="margin-bottom:var(--space-6)">📝 New Change Proposal</h3>
          <form id="pr-form" style="display:flex;flex-direction:column;gap:var(--space-5)">
            <div class="form-group">
              <label class="form-label">Target Resource *</label>
              <select class="form-select" id="pr-resource" required>
                <option value="">Select resource</option>
                ${resources.map(r => `<option value="${r.id}">${Helpers.escapeHtml(r.title)}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input class="form-input" id="pr-title" placeholder="e.g. Fix typo in section 3" required />
            </div>
            <div class="form-group">
              <label class="form-label">Description *</label>
              <textarea class="form-textarea" id="pr-desc" placeholder="Describe what you're proposing to change and why..." rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Proposed Changes (Markdown)</label>
              <textarea class="form-textarea" id="pr-proposed" placeholder="Paste your proposed content..." rows="6" style="font-family:monospace;font-size:var(--fs-sm)"></textarea>
            </div>
            <div style="display:flex;gap:var(--space-3);justify-content:flex-end">
              <button type="button" class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Proposal</button>
            </div>
          </form>
        `);

                document.getElementById('pr-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const resId = document.getElementById('pr-resource').value;
                    const title = document.getElementById('pr-title').value.trim();
                    const desc = document.getElementById('pr-desc').value.trim();
                    const proposed = document.getElementById('pr-proposed').value;
                    if (!resId || !title || !desc) { Helpers.showToast('Fill required fields', 'error'); return; }
                    const res = Store.getResourceById(resId);
                    Store.addPullRequest({
                        id: Helpers.generateId(), resourceId: resId,
                        resourceTitle: res ? res.title : '', authorId: user.id,
                        authorName: user.name, title, description: desc,
                        status: 'open', originalContent: res ? (res.content || '').slice(0, 500) : '',
                        proposedContent: proposed || '', createdAt: new Date().toISOString()
                    });
                    Modal.close();
                    Helpers.showToast('Proposal submitted! 🎉', 'success');
                    render();
                });
            });
        }
    }

    function bindPRActions(prs) {
        document.querySelectorAll('.pr-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const action = btn.dataset.action;
                if (action === 'merge') {
                    Store.updatePullRequest(id, { status: 'merged', mergedAt: new Date().toISOString() });
                    Helpers.showToast('Proposal merged! ✅', 'success');
                } else {
                    Store.updatePullRequest(id, { status: 'closed' });
                    Helpers.showToast('Proposal closed', 'info');
                }
                render();
            });
        });
    }

    return { render };
})();
