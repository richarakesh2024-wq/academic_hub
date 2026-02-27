/* ===== markdown-viewer.js – Markdown Viewer Component ===== */

const MarkdownViewer = (() => {
    function render(markdownText) {
        if (!markdownText) return '<p class="text-muted">No content available</p>';
        return `<div class="md-preview">${Helpers.renderMarkdown(markdownText)}</div>`;
    }

    function createEditor({ initialValue = '', onChange } = {}) {
        const container = document.createElement('div');
        container.className = 'md-editor-container';

        container.innerHTML = `
      <div>
        <div class="md-editor-label">✏️ Markdown Editor</div>
        <textarea class="form-textarea md-editor-textarea" id="md-editor-input"
                  placeholder="Write your notes in Markdown..." rows="12"
                  style="min-height:280px;font-family:'Cascadia Code','Fira Code','Consolas',monospace;font-size:var(--fs-sm)">${Helpers.escapeHtml(initialValue)}</textarea>
      </div>
      <div>
        <div class="md-editor-label">👁️ Preview</div>
        <div class="md-preview md-editor-preview" id="md-editor-preview"
             style="min-height:280px;max-height:400px;overflow-y:auto">
          ${initialValue ? Helpers.renderMarkdown(initialValue) : '<p style="color:var(--text-muted)">Preview will appear here...</p>'}
        </div>
      </div>
    `;

        // Defer event binding
        setTimeout(() => {
            const textarea = container.querySelector('.md-editor-textarea');
            const preview = container.querySelector('.md-editor-preview');
            if (textarea && preview) {
                textarea.addEventListener('input', Helpers.debounce((e) => {
                    const val = e.target.value;
                    preview.innerHTML = val ? Helpers.renderMarkdown(val) : '<p style="color:var(--text-muted)">Preview will appear here...</p>';
                    if (onChange) onChange(val);
                }, 200));
            }
        }, 50);

        return container;
    }

    return { render, createEditor };
})();
