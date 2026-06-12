const App = {
    lang: localStorage.getItem('ufix_lang') || 'th',

    init() {
        this.applyLang();
        this.initAOS();
        this.initMobileNavbar();
        this.initLangSwitch();
        this.initPDPA();
        this.initContactForm();
        this.initAnnouncementPopup();
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
    },

    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = this.lang === 'th' 
                ? '<i class="fas fa-spinner fa-spin me-2"></i>กำลังส่งข้อความ...' 
                : '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

            const formData = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                // Show success UI with AOS animation
                const successHtml = this.lang === 'th'
                    ? `
                    <div class="text-center py-5" data-aos="fade-up">
                        <div class="mb-4 text-success" style="font-size: 4rem;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h4 class="text-success mb-3">ส่งข้อความสำเร็จ!</h4>
                        <p class="text-muted mb-4">ขอบคุณที่ติดต่อเรา เจ้าหน้าที่ของเราจะติดต่อกลับหาคุณโดยเร็วที่สุด</p>
                        <button class="btn btn-outline-primary btn-sm" onclick="location.reload()">ส่งข้อความใหม่</button>
                    </div>
                    `
                    : `
                    <div class="text-center py-5" data-aos="fade-up">
                        <div class="mb-4 text-success" style="font-size: 4rem;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h4 class="text-success mb-3">Message Sent Successfully!</h4>
                        <p class="text-muted mb-4">Thank you for contacting us. Our representative will get back to you shortly.</p>
                        <button class="btn btn-outline-primary btn-sm" onclick="location.reload()">Send Another Message</button>
                    </div>
                    `;
                
                // Replace card contents with success UI
                const card = form.closest('.card');
                if (card) {
                    card.innerHTML = successHtml;
                    if (typeof AOS !== 'undefined') AOS.refresh();
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                // Show error message
                alert(this.lang === 'th' 
                    ? 'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง หรือติดต่อทาง LINE: @Ufix.service01' 
                    : 'Error sending message. Please try again or contact us via LINE: @Ufix.service01');
                
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            });
        });
    },

    initAnnouncementPopup() {
        const popupImageUrl = 'assets/images/popup/announcement.jpg';
        const img = new Image();
        
        img.onload = () => {
            console.log("Announcement image loaded successfully. Showing popup...");
            const popupHTML = `
                <div id="dynamicPopup" class="modal fade" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content border-0 bg-transparent">
                            <div class="modal-body p-0 position-relative text-center">
                                <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close" style="z-index: 1060; filter: drop-shadow(0 0 5px rgba(0,0,0,0.8)); opacity: 1;"></button>
                                <img src="${popupImageUrl}" class="img-fluid rounded shadow-lg" alt="Announcement" style="max-height: 90vh; width: 100%;">
                            </div>
                        </div>
                    </div>
                </div>`;
            
            document.body.insertAdjacentHTML('beforeend', popupHTML);
            const popupEl = document.getElementById('dynamicPopup');
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const modal = new bootstrap.Modal(popupEl);
                modal.show();
            }
        };

        img.onerror = () => {
            console.log("No announcement image found at: " + popupImageUrl);
        };

        img.src = popupImageUrl + '?t=' + new Date().getTime();
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
