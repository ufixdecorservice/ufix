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
        
        // Register to re-render when storage is updated in background
        if (!this.handleBgSync) {
            this.handleBgSync = () => {
                console.log('App: Storage updated in background, re-rendering...');
                this.data = Storage.get();
                this.applyTheme();
                this.renderAll();
            };
            window.addEventListener('storage_updated', this.handleBgSync);
        }
        
        // Initial render
        this.renderAll();
        
        this.initAOS();
        this.initContactForm();
        this.initMobileNavbar();
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
        // Hardcoded in index.html, no dynamic favicon insertion
    },

    renderBranding() {
        // Hardcoded in index.html, no dynamic logo branding insertion
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

    async getDynamicImage(folderPath) {
        if (!folderPath) return 'assets/images/default.png';
        if (folderPath.startsWith('http') || /\.(jpg|jpeg|png|gif|webp|svg)/i.test(folderPath)) {
            return folderPath;
        }
        const extensions = ['main.jpg', 'main.png', 'main.jpeg', 'main.webp'];
        for (const ext of extensions) {
            const fullPath = folderPath + (folderPath.endsWith('/') ? '' : '/') + ext;
            try {
                const response = await fetch(fullPath, { method: 'HEAD' });
                if (response.ok) return fullPath;
            } catch (e) {
                console.warn(`Could not check ${fullPath}`);
            }
        }
        return folderPath.endsWith('/') ? folderPath + 'default.png' : folderPath;
    },

    async renderServices() {
        const container = document.querySelector('#services-grid');
        if (!container || !this.data.services) return;
        
        const servicesHtml = await Promise.all(this.data.services.map(async s => {
            const img = await this.getDynamicImage(s.image);
            return `
                <div class="col-md-4 mb-4" data-aos="fade-up">
                    <div class="card h-100 service-card border-0 shadow-sm">
                        <img src="${img}" class="card-img-top service-img" alt="${I18n.getLocalizedText(s.title)}" loading="lazy">
                        <div class="card-body">
                            <h5 class="card-title">${I18n.getLocalizedText(s.title)}</h5>
                            <p class="card-text text-muted small">${I18n.getLocalizedText(s.desc)}</p>
                        </div>
                    </div>
                </div>
            `;
        }));
        container.innerHTML = servicesHtml.join('');
    },

    renderPortfolio() {
        if (typeof Portfolio !== 'undefined' && Portfolio.render) {
            Portfolio.render();
        } else {
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
        }
    },

    renderBlog() {
        const blogSection = document.querySelector('#blog');
        const blogNavLink = document.querySelector('a[href="#blog"]')?.parentElement;
        const blogData = this.data.blog || [];

        if (blogData.length === 0) {
            if (blogSection) blogSection.style.display = 'none';
            if (blogNavLink) blogNavLink.style.display = 'none';
            return;
        } else {
            if (blogSection) blogSection.style.display = 'block';
            if (blogNavLink) blogNavLink.style.display = 'block';
        }

        if (typeof Blog !== 'undefined' && Blog.render) {
            Blog.render();
        } else {
            const container = document.querySelector('#blog-grid');
            if (!container) return;
            
            container.innerHTML = blogData.map(b => `
                <div class="col-md-4 mb-4" data-aos="fade-up">
                    <div class="card h-100 border-0 shadow-sm blog-card">
                        <img src="${b.image}" class="card-img-top" alt="${I18n.getLocalizedText(b.title)}">
                        <div class="card-body">
                            <h5 class="card-title">${I18n.getLocalizedText(b.title)}</h5>
                            <p class="card-text text-muted small">${I18n.getLocalizedText(b.content).substring(0, 100)}...</p>
                            <a href="#" class="btn btn-link p-0 text-accent" data-i18n="read_more">อ่านต่อ</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
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
        
        const cleanPhone = s.phone ? s.phone.replace(/-/g, '').replace(/\s/g, '') : '';
        const lineUrl = s.line.startsWith('@') 
            ? `https://line.me/R/ti/p/${encodeURIComponent(s.line)}` 
            : `https://line.me/ti/p/~${s.line}`;
        
        // Floating Btns
        document.querySelector('.btn-call')?.setAttribute('href', `tel:${cleanPhone}`);
        document.querySelector('.btn-line')?.setAttribute('href', lineUrl);
        
        // Mobile Bar
        const stickyItems = document.querySelectorAll('.mobile-sticky-bar .sticky-item');
        if (stickyItems[0]) stickyItems[0].setAttribute('href', `tel:${cleanPhone}`);
        if (stickyItems[1]) stickyItems[1].setAttribute('href', lineUrl);
        if (stickyItems[2]) stickyItems[2].setAttribute('href', `mailto:${s.email}`);
    },

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({ 
                duration: 800, 
                once: false, // Repeat animation
                mirror: true, // Animate while scrolling past
                anchorPlacement: 'top-bottom', // Trigger when top of element hits bottom of window
                offset: 50, // Trigger slightly earlier
                disable: 'mobile' // ป้องกันอนิเมชัน AOS ดันหน้าจอมือถือเลื่อนซ้ายขวาได้
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
    },

    initMobileNavbar() {
        // Auto close mobile navbar menu collapse after clicking a navigation link
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    if (bsCollapse) {
                        bsCollapse.hide();
                    } else {
                        // Fallback to trigger hamburger click
                        document.querySelector('.navbar-toggler')?.click();
                    }
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
