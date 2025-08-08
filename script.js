// Performance monitoring
const startTime = performance.now();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initLoadingScreen();
    initMobileNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initFormHandling();
    initParallaxEffects();
    initPortfolioLightbox();
    initTypingEffect();
    initCounterAnimations();
    initNavbarScroll();
    
    // Track DOM content loaded performance
    const domLoadTime = performance.now() - startTime;
    console.log(`DOM loaded in ${domLoadTime.toFixed(2)}ms`);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            name: 'dom_interactive',
            value: Math.round(domLoadTime)
        });
    }
});

// Loading Screen
function initLoadingScreen() {
    // Skip loading screen for now to avoid issues
    return;
    
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loading);

    // Hide loading screen after page loads
    const hideLoading = () => {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.remove();
            }, 500);
        }, 1000);
    };

    // Listen for window load event
    window.addEventListener('load', hideLoading);
    
    // Fallback: hide loading screen after 3 seconds regardless
    setTimeout(hideLoading, 3000);
    
    // Also hide on DOMContentLoaded as backup
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(hideLoading, 2000);
    });
}

// Mobile Navigation
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Optimized Smooth Scrolling with reduced motion support
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        // Skip social media links and other non-navigation links
        if (link.classList.contains('social-link')) {
            return;
        }
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Only proceed if href is a valid selector (starts with # and has an ID)
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    
                    // Check for reduced motion preference
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            }
        });
    });
}

// Enhanced Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animations based on element type
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.animation = 'fadeInScale 0.8s ease-out forwards';
                } else if (entry.target.classList.contains('portfolio-item')) {
                    entry.target.style.animation = 'slideInFromBottom 0.8s ease-out forwards';
                } else if (entry.target.classList.contains('stat')) {
                    entry.target.style.animation = 'bounceIn 0.8s ease-out forwards';
                } else if (entry.target.classList.contains('contact-item')) {
                    entry.target.style.animation = 'slideInDiagonal 0.8s ease-out forwards';
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .stat, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Special animations for different sections
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    
    if (aboutText && aboutImage) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === aboutText) {
                        entry.target.style.animation = 'slideInFromLeft 0.8s ease forwards';
                    } else if (entry.target === aboutImage) {
                        entry.target.style.animation = 'slideInFromRight 0.8s ease forwards';
                    }
                }
            });
        }, { threshold: 0.3 });

        aboutObserver.observe(aboutText);
        aboutObserver.observe(aboutImage);
    }

    // Enhanced section header animations
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInFromTop 0.8s ease-out forwards';
            }
        });
    }, { threshold: 0.5 });

    sectionHeaders.forEach(header => {
        headerObserver.observe(header);
    });
}

// Parallax Effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background, .glass-overlay');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Portfolio Lightbox
function initPortfolioLightbox() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            // Ensure image is loaded before opening lightbox
            const imgSrc = img.src;
            const imgElement = new Image();
            
            imgElement.onload = function() {
                console.log('Image loaded successfully:', imgSrc);
                createLightbox(imgSrc, title, description);
            };
            
            imgElement.onerror = function() {
                console.log('Image failed to load:', imgSrc);
                // Use a local fallback SVG if the original fails
                createLightbox('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMzQ5OGRiIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+Cg==', title, description);
            };
            
            // Start loading the image
            imgElement.src = imgSrc;
        });
    });
}

