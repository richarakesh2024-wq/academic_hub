/* ===== browse.js – Browse & Search Page ===== */

const BrowsePage = (() => {
    let filters = { keyword: '', department: '', courseCode: '', type: '', sortBy: 'newest' };

    function render() {
        const app = document.getElementById('app');
        const departments = [...new Set(Store.getResources().map(r => r.department).filter(Boolean))];
        const courseCodes = [...new Set(Store.getResources().map(r => r.courseCode).filter(Boolean))];

        app.innerHTML = `
      <div class="browse-page page-enter">
        <div class="browse-header">
          <h1 class="section-title">Browse <span class="text-gradient">Resources</span></h1>
          <p class="section-subtitle">Discover study materials from your peers across all departments and courses.</p>
          <div id="search-bar-container" style="margin-top:var(--space-6);max-width:600px"></div>
          <div class="browse-filters">
            <select class="form-select" id="filter-department" style="width:auto;min-width:170px">
              <option value="">All Departments</option>
              ${departments.map(d => `<option value="${d}" ${filters.department === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
            <select class="form-select" id="filter-course" style="width:auto;min-width:140px">
              <option value="">All Courses</option>
              ${courseCodes.map(c => `<option value="${c}" ${filters.courseCode === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
            <select class="form-select" id="filter-type" style="width:auto;min-width:130px">
              <option value="">All Types</option>
              <option value="notes" ${filters.type === 'notes' ? 'selected' : ''}>📝 Notes</option>
              <option value="quiz" ${filters.type === 'quiz' ? 'selected' : ''}>❓ Quizzes</option>
              <option value="assignment" ${filters.type === 'assignment' ? 'selected' : ''}>📋 Assignments</option>
            </select>
          </div>
        </div>

        <div class="browse-results-info">
          <span class="browse-results-count" id="results-count"></span>
          <div class="browse-sort">
            <span style="font-size:var(--fs-sm);color:var(--text-muted)">Sort:</span>
            <select class="form-select" id="sort-select" style="width:auto;min-width:150px">
              <option value="newest" ${filters.sortBy === 'newest' ? 'selected' : ''}>🕐 Newest</option>
              <option value="rating" ${filters.sortBy === 'rating' ? 'selected' : ''}>⭐ Highest Rated</option>
              <option value="downloads" ${filters.sortBy === 'downloads' ? 'selected' : ''}>⬇ Most Downloads</option>
            </select>
          </div>
        </div>

        <div class="resource-grid" id="browse-results"></div>
      </div>
    `;

        // Search bar
        const searchContainer = document.getElementById('search-bar-container');
        searchContainer.appendChild(SearchBar.create({
            placeholder: 'Search by title, keyword, course...',
            initialValue: filters.keyword,
            onSearch: (val) => { filters.keyword = val; renderResults(); }
        }));

        // Filter events
        document.getElementById('filter-department').addEventListener('change', (e) => { filters.department = e.target.value; renderResults(); });
        document.getElementById('filter-course').addEventListener('change', (e) => { filters.courseCode = e.target.value; renderResults(); });
        document.getElementById('filter-type').addEventListener('change', (e) => { filters.type = e.target.value; renderResults(); });
        document.getElementById('sort-select').addEventListener('change', (e) => { filters.sortBy = e.target.value; renderResults(); });

        renderResults();
    }

    function renderResults() {
        const grid = document.getElementById('browse-results');
        const countEl = document.getElementById('results-count');
        const results = Store.searchResources(filters);

        countEl.textContent = `${results.length} resource${results.length !== 1 ? 's' : ''} found`;
        grid.innerHTML = '';

        if (results.length === 0) {
            grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">📭</div>
          <p class="empty-state-title">No resources found</p>
          <p class="empty-state-text">Try adjusting your filters or search terms.</p>
        </div>
      `;
            return;
        }

        results.forEach(r => grid.appendChild(ResourceCard.create(r)));
    }

    return { render };
})();
