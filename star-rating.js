/* ===== star-rating.js – Star Rating Component ===== */

const StarRating = (() => {
    /**
     * Create an interactive star rating.
     * @param {object} opts
     * @param {number} opts.value - Current rating (0-5)
     * @param {boolean} opts.readonly - If true, no interaction
     * @param {function} opts.onChange - Callback(newValue)
     * @param {string} opts.size - 'sm' or default
     * @returns {HTMLElement}
     */
    function create({ value = 0, readonly = false, onChange = null, size = '' } = {}) {
        const wrapper = document.createElement('div');
        wrapper.className = 'star-rating' + (size ? ` star-rating-${size}` : '');

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('button');
            star.type = 'button';
            star.className = 'star' + (i <= value ? ' filled' : '');
            star.textContent = i <= value ? '★' : '☆';
            star.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);

            if (!readonly) {
                star.addEventListener('mouseenter', () => {
                    wrapper.querySelectorAll('.star').forEach((s, idx) => {
                        s.textContent = idx < i ? '★' : '☆';
                        s.classList.toggle('filled', idx < i);
                    });
                });

                star.addEventListener('click', () => {
                    value = i;
                    if (onChange) onChange(i);
                    wrapper.querySelectorAll('.star').forEach((s, idx) => {
                        s.textContent = idx < i ? '★' : '☆';
                        s.classList.toggle('filled', idx < i);
                    });
                });
            } else {
                star.style.cursor = 'default';
            }

            wrapper.appendChild(star);
        }

        if (!readonly) {
            wrapper.addEventListener('mouseleave', () => {
                wrapper.querySelectorAll('.star').forEach((s, idx) => {
                    s.textContent = idx < value ? '★' : '☆';
                    s.classList.toggle('filled', idx < value);
                });
            });
        }

        return wrapper;
    }

    /**
     * Create a display-only star rating with text.
     * @param {number} rating
     * @param {number} count
     * @returns {string} HTML string
     */
    function displayHtml(rating, count) {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) stars += '★';
            else if (i === fullStars && halfStar) stars += '★';
            else stars += '☆';
        }
        return `<span class="star-rating-display"><span class="stars">${stars}</span> ${rating.toFixed(1)} (${count})</span>`;
    }

    return { create, displayHtml };
})();
