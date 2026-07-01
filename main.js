document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CURSOR PERSONALIZADO ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const magneticItems = document.querySelectorAll('.magnetic-item, a, button, .ig-post, .proyecto-card');

    if (window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });
    }

    // --- 2. FÍSICA MAGNÉTICA PARA BOTONES ---
    magneticItems.forEach(item => {
        item.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
            item.style.transform = `translate(0px, 0px)`;
        });

        if(item.tagName === 'A' || item.tagName === 'BUTTON' || item.classList.contains('magnetic-item')) {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 4;
                item.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
                item.style.transition = 'transform 0.1s ease-out';
            });
        }
    });

    // --- 3. SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 4. LÓGICA DEL CARRUSEL 3D (PROYECTOS) ---
    const cards = document.querySelectorAll('.proyecto-card');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const dots = document.querySelectorAll('.carousel-indicators .dot');
    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next', 'hidden');
            
            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                card.classList.add('prev');
            } else if (index === (currentIndex + 1) % cards.length) {
                card.classList.add('next');
            } else {
                card.classList.add('hidden');
            }
        });

        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    if(btnNext && btnPrev) {
        btnNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });
        
        btnPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    updateCarousel();

    // --- 5. LÓGICA DEL SLIDER DIAGONAL AUTOMÁTICO (HERO) ---
    const slides = document.querySelectorAll('.hero-slide');
    if(slides.length > 0) {
        let currentHeroSlide = 0;
        
        function nextHeroSlide() {
            slides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % slides.length;
            slides[currentHeroSlide].classList.add('active');
        }

        setInterval(nextHeroSlide, 4000); // Cambia imagen cada 4 segundos
    }
});