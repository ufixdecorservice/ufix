const App = {
    data: {},
    
    async init() {
        if (!Storage.isReady) {
            Storage.onReady.push(() => this.init());
            return;
        }

        this.data = Storage.get();
        this.applyTheme();
        
        // Register for reactive re-renders when language changes
        I18n.registerRenderer(() => this.renderAll());
        
        this.initAOS();
        this.initContactForm();
    },

    applyTheme() {
        const theme = this.data.theme;
        if (!theme) return;
        
        document.documentElement.style.setProperty('--brand-primary', theme.primary);
        document.documentElement.style.setProperty('--brand-accent', theme.accent);
        
        // Dynamic Meta Theme Color
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.primary);
    },

    renderAll() {
        this.renderSEO();
        this.renderFavicon();
        this.renderUI();
        this.renderBranding();
        this.renderHero();
        this.renderAbout();
        this.renderWhyUs();
        this.renderServices();
        this.renderPortfolio();
        this.renderBlog();
        this.renderContact();
        this.renderFooter();
        this.renderFloatingButtons();
        
        // Refresh AOS to detect newly rendered elements and updated heights
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    },

    renderUI() {
        const ui = this.data.ui;
        if (!ui) return;
        
        // Update elements with data-i18n that we want to override from CMS
        Object.keys(ui).forEach(key => {
            const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
            elements.forEach(el => {
                el.innerHTML = I18n.getLocalizedText(ui[key]);
            });
        });
    },

    renderSEO() {
        const seo = this.data.seo;
        if (!seo) return;
        document.title = I18n.getLocalizedText(seo.title);
        document.querySelector('meta[name="description"]')?.setAttribute('content', I18n.getLocalizedText(seo.desc));
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', seo.keywords);
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', I18n.getLocalizedText(seo.title));
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', I18n.getLocalizedText(seo.desc));
    },

    renderFavicon() {
        const url = this.data.site?.favicon_url;
        if (!url) return;
        
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'shortcut icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = url;
    },

    renderBranding() {
        const logo = this.data.site?.logo_url;
        const width = this.data.site?.logo_width || '200';
        const maxHeight = this.data.site?.logo_height || '50';
        const logoEl = document.querySelector('#site-logo');
        if (logo && logoEl) {
            logoEl.src = logo;
            logoEl.style.width = width + 'px';
            logoEl.style.maxHeight = maxHeight + 'px';
            logoEl.style.height = 'auto';
            logoEl.style.objectFit = 'contain';
        }
    },

    renderHero() {
        const h = this.data.hero;
        if (!h) return;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) heroSection.style.backgroundImage = `url(${h.bg_image})`;
        
        const titleEl = document.querySelector('#hero-title');
        const descEl = document.querySelector('#hero-desc');
        
        if (titleEl) titleEl.innerHTML = I18n.getLocalizedText(h.title);
        if (descEl) descEl.innerHTML = I18n.getLocalizedText(h.desc);
    },

    renderAbout() {
        const a = this.data.about;
        if (!a) return;
        
        const sectionTitle = document.querySelector('#about .section-title h2');
        if (sectionTitle) sectionTitle.innerHTML = I18n.getLocalizedText(a.title);
        
        const descEl = document.querySelector('[data-i18n="about_desc"]');
        if (descEl) descEl.innerHTML = I18n.getLocalizedText(a.desc);
        
        const imgEl = document.querySelector('#about img');
        if (imgEl && a.image) imgEl.src = a.image;

        const listContainer = document.querySelector('#about ul.list-unstyled');
        if (listContainer && a.list) {
            listContainer.innerHTML = a.list.map(item => `
                <li><i class="fas fa-check-circle text-accent me-2"></i> <span>${I18n.getLocalizedText(item)}</span></li>
            `).join('');
        }
    },

    renderWhyUs() {
        const w = this.data.why;
        if (!w) return;
        
        const sectionTitle = document.querySelector('#why-us .section-title h2');
        if (sectionTitle) sectionTitle.innerHTML = I18n.getLocalizedText(w.title);

        const container = document.querySelector('#why-us .row');
        if (container && w.items) {
            container.innerHTML = w.items.map((item, idx) => `
                <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="${idx * 100}">
                    <div class="p-4">
                        <i class="${item.icon} fa-3x text-accent mb-3"></i>
                        <h4>${I18n.getLocalizedText(item.title)}</h4>
                        <p class="text-muted">${I18n.getLocalizedText(item.desc)}</p>
                    </div>
                </div>
            `).join('');
        }
    },

    renderServices() {
        const container = document.querySelector('#services-grid');
        if (!container || !this.data.services) return;
        
        container.innerHTML = this.data.services.map(s => `
            <div class="col-md-4 mb-4" data-aos="fade-up">
                <div class="card h-100 service-card border-0 shadow-sm">
                    <img src="${s.image}" class="card-img-top service-img" alt="${I18n.getLocalizedText(s.title)}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">${I18n.getLocalizedText(s.title)}</h5>
                        <p class="card-text text-muted small">${I18n.getLocalizedText(s.desc)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderPortfolio() {
        const container = document.querySelector('#portfolio-grid');
        if (!container || !this.data.portfolio) return;
        
        container.innerHTML = this.data.portfolio.map(p => `
            <div class="col-md-6 mb-4" data-aos="fade-up">
                <div class="card portfolio-card h-100 border-0 shadow-sm overflow-hidden">
                    <div class="row g-0 h-100">
                        <div class="col-6">
                            <div class="portfolio-label">BEFORE</div>
                            <img src="${p.image_before}" class="img-fluid h-100 object-fit-cover" alt="Before">
                        </div>
                        <div class="col-6">
                            <div class="portfolio-label">AFTER</div>
                            <img src="${p.image_after}" class="img-fluid h-100 object-fit-cover" alt="After">
                        </div>
                    </div>
                    <div class="portfolio-info p-3">
                        <h5 class="mb-1">${I18n.getLocalizedText(p.title)}</h5>
                        <p class="small text-muted mb-0">${I18n.getLocalizedText(p.desc)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderBlog() {
        const container = document.querySelector('#blog-grid');
        if (!container || !this.data.blog) return;
        
        if (this.data.blog.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-5">เร็วๆ นี้ / Coming Soon</div>';
            return;
        }

        container.innerHTML = this.data.blog.map(b => `
            <div class="col-md-4 mb-4" data-aos="fade-up">
                <div class="card h-100 border-0 shadow-sm blog-card">
                    <img src="${b.image}" class="card-img-top" alt="${I18n.getLocalizedText(b.title)}">
                    <div class="card-body">
                        <h5 class="card-title">${I18n.getLocalizedText(b.title)}</h5>
                        <p class="card-text text-muted small">${I18n.getLocalizedText(b.content).substring(0, 100)}...</p>
                        <a href="#" class="btn btn-link p-0 text-accent fw-bold" data-i18n="read_more">อ่านต่อ</a>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderContact() {
        const s = this.data.site;
        if (!s) return;
        
        const addrEl = document.querySelector('#contact-address');
        if (addrEl) addrEl.innerHTML = I18n.getLocalizedText(s.address);
        
        document.querySelector('#contact-phone').innerText = s.phone;
        document.querySelector('#contact-email').innerText = s.email;
        document.querySelector('#contact-line').innerText = s.line;
        
        const mapIframe = document.querySelector('#google-map');
        if (mapIframe) mapIframe.src = s.maps_url;
    },

    renderFooter() {
        const s = this.data.site;
        if (!s) return;
        const footerDesc = document.querySelector('[data-i18n="footer_desc"]');
        if (footerDesc) footerDesc.innerHTML = I18n.getLocalizedText(s.footer_desc);
    },

    renderFloatingButtons() {
        const s = this.data.site;
        if (!s) return;
        
        // Floating Btns
        document.querySelector('.btn-call')?.setAttribute('href', `tel:${s.phone.replace(/-/g, '')}`);
        document.querySelector('.btn-line')?.setAttribute('href', `https://line.me/ti/p/${s.line}`);
        
        // Mobile Bar
        const stickyItems = document.querySelectorAll('.mobile-sticky-bar .sticky-item');
        if (stickyItems[0]) stickyItems[0].setAttribute('href', `tel:${s.phone.replace(/-/g, '')}`);
        if (stickyItems[1]) stickyItems[1].setAttribute('href', `https://line.me/ti/p/${s.line}`);
        if (stickyItems[2]) stickyItems[2].setAttribute('href', `mailto:${s.email}`);
    },

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({ 
                duration: 800, 
                once: false, // Repeat animation
                mirror: true, // Animate while scrolling past
                anchorPlacement: 'top-bottom', // Trigger when top of element hits bottom of window
                offset: 50 // Trigger slightly earlier
            });
        }
    },

    initContactForm() {
        const form = document.querySelector('#contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = form.querySelector('[name="name"]').value;
                const email = form.querySelector('[name="email"]').value;
                const phone = form.querySelector('[name="phone"]').value;
                const message = form.querySelector('[name="message"]').value;
                
                const mailtoLink = `mailto:${this.data.site.email}?subject=Contact from ${name}&body=Name: ${name}%0D%0APhone: ${phone}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;
                window.location.href = mailtoLink;
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
