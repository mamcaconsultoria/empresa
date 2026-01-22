// Initialize Lucide Icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Logic ---
    const navbar = document.getElementById('navbar');
    const navContainer = document.getElementById('nav-container'); // Get container to control height
    const mainLogo = document.getElementById('main-logo'); // Get logo element
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuBtnIcon = mobileMenuBtn.querySelector('i');

    const handleScroll = () => {
        if (window.scrollY > 20) {
            // SCROLLED STATE (Compact)
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('py-6', 'bg-transparent');
            
            // Remove the tall min-height so the bar can shrink
            if(navContainer) {
                navContainer.classList.remove('min-h-[110px]');
            }

            // Resize logo significantly smaller (h-28 -> h-14)
            if(mainLogo) {
                mainLogo.classList.remove('h-28');
                mainLogo.classList.add('h-14');
            }

            navLinks.forEach(link => {
                link.classList.remove('text-white', 'hover:text-secondary', 'drop-shadow-sm');
                link.classList.add('text-gray-700', 'hover:text-primary');
            });

            mobileMenuBtn.classList.remove('text-white', 'hover:text-secondary');
            mobileMenuBtn.classList.add('text-gray-700', 'hover:text-primary', 'bg-gray-100');
        } else {
            // TOP STATE (Expanded)
            navbar.classList.remove('navbar-scrolled');
            navbar.classList.add('py-6', 'bg-transparent');

            // Restore tall min-height
            if(navContainer) {
                navContainer.classList.add('min-h-[110px]');
            }

            // Restore large logo
            if(mainLogo) {
                mainLogo.classList.add('h-28');
                mainLogo.classList.remove('h-14');
            }

            navLinks.forEach(link => {
                link.classList.add('text-white', 'hover:text-secondary', 'drop-shadow-sm');
                link.classList.remove('text-gray-700', 'hover:text-primary');
            });

            mobileMenuBtn.classList.add('text-white', 'hover:text-secondary');
            mobileMenuBtn.classList.remove('text-gray-700', 'hover:text-primary', 'bg-gray-100');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- Mobile Menu Logic ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('scale-y-0', 'opacity-0');
            mobileMenuBtnIcon.setAttribute('data-lucide', 'x');
        } else {
            mobileMenu.classList.add('scale-y-0', 'opacity-0');
            mobileMenuBtnIcon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.classList.add('scale-y-0', 'opacity-0');
            mobileMenuBtnIcon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && isMenuOpen) {
            isMenuOpen = false;
            mobileMenu.classList.add('scale-y-0', 'opacity-0');
            mobileMenuBtnIcon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    });

    // --- Service Accordion Logic (Smooth Height) ---
    const toggleButtons = document.querySelectorAll('.toggle-service-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.service-card');
            const details = card.querySelector('.service-details');
            const btnText = this.querySelector('.btn-text');
            const arrow = this.querySelector('.icon-arrow');
            
            const isExpanded = !details.classList.contains('max-h-0');

            // Close all other details (optional, but good UX)
            document.querySelectorAll('.service-details').forEach(el => {
                el.style.maxHeight = null;
                el.classList.add('max-h-0', 'opacity-0');
                // Reset buttons
                const parentBtn = el.closest('.service-card').querySelector('.toggle-service-btn');
                parentBtn.querySelector('.btn-text').textContent = 'Ver detalles';
                parentBtn.querySelector('.icon-arrow').classList.remove('rotate-180');
            });

            if (!isExpanded) {
                // Open clicked
                details.classList.remove('max-h-0', 'opacity-0');
                details.style.maxHeight = details.scrollHeight + "px";
                btnText.textContent = 'Ver menos';
                arrow.classList.add('rotate-180');
            }
        });
    });

    // --- Mission & Vision Modal Logic ---
    const missionBtn = document.getElementById('mission-btn');
    const missionModal = document.getElementById('mission-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');

    const openModal = () => {
        missionModal.classList.remove('pointer-events-none', 'opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    };

    const closeModal = () => {
        missionModal.classList.add('pointer-events-none', 'opacity-0');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
    };

    if (missionBtn && missionModal) {
        missionBtn.addEventListener('click', openModal);
        
        // Close on button click
        closeModalBtn.addEventListener('click', closeModal);
        
        // Close on backdrop click
        modalBackdrop.addEventListener('click', closeModal);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !missionModal.classList.contains('opacity-0')) {
                closeModal();
            }
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });

    // --- Form Handling ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate sending
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            
            btn.innerHTML = '<span>Enviando...</span><div class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<span>¡Mensaje Enviado!</span><i data-lucide="check" class="w-5 h-5"></i>';
                btn.classList.remove('bg-primary', 'hover:bg-primary/90');
                btn.classList.add('bg-green-600');
                lucide.createIcons();
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.disabled = false;
                    btn.classList.add('bg-primary', 'hover:bg-primary/90');
                    btn.classList.remove('bg-green-600');
                    lucide.createIcons();
                }, 3000);
            }, 1500);
        });
    }
});