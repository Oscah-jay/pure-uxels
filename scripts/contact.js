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
    
    const links = document.querySelectorAll('a, button, .info-card, .social-icon, .faq-question, .hours-card');
    
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
    
    // Form Input Animation
    const formInputs = document.querySelectorAll('.input-wrapper input, .input-wrapper select, .input-wrapper textarea');
    
    formInputs.forEach(input => {
        // Check if input has value on load
        if (input.value !== '') {
            input.parentElement.classList.add('has-value');
        }
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value !== '') {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
    });
    
    // Form Validation
   // Form Validation and Submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    let isValid = true;
    const formGroups = contactForm.querySelectorAll('.form-group');
    
    // Validate form fields
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const inputWrapper = group.querySelector('.input-wrapper');
        
        if (input && input.required && !input.value) {
            inputWrapper.classList.add('error');
            isValid = false;
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            inputWrapper.classList.add('error');
            isValid = false;
        } else if (inputWrapper) {
            inputWrapper.classList.remove('error');
        }
    });
    
    if (!isValid) {
        e.preventDefault(); // Prevent form submission if validation fails
        return;
    }
    
    // If form is valid, show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    
    // The form will be submitted to Formspree
    // We can add additional handling for the success state
    
    // Optional: If you want to handle the form submission with AJAX instead
    /* 
    e.preventDefault();
    
    fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Show success state
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        
        setTimeout(function() {
            // Show success message
            document.querySelector('.success-message').classList.add('active');
            
            // Reset form
            contactForm.reset();
            formGroups.forEach(group => {
                const inputWrapper = group.querySelector('.input-wrapper');
                if (inputWrapper) {
                    inputWrapper.classList.remove('has-value');
                }
            });
            
            submitBtn.classList.remove('success');
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.classList.remove('loading');
        // Handle error state
    });
    */
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Map Animation
    const mapContainer = document.querySelector('.map-container');
    
    function animateMap() {
        const mapTop = mapContainer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (mapTop < windowHeight - 100) {
            mapContainer.classList.add('active');
        }
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
        
        // Animate map when in view
        animateMap();
    }
    
    window.addEventListener('scroll', revealElements);
    
    // Trigger reveal on page load
    setTimeout(revealElements, 2600);
    
    // Update office hours status based on current time
    function updateOfficeHours() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hour = now.getHours();
        
        const openStatus = document.querySelector('.status.open');
        const closedStatuses = document.querySelectorAll('.status.closed');
        
        // Check if it's a weekday and within office hours
        if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
            // Weekday during office hours
            openStatus.style.display = 'inline-block';
            closedStatuses[0].style.display = 'none';
        } else if (day === 6 && hour >= 10 && hour < 16) {
            // Saturday during office hours
            openStatus.style.display = 'none';
            closedStatuses[0].style.display = 'inline-block';
            closedStatuses[0].textContent = 'Open Now';
            closedStatuses[0].classList.remove('closed');
            closedStatuses[0].classList.add('open');
        } else {
            // Outside office hours
            openStatus.style.display = 'none';
            closedStatuses.forEach(status => {
                status.style.display = 'inline-block';
            });
        }
    }
    
    updateOfficeHours();
    
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