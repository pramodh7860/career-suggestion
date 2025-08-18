// Privacy Policy Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    initializeScrollEffects();
});

// Initialize page animations
function initializeAnimations() {
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// Add click handlers for action buttons
document.addEventListener('DOMContentLoaded', function() {
    const actionButtons = document.querySelectorAll('.action-buttons .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .glass-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .glass-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
`;
document.head.appendChild(rippleStyle);

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
addScrollProgress();

// Add table of contents functionality
function addTableOfContents() {
    const headings = document.querySelectorAll('.privacy-content h2');
    if (headings.length > 0) {
        const toc = document.createElement('div');
        toc.className = 'table-of-contents glass-card';
        toc.innerHTML = `
            <h3>Table of Contents</h3>
            <ul>
                ${Array.from(headings).map((heading, index) => {
                    const id = `section-${index + 1}`;
                    heading.id = id;
                    return `<li><a href="#${id}">${heading.textContent}</a></li>`;
                }).join('')}
            </ul>
        `;
        
        // Insert after privacy header
        const privacyHeader = document.querySelector('.privacy-header');
        privacyHeader.parentNode.insertBefore(toc, privacyHeader.nextSibling);
        
        // Add styles for table of contents
        const tocStyle = document.createElement('style');
        tocStyle.textContent = `
            .table-of-contents {
                margin-bottom: 2rem;
                padding: 2rem;
            }
            
            .table-of-contents h3 {
                margin-bottom: 1rem;
                color: var(--primary-color);
            }
            
            .table-of-contents ul {
                list-style: none;
                padding: 0;
            }
            
            .table-of-contents li {
                margin-bottom: 0.5rem;
            }
            
            .table-of-contents a {
                color: var(--text-color);
                text-decoration: none;
                transition: color 0.3s ease;
            }
            
            .table-of-contents a:hover {
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(tocStyle);
    }
}

// Initialize table of contents
addTableOfContents(); 