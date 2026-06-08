const App = {
    lang: localStorage.getItem('ufix_lang') || 'th',

    init() {
        this.applyLang();
        this.initAOS();
        this.initMobileNavbar();
        this.initLangSwitch();
        this.initPDPA();
    },

    initPDPA() {
        const pdpaAccepted = localStorage.getItem('ufix_pdpa_accepted');
        const banner = document.getElementById('cookie-banner');
        
        if (!pdpaAccepted && banner) {
            banner.style.display = 'block';
        }

        window.acceptCookies = () => {
            localStorage.setItem('ufix_pdpa_accepted', 'true');
            if (banner) banner.style.display = 'none';
        };

        window.declineCookies = () => {
            localStorage.setItem('ufix_pdpa_accepted', 'false');
            if (banner) banner.style.display = 'none';
        };
    },

    applyLang() {
        document.documentElement.lang = this.lang;
        document.body.setAttribute('lang', this.lang);
        
        // Update active class on buttons
        document.querySelectorAll('.btn-lang').forEach(btn => {
            if (btn.getAttribute('onclick').includes(`'${this.lang}'`)) {
                btn.classList.replace('btn-outline-primary', 'btn-primary');
            } else {
                btn.classList.replace('btn-primary', 'btn-outline-primary');
            }
        });
    },

    setLang(lang) {
        this.lang = lang;
        localStorage.setItem('ufix_lang', lang);
        this.applyLang();
        if (typeof AOS !== 'undefined') AOS.refresh();
    },

    initLangSwitch() {
        // Handle language switcher buttons
        window.setLanguage = (l) => this.setLang(l);
    },

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({ 
                duration: 800, 
                once: false, 
                mirror: true, 
                anchorPlacement: 'top-bottom', 
                offset: 50, 
                disable: false 
            });

            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (typeof AOS !== 'undefined') AOS.refresh();
                }, 500);
            });
        }
    },

    initMobileNavbar() {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
