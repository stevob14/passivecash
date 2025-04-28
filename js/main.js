document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        // Toggle menu on hamburger click
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('active'); // Toggle active class on button too
            // Optional: Toggle ARIA attribute for accessibility
            const isExpanded = navLinks.classList.contains('active');
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburgerBtn.contains(event.target);
            const isNavActive = navLinks.classList.contains('active');

            if (!isClickInsideNav && !isClickOnHamburger && isNavActive) {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('active'); // Remove active class from button too
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        console.error("Hamburger button or nav links not found. Menu script not initialized.");
    }
});