function createLightbox(imgSrc, title, description) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-image-container">
                <div class="lightbox-loading">
                    <div class="spinner"></div>
                    <p>Loading image...</p>
                </div>
                <img src="${imgSrc}" alt="${title}" class="lightbox-image" onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';" onerror="this.previousElementSibling.innerHTML='<p>Image not available</p>';">
            </div>
            <div class="lightbox-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="lightbox-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>2024 Project</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Professional Construction</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add enhanced lightbox styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .lightbox.visible {
            opacity: 1;
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background: white;
            border-radius: 25px;
            overflow: hidden;
            transform: scale(0.8) translateY(50px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .lightbox.visible .lightbox-content {
            transform: scale(1) translateY(0);
        }
        .lightbox-image-container {
            position: relative;
            overflow: hidden;
        }
        .lightbox-image {
            width: 100%;
            height: auto;
            max-height: 60vh;
            object-fit: cover;
            transition: transform 0.3s ease;
            display: block !important;
            background: #f8f9fa;
            position: relative;
            z-index: 1;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .lightbox-image:hover {
            transform: scale(1.05);
        }
        .lightbox-image-container {
            min-height: 300px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .lightbox-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            color: #7f8c8d;
        }
        .lightbox-loading .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e9ecef;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .lightbox-info {
            padding: 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }
        .lightbox-info h3 {
            font-size: 2rem;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .lightbox-info p {
            font-size: 1.1rem;
            color: #7f8c8d;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .lightbox-details {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        .detail-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #3498db;
            font-weight: 500;
        }
        .detail-item i {
            font-size: 1.1rem;
        }
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 25px;
            font-size: 24px;
            color: white;
            cursor: pointer;
            z-index: 10001;
            background: rgba(0, 0, 0, 0.7);
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        .lightbox-close:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.1);
        }
        @media (max-width: 768px) {
            .lightbox-content {
                max-width: 95%;
                max-height: 95%;
            }
            .lightbox-info {
                padding: 20px;
            }
            .lightbox-info h3 {
                font-size: 1.5rem;
            }
            .lightbox-details {
                flex-direction: column;
                gap: 10px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(lightbox);
    
    // Show lightbox
    setTimeout(() => {
        lightbox.classList.add('visible');
    }, 10);
    
    // Close lightbox
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('visible');
        setTimeout(() => {
            lightbox.remove();
        }, 300);
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.remove();
            }, 300);
        }
    });
}

// Typing Effect
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const titleLines = heroTitle.querySelectorAll('.title-line');
    let currentLine = 0;
    
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // Start typing effect after initial animations
    setTimeout(() => {
        titleLines.forEach((line, index) => {
            setTimeout(() => {
                const originalText = line.textContent;
                typeWriter(line, originalText, 80);
            }, index * 1000);
        });
    }, 2000);
}

// Counter Animations
function initCounterAnimations() {
    const stats = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                const duration = 2000;
                const increment = finalValue / (duration / 16);
                let currentValue = 0;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue + (target.textContent.includes('+') ? '+' : '');
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(currentValue) + (target.textContent.includes('+') ? '+' : '');
                    }
                }, 16);
                
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        counterObserver.observe(stat);
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when scrolling down
        if (scrollTop > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Dynamic transparency based on scroll position
        const maxScroll = 200;
        const scrollProgress = Math.min(scrollTop / maxScroll, 1);
        
        // Update navbar background opacity dynamically
        const baseOpacity = 0.05;
        const scrolledOpacity = 0.15;
        const currentOpacity = baseOpacity + (scrolledOpacity - baseOpacity) * scrollProgress;
        
        navbar.style.background = `rgba(255, 255, 255, ${currentOpacity})`;
        
        // Update blur effect
        const baseBlur = 20;
        const scrolledBlur = 30;
        const currentBlur = baseBlur + (scrolledBlur - baseBlur) * scrollProgress;
        
        navbar.style.backdropFilter = `blur(${currentBlur}px)`;
        navbar.style.webkitBackdropFilter = `blur(${currentBlur}px)`;
        
        lastScrollTop = scrollTop;
    });
}

