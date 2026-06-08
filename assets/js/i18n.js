const I18n = {
    lang: localStorage.getItem('ufix_lang') || 'th',
    translations: {},
    renderers: [],
    isReady: false,

    // 100% Complete Fallback to ensure UI never shows keys
    fallback: {
        "th": {
            "nav_home": "หน้าแรก", "nav_about": "เกี่ยวกับเรา", "nav_services": "บริการ",
            "nav_portfolio": "ผลงาน", "nav_blog": "บทความ", "nav_contact": "ติดต่อเรา",
            "cta_quote": "ขอใบเสนอราคา", "cta_contact": "ติดต่อเรา", "cta_learn_more": "รู้จักเรา",
            "section_about_title": "เกี่ยวกับเรา", "about_desc": "ผู้เชี่ยวชาญด้านงานซ่อมแซมและบำรุงรักษาอาคารครบวงจร",
            "about_list_1": "งานโรยตัวอาคารสูง", "about_list_2": "ระบบกันซึม", "about_list_3": "งานทาสี", "about_list_4": "งานระบบไฟฟ้า",
            "section_services_title": "บริการของเรา", "section_why_title": "ทำไมต้องเลือกเรา",
            "why_pro_title": "ทีมงานมืออาชีพ", "why_pro_desc": "วิศวกรผู้ชำนาญการ",
            "why_safety_title": "มาตรฐานความปลอดภัย", "why_safety_desc": "ปลอดภัย 100%",
            "why_time_title": "ตรงต่อเวลา", "why_time_desc": "ส่งมอบงานตามกำหนด",
            "section_portfolio_title": "ผลงานที่ผ่านมา", "section_blog_title": "บทความน่ารู้", "section_contact_title": "ติดต่อเรา",
            "contact_info_title": "ข้อมูลติดต่อ", "contact_form_title": "ส่งข้อความหาเรา",
            "form_name": "ชื่อ-นามสกุล", "form_email": "อีเมล", "form_phone": "เบอร์โทรศัพท์", "form_message": "ข้อความ", "form_submit": "ส่งข้อความ",
            "footer_desc": "ผู้นำด้านการซ่อมแซมและบำรุงรักษาอาคารอย่างมืออาชีพ ปลอดภัย และมีคุณภาพ",
            "footer_menu": "เมนู", "footer_legal": "กฎหมาย", "footer_privacy": "นโยบายความเป็นส่วนตัว", "footer_terms": "ข้อกำหนดและเงื่อนไข", "footer_cookie_policy": "นโยบายคุกกี้",
            "cookie_title": "ความเป็นส่วนตัวของคุณ", "cookie_desc": "เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพการใช้งาน", "cookie_accept": "ยอมรับ", "cookie_reject": "ปฏิเสธ"
        },
        "en": {
            "nav_home": "Home", "nav_about": "About Us", "nav_services": "Services",
            "nav_portfolio": "Portfolio", "nav_blog": "Blog", "nav_contact": "Contact",
            "cta_quote": "Get a Quote", "cta_contact": "Contact Us", "cta_learn_more": "Learn More",
            "section_about_title": "About Us", "about_desc": "Integrated Building Repair and Maintenance Specialists",
            "about_list_1": "Rope Access Services", "about_list_2": "Waterproofing", "about_list_3": "Painting", "about_list_4": "Electrical Systems",
            "section_services_title": "Our Services", "section_why_title": "Why Choose Us",
            "why_pro_title": "Professional Team", "why_pro_desc": "Expert Engineers",
            "why_safety_title": "Safety Standards", "why_safety_desc": "100% Safe",
            "why_time_title": "On Time Delivery", "why_time_desc": "Scheduled Delivery",
            "section_portfolio_title": "Our Portfolio", "section_blog_title": "Blog & Articles", "section_contact_title": "Contact Us",
            "contact_info_title": "Contact Info", "contact_form_title": "Send Us a Message",
            "form_name": "Full Name", "form_email": "Email", "form_phone": "Phone", "form_message": "Message", "form_submit": "Send Message",
            "footer_desc": "Leading professional, safe, and quality building repair specialist.",
            "footer_menu": "Menu", "footer_legal": "Legal", "footer_privacy": "Privacy Policy", "footer_terms": "Terms", "footer_cookie_policy": "Cookie Policy",
            "cookie_title": "Your Privacy", "cookie_desc": "We use cookies to enhance your experience", "cookie_accept": "Accept", "cookie_reject": "Reject"
        }
    },

    async init() {
        try {
            const res = await fetch('assets/data/language.json');
            if (!res.ok) throw new Error('Fetch failed');
            this.translations = await res.json();
        } catch (error) {
            console.warn('I18n: Using fallback dictionary.');
            this.translations = this.fallback;
        } finally {
            this.isReady = true;
            this.apply();
            this.renderers.forEach(render => render());
        }
    },

    registerRenderer(renderer) {
        this.renderers.push(renderer);
        if (this.isReady) renderer();
    },

    setLang(lang) {
        this.lang = lang;
        localStorage.setItem('ufix_lang', lang);
        this.apply();
        this.renderers.forEach(render => render());
    },

    t(key) {
        if (!this.translations[this.lang]) return this.fallback[this.lang][key] || key;
        return this.translations[this.lang][key] || this.fallback[this.lang][key] || key;
    },

    getLocalizedText(field) {
        if (!field) return '';
        if (typeof field === 'object') {
            return field[this.lang] || field.th || '';
        }
        return field;
    },

    apply() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerText = this.t(key);
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        document.documentElement.lang = this.lang;
    }
};

I18n.init();
