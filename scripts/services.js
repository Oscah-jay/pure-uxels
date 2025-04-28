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
    
    const links = document.querySelectorAll('a, button, .service-item, .partnership-option');
    
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
    setTimeout(revealElements, 200);
    
    // Parallax effect for sections
    if (!isMobile()) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Parallax for pattern grids
            document.querySelectorAll('.pattern-grid').forEach(grid => {
                const parent = grid.closest('section');
                const parentTop = parent.offsetTop;
                const speed = 0.1;
                
                const yPos = (scrollPosition - parentTop) * speed;
                grid.style.transform = `translateY(${yPos}px)`;
            });
            
            // Parallax for vertical text
            document.querySelectorAll('.vertical-text').forEach(text => {
                const parent = text.closest('section');
                const parentTop = parent.offsetTop;
                const speed = 0.05;
                
                const yPos = (scrollPosition - parentTop) * speed;
                text.style.transform = `translateY(calc(-50% + ${yPos}px))`;
            });
        });
    }
    
    // Form validation and submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            // Basic validation
            if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate form submission success
            alert('Your message has been sent successfully!');
            contactForm.reset();
        });
    }
    
    // Initialize everything on load
    window.addEventListener('load', function() {
        revealElements();
        
        // Add page transition effect
        document.body.classList.add('loaded');
    });
});

// Let's Talk Button and Overlay Functionality
document.addEventListener('DOMContentLoaded', function() {
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
});


// Industries We Serve Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS library if it exists
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease',
            once: true
        });
    } else {
        // Fallback animations if AOS is not available
        initFallbackAnimations();
    }
    
    // Animate stats counter when in viewport
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateStats() {
        if (animated) return;
        
        const statsSection = document.querySelector('.industry-stats');
        if (!statsSection) return;
        
        const statsSectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (statsSectionTop < windowHeight - 100) {
            statNumbers.forEach(stat => {
                const targetNumber = parseInt(stat.getAttribute('data-count'));
                animateCounter(stat, targetNumber);
            });
            animated = true;
        }
    }
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = Math.ceil(target / 50); // Adjust speed here
        const duration = 2000; // 2 seconds
        const interval = Math.floor(duration / (target / increment));
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = current;
            }
        }, interval);
    }
    
    // 3D Card Tilt Effect
    const industryCards = document.querySelectorAll('.industry-card');
    
    industryCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Only apply if not on mobile
            if (window.innerWidth > 768) {
                const cardRect = card.getBoundingClientRect();
                const cardX = e.clientX - cardRect.left;
                const cardY = e.clientY - cardRect.top;
                
                const centerX = cardRect.width / 2;
                const centerY = cardRect.height / 2;
                
                const rotateX = (cardY - centerY) / 10;
                const rotateY = (centerX - cardX) / 10;
                
                // Don't apply tilt if card is flipped
                if (!card.classList.contains('flipped')) {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset transform when mouse leaves
            if (!card.classList.contains('flipped')) {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }
        });
        
        // Handle click to flip
        card.addEventListener('click', function() {
            card.classList.toggle('flipped');
            if (card.classList.contains('flipped')) {
                card.style.transform = 'rotateY(180deg)';
            } else {
                card.style.transform = 'rotateY(0deg)';
            }
        });
    });
    
    // Parallax Effect for Background Elements
    const bgElements = document.querySelectorAll('.bg-circle, .bg-shape');
    
    window.addEventListener('mousemove', function(e) {
        // Only apply if not on mobile
        if (window.innerWidth > 768) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            bgElements.forEach(element => {
                const offsetX = (mouseX - 0.5) * 30;
                const offsetY = (mouseY - 0.5) * 30;
                const depth = parseFloat(element.getAttribute('data-depth') || Math.random() * 0.2 + 0.1);
                
                element.style.transform = `translate(${offsetX * depth}px, ${offsetY * depth}px)`;
            });
        }
    });
    
    // Fallback animations if AOS is not available
    function initFallbackAnimations() {
        const animateElements = document.querySelectorAll('[data-aos]');
        
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
            );
        }
        
        // Function to animate elements in viewport
        function animateOnScroll() {
            animateElements.forEach(element => {
                if (isInViewport(element) && !element.classList.contains('aos-animate')) {
                    element.classList.add('aos-animate');
                }
            });
        }
        
        // Initial check
        setTimeout(animateOnScroll, 100);
        
        // Listen for scroll
        window.addEventListener('scroll', animateOnScroll);
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', function() {
        animateStats();
    });
    
    // Initial check
    setTimeout(function() {
        animateStats();
    }, 500);
});