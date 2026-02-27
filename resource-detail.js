/* ===== resource-detail.js – Resource Detail Page ===== */

const ResourceDetailPage = (() => {
    function render(resourceId) {
        const app = document.getElementById('app');
        const resource = Store.getResourceById(resourceId);

        if (!resource) {
            app.innerHTML = `<div class="resource-detail page-enter"><div class="empty-state"><div class="empty-state-icon">🔍</div><p class="empty-state-title">Resource not found</p><p class="empty-state-text">This resource may have been removed.</p><a href="#/browse" class="btn btn-primary">Browse Resources</a></div></div>`;
            return;
        }

        const reviews = Store.getReviewsForResource(resourceId);
        const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        const user = Store.getCurrentUser();
        const userProgress = user ? (Store.getProgressForUser(user.id).find(p => p.resourceId === resourceId) || {}) : {};

        const typeColors = { notes: 'badge-primary', quiz: 'badge-warning', assignment: 'badge-secondary' };

        app.innerHTML = `
      <div class="resource-detail page-enter">
        <div class="resource-detail-header">
          <button class="resource-detail-back" onclick="window.location.hash='#/browse'">← Back to Browse</button>
          <h1 class="resource-detail-title">${Helpers.escapeHtml(resource.title)}</h1>
          <div class="resource-detail-meta">
            <span class="resource-detail-meta-item">
              <div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(resource.authorName)}">${Helpers.getInitials(resource.authorName)}</div>
              ${Helpers.escapeHtml(resource.authorName)}
            </span>
            <span class="resource-detail-meta-item">📅 ${Helpers.formatDate(resource.createdAt)}</span>
            <span class="resource-detail-meta-item">⬇ ${resource.downloads || 0} downloads</span>
            <span class="resource-detail-meta-item">${StarRating.displayHtml(avgRating, reviews.length)}</span>
          </div>
          <div class="resource-detail-tags">
            <span class="badge ${typeColors[resource.type] || 'badge-primary'}">${resource.type}</span>
            <span class="badge badge-secondary">${Helpers.escapeHtml(resource.department)}</span>
            <span class="badge badge-secondary">${Helpers.escapeHtml(resource.courseCode)}</span>
            ${resource.semester ? `<span class="badge badge-warning">${Helpers.escapeHtml(resource.semester)} Sem</span>` : ''}
            ${resource.subject ? `<span class="badge badge-primary">${Helpers.escapeHtml(resource.subject)}</span>` : ''}
            ${(resource.tags || []).map(t => `<span class="chip">${Helpers.escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="resource-detail-actions">
            <button class="btn btn-primary" id="download-btn">⬇ Download</button>
            ${user ? `
              <div style="display:flex;gap:var(--space-2);align-items:center">
                <button class="progress-status-btn ${userProgress.status === 'read' ? 'active-read' : ''}" id="mark-read">📖 Read</button>
                <button class="progress-status-btn ${userProgress.status === 'understood' ? 'active-understood' : ''}" id="mark-understood">✅ Understood</button>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Hierarchical Info -->
        ${resource.subject || resource.module ? `
          <div class="card" style="margin-bottom:var(--space-8);padding:var(--space-5)">
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-3);align-items:center;font-size:var(--fs-sm)">
              <span style="color:var(--text-muted)">📂</span>
              <span style="color:var(--text-accent)">${Helpers.escapeHtml(resource.courseCode)}</span>
              ${resource.semester ? `<span style="color:var(--text-muted)">→</span><span>${Helpers.escapeHtml(resource.semester)} Semester</span>` : ''}
              ${resource.subject ? `<span style="color:var(--text-muted)">→</span><span>${Helpers.escapeHtml(resource.subject)}</span>` : ''}
              ${resource.module ? `<span style="color:var(--text-muted)">→</span><span style="color:var(--accent-secondary)">${Helpers.escapeHtml(resource.module)}</span>` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Description -->
        <div class="resource-detail-section">
          <h3 class="resource-detail-section-title">📋 Description</h3>
          <p style="color:var(--text-secondary);line-height:1.8;font-size:var(--fs-base)">${Helpers.escapeHtml(resource.description)}</p>
        </div>

        <!-- Content Preview -->
        ${resource.content ? `
          <div class="resource-detail-section">
            <h3 class="resource-detail-section-title">📄 Content Preview</h3>
            ${MarkdownViewer.render(resource.content)}
          </div>
        ` : ''}

        <!-- Ratings & Reviews -->
        <div class="resource-detail-section">
          <h3 class="resource-detail-section-title">⭐ Ratings & Reviews (${reviews.length})</h3>

          ${user ? `
            <div class="card" style="margin-bottom:var(--space-6)">
              <h4 style="font-size:var(--fs-base);margin-bottom:var(--space-3)">Leave a Review</h4>
              <div id="review-stars-container" style="margin-bottom:var(--space-3)"></div>
              <textarea class="form-textarea" id="review-text" placeholder="Share your thoughts about this resource..." rows="3"></textarea>
              <button class="btn btn-primary btn-sm" id="submit-review" style="margin-top:var(--space-3)">Submit Review</button>
            </div>
          ` : '<p style="font-size:var(--fs-sm);color:var(--text-muted);margin-bottom:var(--space-6)"><a href="#/auth">Log in</a> to leave a review.</p>'}

          ${reviews.length === 0 ? '<p style="color:var(--text-muted);font-size:var(--fs-sm)">No reviews yet. Be the first!</p>' : ''}

          <div id="reviews-list">
            ${reviews.map(r => `
              <div class="comment">
                <div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(r.userName)}">${Helpers.getInitials(r.userName)}</div>
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-author">${Helpers.escapeHtml(r.userName)}</span>
                    <span class="comment-time">${Helpers.formatDate(r.createdAt)}</span>
                  </div>
                  <div style="margin-bottom:var(--space-2)">${StarRating.displayHtml(r.rating, 0).replace(/\(0\)/, '')}</div>
                  <div class="comment-text">${Helpers.escapeHtml(r.text)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Discussion -->
        ${CommentThread.render(resourceId)}
      </div>
    `;

        bindEvents(resourceId, resource);
    }

    function bindEvents(resourceId, resource) {
        const user = Store.getCurrentUser();

        // Download
        document.getElementById('download-btn').addEventListener('click', () => {
            if (user) {
                Store.addDownload(user.id, resourceId);
            }
            // Simulate download
            if (resource.content) {
                const blob = new Blob([resource.content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
                a.click();
                URL.revokeObjectURL(url);
            }
            Helpers.showToast('Download started!', 'success');
        });

        // Progress buttons
        const markRead = document.getElementById('mark-read');
        const markUnderstood = document.getElementById('mark-understood');
        if (markRead && user) {
            markRead.addEventListener('click', () => {
                Store.setProgress(user.id, resourceId, 'read');
                markRead.classList.add('active-read');
                markUnderstood.classList.remove('active-understood');
                Helpers.showToast('Marked as Read 📖', 'info');
            });
        }
        if (markUnderstood && user) {
            markUnderstood.addEventListener('click', () => {
                Store.setProgress(user.id, resourceId, 'understood');
                markUnderstood.classList.add('active-understood');
                markRead.classList.remove('active-read');
                Helpers.showToast('Marked as Understood ✅', 'success');
            });
        }

        // Review
        let selectedRating = 0;
        const starsContainer = document.getElementById('review-stars-container');
        if (starsContainer && user) {
            const stars = StarRating.create({
                value: 0,
                onChange: (val) => { selectedRating = val; }
            });
            starsContainer.appendChild(stars);

            document.getElementById('submit-review').addEventListener('click', () => {
                const text = document.getElementById('review-text').value.trim();
                if (!selectedRating) { Helpers.showToast('Please select a rating', 'error'); return; }
                if (!text) { Helpers.showToast('Please write a review', 'error'); return; }

                Store.addReview({
                    id: Helpers.generateId(),
                    resourceId,
                    userId: user.id,
                    userName: user.name,
                    rating: selectedRating,
                    text,
                    createdAt: new Date().toISOString()
                });

                Helpers.showToast('Review submitted! ⭐', 'success');
                render(resourceId);
            });
        }

        // Discussion events
        CommentThread.bindEvents(resourceId);
    }

    return { render };
})();
