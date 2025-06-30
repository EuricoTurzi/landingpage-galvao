// JavaScript principal para Galvão RV - Versão Melhorada

// Estado do portfólio expandível
let isPortfolioExpanded = false;
let currentPortfolioFilter = 'todos';

// Inicializar portfólio expandível
function initExpandablePortfolio() {
    const showMoreBtn = document.getElementById('show-more-btn');
    const showLessBtn = document.getElementById('show-less-btn');
    const showLessContainer = document.getElementById('show-less-container');
    const portfolioOverlay = document.getElementById('portfolio-overlay');
    
    if (!showMoreBtn || !showLessBtn) return;
    
    // Event listeners
    showMoreBtn.addEventListener('click', showMoreWorks);
    showLessBtn.addEventListener('click', showLessWorks);
    
    // Atualizar filtros para trabalhar com sistema expandível
    updateWorkFilter();
}

// Função para mostrar mais trabalhos
function showMoreWorks() {
    const hiddenItems = document.querySelectorAll('.work-item.hidden');
    const portfolioOverlay = document.getElementById('portfolio-overlay');
    const showLessContainer = document.getElementById('show-less-container');
    
    hiddenItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.remove('hidden');
            item.classList.add('fade-in');
        }, index * 100);
    });
    
    // Esconder overlay e mostrar botão "Ver Menos"
    portfolioOverlay.style.display = 'none';
    showLessContainer.classList.remove('hidden');
    isPortfolioExpanded = true;
    
    // Scroll suave para mostrar novos itens
    setTimeout(() => {
        const firstNewItem = hiddenItems[0];
        if (firstNewItem) {
            firstNewItem.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 500);
}

// Função para mostrar menos trabalhos
function showLessWorks() {
    const allItems = document.querySelectorAll('.work-item');
    const itemsToHide = Array.from(allItems).slice(3); // Todos exceto os primeiros 3
    const portfolioOverlay = document.getElementById('portfolio-overlay');
    const showLessContainer = document.getElementById('show-less-container');
    
    itemsToHide.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('hidden');
            item.classList.remove('fade-in');
        }, index * 50);
    });
    
    // Mostrar overlay e esconder botão "Ver Menos"
    setTimeout(() => {
        portfolioOverlay.style.display = 'flex';
        showLessContainer.classList.add('hidden');
        isPortfolioExpanded = false;
        
        // Scroll de volta para o topo da seção
        document.querySelector('.work-grid').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);
}

// Atualizar sistema de filtros para trabalhar com expansão
function updateWorkFilter() {
    const filterButtons = document.querySelectorAll('.work-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Atualizar botão ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Aplicar filtro
            const category = button.textContent.toLowerCase().trim();
            currentPortfolioFilter = category;
            filterPortfolioWorks(category);
            
            // Reset do estado expandido quando mudar filtro
            if (isPortfolioExpanded) {
                const showLessContainer = document.getElementById('show-less-container');
                const portfolioOverlay = document.getElementById('portfolio-overlay');
                
                isPortfolioExpanded = false;
                showLessContainer.classList.add('hidden');
                portfolioOverlay.style.display = 'flex';
            }
        });
    });
}

// Função para filtrar trabalhos com sistema expandível
function filterPortfolioWorks(category) {
    const allItems = document.querySelectorAll('.work-item');
    const portfolioOverlay = document.getElementById('portfolio-overlay');
    let visibleCount = 0;
    
    allItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = category === 'todos' || itemCategory === category;
        
        if (shouldShow) {
            if (!isPortfolioExpanded && visibleCount >= 3) {
                item.classList.add('hidden');
            } else {
                item.classList.remove('hidden');
                item.style.opacity = '1';
            }
            visibleCount++;
        } else {
            item.classList.add('hidden');
            item.style.opacity = '0.3';
        }
    });
    
    // Mostrar/esconder overlay baseado no filtro e estado
    const totalInCategory = document.querySelectorAll(
        category === 'todos' ? '.work-item' : `.work-item[data-category="${category}"]`
    ).length;
    
    if (!isPortfolioExpanded && totalInCategory > 3) {
        portfolioOverlay.style.display = 'flex';
    } else {
        portfolioOverlay.style.display = 'none';
    }
}

