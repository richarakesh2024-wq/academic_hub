/* ===== main.js – App Entry Point ===== */
(function () {
    'use strict';

    // Seed demo data
    SeedData.seed();

    // Initialize components
    Navbar.init();
    Modal.init();

    // Start router
    Router.init();

    console.log('🎓 AcademicHub initialized');
})();
