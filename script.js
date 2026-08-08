// DOM Elements
const header = document.querySelector('header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
const fadeElements = document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-scale');
const magneticBtn = document.querySelector('.magnetic-btn');
const parallaxAssets = document.querySelectorAll('.parallax-element');
const interactiveMascot = document.querySelector('.interactive-mascot');

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// INITIAL SCROLL LOGIC: Snap to Servicos once, then free scroll
let hasSnapedFirst = false;
window.addEventListener('wheel', (e) => {
    // Se o usuario der scroll down, e estiver no hero (scroll Y quase 0)
    if (!hasSnapedFirst && window.scrollY < 50 && e.deltaY > 0) {
        e.preventDefault();
        hasSnapedFirst = true;
        document.body.classList.remove('scroll-locked-initial');
        
        const nextSection = document.getElementById('servicos').offsetTop;
        window.scrollTo({
            top: nextSection - 80, // offset header
            behavior: 'smooth'
        });
    } else if (window.scrollY > 100) {
        // Fallback in case they bypass
        hasSnapedFirst = true;
        document.body.classList.remove('scroll-locked-initial');
    }
}, { passive: false });

// For touch devices (mobile)
let startY = 0;
window.addEventListener('touchstart', e => startY = e.touches[0].clientY);
window.addEventListener('touchmove', e => {
    let currentY = e.touches[0].clientY;
    if (!hasSnapedFirst && window.scrollY < 50 && (startY - currentY) > 20) {
        e.preventDefault();
        hasSnapedFirst = true;
        document.body.classList.remove('scroll-locked-initial');
        const nextSection = document.getElementById('servicos').offsetTop;
        window.scrollTo({ top: nextSection - 80, behavior: 'smooth' });
    }
}, { passive: false });


// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = mobileMenuBtn.querySelectorAll('span');
    
    if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Scroll Reveal Animations
const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, revealOptions);

fadeElements.forEach(el => revealOnScroll.observe(el));

// Active Menu Link on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.desktop-nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});


// ==================== PREMIUM INTERACTIONS ====================