// Configurações globais
const CONFIG = {
    animationDuration: 1,
    staggerDelay: 0.2,
    scrollOffset: 80,
    loaderDuration: 2.5
};

// Estado da aplicação
const APP_STATE = {
    isLoaded: false,
    currentTestimonial: 0,
    isMenuOpen: false,
    scrollY: 0
};

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicializar aplicação
function initializeApp() {
    try {
        // Registrar plugins GSAP
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        }
        
        // Inicializar componentes
        initLoader();
        initCustomCursor();
        initNavigation();
        initGSAPAnimations();
        initWorkFilter();
        initTestimonialSlider();
        initFAQ();
        initContactForm();
        initProgressBar();
        initScrollEffects();
        initExpandablePortfolio();
        
        console.log('Aplicação inicializada com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }
}

// Inicializar loader
function initLoader() {
    const loader = document.getElementById('loader');
    const loaderLetters = document.querySelectorAll('.loader-letter');
    const loaderBar = document.querySelector('.loader-bar');
    
    if (!loader || !loaderBar) return;
    
    // Animar letras do loader
    if (typeof gsap !== 'undefined' && loaderLetters.length > 0) {
        gsap.fromTo(loaderLetters, 
            { 
                opacity: 0, 
                scale: 0.5, 
                y: 50, 
                rotation: -5 
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                rotation: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "elastic.out(1, 0.3)"
            }
        );
        
        // Animar barra de progresso
        gsap.to(loaderBar, {
            width: "100%",
            duration: CONFIG.loaderDuration,
            ease: "power2.out",
            onComplete: hideLoader
        });
    } else {
        // Fallback sem GSAP
        setTimeout(hideLoader, CONFIG.loaderDuration * 1000);
    }
}

// Esconder loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                loader.classList.add('hidden');
                APP_STATE.isLoaded = true;
                animateHeroSection();
            }
        });
    } else {
        loader.classList.add('hidden');
        APP_STATE.isLoaded = true;
        animateHeroSection();
    }
}

// Inicializar cursor personalizado
function initCustomCursor() {
    if (window.innerWidth <= 768) return; // Não usar em mobile
    
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    
    // Atualizar posição do mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animar cursor com requestAnimationFrame para melhor performance
    function animateCursor() {
        // Cursor dot (mais rápido)
        dotX += (mouseX - dotX) * 0.8;
        dotY += (mouseY - dotY) * 0.8;
        
        // Cursor outline (mais lento)
        outlineX += (mouseX - outlineX) * 0.2;
        outlineY += (mouseY - outlineY) * 0.2;
        
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Efeitos hover
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .faq-question, .work-filter-btn, .work-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
        });
    });
}

