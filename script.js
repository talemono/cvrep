// DOM Elements
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const projectFilters = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('projectModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const backToTop = document.getElementById('backToTop');

// Theme management
let currentTheme = localStorage.getItem('theme') || 'system';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeProjectFilters();
    initializeContactForm();
    initializeScrollAnimations();
    initializeModal();
    initializeSkillTags();
    initializeBackToTop();
});

// Theme functionality
function initializeTheme() {
    // Set initial theme
    setTheme(currentTheme);
    
    // Add event listener for theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (currentTheme === 'system') {
            setTheme('system');
        }
    });
}

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
        // Remove explicit theme and let CSS handle system preference
        document.documentElement.removeAttribute('data-theme');
        updateThemeIcon('system');
    } else {
        // Set explicit theme
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
    
    // Update navbar background
    updateNavbarBackground();
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function updateThemeIcon(theme) {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
        themeIcon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeIcon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking on theme toggle
    themeToggle.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        updateActiveNavLink();
        updateNavbarBackground();
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Update navbar background on scroll
function updateNavbarBackground() {
    const isDark = currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (window.scrollY > 100) {
        if (isDark) {
            navbar.style.background = 'rgba(15, 15, 15, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        }
    } else {
        if (isDark) {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }
}

// Project filtering functionality
function initializeProjectFilters() {
    projectFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-filter');
            
            // Update active filter button
            projectFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            filterProjects(category);
        });
    });
}

function filterProjects(category) {
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            setTimeout(() => {
                if (card.classList.contains('hidden')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });

    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
}

function handleFormSubmission() {
    const formData = new FormData(contactForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Basic validation
    if (!validateForm(formObject)) {
        return;
    }

    // Show loading state
    contactForm.classList.add('loading');
    
    // Simulate form submission
    setTimeout(() => {
        contactForm.classList.remove('loading');
        showSuccessMessage();
        contactForm.reset();
    }, 2000);
}

function validateForm(data) {
    let isValid = true;
    const errors = {};

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Subject validation
    if (!data.subject || data.subject.trim().length < 5) {
        errors.subject = 'Subject must be at least 5 characters long';
        isValid = false;
    }

    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
        isValid = false;
    }

    // Display errors
    displayFormErrors(errors);
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(fieldName);
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters long');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
            }
            break;
        case 'subject':
            if (value.length < 5) {
                showFieldError(fieldName, 'Subject must be at least 5 characters long');
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters long');
            }
            break;
    }
}

function clearErrors(e) {
    clearFieldError(e.target.name);
}

function displayFormErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        showFieldError(fieldName, errors[fieldName]);
    });
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const fieldGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = fieldGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.9rem';
    errorElement.style.marginTop = '0.5rem';
    errorElement.textContent = message;
    
    fieldGroup.appendChild(errorElement);
    field.style.borderColor = '#ef4444';
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const fieldGroup = field.closest('.form-group');
    const errorMessage = fieldGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    field.style.borderColor = '#333333';
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #10b981, #8b5cf6);
        color: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        z-index: 3000;
        text-align: center;
        animation: slideUp 0.5s ease;
    `;
    
    successMessage.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Message Sent Successfully!</h3>
        <p>Thank you for reaching out. I'll get back to you soon.</p>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Modal functionality
function initializeModal() {
    closeModal.addEventListener('click', closeProjectModal);
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
}

function openModal(projectId) {
    const projectData = getProjectData(projectId);
    modalContent.innerHTML = createModalContent(projectData);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function getProjectData(projectId) {
    const projects = {
        project1: {
            title: 'E-Commerce Platform',
            description: 'A comprehensive e-commerce solution built with modern web technologies, featuring user authentication, product management, shopping cart functionality, and secure payment processing.',
            image: 'linear-gradient(135deg, #10b981, #8b5cf6)',
            tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Express.js'],
            features: [
                'User authentication and authorization',
                'Product catalog with advanced filtering',
                'Shopping cart and wishlist functionality',
                'Secure payment processing with Stripe',
                'Order tracking and management',
                'Admin dashboard for inventory management',
                'Responsive design for all devices',
                'Real-time notifications'
            ],
            liveLink: 'https://example-ecommerce.com',
            githubLink: 'https://github.com/johndoe/ecommerce-platform'
        },
        project2: {
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates, team collaboration features, and intuitive project organization tools.',
            image: 'linear-gradient(135deg, #06d6a0, #10b981)',
            tech: ['Vue.js', 'Socket.io', 'Firebase', 'Vuex', 'Tailwind CSS'],
            features: [
                'Real-time collaboration',
                'Drag and drop task organization',
                'Team member management',
                'Project timelines and deadlines',
                'File attachments and comments',
                'Progress tracking and analytics',
                'Mobile-responsive interface',
                'Offline functionality'
            ],
            liveLink: 'https://example-taskmanager.com',
            githubLink: 'https://github.com/johndoe/task-manager'
        },
        project3: {
            title: 'Mobile Banking App',
            description: 'A secure mobile banking application featuring biometric authentication, transaction management, and comprehensive financial tools.',
            image: 'linear-gradient(135deg, #8b5cf6, #06d6a0)',
            tech: ['React Native', 'Firebase', 'Stripe', 'Redux', 'Expo'],
            features: [
                'Biometric authentication',
                'Account balance and transaction history',
                'Money transfers and payments',
                'Bill payment functionality',
                'Investment portfolio tracking',
                'Spending analytics and budgeting',
                'Push notifications',
                'Secure encrypted data storage'
            ],
            liveLink: 'https://example-banking-app.com',
            githubLink: 'https://github.com/johndoe/mobile-banking'
        },
        project4: {
            title: 'Weather Dashboard',
            description: 'A comprehensive weather dashboard providing real-time weather data, forecasts, and location-based alerts with beautiful visualizations.',
            image: 'linear-gradient(135deg, #10b981, #06d6a0)',
            tech: ['Python', 'Django', 'OpenWeather API', 'Chart.js', 'PostgreSQL'],
            features: [
                'Real-time weather data',
                '7-day weather forecasts',
                'Location-based weather alerts',
                'Interactive weather maps',
                'Historical weather data',
                'Weather trend analysis',
                'Custom location management',
                'API integration with multiple weather services'
            ],
            liveLink: 'https://example-weather.com',
            githubLink: 'https://github.com/johndoe/weather-dashboard'
        },
        project5: {
            title: 'Portfolio Website',
            description: 'A modern, responsive portfolio website featuring dark theme, smooth animations, and interactive elements to showcase projects and skills.',
            image: 'linear-gradient(135deg, #8b5cf6, #10b981)',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Intersection Observer'],
            features: [
                'Modern dark theme design',
                'Responsive layout for all devices',
                'Smooth scroll animations',
                'Interactive project filtering',
                'Contact form with validation',
                'SEO optimized',
                'Fast loading performance',
                'Cross-browser compatibility'
            ],
            liveLink: 'https://johndoe-portfolio.com',
            githubLink: 'https://github.com/johndoe/portfolio'
        },
        project6: {
            title: 'API Gateway',
            description: 'A robust microservices API gateway with authentication, rate limiting, load balancing, and comprehensive monitoring capabilities.',
            image: 'linear-gradient(135deg, #06d6a0, #8b5cf6)',
            tech: ['Node.js', 'Express', 'Redis', 'JWT', 'Docker', 'Nginx'],
            features: [
                'API authentication and authorization',
                'Rate limiting and throttling',
                'Load balancing across services',
                'Request/response logging',
                'API versioning support',
                'Health monitoring and alerts',
                'Caching with Redis',
                'Docker containerization'
            ],
            liveLink: 'https://api-gateway-demo.com',
            githubLink: 'https://github.com/johndoe/api-gateway'
        }
    };
    
    return projects[projectId] || projects.project1;
}

function createModalContent(project) {
    return `
        <div class="modal-project">
            <div class="modal-header">
                <h2 style="color: #10b981; margin-bottom: 1rem;">${project.title}</h2>
                <div class="modal-image" style="
                    height: 300px;
                    background: ${project.image};
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 600;
                ">${project.title}</div>
            </div>
            
            <div class="modal-body">
                <p style="color: #b3b3b3; font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.8;">
                    ${project.description}
                </p>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #10b981; margin-bottom: 1rem;">Technologies Used</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${project.tech.map(tech => `
                            <span style="
                                background: #0f0f0f;
                                color: #10b981;
                                padding: 0.3rem 0.8rem;
                                border-radius: 15px;
                                font-size: 0.9rem;
                                border: 1px solid #333;
                            ">${tech}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #10b981; margin-bottom: 1rem;">Key Features</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${project.features.map(feature => `
                            <li style="
                                color: #b3b3b3;
                                margin-bottom: 0.5rem;
                                padding-left: 1.5rem;
                                position: relative;
                            ">
                                <span style="
                                    position: absolute;
                                    left: 0;
                                    color: #10b981;
                                ">✓</span>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="modal-actions" style="
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                ">
                    <a href="${project.liveLink}" target="_blank" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        background: linear-gradient(135deg, #10b981, #8b5cf6);
                        color: white;
                        padding: 0.8rem 1.5rem;
                        border-radius: 12px;
                        text-decoration: none;
                        font-weight: 600;
                        transition: transform 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'" 
                       onmouseout="this.style.transform='translateY(0)'">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                    </a>
                    <a href="${project.githubLink}" target="_blank" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        background: transparent;
                        color: #10b981;
                        border: 2px solid #10b981;
                        padding: 0.8rem 1.5rem;
                        border-radius: 12px;
                        text-decoration: none;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#10b981'; this.style.color='#0f0f0f'; this.style.transform='translateY(-2px)'" 
                       onmouseout="this.style.background='transparent'; this.style.color='#10b981'; this.style.transform='translateY(0)'">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-section, .timeline-item, .project-card, .education-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Skill tags interaction
function initializeSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Initialize scroll indicator
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    scrollToSection('about');
});

// Typing effect for hero title (optional enhancement)
function initializeTypingEffect() {
    const text = "John Doe";
    const nameElement = document.querySelector('.gradient-text');
    let index = 0;
    
    function typeText() {
        if (index < text.length) {
            nameElement.textContent = text.slice(0, index + 1);
            index++;
            setTimeout(typeText, 100);
        }
    }
    
    // Uncomment to enable typing effect
    // setTimeout(typeText, 1000);
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation to page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate skill tags on load
    setTimeout(function() {
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});

// Initialize all functionality
initializeTypingEffect();

// Export functions for global access
window.openModal = openModal;
window.scrollToSection = scrollToSection;

// Back to Top functionality
function initializeBackToTop() {
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Smooth scroll to top when button is clicked
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Keyboard accessibility
    backToTop.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}