// Form Handling
function initFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Enhanced validation for all form fields - only on submit
        const requiredFields = ['name', 'email', 'service', 'message'];
        let isValid = true;
        
        // Clear any existing errors first
        this.querySelectorAll('.error-message').forEach(error => error.remove());
        
        // Validate required fields
        requiredFields.forEach(field => {
            const input = this.querySelector(`[name="${field}"]`);
            if (!input || !input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            } else {
                clearError(input);
            }
        });
        
        // Email validation
        const emailField = this.querySelector('[name="email"]');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
            isValid = false;
            showError(emailField, 'Please enter a valid email address');
        }
        
        // Phone validation (optional but if provided, validate format)
        const phoneField = this.querySelector('[name="phone"]');
        const countrySelect = this.querySelector('[name="countryCode"]');
        const countryCode = countrySelect ? countrySelect.value : '+233';
        
        if (phoneField && phoneField.value.trim() && !isValidPhone(phoneField.value.trim(), countryCode)) {
            isValid = false;
            const selectedOption = countrySelect ? countrySelect.options[countrySelect.selectedIndex] : null;
            const placeholder = selectedOption ? selectedOption.getAttribute('data-placeholder') : '0257679050';
            showError(phoneField, `Please enter a valid phone number (e.g., ${placeholder})`);
        }
        
        if (isValid) {
            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Collect form data properly
            const formData = {
                name: this.querySelector('[name="name"]').value.trim(),
                email: this.querySelector('[name="email"]').value.trim(),
                phone: this.querySelector('[name="phone"]').value.trim(),
                service: this.querySelector('[name="service"]').value,
                message: this.querySelector('[name="message"]').value.trim()
            };
            
            console.log('Form Data Collected:', formData);
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Show success message
                showSuccessMessage();
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
    
    // Real-time validation with enhanced phone handling
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearError(this);
            
            // Special handling for phone field
            if (this.name === 'phone') {
                // Only allow numbers for Ghanaian phone numbers
                const value = this.value;
                const cleanedValue = value.replace(/[^\d]/g, '');
                
                if (value !== cleanedValue) {
                    this.value = cleanedValue;
                }
            }
            
            // Special handling for name field
            if (this.name === 'name') {
                // Only allow letters, spaces, hyphens, apostrophes, and dots
                const value = this.value;
                const cleanedValue = value.replace(/[^a-zA-Z\s\-'\.]/g, '');
                
                if (value !== cleanedValue) {
                    this.value = cleanedValue;
                }
            }
        });
        
        // Add focus effects only
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
    
    // Country selector change handler
    const countrySelect = form.querySelector('[name="countryCode"]');
    const phoneField = form.querySelector('[name="phone"]');
    
    if (countrySelect && phoneField) {
        countrySelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const placeholder = selectedOption.getAttribute('data-placeholder');
            const pattern = selectedOption.getAttribute('data-pattern');
            
            // Update phone field placeholder and pattern
            phoneField.placeholder = placeholder;
            phoneField.pattern = pattern;
            
            // Clear any existing errors
            clearError(phoneField);
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    
    // Skip validation for optional phone field if empty
    if (field.name === 'phone' && !value) {
        clearError(field);
        return true;
    }
    
    // Only show errors for required fields that are empty
    if (!value && ['name', 'email', 'service', 'message'].includes(field.name)) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Name validation - only letters, spaces, hyphens, apostrophes, and dots
    if (field.name === 'name' && value && !isValidName(value)) {
        showError(field, 'Please enter a valid name (letters, spaces, hyphens, apostrophes only)');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.name === 'phone' && value && !isValidPhone(value)) {
        showError(field, 'Please enter a valid phone number (e.g., +1 (123) 456-7890)');
        return false;
    }
    
    clearError(field);
    return true;
}

function isValidName(name) {
    // Allow letters, spaces, hyphens, apostrophes, and dots (for names like "Mary-Jane O'Connor Jr.")
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
}

function isValidEmail(email) {
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
}

function isValidPhone(phone, countryCode = '+233') {
    // Remove all non-numeric characters
    const cleanedPhone = phone.replace(/[^\d]/g, '');
    
    // Check if it contains only numbers
    if (phone !== cleanedPhone) {
        return false;
    }
    
    // Country-specific validation
    switch (countryCode) {
        case '+233': // Ghana
            return cleanedPhone.length === 10 && cleanedPhone.startsWith('0');
        case '+234': // Nigeria
            return cleanedPhone.length === 11 && (cleanedPhone.startsWith('0') || cleanedPhone.startsWith('234'));
        case '+254': // Kenya
            return cleanedPhone.length === 9 && cleanedPhone.startsWith('7');
        case '+27': // South Africa
            return cleanedPhone.length === 9 && (cleanedPhone.startsWith('0') || cleanedPhone.startsWith('27'));
        case '+1': // USA/Canada
            return cleanedPhone.length === 10;
        case '+44': // UK
            return cleanedPhone.length === 11 && cleanedPhone.startsWith('0');
        case '+91': // India
            return cleanedPhone.length === 10 && (cleanedPhone.startsWith('6') || cleanedPhone.startsWith('7') || cleanedPhone.startsWith('8') || cleanedPhone.startsWith('9'));
        case '+86': // China
            return cleanedPhone.length === 11 && cleanedPhone.startsWith('1');
        case '+81': // Japan
            return cleanedPhone.length === 10 && cleanedPhone.startsWith('0');
        case '+49': // Germany
            return cleanedPhone.length === 11 && (cleanedPhone.startsWith('0') || cleanedPhone.startsWith('49'));
        default:
            return cleanedPhone.length >= 10 && cleanedPhone.length <= 15;
    }
}

function showError(field, message) {
    clearError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
}

function clearError(field) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = 'rgba(52, 152, 219, 0.2)';
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            width: 90%;
        ">
            <div style="
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #1877f2, #0d6efd);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                animation: elegantSlideIn 0.6s ease-out;
            ">
                <i class="fas fa-check" style="color: white; font-size: 24px;"></i>
            </div>
            <h3 style="
                color: #2c3e50;
                margin-bottom: 10px;
                font-size: 1.5rem;
                animation: elegantFadeIn 0.8s ease-out 0.2s both;
            ">Message Sent Successfully!</h3>
            <p style="
                color: #7f8c8d;
                margin-bottom: 20px;
                line-height: 1.6;
                animation: elegantFadeIn 0.8s ease-out 0.4s both;
            ">Thank you for contacting Amenuveve. We'll get back to you within 24 hours.</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: linear-gradient(135deg, #1877f2, #0d6efd);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                animation: elegantSlideIn 0.8s ease-out 0.6s both;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);


}