// Inicializar navegação
function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Toggle menu mobile
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', toggleMobileMenu);
        
        // Fechar menu ao clicar em links
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    // Efeito scroll na navegação
    window.addEventListener('scroll', () => {
        APP_STATE.scrollY = window.scrollY;
        
        if (navbar) {
            if (APP_STATE.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Smooth scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
    });
    
    // Destacar link ativo
    updateActiveNavLink();
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

// Toggle menu mobile
function toggleMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    APP_STATE.isMenuOpen = !APP_STATE.isMenuOpen;
    menuToggle.classList.toggle('active');
    
    if (typeof gsap !== 'undefined') {
        if (APP_STATE.isMenuOpen) {
            gsap.to(mobileMenu, {
                x: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        } else {
            gsap.to(mobileMenu, {
                x: '100%',
                duration: 0.8,
                ease: "power3.in"
            });
        }
    } else {
        mobileMenu.style.transform = APP_STATE.isMenuOpen ? 'translateX(0)' : 'translateX(100%)';
    }
}

// Fechar menu mobile
function closeMobileMenu() {
    if (!APP_STATE.isMenuOpen) return;
    
    APP_STATE.isMenuOpen = false;
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.classList.remove('active');
    
    if (typeof gsap !== 'undefined') {
        gsap.to(mobileMenu, {
            x: '100%',
            duration: 0.8,
            ease: "power3.in"
        });
    } else {
        mobileMenu.style.transform = 'translateX(100%)';
    }
}

// Manipular clique em âncora
function handleAnchorClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        closeMobileMenu();
        
        if (typeof gsap !== 'undefined') {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetElement,
                    offsetY: CONFIG.scrollOffset
                },
                ease: "power3.inOut"
            });
        } else {
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Atualizar link ativo na navegação
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - CONFIG.scrollOffset;
        const sectionHeight = section.offsetHeight;
        
        if (APP_STATE.scrollY >= sectionTop && APP_STATE.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Inicializar animações GSAP
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Configurar animações baseadas em scroll
    animateAboutSection();
    animateWorkSection();
    animateProcessSection();
    animateTestimonialsSection();
    animateContactSection();
    animateFAQSection();
}

// Animar seção Hero
function animateHeroSection() {
    if (typeof gsap === 'undefined') return;
    
    const heroTitle = document.querySelectorAll('.hero-title .block span');
    const heroSubtitle = document.querySelector('.hero-subtitle span');
    const heroCta = document.querySelector('.hero-cta > div');
    
    const tl = gsap.timeline();
    
    if (heroTitle.length > 0) {
        tl.to(heroTitle, {
            y: 0,
            opacity: 1,
            duration: CONFIG.animationDuration,
            stagger: CONFIG.staggerDelay,
            ease: "power3.out"
        });
    }
    
    if (heroSubtitle) {
        tl.to(heroSubtitle, {
            y: 0,
            opacity: 1,
            duration: CONFIG.animationDuration,
            ease: "power3.out"
        }, "-=0.8");
    }
    
    if (heroCta) {
        tl.to(heroCta, {
            y: 0,
            opacity: 1,
            duration: CONFIG.animationDuration,
            ease: "power3.out"
        }, "-=0.6");
    }
}

// Animar seção Sobre
function animateAboutSection() {
    if (typeof gsap === 'undefined') return;
    
    const elements = [
        '#about .section-header .transform',
        '#about .about-paragraph .block',
        '#about .about-specialties .transform',
        '#about .about-signature .transform'
    ];
    
    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%'
                },
                y: 0,
                opacity: 1,
                duration: CONFIG.animationDuration,
                delay: index * 0.1,
                ease: "power3.out"
            });
        }
    });
    
    // ADICIONE ESTA PARTE PARA AS ESTATÍSTICAS:
    gsap.to('#about .about-stats .transform', {
        scrollTrigger: {
            trigger: '#about .about-stats',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        stagger: 0.1,
        ease: "power3.out"
    });
}

// Animar seção Trabalhos
function animateWorkSection() {
    if (typeof gsap === 'undefined') return;
    
    // Animar título
    gsap.to('#work .section-header .transform', {
        scrollTrigger: {
            trigger: '#work',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        ease: "power3.out"
    });
    
    // Animar filtros
    gsap.to('.work-filter-container .transform', {
        scrollTrigger: {
            trigger: '.work-filter-container',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        ease: "power3.out"
    });
    
    // Animar itens do portfólio
    gsap.to('.work-item .transform', {
        scrollTrigger: {
            trigger: '.work-grid',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        stagger: CONFIG.staggerDelay,
        ease: "power3.out"
    });
}

// Inicializar filtro de trabalhos
function initWorkFilter() {
    const filterButtons = document.querySelectorAll('.work-filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    if (filterButtons.length === 0 || workItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => handleFilterClick(button, filterButtons, workItems));
    });
}

// Manipular clique no filtro
function handleFilterClick(clickedButton, allButtons, workItems) {
    // Atualizar botões ativos
    allButtons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
    
    // Obter categoria do filtro
    const filterValue = clickedButton.textContent.toLowerCase().trim();
    
    // Filtrar itens
    workItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = filterValue === 'todos' || itemCategory === filterValue;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(item, {
                opacity: shouldShow ? 1 : 0.3,
                scale: shouldShow ? 1 : 0.95,
                duration: 0.5,
                ease: "power2.out"
            });
        } else {
            item.style.opacity = shouldShow ? '1' : '0.3';
            item.style.transform = shouldShow ? 'scale(1)' : 'scale(0.95)';
        }
    });
}

