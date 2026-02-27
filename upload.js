/* ===== upload.js – Upload Resource Page ===== */

const UploadPage = (() => {
    let uploadedFile = null;
    let markdownContent = '';

    function render() {
        const user = Store.getCurrentUser();
        if (!user) { window.location.hash = '#/auth'; return; }

        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="upload-page page-enter">
        <div class="upload-header">
          <h1 class="section-title">📤 Upload <span class="text-gradient">Resource</span></h1>
          <p class="section-subtitle">Share your notes, quizzes, or assignments with the community.</p>
        </div>

        <form class="upload-form card" id="upload-form" style="padding:var(--space-8)">
          <!-- File Upload -->
          <div class="form-group">
            <label class="form-label">File Upload</label>
            <div class="upload-dropzone" id="upload-dropzone">
              <div class="upload-dropzone-icon">📂</div>
              <p class="upload-dropzone-text">Drag & drop your file here, or click to browse</p>
              <p class="upload-dropzone-hint">Supports PDF, DOCX, MD, images (max 10MB)</p>
            </div>
            <input type="file" id="file-input" accept=".pdf,.docx,.md,.txt,.png,.jpg,.jpeg" style="display:none" />
            <div class="upload-file-preview hidden" id="file-preview">
              <span id="file-preview-icon">📄</span>
              <span class="upload-file-name" id="file-preview-name"></span>
              <span class="upload-file-size" id="file-preview-size"></span>
              <button type="button" class="btn btn-ghost btn-sm" id="file-remove">✕</button>
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" id="upload-title" placeholder="e.g. Data Structures — Complete Notes" required />
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" id="upload-description" placeholder="Briefly describe what this resource covers..." rows="3" required></textarea>
          </div>

          <!-- Category -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Department *</label>
              <select class="form-select" id="upload-department" required>
                <option value="">Select department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Course Code *</label>
              <input type="text" class="form-input" id="upload-course" placeholder="e.g. CS201" required />
            </div>
            <div class="form-group">
              <label class="form-label">Type *</label>
              <select class="form-select" id="upload-type" required>
                <option value="">Select type</option>
                <option value="notes">📝 Notes</option>
                <option value="quiz">❓ Quiz</option>
                <option value="assignment">📋 Assignment</option>
              </select>
            </div>
          </div>

          <!-- Hierarchy -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Semester</label>
              <select class="form-select" id="upload-semester">
                <option value="">Select semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="3rd">3rd Semester</option>
                <option value="4th">4th Semester</option>
                <option value="5th">5th Semester</option>
                <option value="6th">6th Semester</option>
                <option value="7th">7th Semester</option>
                <option value="8th">8th Semester</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Subject</label>
              <input type="text" class="form-input" id="upload-subject" placeholder="e.g. Data Structures" />
            </div>
            <div class="form-group">
              <label class="form-label">Module / Topic</label>
              <input type="text" class="form-input" id="upload-module" placeholder="e.g. Trees & Graphs" />
            </div>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label class="form-label">Tags (comma separated)</label>
            <input type="text" class="form-input" id="upload-tags" placeholder="e.g. algorithms, sorting, dynamic programming" />
          </div>

          <!-- Markdown Editor -->
          <div class="form-group">
            <label class="form-label">Markdown Content (optional)</label>
            <p style="font-size:var(--fs-xs);color:var(--text-muted);margin-bottom:var(--space-3)">Write or paste your notes in Markdown format. This will be the viewable content of your resource.</p>
            <div id="md-editor-container"></div>
          </div>

          <hr class="divider" />

          <div style="display:flex;gap:var(--space-3);justify-content:flex-end">
            <a href="#/browse" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary btn-lg">🚀 Publish Resource</button>
          </div>
        </form>
      </div>
    `;

        // Markdown editor
        const editorContainer = document.getElementById('md-editor-container');
        editorContainer.appendChild(MarkdownViewer.createEditor({
            onChange: (val) => { markdownContent = val; }
        }));

        bindEvents();
    }

    function bindEvents() {
        const dropzone = document.getElementById('upload-dropzone');
        const fileInput = document.getElementById('file-input');
        const filePreview = document.getElementById('file-preview');

        // Dropzone click
        dropzone.addEventListener('click', () => fileInput.click());

        // Drag & drop
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        });

        // File input
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleFile(e.target.files[0]);
        });

        // Remove file
        document.getElementById('file-remove').addEventListener('click', () => {
            uploadedFile = null;
            filePreview.classList.add('hidden');
            dropzone.classList.remove('hidden');
        });

        // Form submit
        document.getElementById('upload-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const user = Store.getCurrentUser();
            const title = document.getElementById('upload-title').value.trim();
            const description = document.getElementById('upload-description').value.trim();
            const department = document.getElementById('upload-department').value;
            const courseCode = document.getElementById('upload-course').value.trim();
            const type = document.getElementById('upload-type').value;
            const semester = document.getElementById('upload-semester').value;
            const subject = document.getElementById('upload-subject').value.trim();
            const module = document.getElementById('upload-module').value.trim();
            const tagsStr = document.getElementById('upload-tags').value.trim();
            const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

            if (!title || !description || !department || !courseCode || !type) {
                Helpers.showToast('Please fill in all required fields', 'error');
                return;
            }

            // Get markdown from editor
            const mdInput = document.getElementById('md-editor-input');
            const content = mdInput ? mdInput.value : markdownContent;

            const resource = {
                id: Helpers.generateId(),
                title, description, department, courseCode, type,
                semester, subject, module, tags,
                authorId: user.id, authorName: user.name,
                downloads: 0,
                fileType: uploadedFile ? uploadedFile.name.split('.').pop() : 'markdown',
                content: content || '',
                fileName: uploadedFile ? uploadedFile.name : null,
                createdAt: new Date().toISOString()
            };

            Store.addResource(resource);
            uploadedFile = null;
            markdownContent = '';
            Helpers.showToast('Resource published successfully! 🎉', 'success');
            window.location.hash = `#/resource/${resource.id}`;
        });
    }

    function handleFile(file) {
        if (file.size > 10 * 1024 * 1024) {
            Helpers.showToast('File size must be under 10MB', 'error');
            return;
        }
        uploadedFile = file;
        document.getElementById('upload-dropzone').classList.add('hidden');
        const preview = document.getElementById('file-preview');
        preview.classList.remove('hidden');
        document.getElementById('file-preview-name').textContent = file.name;
        document.getElementById('file-preview-size').textContent = Helpers.formatFileSize(file.size);
        document.getElementById('file-preview-icon').textContent = Helpers.getFileIcon(file.name.split('.').pop());

        // If markdown file, read content
        if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                markdownContent = e.target.result;
                const mdInput = document.getElementById('md-editor-input');
                if (mdInput) {
                    mdInput.value = markdownContent;
                    mdInput.dispatchEvent(new Event('input'));
                }
            };
            reader.readAsText(file);
        }
    }

    return { render };
})();
