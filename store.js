/* ===== store.js – Data Layer (localStorage) ===== */

const Store = (() => {
    const KEYS = {
        users: 'ah_users',
        currentUser: 'ah_currentUser',
        resources: 'ah_resources',
        reviews: 'ah_reviews',
        comments: 'ah_comments',
        pullRequests: 'ah_pullRequests',
        progress: 'ah_progress',
        downloads: 'ah_downloads',
        seeded: 'ah_seeded'
    };

    function _get(key) {
        try { return JSON.parse(localStorage.getItem(key)) || null; }
        catch { return null; }
    }

    function _set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    /* ---- Users ---- */
    function getUsers() { return _get(KEYS.users) || []; }

    function addUser(user) {
        const users = getUsers();
        users.push(user);
        _set(KEYS.users, users);
    }

    function findUser(email) {
        return getUsers().find(u => u.email === email);
    }

    function getCurrentUser() { return _get(KEYS.currentUser); }

    function setCurrentUser(user) { _set(KEYS.currentUser, user); }

    function logout() { localStorage.removeItem(KEYS.currentUser); }

    function updateUser(userId, updates) {
        const users = getUsers();
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updates };
            _set(KEYS.users, users);
            const cur = getCurrentUser();
            if (cur && cur.id === userId) setCurrentUser(users[idx]);
        }
    }

    /* ---- Resources ---- */
    function getResources() { return _get(KEYS.resources) || []; }

    function addResource(res) {
        const list = getResources();
        list.unshift(res);
        _set(KEYS.resources, list);
    }

    function getResourceById(id) {
        return getResources().find(r => r.id === id) || null;
    }

    function updateResource(id, updates) {
        const list = getResources();
        const idx = list.findIndex(r => r.id === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...updates };
            _set(KEYS.resources, list);
        }
    }

    function deleteResource(id) {
        _set(KEYS.resources, getResources().filter(r => r.id !== id));
    }

    function searchResources({ keyword, department, courseCode, type, sortBy }) {
        let list = getResources();
        if (keyword) {
            const kw = keyword.toLowerCase();
            list = list.filter(r =>
                (r.title || '').toLowerCase().includes(kw) ||
                (r.description || '').toLowerCase().includes(kw) ||
                (r.tags || []).some(t => t.toLowerCase().includes(kw)) ||
                (r.courseCode || '').toLowerCase().includes(kw) ||
                (r.subject || '').toLowerCase().includes(kw)
            );
        }
        if (department) list = list.filter(r => r.department === department);
        if (courseCode) list = list.filter(r => r.courseCode === courseCode);
        if (type) list = list.filter(r => r.type === type);

        // Calculate avg rating for each
        const reviews = getReviews();
        list = list.map(r => {
            const rr = reviews.filter(rev => rev.resourceId === r.id);
            const avgRating = rr.length ? rr.reduce((s, x) => s + x.rating, 0) / rr.length : 0;
            return { ...r, avgRating, reviewCount: rr.length };
        });

        if (sortBy === 'rating') list.sort((a, b) => b.avgRating - a.avgRating);
        else if (sortBy === 'downloads') list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return list;
    }

    /* ---- Reviews ---- */
    function getReviews() { return _get(KEYS.reviews) || []; }

    function getReviewsForResource(resourceId) {
        return getReviews().filter(r => r.resourceId === resourceId);
    }

    function addReview(review) {
        const list = getReviews();
        // Only one review per user per resource
        const existing = list.findIndex(r => r.resourceId === review.resourceId && r.userId === review.userId);
        if (existing !== -1) {
            list[existing] = { ...list[existing], ...review, updatedAt: new Date().toISOString() };
        } else {
            list.push(review);
        }
        _set(KEYS.reviews, list);
    }

    /* ---- Comments ---- */
    function getComments() { return _get(KEYS.comments) || []; }

    function getCommentsForResource(resourceId) {
        return getComments().filter(c => c.resourceId === resourceId);
    }

    function addComment(comment) {
        const list = getComments();
        list.push(comment);
        _set(KEYS.comments, list);
    }

    /* ---- Pull Requests ---- */
    function getPullRequests() { return _get(KEYS.pullRequests) || []; }

    function addPullRequest(pr) {
        const list = getPullRequests();
        list.push(pr);
        _set(KEYS.pullRequests, list);
    }

    function updatePullRequest(id, updates) {
        const list = getPullRequests();
        const idx = list.findIndex(p => p.id === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...updates };
            _set(KEYS.pullRequests, list);
        }
    }

    /* ---- Progress Tracker ---- */
    function getProgress() { return _get(KEYS.progress) || []; }

    function setProgress(userId, resourceId, status) {
        const list = getProgress();
        const idx = list.findIndex(p => p.userId === userId && p.resourceId === resourceId);
        if (idx !== -1) {
            list[idx].status = status;
        } else {
            list.push({ userId, resourceId, status });
        }
        _set(KEYS.progress, list);
    }

    function getProgressForUser(userId) {
        return getProgress().filter(p => p.userId === userId);
    }

    /* ---- Downloads ---- */
    function getDownloads() { return _get(KEYS.downloads) || []; }

    function addDownload(userId, resourceId) {
        const list = getDownloads();
        if (!list.find(d => d.userId === userId && d.resourceId === resourceId)) {
            list.push({ userId, resourceId, at: new Date().toISOString() });
            _set(KEYS.downloads, list);
        }
        // Increment download count
        const res = getResourceById(resourceId);
        if (res) updateResource(resourceId, { downloads: (res.downloads || 0) + 1 });
    }

    function getDownloadsForUser(userId) {
        return getDownloads().filter(d => d.userId === userId);
    }

    /* ---- Seed check ---- */
    function isSeeded() { return !!_get(KEYS.seeded); }
    function markSeeded() { _set(KEYS.seeded, true); }

    return {
        getUsers, addUser, findUser, getCurrentUser, setCurrentUser, logout, updateUser,
        getResources, addResource, getResourceById, updateResource, deleteResource, searchResources,
        getReviews, getReviewsForResource, addReview,
        getComments, getCommentsForResource, addComment,
        getPullRequests, addPullRequest, updatePullRequest,
        getProgress, setProgress, getProgressForUser,
        getDownloads, addDownload, getDownloadsForUser,
        isSeeded, markSeeded
    };
})();
