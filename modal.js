/* ===== modal.js – Modal Component ===== */

const Modal = (() => {
    function open(contentHtml) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        content.innerHTML = contentHtml;
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function init() {
        const overlay = document.getElementById('modal-overlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    return { open, close, init };
})();