// Additional CSS for animations
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Service Worker for PWA capabilities (commented out until sw.js is created)
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/

// Enhanced Dropdown Animations
function initDropdownAnimations() {
    const selectElements = document.querySelectorAll('select');
    
    selectElements.forEach(select => {
        // Focus effects - match other form fields
        select.addEventListener('focus', function() {
            this.style.borderColor = '#1877f2';
            this.style.borderWidth = '2px';
            this.style.boxShadow = '0 0 0 3px rgba(24, 119, 242, 0.1)';
            this.style.background = 'rgba(255, 255, 255, 0.15)';
            this.style.backdropFilter = 'blur(20px)';
            this.style.webkitBackdropFilter = 'blur(20px)';
        });
        
        // Remove effect when dropdown closes
        select.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.borderWidth = '';
            this.style.boxShadow = '';
            this.style.background = 'rgba(255, 255, 255, 0.15)';
            this.style.backdropFilter = 'blur(20px)';
            this.style.webkitBackdropFilter = 'blur(20px)';
        });
        
        // Change animation
        select.addEventListener('change', function() {
            this.style.borderColor = '#1877f2';
            this.style.borderWidth = '2px';
            this.style.boxShadow = '0 0 0 3px rgba(24, 119, 242, 0.1)';
            setTimeout(() => {
                this.style.borderColor = '';
                this.style.borderWidth = '';
                this.style.boxShadow = '';
            }, 300);
        });
        
        // Hover effects - match other form fields
        select.addEventListener('mouseenter', function() {
            if (document.activeElement !== this) {
                this.style.borderColor = 'rgba(52, 152, 219, 0.5)';
            }
        });
        
        select.addEventListener('mouseleave', function() {
            if (document.activeElement !== this) {
                this.style.borderColor = '';
            }
        });
    });
}

// Contact Information Click Handlers
function initContactHandlers() {
    // Phone click handler
    const phoneElements = document.querySelectorAll('[onclick*="tel:"]');
    phoneElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                window.open('tel:+15551234567');
            }, 150);
        });
    });

    // Email click handler
    const emailElements = document.querySelectorAll('[onclick*="mailto:"]');
    emailElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                window.open('mailto:info@amenuveve.com?subject=Inquiry from Amenuveve Website&body=Hello, I would like to discuss a construction project with you.');
            }, 150);
        });
    });

    // Location click handler
    const locationElements = document.querySelectorAll('[onclick*="maps.google.com"]');
    locationElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                window.open('https://maps.google.com/?q=123+Construction+Ave+Building+District');
            }, 150);
        });
    });
}

// Performance optimization and tracking
window.addEventListener('load', () => {
    // Track page load performance
    const loadTime = performance.now() - startTime;
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            name: 'load',
            value: Math.round(loadTime)
        });
        
        // Track user engagement
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Initialize contact handlers
    initContactHandlers();
    
    // Initialize dropdown animations
    initDropdownAnimations();
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (typeof gtag !== 'undefined' && maxScroll % 25 === 0) {
                gtag('event', 'scroll_depth', {
                    scroll_percentage: maxScroll
                });
            }
        }
    });
});

// Image loading optimization
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // Show image when loaded
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.classList.add('loaded');
        });
        
        // Handle error with fallback
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // The onerror attribute in HTML will handle the fallback
            this.style.opacity = '1'; // Show fallback image
        });
        
        // If image is already cached, show it immediately
        if (img.complete) {
            img.style.opacity = '1';
            img.classList.add('loaded');
        }
    });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', function() {
    initImageLoading();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.remove();
            }, 300);
        }
    }
}); 