// Mouse Tracking Variables
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = mouseX;
let targetY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth Lerp for Parallax globais e Mascote
function lerp() {
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;
    
    // Global Parallax
    const xOffset = (targetX / window.innerWidth - 0.5) * 30;
    const yOffset = (targetY / window.innerHeight - 0.5) * 30;
    parallaxAssets.forEach(asset => {
        asset.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
    
    // Interactive Mascot Parallax (Very subtle)
    if(interactiveMascot && window.scrollY < window.innerHeight) {
        const mascX = (targetX / window.innerWidth - 0.5) * 15; // Max 15px
        const mascY = (targetY / window.innerHeight - 0.5) * 15;
        // The scale(1.02) is applied via hover directly in JS below, we just preserve it
        const currentTransform = interactiveMascot.style.transform;
        const isHovered = currentTransform.includes('scale(1.02)');
        
        interactiveMascot.style.transform = `translate(${mascX}px, ${mascY}px) rotateY(${mascX * 0.2}deg) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`;
    }
    
    requestAnimationFrame(lerp);
}
requestAnimationFrame(lerp);

// Mascot Hover
if(interactiveMascot && window.innerWidth > 1024) {
    interactiveMascot.addEventListener('mouseenter', () => {
        interactiveMascot.style.transform += ' scale(1.02)';
    });
    interactiveMascot.addEventListener('mouseleave', () => {
        interactiveMascot.style.transform = interactiveMascot.style.transform.replace(' scale(1.02)', '');
    });
}

// Magnetic Button General
if (magneticBtn && window.innerWidth > 1024) {
    magneticBtn.addEventListener('mousemove', (e) => {
        const rect = magneticBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        magneticBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    magneticBtn.addEventListener('mouseleave', () => {
        // Remove custom transform and let CSS hover take over
        magneticBtn.style.transform = '';
    });
}

// ----------------------------------------------------------------
// CONTATO - Experiência 3D "Da Ideia ao Digital"
// ----------------------------------------------------------------
const contactSection = document.querySelector('#contato');
const digitalPaperWrapper = document.querySelector('.digital-paper-wrapper');
const contactGlow = document.querySelector('.contact-cursor-glow');
const contactScene = document.querySelector('.contact-3d-scene');

if (contactSection && digitalPaperWrapper && window.innerWidth > 1024) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Limits
    const rotateLimit = 3; // graus máximos de rotação aditiva (além dos originais)
    const moveLimit = 10;  // pixels de parallax translacional

    contactSection.addEventListener('mousemove', (e) => {
        contactScene.classList.add('active-glow');
        
        const rect = contactSection.getBoundingClientRect();
        // Normaliza de -1 a 1
        targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        // Move the soft glow directly
        if (contactGlow) {
            contactGlow.style.left = `${e.clientX - rect.left}px`;
            contactGlow.style.top = `${e.clientY - rect.top}px`;
        }
    });

    contactSection.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        contactScene.classList.remove('active-glow');
    });

    function animateContact3D() {
        // Lerp factor
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        // Rotação subtil adicionada
        const rotY = currentX * rotateLimit;
        const rotX = -currentY * rotateLimit; // Inverte Y para rotação natural
        
        // Translacao sutil
        const transX = currentX * -moveLimit;
        const transY = currentY * -moveLimit;

        // O wrapper recebe a variação iterativa, enquanto a base tem suas rotações no CSS
        digitalPaperWrapper.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateX(${transX}px) translateY(${transY}px)`;
        
        requestAnimationFrame(animateContact3D);
    }
    
    animateContact3D();
}

// ----------------------------------------------------------------
// SOLUÇÕES - Iluminação Ambiente Interativa
// ----------------------------------------------------------------
const solucoesSection = document.querySelector('#solucoes');
const solucoesGlow = document.querySelector('.solucoes-cursor-glow');

if (solucoesSection && solucoesGlow && window.matchMedia("(hover: hover)").matches) {
    let mouseX = solucoesSection.offsetWidth / 2;
    let mouseY = solucoesSection.offsetHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let rafId = null;
    let isHovering = false;

    function animateSolucoesGlow() {
        if (!isHovering) return;
        
        // Lerp Cursor Glow
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;
        
        solucoesGlow.style.left = `${mouseX}px`;
        solucoesGlow.style.top = `${mouseY}px`;

        rafId = requestAnimationFrame(animateSolucoesGlow);
    }

    solucoesSection.addEventListener('mousemove', (e) => {
        solucoesSection.classList.add('active-glow');
        const rect = solucoesSection.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
    });

    solucoesSection.addEventListener('mouseenter', () => {
        isHovering = true;
        animateSolucoesGlow();
    });

    solucoesSection.addEventListener('mouseleave', () => {
        isHovering = false;
        solucoesSection.classList.remove('active-glow');
        cancelAnimationFrame(rafId);
    });
}

// ----------------------------------------------------------------
// SERVIÇOS - Interações 3D e Iluminação
// ----------------------------------------------------------------
const servicosSection = document.querySelector('#servicos');
const servicosGlow = document.querySelector('.srv-cursor-glow');
const parallaxBgs = document.querySelectorAll('.srv-parallax-bg');
const bentoImages = document.querySelectorAll('.srv-img-wrapper .bento-img');

if (servicosSection && window.innerWidth > 1024) {
    let mouseX = 0, mouseY = 0;
    
    servicosSection.addEventListener('mousemove', (e) => {
        servicosSection.classList.add('active-glow');
        const rect = servicosSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        if (servicosGlow) {
            servicosGlow.style.left = `${mouseX}px`;
            servicosGlow.style.top = `${mouseY}px`;
        }
        
        // Parallax BGs (movimento muito sutil)
        parallaxBgs.forEach(bg => {
            const speed = parseFloat(bg.getAttribute('data-speed')) || 0;
            const x = (window.innerWidth / 2 - e.clientX) * speed;
            const y = (window.innerHeight / 2 - e.clientY) * speed;
            // Combina com a animação CSS adicionando o translate via variável ou inline
            bg.style.marginLeft = `${x}px`;
            bg.style.marginTop = `${y}px`;
        });
    });

    servicosSection.addEventListener('mouseleave', () => {
        servicosSection.classList.remove('active-glow');
        parallaxBgs.forEach(bg => {
            bg.style.marginLeft = `0px`;
            bg.style.marginTop = `0px`;
        });
    });
}

// Lerp 3D nas imagens dos Serviços
bentoImages.forEach(img => {
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let isHovering = false;
    let rafId = null;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
        if (!isHovering) return;
        currentX = lerp(currentX, targetX, 0.1);
        currentY = lerp(currentY, targetY, 0.1);

        img.style.transform = `scale(1.06) translateY(-5px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
        img.style.boxShadow = `0 15px 30px rgba(0,0,0,0.8), 0 0 25px rgba(255,122,0,0.15)`;
        
        rafId = requestAnimationFrame(animate);
    };

    if (window.innerWidth > 1024) {
        img.parentElement.addEventListener('mousemove', (e) => {
            const rect = img.parentElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // rotateY: esquerda-direita (-4 a 4)
            targetX = ((x - centerX) / centerX) * 4;
            // rotateX: cima-baixo (invertido, -3 a 3)
            targetY = -((y - centerY) / centerY) * 3; 
        });

        img.parentElement.addEventListener('mouseenter', () => {
            isHovering = true;
            img.classList.add('is-hovering');
            animate();
        });

        img.parentElement.addEventListener('mouseleave', () => {
            isHovering = false;
            cancelAnimationFrame(rafId);
            img.classList.remove('is-hovering');
            img.style.transform = '';
            img.style.boxShadow = '';
            targetX = 0;
            targetY = 0;
            currentX = 0;
            currentY = 0;
        });
    }
});