// Animar seção Processo
function animateProcessSection() {
    if (typeof gsap === 'undefined') return;

    // Animar título da seção
    gsap.to('#process .section-header .transform', {
        scrollTrigger: {
            trigger: '#process',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        ease: "power3.out"
    });
    
    document.querySelectorAll('.process-step').forEach((step, index) => {
        const content = step.querySelector('.process-step-content .transform');
        const image = step.querySelector('.process-step-image .transform');
        const icon = step.querySelector('.process-step-icon');
        
        if (content) {
            gsap.to(content, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%'
                },
                y: 0,
                opacity: 1,
                duration: CONFIG.animationDuration,
                ease: "power3.out"
            });
        }
        
        if (image) {
            gsap.to(image, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%'
                },
                y: 0,
                opacity: 1,
                duration: CONFIG.animationDuration,
                delay: 0.2,
                ease: "power3.out"
            });
        }
        
        if (icon) {
            gsap.fromTo(icon,
                { scale: 0, rotation: -45 },
                {
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 80%'
                    },
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }
            );
        }
    });
}

// Animar seção Depoimentos
function animateTestimonialsSection() {
    if (typeof gsap === 'undefined') return;
    
    // Encontrar a seção de depoimentos (a que contém .testimonial-slider)
    const testimonialSection = document.querySelector('.testimonial-slider').closest('section');
    
    // Animar título da seção
    if (testimonialSection) {
        const headerTransform = testimonialSection.querySelector('.section-header .transform');
        if (headerTransform) {
            gsap.to(headerTransform, {
                scrollTrigger: {
                    trigger: testimonialSection,
                    start: 'top 80%'
                },
                y: 0,
                opacity: 1,
                duration: CONFIG.animationDuration,
                ease: "power3.out"
            });
        }
    }
    
    // Animar o container do slider
    gsap.fromTo('.testimonial-slider', 
        { opacity: 0, y: 50 },
        {
            scrollTrigger: {
                trigger: '.testimonial-slider',
                start: 'top 80%'
            },
            opacity: 1,
            y: 0,
            duration: CONFIG.animationDuration,
            ease: "power3.out"
        }
    );
}

// Inicializar slider de depoimentos
function initTestimonialSlider() {
    const pages = document.querySelectorAll('.testimonial-page');
    const dots = document.querySelectorAll('.testimonial-dot');
    const track = document.querySelector('.testimonial-track');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (pages.length === 0 || dots.length === 0 || !track) return;
    
    let totalPages = pages.length; // Agora são 3 páginas
    let autoPlayInterval;
    
    // Configurar dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToTestimonial(index));
    });
    
    // Configurar setas
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            APP_STATE.currentTestimonial = APP_STATE.currentTestimonial === 0 
                ? totalPages - 1 
                : APP_STATE.currentTestimonial - 1;
            updateTestimonialSlider();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            APP_STATE.currentTestimonial = (APP_STATE.currentTestimonial + 1) % totalPages;
            updateTestimonialSlider();
        });
    }
    
    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            APP_STATE.currentTestimonial = (APP_STATE.currentTestimonial + 1) % totalPages;
            updateTestimonialSlider();
        }, 7000); // Aumentado para 7 segundos por ter mais conteúdo
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Parar auto-play ao hover
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Iniciar auto-play
    startAutoPlay();
    
    // Atualizar slider inicial
    updateTestimonialSlider();
}

// Ir para depoimento específico
function goToTestimonial(index) {
    APP_STATE.currentTestimonial = index;
    updateTestimonialSlider();
}

// Atualizar slider de depoimentos
function updateTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (track) {
        const translateX = -APP_STATE.currentTestimonial * 100;
        track.style.transform = `translateX(${translateX}%)`;
    }
    
    // Atualizar dots
    dots.forEach((dot, index) => {
        if (index === APP_STATE.currentTestimonial) {
            dot.classList.add('active');
            dot.style.backgroundColor = '#FFB800';
        } else {
            dot.classList.remove('active');
            dot.style.backgroundColor = '#6b7280';
        }
    });
}

