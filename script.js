/* ========================================
   PREMIUM PORTFOLIO - INTERACTIVE JAVASCRIPT
   ======================================== */

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initParticles();
    initNavigation();
    initScrollEffects();
    initCounters();
    initTypingAnimation();
    initFormHandler();
    initBackToTop();
});

// ========== LOADING SCREEN ==========

function initLoading() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.classList.add('hidden');
        }, 500);
    });
}

// ========== PARTICLE CANVAS ==========

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationId;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? 'rgba(37, 99, 235' : 'rgba(56, 189, 248';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary wrapping
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `${this.color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        particles.length = 0;
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(37, 99, 235, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawLines();
        animationId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);
}

// ========== NAVIGATION ==========

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    // Active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.style.display = 
            navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.style.display = 'none';
        });
    });
}

// ========== SCROLL EFFECTS ==========

function initScrollEffects() {
    // Scroll progress bar
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        document.getElementById('scrollProgress').style.width = scrolled + '%';
    });

    // Fade in on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category, .project-card, .blog-card, .experience-card').forEach(el => {
        observer.observe(el);
    });
}

// ========== COUNTER ANIMATION ==========

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const runCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const increment = target / speed;
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                el.textContent = Math.ceil(current);
                setTimeout(updateCount, 10);
            } else {
                el.textContent = target;
            }
        };

        updateCount();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// ========== TYPING ANIMATION ==========

function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-animation');
    const texts = [
        'Intelligent Solutions',
        'Machine Learning Models',
        'Data-Driven Systems',
        'Smart Automation'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingElement.textContent = currentText.substring(0, charIndex);

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            textIndex = (textIndex + 1) % texts.length;
            isDeleting = false;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
}

// ========== FORM HANDLER ==========

function initFormHandler() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }

    // In a real app, this would send to a backend
    console.log('Form Data:', { name, email, subject, message });

    // Show success message
    const btn = document.querySelector('.contact-form .btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'MESSAGE SENT! ✓';
    btn.style.background = 'var(--color-secondary)';

    // Reset form
    document.getElementById('contactForm').reset();

    // Restore button
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'var(--color-primary)';
    }, 3000);
}

// ========== BACK TO TOP BUTTON ==========

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========== UTILITY FUNCTIONS ==========

function downloadResume() {
    // In a real app, this would download the actual resume
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'Shubham_Kumar_Labh_Resume.pdf';
    alert('Resume download would be triggered. Replace with actual resume URL.');
}

// ========== SMOOTH SCROLL BEHAVIOR ==========

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

// ========== PREVENT LAYOUT SHIFT ==========

window.addEventListener('load', () => {
    document.body.style.overflow = 'auto';
});

// ========== PERFORMANCE: Lazy Load Images ==========

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
}
