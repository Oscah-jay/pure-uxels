// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize reveal animations
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-text');
        
        // Add initial state
        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });
        
        // Trigger animations on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize on page load
    initRevealAnimations();
});
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
    
    let allProjects = [];

    // Element references
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const loadMoreText = loadMoreBtn.querySelector('span');
    const spinner = loadMoreBtn.querySelector('i');
    const overlay = document.getElementById('projectsOverlay');
    const overlayGrid = document.getElementById('overlayGrid');
    const overlayClose = document.getElementById('overlayClose');
    
    // Fetch all projects on page load
    async function fetchProjects() {
      try {
        const response = await fetch('projects.json');
        const data = await response.json();
        allProjects = Object.values(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    }
    
    // Show all projects in overlay
    function showProjectsOverlay() {
      loadMoreBtn.classList.add('loading');
      loadMoreText.textContent = 'Loading...';
      spinner.style.display = 'inline-block';
    
      setTimeout(() => {
        overlayGrid.innerHTML = ''; // clear previous
    
        allProjects.forEach(project => {
          const projectEl = document.createElement('div');
          projectEl.className = 'project-card';
          projectEl.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>Client:</strong> ${project.client}</p>
            <p><strong>Category:</strong> ${project.category}</p>
            <p><strong>Date:</strong> ${project.date}</p>
            <p>${project.description}</p>
            <video src="${project.videos ? project.videos[0] : ''}" autoplay muted loop playsinline style="width: 100%; border-radius: 8px; margin-top: 1rem;"></video>
          `;
          overlayGrid.appendChild(projectEl);
        });
    
        overlay.style.display = 'flex'; // show overlay
        spinner.style.display = 'none';
      }, 800);
    }
    
    // Close overlay
    overlayClose.addEventListener('click', () => {
        overlay.style.display = 'none';
      
        // Reset Load More button
        loadMoreBtn.classList.remove('loading');
        loadMoreText.textContent = 'Load More';
        spinner.style.display = 'none';
      });
      
    
   
    
    loadMoreBtn.addEventListener('click', showProjectsOverlay);
    
    fetchProjects();
    

// Wait for click
loadMoreBtn.addEventListener('click', loadMoreProjects);

    
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
            title: 'Web Design',
            category: 'Web Design',
            client: 'Newlife Fountain Ministries',
            date: '2024-10-06',
            description: 'Web Design for the ministry Website.',
            challenge: 'Balancing modern design trends with the traditional values and expectations of the ministrys audience.',
            solution: 'Blend modern design principles with familiar elements, and involve ministry leaders early through moodboards and previews to ensure alignment and smooth approvals.',
            
        },
        'project2': {
            title: 'UI/UX design',
            category: 'Web Design',
            client: 'Go Cart',
            date: '2025-01-01',
            description: 'Consumable goods supply chain connecting suppliers to vendors and cuustomers.',
            challenge: 'A key challenge was organizing the companys extensive and frequently changing inventory into a user-friendly layout that allowed for quick navigation and efficient bulk ordering.            ',
            solution: 'The solution involved implementing a dynamic filtering system with clear product categories, search functionality, and bulk order options, all integrated into a responsive, easy-to-navigate interface.',
        
        },
        'project3': {
            title: 'Mobile App UI',
            category: 'UI/UX',
            client: 'Waigapharm',
            date: '2024-08-04',
            description: 'Mobile App UI for medicine delivery',
            challenge: 'Ensuring clear and intuitive navigation for users of all ages and digital literacy levels can be a major challenge in designing a medicine delivery app UI.',
            solution: 'We simplified the interface with large icons and clear steps to make navigation easy for all users.',
            
        },
        'project4': {
            title: 'Explainer Video',
            category: 'Motion',
            client: 'Neema Stores',
            date: '2023-02-01',
            description: 'Animated video to showcase how to shop on Neema stores easily.',
            challenge: ' We faced difficulty balancing visual appeal with instructional clarity, as overly complex animations risked distracting from key shopping steps.',
            solution: ' We developed a streamlined storyboard that aligned motion graphics with precise voiceover cues, ensuring each animation enhanced rather than overwhelmed the instructional flow.',
        
        },
        'project5': {
            title: 'Children Storybook',
            category: 'Print',
            client: 'Sarah N',
            date: '2025-02-03',
            description: 'Visually appealing children storybook with colorful images and engaging words for kids',
            challenge: ' We found it challenging to create illustrations that were both visually engaging and age-appropriate while aligning with the tone of the story.',
            solution: 'We used bright, simple visuals with expressive characters and tested early drafts with children to ensure the style resonated with the target age group.',
        },
        'project6': {
            title: 'Coming soon poster',
            category: 'Graphic',
            client: 'Charles',
            date: '2025-03-01',
            description: 'Poster to announce the almost launching of the crypto trading platform in Africa.',
            challenge: '1. Blending brand colors with specific nail set and incorporating both the brand identity while maintaining modern trendy methods.',
            solution: 'Using more complex design tools and ensuring perfect blend of colors and showcasing the main brand message.',
        },
        'project7': {
            title: 'Creative Portfolio Design',
            category: 'Web Development',
            client: 'Michael',
            date: '2024-11-10',
            description: 'Creative portfolio website for a developer/designer.',
            challenge: 'Fully integrating both aspects of the developer/designer roles without putting much weight on one role.',
            solution: 'Designing portions for each section to ensure each role has been captured equally to the other.',
        
        },
        'project8': {
            title: 'Vendor Dashboard UI',
            category: 'Web Development',
            client: 'Go Cart',
            date: '2025-02-10',
            description: 'UI for a vendor dashboard for a consumable goods supply chain website.',
            challenge: 'Incorporating specific charts as per the requirements and each filter option to match the charts.',
            solution: 'Gaining inspirations from existing designs and useing best tools to incorporate all the necessary and required systems.',
        },
        'project9': {
            title: 'Product Animation',
            category: 'Motion',
            client: 'Neema Stores',
            date: '2023-06-05',
            description: 'Product animation video for the display of a new product.',
            challenge: 'Blending the product with the right colors.',
            solution: 'Using uniform solid colors for the design.',
        },
        'project10': {
            title: 'Logo Design',
            category: 'Graphic Design',
            client: 'Lydia',
            date: '2023-04-06',
            description: 'Logo for Neema stores.',
            challenge: 'Getting modern trends for the logo while maintaining the brand identity and message.',
            solution: 'Getting insights from users for best practice and modernism.',
        },
        'project11': {
            title: 'Brand Identity',
            category: 'Graphic Design',
            client: 'Precious',
            date: '2024-10-12',
            description: 'Fashion design agency branding .',
            challenge: 'Neatly applying overlays and brand colors to the design to ensure visibility of each element.',
            solution: 'Applying best practice and professionalism for client satisfaction.',
        },
        'project12': {
            title: 'Poster Design',
            category: 'Graphic Design',
            client: 'Dagracia Hotel',
            date: '2024-11-20',
            description: 'Poster for a new special meal in the restaurant.',
            challenge: 'Combining modernism and client satisfaction to align with target audience.',
            solution: 'Getting insights from customers of what would be most appealing to them if presented with a choice.',
        },
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
  ${
    Array.isArray(project.images)
      ? project.images.map(image => `
          <div class="gallery-item">
            <img src="${image}" alt="${project.title}">
          </div>
        `).join('')
      : ''
  }
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

