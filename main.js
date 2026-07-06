document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CURSOR PERSONALIZADO ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const magneticItems = document.querySelectorAll('.magnetic-item, a, button, .ig-post, .proyecto-card');

    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
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

    // --- 2. FÍSICA MAGNÉTICA ---
    magneticItems.forEach(item => {
        item.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
            item.style.transform = `translate(0px, 0px) scale(${item.classList.contains('active') ? 1 : ''})`; 
        });

        if(item.tagName === 'A' || item.tagName === 'BUTTON' || item.classList.contains('magnetic-item')) {
            item.addEventListener('mousemove', (e) => {
                if(item.classList.contains('proyecto-card')) return; 

                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 5;
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

    // --- 4. HERO SLIDER ---
    const slides = document.querySelectorAll('.hero-slide');
    if(slides.length > 0) {
        let currentHeroSlide = 0;
        function nextHeroSlide() {
            slides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % slides.length;
            slides[currentHeroSlide].classList.add('active');
        }
        setInterval(nextHeroSlide, 4500);
    }

    // --- 5. MENÚ MÓVIL DESPLEGABLE LÓGICO ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    if(mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
                dropdowns.forEach(drop => drop.classList.remove('open'));
            }
        });

        dropdowns.forEach(dropdown => {
            const toggleBtn = dropdown.querySelector('.dropdown-toggle');
            toggleBtn.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); 
                    
                    dropdowns.forEach(other => {
                        if(other !== dropdown) other.classList.remove('open');
                    });
                    
                    dropdown.classList.toggle('open');
                }
            });
        });

        const normalLinks = document.querySelectorAll('.menu-principal > li:not(.dropdown) > a, .submenu a');
        normalLinks.forEach(link => {
            link.addEventListener('click', () => {
                if(window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    mobileToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
                    dropdowns.forEach(drop => drop.classList.remove('open'));
                }
            });
        });
    }

    // --- 6. SISTEMA DE PARTÍCULAS ---
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 20;

    if (particlesContainer && window.innerWidth > 768) {
        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 1; 
        const posX = Math.random() * 100; 
        const duration = Math.random() * 15 + 10; 
        const delay = Math.random() * 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesContainer.appendChild(particle);
    }

    // --- 7. LÓGICA DEL CARRUSEL 3D (Z-INDEX DINÁMICO MEJORADO + SWIPE) ---
    const track = document.querySelector('.carousel-track');
    if(track) {
        const cards = Array.from(track.querySelectorAll('.proyecto-card'));
        const prevBtn = document.querySelector('.prev-carousel');
        const nextBtn = document.querySelector('.next-carousel');
        
        let currentIndex = Math.floor(cards.length / 2); 
        const totalCards = cards.length;

        function updateCarousel() {
            // Asignamos Z-index estrictamente a través de JS y limpiamos clases
            cards.forEach((card) => {
                card.classList.remove('active', 'prev', 'next', 'prev-hidden', 'next-hidden');
                card.style.zIndex = "1"; // Todas inician en el fondo
            });
            
            const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
            const nextIndex = (currentIndex + 1) % totalCards;
            const prevHiddenIndex = (currentIndex - 2 + totalCards) % totalCards;
            const nextHiddenIndex = (currentIndex + 2) % totalCards;

            // Tarjeta Principal (Máximo z-index)
            cards[currentIndex].classList.add('active');
            cards[currentIndex].style.zIndex = "10";
            
            // Tarjetas Laterales (z-index medio)
            cards[prevIndex].classList.add('prev');
            cards[prevIndex].style.zIndex = "5";
            
            cards[nextIndex].classList.add('next');
            cards[nextIndex].style.zIndex = "5";
            
            // Tarjetas Ocultas (z-index fondo)
            cards[prevHiddenIndex].classList.add('prev-hidden');
            cards[prevHiddenIndex].style.zIndex = "1";
            
            cards[nextHiddenIndex].classList.add('next-hidden');
            cards[nextHiddenIndex].style.zIndex = "1";
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        });

        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if(card.classList.contains('prev') || card.classList.contains('next')) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });

        // FUNCIONALIDAD SWIPE TÁCTIL (¡Excelente para Mobile!)
        let touchstartX = 0;
        let touchendX = 0;

        track.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, {passive: true});

        track.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            handleGesture();
        }, {passive: true});

        function handleGesture() {
            if (touchendX < touchstartX - 40) { 
                // Swipe Izquierda -> Siguiente
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            }
            if (touchendX > touchstartX + 40) { 
                // Swipe Derecha -> Anterior
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            }
        }

        // Inicia el carrusel
        updateCarousel();
    }
});
