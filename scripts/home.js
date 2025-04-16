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
    
    const links = document.querySelectorAll('a, button, .service-card, .portfolio-item');
    
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
    
    // Active nav link highlight
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
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
    
    // Testimonial Slider
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    function updateSlider() {
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    nextBtn.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        updateSlider();
    });
    
    prevBtn.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        updateSlider();
    });
    
    // Auto-slide testimonials
    setInterval(function() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        updateSlider();
    }, 5000);
    
    // Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    function animateStats() {
        if (hasAnimated) return;
        
        const statsSection = document.querySelector('.stats');
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
        updateSlider();
        
        // If not mobile, apply parallax effect
        if (!isMobile()) {
            // Parallax effect for hero section
            window.addEventListener('scroll', function() {
                const scrollPosition = window.scrollY;
                const heroSection = document.querySelector('.hero');
                const heroImage = document.querySelector('.hero-image');
                
                if (heroSection && heroImage) {
                    heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
                }
            });
        }
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

// Services Section with Controlled Scrolling
document.addEventListener('DOMContentLoaded', function() {
    const servicesSection = document.getElementById('services-section');
    const serviceSlides = document.querySelectorAll('.service-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    let isAnimating = false;
    let autoplayInterval;
    let canScrollPast = false;
    let sectionInView = false;
    
    // Initialize the section
    function initServicesSection() {
        // Set up the first slide
        showSlide(0);
        
        // Start autoplay
        startAutoplay();
        
        // Add event listeners for indicators
        indicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                if (isAnimating) return;
                
                const index = parseInt(this.getAttribute('data-index'));
                showSlide(index);
                resetAutoplay();
            });
        });
        
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Add wheel event listener to control scrolling
        window.addEventListener('wheel', handleWheel, { passive: false });
        
        // Add touch events for mobile
        let touchStartY = 0;
        
        window.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchmove', function(e) {
            if (!sectionInView) return;
            
            const touchY = e.touches[0].clientY;
            const diff = touchStartY - touchY;
            
            // If scrolling down and not at the last slide or can't scroll past
            if (diff > 0 && (currentSlide < serviceSlides.length - 1 || !canScrollPast)) {
                e.preventDefault();
                
                if (diff > 50 && !isAnimating) {
                    nextSlide();
                    touchStartY = touchY;
                }
            }
            
            // If scrolling up and not at the first slide
            if (diff < 0 && currentSlide > 0) {
                e.preventDefault();
                
                if (diff < -50 && !isAnimating) {
                    prevSlide();
                    touchStartY = touchY;
                }
            }
        }, { passive: false });
    }
    
    // Handle scroll events
    function handleScroll() {
        const rect = servicesSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if section is in view
        if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.7) {
            if (!sectionInView) {
                sectionInView = true;
                startAutoplay();
            }
        } else {
            sectionInView = false;
            stopAutoplay();
        }
        
        // Lock scrolling when section is in view and we're not at the last slide
        if (sectionInView && !canScrollPast) {
            servicesSection.style.position = 'fixed';
            servicesSection.style.top = '0';
            servicesSection.style.left = '0';
            servicesSection.style.zIndex = '10';
            
            // Add a spacer to prevent content jump
            if (!document.getElementById('services-spacer')) {
                const spacer = document.createElement('div');
                spacer.id = 'services-spacer';
                spacer.style.height = '100vh';
                servicesSection.parentNode.insertBefore(spacer, servicesSection);
            }
        } else {
            servicesSection.style.position = 'relative';
            servicesSection.style.top = 'auto';
            servicesSection.style.left = 'auto';
            servicesSection.style.zIndex = 'auto';
        }
    }
    
    // Handle wheel events
    function handleWheel(e) {
        if (!sectionInView) return;
        
        // If scrolling down and not at the last slide or can't scroll past
        if (e.deltaY > 0 && (currentSlide < serviceSlides.length - 1 || !canScrollPast)) {
            e.preventDefault();
            
            if (!isAnimating) {
                nextSlide();
            }
        }
        
        // If scrolling up and not at the first slide
        if (e.deltaY < 0 && currentSlide > 0) {
            e.preventDefault();
            
            if (!isAnimating) {
                prevSlide();
            }
        }
    }
    
    // Show a specific slide
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Hide current slide
        serviceSlides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        // Show new slide
        currentSlide = index;
        serviceSlides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        
        // Allow scrolling past if we're at the last slide
        canScrollPast = currentSlide === serviceSlides.length - 1;
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }
    
    // Go to next slide
    function nextSlide() {
        if (currentSlide < serviceSlides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }
    
    // Go to previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }
    
    // Start autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            if (currentSlide < serviceSlides.length - 1) {
                nextSlide();
            } else {
                showSlide(0);
            }
        }, 5000);
    }
    
    // Stop autoplay
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Reset autoplay
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Initialize the section
    initServicesSection();
});


// Testimonials Section 
document.addEventListener('DOMContentLoaded', function() {
    // Testimonials Slider
    const track = document.querySelector('.testimonials-track');
    const items = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const progressFill = document.querySelector('.progress-fill');
    const currentNumber = document.querySelector('.progress-numbers .current');
    const totalNumber = document.querySelector('.progress-numbers .total');
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    // Set total number
    totalNumber.textContent = totalItems.toString().padStart(2, '0');
    
    // Initialize slider
    function updateSlider() {
        // Update track position
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update progress fill
        const progressWidth = (currentIndex / (totalItems - 1)) * 100;
        progressFill.style.transform = `translateX(${progressWidth}%)`;
        
        // Update current number
        currentNumber.textContent = (currentIndex + 1).toString().padStart(2, '0');
        
        // Update button states
        prevBtn.classList.toggle('disabled', currentIndex === 0);
        nextBtn.classList.toggle('disabled', currentIndex === totalItems - 1);
        
        // Animate current testimonial elements
        animateTestimonial(currentIndex);
    }
    
    // Previous slide
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    // Next slide
    nextBtn.addEventListener('click', function() {
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // Animate testimonial elements
    function animateTestimonial(index) {
        // Reset all animations
        document.querySelectorAll('.testimonial-item .reveal, .testimonial-item .reveal-text').forEach(el => {
            el.classList.remove('active');
        });
        
        // Get current testimonial elements
        const currentItem = items[index];
        const revealElements = currentItem.querySelectorAll('.reveal');
        const revealTextElements = currentItem.querySelectorAll('.reveal-text');
        
        // Animate with delay
        setTimeout(() => {
            revealTextElements.forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, i * 200);
            });
            
            revealElements.forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, 300 + (i * 200));
            });
        }, 100);
    }
    
    // Touch/Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left (next)
            if (currentIndex < totalItems - 1) {
                currentIndex++;
                updateSlider();
            }
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right (prev)
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }
    }
    
    // Auto-play (optional)
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentIndex < totalItems - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 6000); // Change slide every 6 seconds
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Start autoplay
    startAutoplay();
    
    // Pause autoplay on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    
    // Pause autoplay on touch
    track.addEventListener('touchstart', stopAutoplay);
    track.addEventListener('touchend', startAutoplay);
    
    // Scroll Reveal Animation
    function revealElements() {
        const reveals = document.querySelectorAll('.testimonials-section .reveal');
        const revealTexts = document.querySelectorAll('.testimonials-section .reveal-text');
        
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
    
    // Listen for scroll events
    window.addEventListener('scroll', revealElements);
    
    // Initialize slider and animations
    updateSlider();
    revealElements();
});