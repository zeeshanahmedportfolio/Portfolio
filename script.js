
        const PortfolioApp = (() => {
            // Configuration constants
            const PUBLIC_KEY = "35jGFWBGsfO0ldZa4";
            const SERVICE_ID = "service_vrfurlp";
            const TEMPLATE_ID = "template_62sk3cu";
            
            // DOM IDs
            const FORM_ID = "contact-form";
            const SEND_BTN_ID = "send-btn";
            const FORM_STATUS_ID = "form-status";
            const MENU_TOGGLE_ID = "menu-toggle";
            const MENU_CLOSE_ID = "menu-close";
            const PRIMARY_MENU_ID = "primary-menu";
            const HERO_TYPING_SELECTOR = ".tagline[data-typing]";
            
            const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            let elements = {};
            
            function init() {
                cacheDOMElements();
                initNav();
                initHero();
                initScrollReveal();
                initEmailJS();
                initSkillBars();
                initMisc();
            }
            
            function cacheDOMElements() {
                elements = {
                    menuToggle: document.getElementById(MENU_TOGGLE_ID),
                    menuClose: document.getElementById(MENU_CLOSE_ID),
                    primaryMenu: document.getElementById(PRIMARY_MENU_ID),
                    contactForm: document.getElementById(FORM_ID),
                    sendBtn: document.getElementById(SEND_BTN_ID),
                    formStatus: document.getElementById(FORM_STATUS_ID),
                    yearElement: document.getElementById('year')
                };
            }
            
            function initNav() {
                if (!elements.menuToggle || !elements.primaryMenu || !elements.menuClose) return;

                const toggleMenu = (open) => {
                    const isMenuOpen = open;
                    elements.menuToggle.classList.toggle('open', isMenuOpen);
                    elements.menuToggle.setAttribute('aria-expanded', isMenuOpen);
                    elements.primaryMenu.setAttribute('aria-hidden', !isMenuOpen);
                    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
                    if (!isMenuOpen) elements.menuToggle.focus();
                };

                elements.menuToggle.addEventListener('click', () => toggleMenu(elements.primaryMenu.getAttribute('aria-hidden') === 'true'));
                elements.menuClose.addEventListener('click', () => toggleMenu(false));
                
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && elements.primaryMenu.getAttribute('aria-hidden') === 'false') {
                        toggleMenu(false);
                    }
                });

                elements.primaryMenu.querySelectorAll('a:not(.social-icon a)').forEach(link => {
                    link.addEventListener('click', () => {
                         if (window.innerWidth < 900) toggleMenu(false);
                    });
                });
            }
            
            function initHero() {
                initTypingEffect();
                initParallax();
            }
            
            function initTypingEffect() {
                const typingElement = document.querySelector(HERO_TYPING_SELECTOR);
                if (!typingElement || REDUCED_MOTION) return;
                
                const text = typingElement.textContent;
                typingElement.textContent = '';
                
                let i = 0;
                const typeWriter = () => {
                    if (i < text.length) {
                        typingElement.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 50);
                    }
                };
                setTimeout(typeWriter, 900); // Start after intro animation
            }
            
            function initParallax() {
                if (REDUCED_MOTION) return;
                
                const heroImage = document.querySelector('.hero-image');
                if (!heroImage) return;

                window.addEventListener('scroll', throttle(() => {
                    const scrollY = window.scrollY;
                    const offset = scrollY * 0.05;
                    document.documentElement.style.setProperty('--hero-offset', `${Math.min(offset, 50)}px`);
                }, 10));
            }
            
            function initScrollReveal() {
                const revealElements = document.querySelectorAll('.reveal');
                if (REDUCED_MOTION || !('IntersectionObserver' in window) || revealElements.length === 0) {
                    revealElements.forEach(el => el.classList.add('is-visible'));
                    return;
                }
                
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            obs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
                
                revealElements.forEach(el => observer.observe(el));
            }
            
            function initEmailJS() {
                if (typeof emailjs === 'undefined') {
                    console.warn('EmailJS not loaded. Contact form will not work.');
                    return;
                }
                
                emailjs.init(PUBLIC_KEY);
                
                if (elements.contactForm) {
                    elements.contactForm.addEventListener('submit', handleFormSubmit);
                }
            }
            
            async function handleFormSubmit(e) {
                e.preventDefault();
                if (elements.sendBtn.disabled) return;
                
                if (document.getElementById('contact_honeypot')?.value !== '') return;
                if (!validateForm()) return;
                
                setButtonLoading(true);
                
                try {
                    await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, elements.contactForm);
                    showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                    elements.contactForm.reset();
                } catch (error) {
                    console.error('Email sending failed:', error);
                    showFormStatus('Sorry, there was an error. Please try again or email me directly.', 'error');
                } finally {
                    setButtonLoading(false);
                }
            }

            function setButtonLoading(isLoading) {
                 elements.sendBtn.disabled = isLoading;
                 elements.sendBtn.classList.toggle('loading', isLoading);
            }
            
            function validateForm() {
                let isValid = true;
                const fields = [
                    { id: 'from_name', min: 2, msg: 'Please enter your name (min 2 chars).' },
                    { id: 'from_email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email.' },
                    { id: 'subject', min: 3, msg: 'Please enter a subject (min 3 chars).' },
                    { id: 'message', min: 6, msg: 'Please enter a message (min 6 chars).' }
                ];
                
                for (const field of fields) {
                    const input = document.getElementById(field.id);
                    if (!input) continue;
                    const value = input.value.trim();
                    if ((field.min && value.length < field.min) || (field.pattern && !field.pattern.test(value))) {
                        showFormStatus(field.msg, 'error');
                        input.focus();
                        isValid = false;
                        break;
                    }
                }
                return isValid;
            }
            
            function showFormStatus(message, type) {
                if (!elements.formStatus) return;
                elements.formStatus.textContent = message;
                elements.formStatus.className = `visible is-${type}`;
                setTimeout(() => {
                    elements.formStatus.className = '';
                }, 5000);
            }

            function initSkillBars() {
                const skillItems = document.querySelectorAll('.skill-item');
                if (REDUCED_MOTION || !('IntersectionObserver' in window) || skillItems.length === 0) {
                     skillItems.forEach(item => {
                        const fill = item.querySelector('.skill-bar-fill');
                        if(fill) fill.style.width = item.dataset.skillLevel + '%';
                    });
                    return;
                }

                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const item = entry.target;
                            const fill = item.querySelector('.skill-bar-fill');
                            if (fill) fill.style.width = item.dataset.skillLevel + '%';
                            obs.unobserve(item);
                        }
                    });
                }, { threshold: 0.5 });
                
                skillItems.forEach(item => observer.observe(item));
            }
            
            function initMisc() {
                if (elements.yearElement) {
                    elements.yearElement.textContent = new Date().getFullYear();
                }
            }
            
            function throttle(func, limit) {
                let inThrottle;
                return function (...args) {
                    if (!inThrottle) {
                        func(...args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            }
            
            return { init };
        })();
        
        document.addEventListener('DOMContentLoaded', PortfolioApp.init);
    