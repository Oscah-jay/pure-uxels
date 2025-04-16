// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Loading Animation
    const loader = document.querySelector('.loader');
    const loaderPercentage = document.querySelector('.loader-percentage');
    
    let loadProgress = 0;
    const loadInterval = setInterval(function() {
        loadProgress += Math.floor(Math.random() * 5) + 1;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            
            setTimeout(function() {
                loader.classList.add('loaded');
            }, 500);
        }
        loaderPercentage.textContent = loadProgress + '%';
    }, 100);
    
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(function() {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    const links = document.querySelectorAll('a, button, .project-item, .filter-btn, .view-btn');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            cursorFollower.classList.add('link-grow');
        });
        
        link.addEventListener('mouseleave', function() {
            cursorFollower.classList.remove('link-grow');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseout', function() {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mouseover', function() {
        cursor.style.opacity = '0.8';
        cursorFollower.style.opacity = '0.5';
    });
    
    // Mobile Check
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // If mobile, disable custom cursor
    if (isMobile()) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }
    
    // Sticky Header
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links1');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links1 a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Dark Mode Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference to local storage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
        });
    });
    
    // View Toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    const projectsContainer = document.querySelector('.projects-container');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            
            // Toggle view
            if (view === 'grid') {
                projectsContainer.classList.remove('list-view');
                projectsContainer.classList.add('grid-view');
            } else {
                projectsContainer.classList.remove('grid-view');
                projectsContainer.classList.add('list-view');
            }
        });
    });
    
    // Load More Button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    loadMoreBtn.addEventListener('click', function() {
        this.classList.add('loading');
        this.querySelector('span').textContent = 'Loading...';
        
        // Simulate loading
        setTimeout(() => {
            this.classList.remove('loading');
            this.querySelector('span').textContent = 'No More Projects';
            this.disabled = true;
            this.style.opacity = '0.5';
            this.style.cursor = 'not-allowed';
        }, 2000);
    });
    
    // Project Modal
    const projectModal = document.querySelector('.project-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    
    // Define projectsData here or import it
    const projectsData = {
        'project1': {
            title: 'Project 1',
            category: 'Web Design',
            client: 'Client A',
            date: '2023-01-01',
            description: 'Description of Project 1.',
            challenge: 'Challenge of Project 1.',
            solution: 'Solution for Project 1.',
            images: ['image1.jpg', 'image2.jpg']
        },
        'project2': {
            title: 'Project 2',
            category: 'Web Development',
            client: 'Client B',
            date: '2023-02-01',
            description: 'Description of Project 2.',
            challenge: 'Challenge of Project 2.',
            solution: 'Solution for Project 2.',
            images: ['image3.jpg', 'image4.jpg']
        },
        'project3': {
            title: 'Project 3',
            category: 'Graphic Design',
            client: 'Client C',
            date: '2023-03-01',
            description: 'Description of Project 3.',
            challenge: 'Challenge of Project 3.',
            solution: 'Solution for Project 3.',
            images: ['image5.jpg', 'image6.jpg']
        }
    };
    
    let currentProjectIndex = 0;
    const projectIds = Object.keys(projectsData);
    
    // Open modal when clicking view project button
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const projectId = this.getAttribute('data-project');
            currentProjectIndex = projectIds.indexOf(projectId);
            
            openModal(projectId);
        });
    });
    
    // Close modal when clicking close button or overlay
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Navigate to previous project
    modalPrev.addEventListener('click', function() {
        currentProjectIndex = (currentProjectIndex - 1 + projectIds.length) % projectIds.length;
        openModal(projectIds[currentProjectIndex]);
    });
    
    // Navigate to next project
    modalNext.addEventListener('click', function() {
        currentProjectIndex = (currentProjectIndex + 1) % projectIds.length;
        openModal(projectIds[currentProjectIndex]);
    });
    
    // Close modal when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Open modal function
    function openModal(projectId) {
        const project = projectsData[projectId];
        
        // Create modal content
        modalContent.innerHTML = `
            <div class="modal-header">
                <div class="modal-category">${project.category}</div>
                <h2 class="modal-title">${project.title}</h2>
                <div class="modal-meta">
                    <div class="meta-item">
                        <span class="meta-label">Client</span>
                        <span class="meta-value">${project.client}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Date</span>
                        <span class="meta-value">${project.date}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Category</span>
                        <span class="meta-value">${project.category}</span>
                    </div>
                </div>
            </div>
            <div class="modal-description">
                <p>${project.description}</p>
            </div>
            <div class="modal-section">
                <h3>The Challenge</h3>
                <p>${project.challenge}</p>
            </div>
            <div class="modal-section">
                <h3>Our Solution</h3>
                <p>${project.solution}</p>
            </div>
            <div class="modal-gallery">
                ${project.images.map(image => `
                    <div class="gallery-item">
                        <img src="${image}" alt="${project.title}">
                    </div>
                `).join('')}
            </div>
        `;
        
        // Show modal
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal function
    function closeModal() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Scroll Reveal Animation
    function revealElements() {
        const reveals = document.querySelectorAll('.reveal');
        const revealTexts = document.querySelectorAll('.reveal-text');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
        
        revealTexts.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealElements);
    
    // Trigger reveal on page load
    setTimeout(revealElements, 2600);
    
    // Project Item Animation
    function animateProjectItems() {
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'fadeInUp 0.5s forwards';
            }, 100 * index);
        });
    }
    
    // Trigger project item animation after loader
    setTimeout(animateProjectItems, 2600);
    
    // Let's Talk Button and Overlay
    const letsTalkBtn = document.getElementById('lets-talk-btn');
    const overlayMenu = document.getElementById('overlay-menu');
    const closeOverlay = document.getElementById('close-overlay');
    
    // Open overlay when Let's Talk button is clicked
    letsTalkBtn.addEventListener('click', function() {
        overlayMenu.classList.add('active');
        document.body.classList.add('overlay-active');
        
        // Add animation classes with delay
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    });
    
    // Close overlay when close button is clicked
    closeOverlay.addEventListener('click', function() {
        overlayMenu.classList.remove('active');
        document.body.classList.remove('overlay-active');
        
        // Reset animations
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
        });
    });
    
    // Close overlay when clicking outside of content (optional)
    overlayMenu.addEventListener('click', function(e) {
        if (e.target === overlayMenu) {
            closeOverlay.click();
        }
    });
    
    // Close overlay when ESC key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlayMenu.classList.contains('active')) {
            closeOverlay.click();
        }
    });
    
    // Prevent scrolling when overlay is active
    function handleOverlayScroll() {
        if (document.body.classList.contains('overlay-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    const overlayObserver = new MutationObserver(handleOverlayScroll);
    overlayObserver.observe(document.body, { attributes: true });
    
    // Initialize everything on load
    window.addEventListener('load', function() {
        setTimeout(revealElements, 2600);
        handleOverlayScroll();
    });
});