document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Sticky header class on scroll
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Active Nav Link Highlighting - UPDATED LOGIC
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPagePath = window.location.pathname; // Gets the full path, e.g., "/research/collaborations.html" or "/team.html"

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        let normalizedLinkPath = linkHref;

        // Normalize link: make it absolute if it's relative from a sub-page
        // This is a simplified normalization. For very complex sites, a more robust URL parser might be needed.
        if (linkHref.startsWith('../')) {
            // Assuming script.js is at root, and pages are one level down
            // This part is tricky if script.js is also in a subfolder or paths are more complex
            // For now, we'll compare the end of the paths
        } else if (!linkHref.startsWith('/') && currentPagePath.includes('/research/')) {
            // Link like "index.html" from within /research/ should become "/research/index.html"
            // This logic is very specific to your "research" folder.
            if (linkHref === "index.html" || linkHref === "collaborations.html") {
                 normalizedLinkPath = '/research/' + linkHref;
            }
        }


        // Remove trailing slash from current page path if present (unless it's the root)
        let normalizedCurrentPagePath = currentPagePath;
        if (normalizedCurrentPagePath !== '/' && normalizedCurrentPagePath.endsWith('/')) {
            normalizedCurrentPagePath = normalizedCurrentPagePath.slice(0, -1);
        }
        // Also handle if current page is an index.html, it might just show as /directory/
        if (normalizedCurrentPagePath.endsWith('/index.html')) {
             // Consider both /research/ and /research/index.html as matching research/index.html
        }


        // Check for exact match or if link is to an index.html and current page is the directory
        // Example: link to "research/index.html" should be active on "/research/" or "/research/index.html"
        const linkIsIndex = linkHref.endsWith('index.html');
        const linkPointsToDirectory = linkHref.endsWith('/');

        let isActive = false;
        if (normalizedLinkPath === normalizedCurrentPagePath) { // Exact match
            isActive = true;
        } else if (linkIsIndex && normalizedCurrentPagePath === normalizedLinkPath.substring(0, normalizedLinkPath.lastIndexOf('/index.html'))) {
            // e.g. link is "research/index.html", current page is "/research" (after potential server rewrite)
            isActive = true;
        } else if (linkPointsToDirectory && normalizedCurrentPagePath === normalizedLinkPath.slice(0, -1)) {
            // e.g. link is "research/", current page is "/research"
            isActive = true;
        }


        // Special handling for parent "Research" link when on a sub-page
        if (currentPagePath.startsWith('/research/') && link.getAttribute('href').startsWith('research/')) {
            // If the main "Research" link points to "research/index.html" or "research/"
             if (link.closest('.nav-item-has-dropdown')) { // Check if it's the parent of a dropdown
                const parentLi = link.closest('.nav-item-has-dropdown');
                const directParentLink = parentLi.querySelector(':scope > a'); // Get the direct <a> child
                if (directParentLink && (directParentLink.getAttribute('href') === 'research/index.html' || directParentLink.getAttribute('href') === 'research/')) {
                    directParentLink.classList.add('active');
                }
            }
        }


        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Ensure the main "Research" link is active if any of its children are active
    // This is an additional check because the above logic might only activate the child.
    const activeDropdownLink = document.querySelector('.dropdown-menu a.active');
    if (activeDropdownLink) {
        const parentResearchLink = activeDropdownLink.closest('.nav-item-has-dropdown').querySelector(':scope > a');
        if (parentResearchLink) {
            parentResearchLink.classList.add('active');
        }
    }


    // Update current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});