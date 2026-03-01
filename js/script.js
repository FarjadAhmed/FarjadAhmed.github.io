/* ============================================
   FARJAD AHMED — PORTFOLIO JS
   Particles, typing effect, scroll animations
   ============================================ */

// --- Particle Network Background ---
(function () {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.01;
                    this.y -= dy * force * 0.01;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(20, 184, 166, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const count = Math.min((canvas.width * canvas.height) / 12000, 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        init();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    resize();
    init();
    animate();
})();


// --- Typing Effect ---
(function () {
    const phrases = [
        'Bayesian MMM models.',
        'production ML systems.',
        'transformer architectures.',
        'data-driven attribution.',
        'hierarchical models.',
        'marketing intelligence.'
    ];
    const typedEl = document.getElementById('typed-text');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 300;
        }

        setTimeout(type, speed);
    }

    // Start after a short delay
    setTimeout(type, 1000);
})();


// --- Load Projects from Config ---
(function () {
    function createCard(project, featured) {
        const card = document.createElement('a');
        card.href = project.github;
        card.target = '_blank';
        card.className = featured ? 'project-card project-card-featured reveal' : 'project-card reveal';

        let linksHtml = `<span class="project-link"><i class="fa-brands fa-github"></i></span>`;
        if (project.live) {
            linksHtml += `<span class="project-link"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>`;
        }

        card.innerHTML = `
            <div class="project-card-header">
                <i class="fa-solid fa-folder-open project-icon"></i>
                <div class="project-header-links">${linksHtml}</div>
            </div>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="project-tags">${project.tags.map(t => `<span>${t}</span>`).join('')}</div>
        `;
        return card;
    }

    fetch('projects.json')
        .then(res => res.json())
        .then(data => {
            const featuredGrid = document.getElementById('featured-projects');
            const moreGrid = document.getElementById('more-projects');

            data.featured.filter(p => !p.hidden).forEach(p => featuredGrid.appendChild(createCard(p, true)));
            data.more.filter(p => !p.hidden).forEach(p => moreGrid.appendChild(createCard(p, false)));

            // Re-observe newly added cards for scroll reveal
            initScrollReveal();
        });
})();


// --- Scroll Reveal ---
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.observed)');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => {
        el.classList.add('observed');
        observer.observe(el);
    });
}
initScrollReveal();


// --- Animated Counters ---
(function () {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                started = true;
                animateCounters();
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }
})();


// --- Navbar Scroll Effect ---
(function () {
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--accent-blue)';
            }
        });
    });
})();


// --- Mobile Menu Toggle ---
(function () {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    // Close menu on link click
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
})();


// --- Resume Modal ---
(function () {
    const btn = document.getElementById('resume-btn');
    const overlay = document.getElementById('resume-modal');
    const closeBtn = document.getElementById('modal-close');
    const form = document.getElementById('resume-form');
    const success = document.getElementById('modal-success');

    btn.addEventListener('click', () => overlay.classList.add('active'));

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        form.style.display = '';
        success.style.display = 'none';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            form.style.display = '';
            success.style.display = 'none';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        try {
            await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            form.style.display = 'none';
            success.style.display = '';
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Request Resume';
        }
    });
})();


// --- Smooth Scroll for anchor links ---
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();
