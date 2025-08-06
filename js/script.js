// Theme Toggle Functionality
class ThemeManager {
  constructor() {
    this.themeToggle = document.querySelector('.theme-toggle');
    this.body = document.body;
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.bindEvents();
  }

  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    this.body.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (this.themeToggle) {
      this.themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}

// Mobile Menu Manager
class MobileMenuManager {
  constructor() {
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateToggleIcon();
  }

  bindEvents() {
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('.nav-container')) {
        this.closeMenu();
      }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.navMenu?.classList.add('mobile-open');
    this.updateToggleIcon();
  }

  closeMenu() {
    this.isOpen = false;
    this.navMenu?.classList.remove('mobile-open');
    this.updateToggleIcon();
  }

  updateToggleIcon() {
    if (this.mobileToggle) {
      this.mobileToggle.innerHTML = this.isOpen ? '✕' : '☰';
    }
  }
}

// Form Handler
class FormHandler {
  constructor() {
    this.contactForm = document.querySelector('#contact-form');
    this.newsletterForm = document.querySelector('#newsletter-form');
    
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    if (this.newsletterForm) {
      this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
    }
  }

  async handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.contactForm);
    const data = Object.fromEntries(formData);
    
    try {
      this.setFormLoading(this.contactForm, true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form data:', data);
      this.showNotification('Thank you! Your message has been sent successfully.', 'success');
      this.contactForm.reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      this.setFormLoading(this.contactForm, false);
    }
  }

  async handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.newsletterForm);
    const email = formData.get('email');
    
    if (!this.isValidEmail(email)) {
      this.showNotification('Please enter a valid email address.', 'error');
      return;
    }

    try {
      this.setFormLoading(this.newsletterForm, true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Newsletter subscription:', email);
      this.showNotification('Thank you for subscribing to our newsletter!', 'success');
      this.newsletterForm.reset();
      
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      this.showNotification('Sorry, there was an error. Please try again.', 'error');
    } finally {
      this.setFormLoading(this.newsletterForm, false);
    }
  }

  setFormLoading(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = isLoading;
      submitButton.textContent = isLoading ? 'Sending...' : submitButton.dataset.originalText || 'Send';
      
      if (!submitButton.dataset.originalText) {
        submitButton.dataset.originalText = submitButton.textContent;
      }
    }
    
    form.classList.toggle('loading', isLoading);
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 100px;
          right: 20px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 300px;
          animation: slideIn 0.3s ease;
        }
        
        .notification-success {
          border-left: 4px solid #28a745;
          color: #155724;
          background: #d4edda;
        }
        
        .notification-error {
          border-left: 4px solid #dc3545;
          color: #721c24;
          background: #f8d7da;
        }
        
        .notification-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .notification-close:hover {
          opacity: 1;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Scroll Effects Manager
class ScrollEffectsManager {
  constructor() {
    this.header = document.querySelector('.header');
    this.lastScrollY = window.scrollY;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll(); // Initial call
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Header background opacity based on scroll
    if (this.header) {
      if (currentScrollY > 50) {
        this.header.style.background = 'rgba(255, 255, 255, 0.95)';
        this.header.style.backdropFilter = 'blur(10px)';
      } else {
        this.header.style.background = 'var(--primary-white)';
        this.header.style.backdropFilter = 'none';
      }
    }

    // Fade in elements on scroll
    this.animateOnScroll();
    
    this.lastScrollY = currentScrollY;
  }

  animateOnScroll() {
    const elements = document.querySelectorAll('.fade-on-scroll');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('fade-in');
      }
    });
  }
}

// Stats Counter Animation
class StatsCounter {
  constructor() {
    this.counters = document.querySelectorAll('.counter');
    this.hasAnimated = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.checkPosition());
  }

  checkPosition() {
    if (this.hasAnimated) return;

    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      this.animateCounters();
      this.hasAnimated = true;
    }
  }

  animateCounters() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const increment = target / 200;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 10);
    });
  }
}

// Portfolio Filter Manager
class PortfolioFilterManager {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.portfolioItems = document.querySelectorAll('.portfolio-item');
    
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleFilterClick(e));
    });
  }

  handleFilterClick(e) {
    const filterValue = e.target.getAttribute('data-filter');
    
    // Update active button
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter portfolio items
    this.filterItems(filterValue);
  }

  filterItems(filter) {
    this.portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        item.style.display = 'block';
        // Add animation
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  new ThemeManager();
  new MobileMenuManager();
  new FormHandler();
  new ScrollEffectsManager();
  new StatsCounter();
  new PortfolioFilterManager();

  // Set active navigation link
  setActiveNavLink();
  
  // Add fade-on-scroll class to sections
  addFadeOnScrollClasses();
});

// Utility Functions
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function addFadeOnScrollClasses() {
  const sections = document.querySelectorAll('.section, .service-card, .testimonial-card, .stat-item');
  sections.forEach(section => {
    section.classList.add('fade-on-scroll');
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Service worker registration for PWA (optional)
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