// Atualizar dots dos depoimentos
function updateTestimonialDots() {
    const dots = document.querySelectorAll('.testimonial-dot');
    
    dots.forEach((dot, index) => {
        if (index === APP_STATE.currentTestimonial) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Animar seção Contato
function animateContactSection() {
    if (typeof gsap === 'undefined') return;
    
    gsap.to('#contact .section-header .transform', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        ease: "power3.out"
    });
    
    gsap.to('.contact-item .transform', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        stagger: CONFIG.staggerDelay,
        ease: "power3.out"
    });
    
    gsap.to('.contact-form-container .transform', {
        scrollTrigger: {
            trigger: '.contact-form-container',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        ease: "power3.out"
    });
}

// Animar seção FAQ
function animateFAQSection() {
    if (typeof gsap === 'undefined') return;
    
    // Animar título da seção FAQ
    gsap.to('#faq .section-header .transform', {
        scrollTrigger: {
            trigger: '#faq',
            start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        duration: CONFIG.animationDuration,
        ease: "power3.out"
    });
}

// Inicializar FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => toggleFAQItem(item));
        }
    });
}

// Toggle item FAQ
function toggleFAQItem(item) {
    const isActive = item.classList.contains('active');
    
    // Fechar todos os outros itens
    document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
    });
    
    // Toggle item atual
    if (isActive) {
        item.classList.remove('active');
    } else {
        item.classList.add('active');
    }
}

// Inicializar formulário de contato
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Manipular envio do formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validar formulário
    if (!validateForm(form)) {
        return;
    }
    
    // Simular envio (substituir por integração real)
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Validar formulário
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validar campo individual
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Verificar se é obrigatório
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
    }
    
    // Validar email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email inválido';
        }
    }
    
    // Validar telefone
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Telefone inválido';
        }
    }
    
    // Mostrar/esconder erro
    showFieldError(field, isValid ? '' : errorMessage);
    
    return isValid;
}

// Mostrar erro no campo
function showFieldError(field, message) {
    // Remover erro anterior
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    if (message) {
        field.classList.add('border-red-500');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error text-red-500 text-sm mt-1';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    } else {
        field.classList.remove('border-red-500');
    }
}

// Limpar erro do campo
function clearFieldError(e) {
    const field = e.target;
    const existingError = field.parentNode.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
        field.classList.remove('border-red-500');
    }
}

// Inicializar barra de progresso
function initProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    if (!progressBar) return;
    
    window.addEventListener('scroll', throttle(updateProgressBar, 10));
}

// Atualizar barra de progresso
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = (APP_STATE.scrollY / documentHeight) * 100;
    
    progressBar.style.width = `${Math.min(scrolled, 100)}%`;
}

// Inicializar efeitos de scroll
function initScrollEffects() {
    // Parallax suave para elementos específicos
    if (typeof gsap !== 'undefined') {
        gsap.utils.toArray('.parallax').forEach(element => {
            gsap.to(element, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }
}

// Utilitários
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Manipular redimensionamento da janela
window.addEventListener('resize', debounce(() => {
    // Reinicializar cursor em mudanças de tamanho
    if (window.innerWidth <= 768) {
        const cursorElements = document.querySelectorAll('.cursor-dot, .cursor-outline');
        cursorElements.forEach(el => el.style.display = 'none');
    } else {
        const cursorElements = document.querySelectorAll('.cursor-dot, .cursor-outline');
        cursorElements.forEach(el => el.style.display = 'block');
    }
    
    // Atualizar ScrollTrigger se disponível
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}, 250));

// Manipular visibilidade da página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pausar animações quando a página não está visível
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    } else {
        // Retomar animações quando a página volta a ser visível
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }
    }
});

// Exportar funções para uso global (se necessário)
window.GalvaoRV = {
    toggleMobileMenu,
    goToTestimonial,
    CONFIG,
    APP_STATE
};

