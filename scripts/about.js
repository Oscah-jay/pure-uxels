// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Loading Animation
    const loader = document.querySelector('.loader');
    
    setTimeout(function() {
        loader.classList.add('loaded');
    }, 2500);
    
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
    
    const links = document.querySelectorAll('a, button, .team-card, .value-card, .send-message-btn');
    
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
    
    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
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
    
    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    function animateStats() {
        if (hasAnimated) return;
        
        const statsSection = document.querySelector('.stats-section');
        const statsSectionTop = statsSection.getBoundingClientRect().top;
        
        if (statsSectionTop < window.innerHeight - 100) {
            statNumbers.forEach(statNumber => {
                const target = parseInt(statNumber.getAttribute('data-count'));
                let count = 0;
                const duration = 2000; // 2 seconds
                const interval = duration / target;
                
                const counter = setInterval(function() {
                    count++;
                    statNumber.textContent = count;
                    
                    if (count >= target) {
                        clearInterval(counter);
                    }
                }, interval);
            });
            
            hasAnimated = true;
        }
    }
    
    window.addEventListener('scroll', animateStats);
    
    // Timeline Animation
    function animateTimeline() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;
        
        const timelineTop = timeline.getBoundingClientRect().top;
        const timelineLine = document.querySelector('.timeline-line');
        
        if (timelineTop < window.innerHeight - 100) {
            timelineLine.style.height = '100%';
        }
    }
    
    window.addEventListener('scroll', animateTimeline);
    
    // Team cards hover effect
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.team-info').style.backgroundColor = 'rgba(255, 75, 51, 0.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.team-info').style.backgroundColor = '';
        });
    });
    
    // Office gallery animation
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            galleryItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.5';
                }
            });
        });
        
        item.addEventListener('mouseleave', function() {
            galleryItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
            });
        });
    });
    
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

// Tools & Tech Stack Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Category Tabs Functionality
    const categoryTabs = document.querySelectorAll('.category-tab');
    const toolsGrids = document.querySelectorAll('.tools-grid');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    // Initialize tab indicator position and width
    function setTabIndicator(activeTab) {
        if (!tabIndicator) return;
        
        const tabWidth = activeTab.offsetWidth;
        const tabLeft = activeTab.offsetLeft;
        
        tabIndicator.style.width = tabWidth + 'px';
        tabIndicator.style.transform = `translateX(${tabLeft}px)`;
    }
    
    // Set initial tab indicator
    if (categoryTabs.length > 0) {
        setTabIndicator(categoryTabs[0]);
    }
    
    // Tab click event
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update tab indicator
            setTabIndicator(this);
            
            // Show corresponding tools grid
            const category = this.getAttribute('data-category');
            
            toolsGrids.forEach(grid => {
                grid.classList.remove('active');
                
                if (grid.getAttribute('data-category') === category) {
                    grid.classList.add('active');
                    
                    // Animate tool cards
                    animateToolCards(grid);
                }
            });
        });
    });
    
    // Animate tool cards with staggered delay
    function animateToolCards(grid) {
        const toolCards = grid.querySelectorAll('.tool-card');
        
        toolCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // Expertise Meter Animation
    function animateExpertiseMeters() {
        const meterFills = document.querySelectorAll('.meter-fill');
        
        meterFills.forEach(fill => {
            const percentage = fill.getAttribute('data-percentage');
            fill.style.width = percentage + '%';
        });
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
                
                // If this is the expertise container, animate meters
                if (element.classList.contains('expertise-container')) {
                    animateExpertiseMeters();
                }
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
    
    // Listen for scroll events
    window.addEventListener('scroll', revealElements);
    
    // Initial reveal check
    revealElements();
    
    // Animate the initial active tools grid
    const initialGrid = document.querySelector('.tools-grid.active');
    if (initialGrid) {
        setTimeout(() => {
            animateToolCards(initialGrid);
        }, 500);
    }
    
    // Window resize event for tab indicator
    window.addEventListener('resize', function() {
        const activeTab = document.querySelector('.category-tab.active');
        if (activeTab) {
            setTabIndicator(activeTab);
        }
    });
});