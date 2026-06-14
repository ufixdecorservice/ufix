const App = {
    lang: localStorage.getItem('ufix_lang') || 'th',
    gasUrl: 'https://script.google.com/macros/s/AKfycbwyrEKGVDt4wb_VGbncgKbIRVPwuzqm-EWHSBB29Ol47RmuNNb4UX-3jdBigKbTUSm9nQ/exec',
    swiper: null,
    lightbox: null,

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

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = this.lang === 'th' 
                ? '<i class="fas fa-spinner fa-spin me-2"></i>กำลังประมวลผลและส่งข้อความ...' 
                : '<i class="fas fa-spinner fa-spin me-2"></i>Processing & Sending...';

            const formData = new FormData(form);
            const fileInput = document.getElementById('attachment');
            
            // Handle Image Resizing if file exists
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (file.type.startsWith('image/')) {
                    try {
                        const resizedBlob = await this.processImage(file, 350 * 1024); // Target 350KB
                        formData.set('attachment', resizedBlob, file.name);
                    } catch (err) {
                        console.error('Image processing error:', err);
                        // If error, continue with original file
                    }
                }
            }

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

    // --- Image Processing Helper ---
    processImage(file, targetSize) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Step 1: Resize dimensions if too large (Max 1200px)
                    const maxDim = 1200;
                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height *= maxDim / width;
                            width = maxDim;
                        } else {
                            width *= maxDim / height;
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Step 2: Adjust quality to hit target size
                    let quality = 0.9;
                    const iterate = () => {
                        canvas.toBlob((blob) => {
                            if (blob.size <= targetSize || quality <= 0.1) {
                                resolve(blob);
                            } else {
                                quality -= 0.1;
                                iterate();
                            }
                        }, 'image/jpeg', quality);
                    };
                    iterate();
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
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
    },

    // --- Portfolio Gallery Logic ---
    loadGallery(folderId, element) {
        const container = document.getElementById('gallery-container');
        const loader = document.getElementById('gallery-loader');
        const content = document.getElementById('gallery-content');
        
        // Show container and loader
        container.classList.remove('d-none');
        loader.classList.remove('d-none');
        content.classList.add('d-none');

        // Scroll to gallery
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Fetch images from GAS
        fetch(`${this.gasUrl}?id=${folderId}`)
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success' && res.data.length > 0) {
                    this.renderGallery(res.data);
                    loader.classList.add('d-none');
                    content.classList.remove('d-none');
                    this.initSwiper();
                } else {
                    alert(this.lang === 'th' ? 'ไม่พบรูปภาพในโฟลเดอร์นี้' : 'No images found in this folder.');
                    this.closeGallery();
                }
            })
            .catch(err => {
                console.error('Gallery Error:', err);
                alert(this.lang === 'th' ? 'เกิดข้อผิดพลาดในการโหลดรูปภาพ' : 'Error loading images.');
                this.closeGallery();
            });
    },

    renderGallery(images) {
        const wrapper = document.getElementById('swiper-wrapper');
        wrapper.innerHTML = '';

        images.forEach(img => {
            // ใช้ลิงก์ Thumbnail ความละเอียดสูง (1600px) สำหรับการขยายภาพ
            const fullResUrl = `https://drive.google.com/thumbnail?id=${img.id}&sz=w1600`;
            const thumbUrl = `https://drive.google.com/thumbnail?id=${img.id}&sz=w1000`;

            const slide = `
                <div class="swiper-slide">
                    <a href="${fullResUrl}" class="glightbox" data-gallery="portfolio" data-title="${img.name}" data-type="image">
                        <div class="gallery-img-container">
                            <img src="${thumbUrl}" alt="${img.name}" class="img-fluid rounded shadow-sm" 
                                 onerror="this.src='https://placehold.co/600x400?text=Image+Access+Error'">
                            <div class="gallery-overlay">
                                <i class="fas fa-search-plus"></i>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            wrapper.insertAdjacentHTML('beforeend', slide);
        });

        // Initialize GLightbox
        if (this.lightbox) this.lightbox.destroy();
        this.lightbox = GLightbox({ 
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            zoomable: true,
            draggable: true
        });
    },

    initSwiper() {
        if (this.swiper) this.swiper.destroy();
        
        this.swiper = new Swiper(".portfolioSwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });
    },

    closeGallery() {
        const container = document.getElementById('gallery-container');
        container.classList.add('d-none');
        // Scroll back to portfolio section
        document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
