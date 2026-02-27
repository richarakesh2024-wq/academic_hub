/* ===== comment-thread.js – Discussion Forum Component ===== */

const CommentThread = (() => {
    function render(resourceId) {
        const comments = Store.getCommentsForResource(resourceId);
        const user = Store.getCurrentUser();

        // Build tree
        const rootComments = comments.filter(c => !c.parentId);
        const childMap = {};
        comments.forEach(c => {
            if (c.parentId) {
                if (!childMap[c.parentId]) childMap[c.parentId] = [];
                childMap[c.parentId].push(c);
            }
        });

        let html = `
      <div class="resource-detail-section">
        <h3 class="resource-detail-section-title">💬 Discussion (${comments.length})</h3>
    `;

        if (user) {
            html += `
        <div class="comment-compose" style="margin-bottom:var(--space-6)">
          <div style="display:flex;gap:var(--space-3);align-items:flex-start">
            <div class="avatar avatar-sm" style="background:${Helpers.getAvatarColor(user.name)};margin-top:4px">${Helpers.getInitials(user.name)}</div>
            <div style="flex:1">
              <textarea class="form-textarea" id="new-comment-text" placeholder="Ask a question or start a discussion..." rows="3" style="min-height:80px"></textarea>
              <button class="btn btn-primary btn-sm" id="post-comment-btn" style="margin-top:var(--space-2)">Post Comment</button>
            </div>
          </div>
        </div>
      `;
        } else {
            html += `<p style="color:var(--text-muted);font-size:var(--fs-sm);margin-bottom:var(--space-6)"><a href="#/auth">Log in</a> to join the discussion</p>`;
        }

        if (rootComments.length === 0) {
            html += `<div class="empty-state" style="padding:var(--space-8)"><div class="empty-state-icon">💭</div><p class="empty-state-title">No comments yet</p><p class="empty-state-text">Be the first to start a discussion!</p></div>`;
        } else {
            rootComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            rootComments.forEach(c => {
                html += renderComment(c, childMap, 0, user, resourceId);
            });
        }

        html += '</div>';
        return html;
    }

    function renderComment(comment, childMap, depth, currentUser, resourceId) {
        const color = Helpers.getAvatarColor(comment.userName);
        const initials = Helpers.getInitials(comment.userName);
        const children = childMap[comment.id] || [];

        let html = `
      <div class="comment" data-comment-id="${comment.id}" style="${depth > 0 ? 'margin-left:' + (depth * 24) + 'px;border-left:2px solid var(--border-glass);padding-left:var(--space-4);' : ''}">
        <div class="avatar avatar-sm" style="background:${color};flex-shrink:0">${initials}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-author">${Helpers.escapeHtml(comment.userName)}</span>
            <span class="comment-time">${Helpers.formatDate(comment.createdAt)}</span>
          </div>
          <div class="comment-text">${Helpers.escapeHtml(comment.text)}</div>
          <div class="comment-actions">
            <button class="comment-action like-btn" data-id="${comment.id}">❤ ${comment.likes || 0}</button>
            ${currentUser && depth < 2 ? `<button class="comment-action reply-btn" data-id="${comment.id}" data-resource="${resourceId}">↩ Reply</button>` : ''}
          </div>
          <div class="reply-form-container" id="reply-form-${comment.id}"></div>
        </div>
      </div>
    `;

        children.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        children.forEach(child => {
            html += renderComment(child, childMap, depth + 1, currentUser, resourceId);
        });

        return html;
    }

    function bindEvents(resourceId) {
        const user = Store.getCurrentUser();

        // Post new comment
        const postBtn = document.getElementById('post-comment-btn');
        if (postBtn) {
            postBtn.addEventListener('click', () => {
                const textarea = document.getElementById('new-comment-text');
                const text = textarea.value.trim();
                if (!text) { Helpers.showToast('Please write a comment', 'error'); return; }
                if (!user) { Helpers.showToast('Please log in first', 'error'); return; }

                Store.addComment({
                    id: Helpers.generateId(),
                    resourceId,
                    userId: user.id,
                    userName: user.name,
                    text,
                    parentId: null,
                    likes: 0,
                    createdAt: new Date().toISOString()
                });

                Helpers.showToast('Comment posted!', 'success');
                // Re-render detail page
                if (typeof ResourceDetailPage !== 'undefined') {
                    ResourceDetailPage.render(resourceId);
                }
            });
        }

        // Reply buttons
        document.querySelectorAll('.reply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const parentId = btn.getAttribute('data-id');
                const container = document.getElementById(`reply-form-${parentId}`);
                if (container.innerHTML) { container.innerHTML = ''; return; }

                container.innerHTML = `
          <div style="display:flex;gap:var(--space-3);margin-top:var(--space-3)">
            <textarea class="form-textarea reply-textarea" placeholder="Write a reply..." rows="2" style="min-height:60px;font-size:var(--fs-sm)"></textarea>
            <button class="btn btn-primary btn-sm reply-submit" data-parent="${parentId}">Reply</button>
          </div>
        `;

                container.querySelector('.reply-submit').addEventListener('click', () => {
                    const text = container.querySelector('.reply-textarea').value.trim();
                    if (!text) return;

                    Store.addComment({
                        id: Helpers.generateId(),
                        resourceId,
                        userId: user.id,
                        userName: user.name,
                        text,
                        parentId,
                        likes: 0,
                        createdAt: new Date().toISOString()
                    });

                    Helpers.showToast('Reply posted!', 'success');
                    if (typeof ResourceDetailPage !== 'undefined') {
                        ResourceDetailPage.render(resourceId);
                    }
                });
            });
        });

        // Like buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const comments = Store.getComments();
                const comment = comments.find(c => c.id === id);
                if (comment) {
                    comment.likes = (comment.likes || 0) + 1;
                    localStorage.setItem('ah_comments', JSON.stringify(comments));
                    btn.textContent = `❤ ${comment.likes}`;
                }
            });
        });
    }

    return { render, bindEvents };
})();
