/* ===== resource-card.js – Resource Card Component ===== */

const ResourceCard = (() => {
    function create(resource) {
        const reviews = Store.getReviewsForResource(resource.id);
        const avgRating = reviews.length
            ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
            : 0;
        const icon = Helpers.getFileIcon(resource.type);
        const iconClass = Helpers.getFileIconClass(resource.type);

        const card = document.createElement('article');
        card.className = 'card resource-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View ${resource.title}`);

        const tagsHtml = (resource.tags || []).slice(0, 3).map(t =>
            `<span class="badge badge-primary">${Helpers.escapeHtml(t)}</span>`
        ).join('');

        const typeColors = {
            notes: 'badge-primary',
            quiz: 'badge-warning',
            assignment: 'badge-secondary'
        };

        card.innerHTML = `
      <div class="resource-card-top">
        <div class="file-icon ${iconClass}">${icon}</div>
        <div class="resource-card-info">
          <div class="resource-card-title">${Helpers.escapeHtml(resource.title)}</div>
          <div class="resource-card-meta">
            <span class="badge ${typeColors[resource.type] || 'badge-primary'}">${resource.type}</span>
            <span>·</span>
            <span>${Helpers.escapeHtml(resource.courseCode)}</span>
          </div>
        </div>
      </div>
      <p class="resource-card-desc">${Helpers.escapeHtml(resource.description)}</p>
      <div class="resource-card-tags">${tagsHtml}</div>
      <div class="resource-card-footer">
        <div class="resource-card-stats">
          <span class="resource-card-stat">⬇ ${resource.downloads || 0}</span>
          <span class="resource-card-stat">💬 ${Store.getCommentsForResource(resource.id).length}</span>
        </div>
        ${StarRating.displayHtml(avgRating, reviews.length)}
      </div>
    `;

        card.addEventListener('click', () => {
            window.location.hash = `#/resource/${resource.id}`;
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.location.hash = `#/resource/${resource.id}`;
        });

        return card;
    }

    return { create };
})();
