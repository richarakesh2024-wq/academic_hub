/* ===== search-bar.js – Search Bar Component ===== */

const SearchBar = (() => {
    function create({ placeholder = 'Search resources...', onSearch, initialValue = '' } = {}) {
        const wrapper = document.createElement('div');
        wrapper.className = 'search-wrapper';
        wrapper.innerHTML = `
      <span class="search-icon">🔍</span>
      <input type="text" class="search-input" id="search-input"
             placeholder="${placeholder}" value="${Helpers.escapeHtml(initialValue)}"
             autocomplete="off" />
    `;

        const input = wrapper.querySelector('.search-input');
        const debouncedSearch = Helpers.debounce((val) => {
            if (onSearch) onSearch(val);
        }, 300);

        input.addEventListener('input', (e) => debouncedSearch(e.target.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && onSearch) onSearch(input.value);
        });

        return wrapper;
    }

    return { create };
})();
