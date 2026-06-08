const STORAGE_KEY = 'ufix_decor_data';

const Storage = {
    isReady: false,
    onReady: [],
    
    fallbackData: {
        "site": {
            "name": { "th": "บริษัท ยูฟิกซ์ เดคอร์ เซอร์วิส จำกัด", "en": "Ufix Decor Service Co., Ltd." },
            "logo_url": "https://via.placeholder.com/200x60?text=Ufix+Decor+Service",
            "logo_width": "200",
            "logo_height": "50",
            "favicon_url": "https://via.placeholder.com/32?text=U",
            "phone": "084-996-7957",
            "email": "ufixdecor.service21@gmail.com",
            "line": "@Ufix.service01",
            "address": {
                "th": "873/10 ซอยกรุงเทพฯ - นนทบุรี 23/1 ถนนกรุงเทพฯ - นนทบุรี แขวงบางซื่อ เขตบางซื่อ กรุงเทพมหานคร 10800",
                "en": "873/10 Soi Bangkok - Nonthaburi 23/1, Bangkok - Nonthaburi Rd, Bang Sue, Bangkok 10800"
            },
            "maps_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3874.341496359528!2d100.5255473!3d13.818318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ5JzA2LjAiTiAxMDDCsDMxJzMyLjAiRQ!5e0!3m2!1sth!2sth!4v1717830000000!5m2!1sth!2sth",
            "footer_desc": {
                "th": "ผู้เชี่ยวชาญด้านงานวิศวกรรมอาคารและการบำรุงรักษาครบวงจร ด้วยประสบการณ์ที่ยาวนานและทีมงานมืออาชีพ",
                "en": "Specialists in integrated building engineering and maintenance with long experience and a professional team."
            }
        },
        "seo": {
            "title": { "th": "ยูฟิกซ์ เดคอร์ เซอร์วิส | ซ่อมแซมและบำรุงรักษาอาคารครบวงจร", "en": "Ufix Decor Service | Integrated Building Repair & Maintenance" },
            "desc": { "th": "บริการซ่อมแซมอาคาร แก้ไขน้ำรั่วซึม ซ่อมรอยร้าว งานโรยตัวอาคารสูง ทาสีอาคาร และบำรุงรักษาอาคารครบวงจร", "en": "Building repair services, leak fixing, crack repair, rope access, building painting, and integrated maintenance." },
            "keywords": "ซ่อมอาคาร, น้ำรั่ว, รอยร้าว, โรยตัว, ทาสีอาคาร, building repair, waterproofing, painting"
        },
        "hero": {
            "title": { "th": "ผู้เชี่ยวชาญด้านงานซ่อมแซมและบำรุงรักษาอาคารครบวงจร", "en": "Integrated Building Repair and Maintenance Specialists" },
            "desc": { "th": "ดูแล ซ่อมแซม และปรับปรุงอาคารทุกประเภท โดยทีมงานมืออาชีพ", "en": "Providing professional care, repair, and renovation for all types of buildings." },
            "bg_image": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920"
        },
        "about": {
            "title": { "th": "เกี่ยวกับเรา", "en": "About Us" },
            "desc": {
                "th": "บริษัท ยูฟิกซ์ เดคอร์ เซอร์วิส จำกัด เป็นผู้เชี่ยวชาญด้านงานวิศวกรรมอาคารและการบำรุงรักษาครบวงจร ด้วยประสบการณ์ที่ยาวนานและทีมงานมืออาชีพ เรามุ่งมั่นส่งมอบงานที่มีคุณภาพและมาตรฐานความปลอดภัยสูงสุด",
                "en": "Ufix Decor Service Co., Ltd. is a specialist in integrated building engineering and maintenance. With extensive experience and a professional team, we are committed to delivering quality work and the highest safety standards."
            },
            "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
            "list": [
                { "th": "งานโรยตัวอาคารสูง (Rope Access)", "en": "High-rise Building Rope Access" },
                { "th": "ระบบกันซึมและซ่อมรอยร้าว (Waterproofing)", "en": "Waterproofing and Crack Repair" },
                { "th": "งานทาสีและรีโนเวทอาคาร", "en": "Building Painting and Renovation" },
                { "th": "งานระบบไฟฟ้าและประปา", "en": "Electrical and Plumbing Systems" }
            ]
        },
        "why": {
            "title": { "th": "ทำไมต้องเลือกเรา", "en": "Why Choose Us" },
            "items": [
                {
                    "icon": "fas fa-hard-hat",
                    "title": { "th": "ทีมงานมืออาชีพ", "en": "Professional Team" },
                    "desc": { "th": "ทีมงานวิศวกรและช่างผู้ชำนาญการ", "en": "Expert engineers and skilled technicians" }
                },
                {
                    "icon": "fas fa-shield-alt",
                    "title": { "th": "มาตรฐานความปลอดภัย", "en": "Safety Standards" },
                    "desc": { "th": "ปลอดภัย 100% ในทุกขั้นตอนการทำงาน", "en": "100% safe in every step of operation" }
                },
                {
                    "icon": "fas fa-clock",
                    "title": { "th": "ตรงต่อเวลา", "en": "On Time Delivery" },
                    "desc": { "th": "ส่งมอบงานตามกำหนดการที่ชัดเจน", "en": "Delivery according to clear schedules" }
                }
            ]
        },
        "services": [
            {
                "id": 1,
                "title": { "th": "งานซ่อมรอยร้าวอาคาร", "en": "Building Crack Repair" },
                "desc": { "th": "แก้ไขปัญหาโครงสร้าง รอยแตกร้าวผนัง เพื่อความมั่นคง", "en": "Fixing structural issues and wall cracks for stability." },
                "image": "https://images.unsplash.com/photo-1590069230002-70cc6a27bb75?auto=format&fit=crop&q=80&w=800"
            }
        ],
        "portfolio": [
            {
                "id": 1,
                "title": { "th": "โครงการซ่อมทาสีคอนโด A", "en": "Condo A Painting Project" },
                "desc": { "th": "งานโรยตัวทาสีและเก็บรอยรั่วซึมรอบอาคาร", "en": "Rope access painting and leak repair around the building." },
                "image_before": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
                "image_after": "https://images.unsplash.com/photo-1562663474-6cbb3fee4c72?auto=format&fit=crop&q=80&w=800"
            }
        ],
        "blog": [],
        "theme": {
            "primary": "#002E6D",
            "accent": "#FF7A00"
        },
        "legal": {
            "privacy": { 
                "th": "<h3>นโยบายความเป็นส่วนตัว</h3><p>เราให้ความสำคัญกับข้อมูลส่วนบุคคลของคุณ...</p>", 
                "en": "<h3>Privacy Policy</h3><p>We value your personal data...</p>" 
            },
            "terms": { 
                "th": "<h3>ข้อกำหนดและเงื่อนไข</h3><p>การเข้าใช้งานเว็บไซต์นี้...</p>", 
                "en": "<h3>Terms and Conditions</h3><p>Using this website...</p>" 
            },
            "cookie": { 
                "th": "<h3>นโยบายคุกกี้</h3><p>เราใช้คุกกี้เพื่อ...</p>", 
                "en": "<h3>Cookie Policy</h3><p>We use cookies to...</p>" 
            }
        },
        "ui": {
            "nav_home": { "th": "หน้าแรก", "en": "Home" },
            "nav_about": { "th": "เกี่ยวกับเรา", "en": "About Us" },
            "nav_services": { "th": "บริการ", "en": "Services" },
            "nav_portfolio": { "th": "ผลงาน", "en": "Portfolio" },
            "nav_blog": { "th": "บทความ", "en": "Blog" },
            "nav_contact": { "th": "ติดต่อเรา", "en": "Contact" },
            "cta_quote": { "th": "ขอใบเสนอราคา", "en": "Get a Quote" },
            "cta_contact": { "th": "ติดต่อเรา", "en": "Contact Us" },
            "cta_learn_more": { "th": "รู้จักเรา", "en": "Learn More" },
            "read_more": { "th": "อ่านต่อ", "en": "Read More" },
            "section_about_title": { "th": "เกี่ยวกับเรา", "en": "About Us" },
            "section_services_title": { "th": "บริการของเรา", "en": "Our Services" },
            "section_why_title": { "th": "ทำไมต้องเลือกเรา", "en": "Why Choose Us" },
            "section_portfolio_title": { "th": "ผลงานที่ผ่านมา", "en": "Our Portfolio" },
            "section_blog_title": { "th": "บทความน่ารู้", "en": "Blog & Articles" },
            "section_contact_title": { "th": "ติดต่อเรา", "en": "Contact Us" },
            "contact_info_title": { "th": "ข้อมูลติดต่อ", "en": "Contact Information" },
            "contact_form_title": { "th": "ส่งข้อความหาเรา", "en": "Send Us a Message" },
            "form_name": { "th": "ชื่อ-นามสกุล", "en": "Full Name" },
            "form_email": { "th": "อีเมล", "en": "Email" },
            "form_phone": { "th": "เบอร์โทรศัพท์", "en": "Phone Number" },
            "form_message": { "th": "ข้อความ", "en": "Message" },
            "form_submit": { "th": "ส่งข้อความ", "en": "Send Message" },
            "footer_menu": { "th": "เมนู", "en": "Menu" },
            "footer_legal": { "th": "กฎหมาย", "en": "Legal" },
            "cookie_title": { "th": "ความพึงพอใจของคุณ", "en": "Your Privacy" },
            "cookie_accept": { "th": "ยอมรับทั้งหมด", "en": "Accept All" },
            "cookie_reject": { "th": "ปฏิเสธ", "en": "Reject" },
            "cookie_settings": { "th": "ตั้งค่าคุกกี้", "en": "Cookie Settings" }
        }
    },

    async init() {
        let rawData = localStorage.getItem(STORAGE_KEY);
        let data = rawData ? JSON.parse(rawData) : null;

        if (!data) {
            this.save(this.fallbackData);
        } else {
            // Deep Auto-Repair Missing Keys
            let repaired = false;
            Object.keys(this.fallbackData).forEach(key => {
                if (!data[key]) {
                    data[key] = this.fallbackData[key];
                    repaired = true;
                } else if (typeof this.fallbackData[key] === 'object' && !Array.isArray(this.fallbackData[key])) {
                    // Check sub-keys for objects (like site, hero, about, etc.)
                    Object.keys(this.fallbackData[key]).forEach(subKey => {
                        if (data[key][subKey] === undefined) {
                            data[key][subKey] = this.fallbackData[key][subKey];
                            repaired = true;
                        }
                    });
                }
            });
            if (repaired) {
                console.log('Storage: Deep repair completed.');
                this.save(data);
            }
        }

        this.isReady = true;
        this.onReady.forEach(cb => cb());
    },

    get() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('storage_updated'));
    },

    reset() {
        if (!confirm('คุณต้องการล้างข้อมูลทั้งหมดและกลับไปใช้ค่าเริ่มต้นใช่หรือไม่? (การแก้ไขทั้งหมดจะหายไป)')) return;
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('ufix_lang');
        location.reload();
    },

    exportJSON() {
        const data = this.get();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ufix_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
    }
};

Storage.init();
