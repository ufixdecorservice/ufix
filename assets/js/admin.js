const Admin = {
    user: 'admin',
    pass: 'admin123',
    currentSection: 'hero',
    editingIndex: -1,
    
    init() {
        console.log('Admin CMS Elite V1.1 Initializing...');
        if (sessionStorage.getItem('admin_logged_in') === 'true') {
            this.showPanel();
        }

        const form = document.getElementById('login-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const u = document.getElementById('username').value;
                const p = document.getElementById('password').value;
                if (u === this.user && p === this.pass) {
                    sessionStorage.setItem('admin_logged_in', 'true');
                    this.showPanel();
                } else {
                    const err = document.getElementById('login-error');
                    if (err) err.classList.remove('d-none');
                }
            };
        }
        this.initNavigation();
        
        // Ensure Admin is globally accessible for inline onclick events
        window.Admin = this;
    },

    showPanel() {
        document.getElementById('login-screen')?.classList.add('d-none');
        document.getElementById('admin-panel')?.classList.remove('d-none');
        
        if (Storage.isReady) {
            this.loadSection('hero');
        } else {
            Storage.onReady.push(() => this.loadSection('hero'));
        }
    },

    initNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                this.loadSection(link.dataset.section);
            };
        });
    },

    loadSection(section) {
        console.log('Loading section:', section);
        this.currentSection = section;
        this.editingIndex = -1;
        const data = Storage.get();
        const container = document.getElementById('editor-container');
        if (!data || !container) return;

        try {
            let html = '';
            switch(section) {
                case 'hero': html = this.renderHeroEditor(data.hero); break;
                case 'about': html = this.renderAboutEditor(data.about); break;
                case 'services': html = this.renderListEditor('Services', data.services); break;
                case 'why': html = this.renderWhyEditor(data.why); break;
                case 'portfolio': html = this.renderListEditor('Portfolio', data.portfolio); break;
                case 'blog': html = this.renderListEditor('Blog Articles', data.blog); break;
                case 'site': html = this.renderSiteEditor(data.site); break;
                case 'seo': html = this.renderSEOEditor(data.seo); break;
                case 'ui': html = this.renderUIEditor(data.ui); break;
                case 'legal': html = this.renderLegalEditor(data.legal); break;
                case 'theme': html = this.renderThemeEditor(data, data.theme); break;
            }

            container.innerHTML = html;
        } catch (err) {
            console.error('Render Error:', err);
            container.innerHTML = `<div class="alert alert-danger">
                <h5><i class="fas fa-exclamation-triangle me-2"></i> ไม่สามารถโหลดส่วนนี้ได้</h5>
                <p>เกิดข้อผิดพลาดในการดึงข้อมูลส่วน ${section} อาจมีโครงสร้างข้อมูลไม่สมบูรณ์</p>
                <button class="btn btn-outline-danger btn-sm" onclick="Storage.reset()">ล้างข้อมูลและเริ่มใหม่</button>
            </div>`;
        }
        window.scrollTo(0, 0);
    },

    // --- HELPERS ---

    renderUIEditor(ui) {
        let html = '<h3 class="mb-4">🔡 UI Labels (ชื่อเมนูและป้ายกำกับ)</h3><div class="card p-4 shadow-sm border-0">';
        Object.keys(ui).forEach(key => {
            html += this.renderMultilingual(`Label: ${key}`, `ui_${key}`, ui[key]);
        });
        html += '</div>';
        return html;
    },

    renderInput(label, id, value, type = 'text', hint = '') {
        return `
            <div class="mb-3">
                <label class="fw-bold small mb-1">${label}</label>
                <input type="${type}" class="form-control" id="${id}" value="${value || ''}">
                ${hint ? `<div class="form-text small">${hint}</div>` : ''}
            </div>
        `;
    },

    renderTextarea(label, id, value, rows = 3) {
        return `
            <div class="mb-3">
                <label class="fw-bold small mb-1">${label}</label>
                <textarea class="form-control" id="${id}" rows="${rows}">${value || ''}</textarea>
            </div>
        `;
    },

    renderMultilingual(label, idPrefix, data, isTextarea = false) {
        return `
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold small mb-1">${label} (TH)</label>
                    ${isTextarea ? 
                        `<textarea class="form-control" id="${idPrefix}_th" rows="3">${data?.th || ''}</textarea>` : 
                        `<input type="text" class="form-control" id="${idPrefix}_th" value="${data?.th || ''}">`}
                </div>
                <div class="col-md-6">
                    <label class="fw-bold small mb-1">${label} (EN)</label>
                    ${isTextarea ? 
                        `<textarea class="form-control" id="${idPrefix}_en" rows="3">${data?.en || ''}</textarea>` : 
                        `<input type="text" class="form-control" id="${idPrefix}_en" value="${data?.en || ''}">`}
                </div>
            </div>
        `;
    },

    renderImageUpload(label, id, currentUrl) {
        return `
            <div class="mb-3">
                <label class="fw-bold small mb-1">${label}</label>
                <div class="d-flex gap-2 mb-2">
                    <input type="file" class="form-control" onchange="Admin.handleImageUpload(this, '${id}_preview', '${id}_url')">
                    <input type="text" class="form-control" id="${id}_url" value="${currentUrl || ''}" placeholder="Image URL">
                </div>
                <div class="border p-2 bg-light rounded text-center" style="min-height: 100px;">
                    <img id="${id}_preview" src="${currentUrl || ''}" style="max-height: 150px; max-width: 100%;" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                </div>
            </div>
        `;
    },

    // --- RENDERERS ---

    renderHeroEditor(hero) {
        return `
            <h3 class="mb-4">🚀 หน้าแรก (Hero Section)</h3>
            <div class="card p-4 shadow-sm border-0">
                ${this.renderMultilingual('หัวข้อหลัก (Title)', 'hero_title', hero.title)}
                ${this.renderMultilingual('คำโปรย (Description)', 'hero_desc', hero.desc, true)}
                ${this.renderImageUpload('รูปพื้นหลัง (Background Image)', 'hero_bg', hero.bg_image)}
            </div>
        `;
    },

    renderAboutEditor(about) {
        let listHtml = about.list.map((item, i) => `
            <div class="row mb-2">
                <div class="col-5"><input type="text" class="form-control form-control-sm" id="about_list_th_${i}" value="${item.th}"></div>
                <div class="col-5"><input type="text" class="form-control form-control-sm" id="about_list_en_${i}" value="${item.en}"></div>
                <div class="col-2"><button class="btn btn-sm btn-danger" onclick="this.parentElement.parentElement.remove()">Del</button></div>
            </div>
        `).join('');

        return `
            <h3 class="mb-4">ℹ️ เกี่ยวกับเรา (About Us)</h3>
            <div class="card p-4 shadow-sm border-0 mb-4">
                ${this.renderMultilingual('หัวข้อหลัก (Title)', 'about_title', about.title)}
                ${this.renderMultilingual('รายละเอียด (Description)', 'about_desc', about.desc, true)}
                ${this.renderImageUpload('รูปภาพประกอบ', 'about_img', about.image)}
            </div>
            <div class="card p-4 shadow-sm border-0">
                <h5 class="mb-3">รายการคุณสมบัติ (Checklist Items)</h5>
                <div id="about-list-container">${listHtml}</div>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="Admin.addAboutListItem()">+ เพิ่มรายการ</button>
            </div>
        `;
    },

    addAboutListItem() {
        const div = document.createElement('div');
        div.className = 'row mb-2';
        div.innerHTML = `
            <div class="col-5"><input type="text" class="form-control form-control-sm" value=""></div>
            <div class="col-5"><input type="text" class="form-control form-control-sm" value=""></div>
            <div class="col-2"><button class="btn btn-sm btn-danger" onclick="this.parentElement.parentElement.remove()">Del</button></div>
        `;
        document.getElementById('about-list-container').appendChild(div);
    },

    renderWhyEditor(why) {
        let itemsHtml = why.items.map((item, index) => `
            <div class="card p-3 mb-3 border-start border-4 border-primary shadow-sm item-why">
                <div class="row">
                    <div class="col-md-2 mb-3">
                        <label class="fw-bold small d-block">Icon (FontAwesome)</label>
                        <input type="text" class="form-control mb-2" id="why_icon_${index}" value="${item.icon}">
                        <div class="text-center p-2 border bg-light rounded"><i class="${item.icon} fa-2x"></i></div>
                    </div>
                    <div class="col-md-10">
                        ${this.renderMultilingual('หัวข้อ', `why_title_${index}`, item.title)}
                        ${this.renderMultilingual('คำอธิบาย', `why_desc_${index}`, item.desc, true)}
                    </div>
                </div>
            </div>
        `).join('');
        return `<h3 class="mb-4">❓ ทำไมต้องเลือกเรา (Why Choose Us)</h3>
                <div class="card p-4 shadow-sm border-0 mb-3">${this.renderMultilingual('หัวข้อส่วนนี้', 'why_section_title', why.title)}</div>
                ${itemsHtml}`;
    },

    renderSiteEditor(site) {
        return `
            <h3 class="mb-4">📞 ข้อมูลติดต่อ & ทั่วไป</h3>
            <div class="row">
                <div class="col-md-8">
                    <div class="card p-4 shadow-sm border-0 mb-4">
                        <h5>โลโก้ & ชื่อบริษัท</h5>
                        ${this.renderImageUpload('Logo URL', 'site_logo', site.logo_url)}
                        <div class="row">
                            <div class="col-md-6">${this.renderInput('ความกว้างโลโก้ (px)', 'site_logo_width', site.logo_width, 'number', 'เช่น 200')}</div>
                            <div class="col-md-6">${this.renderInput('ความสูงสูงสุด (px)', 'site_logo_height', site.logo_height, 'number', 'เช่น 50')}</div>
                        </div>
                        <hr>
                        <h5>ไอคอนเบราว์เซอร์ (Favicon)</h5>
                        ${this.renderImageUpload('Favicon URL', 'site_favicon', site.favicon_url)}
                        <div class="form-text small text-muted mb-3">แนะนำรูปจัตุรัสขนาด 32x32 หรือ 64x64 พิกเซล</div>
                        <hr>
                        ${this.renderMultilingual('ชื่อบริษัท', 'site_name', site.name)}
                    </div>
                    <div class="card p-4 shadow-sm border-0 mb-4">
                        <h5>ที่อยู่ & ช่องทางติดต่อ</h5>
                        ${this.renderMultilingual('ที่อยู่ (Address)', 'site_address', site.address, true)}
                        <div class="row">
                            <div class="col-md-6">${this.renderInput('เบอร์โทรศัพท์', 'site_phone', site.phone)}</div>
                            <div class="col-md-6">${this.renderInput('อีเมล', 'site_email', site.email)}</div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">${this.renderInput('LINE ID (ใส่ @ ด้วย)', 'site_line', site.line)}</div>
                            <div class="col-md-6">${this.renderInput('Google Maps Embed URL', 'site_maps', site.maps_url, 'text', 'คัดลอกจาก <a href="https://maps.google.com" target="_blank">Google Maps</a> > Share > Embed map > คัดลอกเฉพาะ URL ใน src="..."')}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card p-4 shadow-sm border-0 mb-4 h-100">
                        <h5>Footer (ท้ายหน้า)</h5>
                        ${this.renderMultilingual('คำอธิบายสั้นๆ ที่ Footer', 'site_footer_desc', site.footer_desc, true)}
                    </div>
                </div>
            </div>
        `;
    },

    renderSEOEditor(seo) {
        return `
            <h3 class="mb-4">🔍 การตั้งค่า SEO (Search Engine Optimization)</h3>
            <div class="card p-4 shadow-sm border-0">
                ${this.renderMultilingual('Page Title (ชื่อแท็บหน้าเว็บ)', 'seo_title', seo.title)}
                ${this.renderMultilingual('Meta Description (คำอธิบายในผลการค้นหา)', 'seo_desc', seo.desc, true)}
                ${this.renderInput('Keywords (คำค้นหา คั่นด้วยจุลภาค)', 'seo_keywords', seo.keywords)}
                <div class="alert alert-info small mt-3">
                    <i class="fas fa-info-circle me-2"></i> การตั้งค่าเหล่านี้จะช่วยให้เว็บไซต์ของคุณถูกค้นหาพบบน Google ได้ง่ายขึ้น
                </div>
            </div>
        `;
    },

    renderLegalEditor(legal) {
        return `
            <h3 class="mb-4">⚖️ กฎหมาย & นโยบายความเป็นส่วนตัว (PDPA)</h3>
            <div class="card p-4 shadow-sm border-0 mb-4">
                <h5>นโยบายความเป็นส่วนตัว (Privacy Policy)</h5>
                ${this.renderMultilingual('เนื้อหา (รองรับ HTML)', 'legal_privacy', legal.privacy, true)}
            </div>
            <div class="card p-4 shadow-sm border-0 mb-4">
                <h5>ข้อกำหนดและเงื่อนไข (Terms & Conditions)</h5>
                ${this.renderMultilingual('เนื้อหา (รองรับ HTML)', 'legal_terms', legal.terms, true)}
            </div>
            <div class="card p-4 shadow-sm border-0">
                <h5>นโยบายคุกกี้ (Cookie Policy)</h5>
                ${this.renderMultilingual('เนื้อหา (รองรับ HTML)', 'legal_cookie', legal.cookie, true)}
            </div>
        `;
    },

    renderThemeEditor(data, theme) {
        return `
            <h3 class="mb-4">🎨 การออกแบบ & ธีมสี</h3>
            <div class="card p-4 shadow-sm border-0 mb-4">
                <h5>โทนสีหลักของแบรนด์</h5>
                <div class="row">
                    <div class="col-md-6">
                        <label class="fw-bold small mb-1">Primary Color (สีหลัก - เช่น สีน้ำเงินบริษัท)</label>
                        <div class="d-flex gap-2 align-items-center">
                            <input type="color" class="form-control form-control-color" id="theme_primary" value="${theme.primary}">
                            <input type="text" class="form-control" value="${theme.primary}" readonly>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="fw-bold small mb-1">Accent Color (สีเน้น - เช่น สีส้มตัด)</label>
                        <div class="d-flex gap-2 align-items-center">
                            <input type="color" class="form-control form-control-color" id="theme_accent" value="${theme.accent}">
                            <input type="text" class="form-control" value="${theme.accent}" readonly>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card p-4 shadow-sm border-0 text-center bg-light">
                <h5>ตัวอย่าง (Preview)</h5>
                <hr>
                <div class="p-3 rounded mb-2" style="background:${theme.primary}; color:white;">สีหลัก (Primary)</div>
                <button class="btn" style="background:${theme.accent}; color:white;">ปุ่มตัวอย่าง (Accent)</button>
            </div>
        `;
    },

    renderListEditor(title, list) {
        let listHtml = list.map((item, index) => {
            let thumb = this.currentSection === 'portfolio' ? item.image_after : item.image;
            return `
                <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                    <div class="d-flex align-items-center">
                        <img src="${thumb || 'https://via.placeholder.com/50'}" style="width:50px; height:50px; object-fit:cover;" class="rounded me-3 border">
                        <div>
                            <div class="fw-bold">${item.title?.th || 'No Title'}</div>
                            <div class="small text-muted">${item.title?.en || 'No English Title'}</div>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-primary me-1" onclick="Admin.editItem(${index})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="Admin.deleteItem(${index})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>${title}</h3>
                <button class="btn btn-primary" onclick="Admin.addNewItem()"><i class="fas fa-plus me-2"></i> เพิ่มรายการใหม่</button>
            </div>
            <div class="card p-4 shadow-sm border-0" id="list-container">
                ${listHtml || '<div class="text-center py-4 text-muted">ไม่พบข้อมูล กรุณาเพิ่มรายการใหม่</div>'}
            </div>
            <div id="item-form-container" class="mt-4 d-none"></div>
        `;
    },

    // --- ACTIONS ---

    handleImageUpload(input, imgId, urlInputId) {
        const file = input.files[0];
        if (!file) return;

        // Check file size (limit to 1MB for localStorage safety)
        if (file.size > 1024 * 1024) {
            alert('รูปภาพมีขนาดใหญ่เกินไป (จำกัด 1MB) กรุณาใช้ไฟล์รูปที่เล็กลงหรือใช้ URL รูปจากภายนอกแทนครับ');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            const imgEl = document.getElementById(imgId);
            const urlEl = document.getElementById(urlInputId);
            if (imgEl) imgEl.src = base64;
            if (urlEl) urlEl.value = base64;
            input.dataset.base64 = base64;
        };
        reader.readAsDataURL(file);
    },

    addNewItem() { this.editingIndex = -1; this.showItemForm(); },
    editItem(index) { this.editingIndex = index; this.showItemForm(); },
    deleteItem(index) {
        if (!confirm('ยืนยันการลบรายการนี้ใช่หรือไม่?')) return;
        const d = Storage.get();
        d[this.currentSection].splice(index, 1);
        Storage.save(d);
        this.loadSection(this.currentSection);
    },

    showItemForm() {
        const d = Storage.get();
        const item = this.editingIndex > -1 ? d[this.currentSection][this.editingIndex] : {};
        const container = document.getElementById('item-form-container');
        const listContainer = document.getElementById('list-container');
        
        container.classList.remove('d-none');
        listContainer.classList.add('d-none');
        document.querySelector('.btn-primary')?.classList.add('d-none');

        let fields = '';
        if (this.currentSection === 'services' || this.currentSection === 'blog') {
            const ks = this.currentSection === 'blog' ? ['title', 'content'] : ['title', 'desc'];
            fields = this.renderMultilingual('หัวข้อ', `f_${ks[0]}`, item[ks[0]]) + 
                     this.renderMultilingual('เนื้อหา/รายละเอียด', `f_${ks[1]}`, item[ks[1]], true) +
                     this.renderImageUpload('รูปภาพประกอบ', 'f_img', item.image);
        } else if (this.currentSection === 'portfolio') {
            fields = this.renderMultilingual('หัวข้อโครงการ', 'f_title', item.title) + 
                     this.renderMultilingual('รายละเอียด', 'f_desc', item.desc, true) + 
                     `<div class="row">
                        <div class="col-md-6">${this.renderImageUpload('รูปภาพก่อนทำ (Before)', 'f_img_b', item.image_before)}</div>
                        <div class="col-md-6">${this.renderImageUpload('รูปภาพหลังทำ (After)', 'f_img_a', item.image_after)}</div>
                      </div>`;
        }

        container.innerHTML = `
            <div class="card p-4 shadow border-0">
                <h5>${this.editingIndex > -1 ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}</h5>
                <hr>
                ${fields}
                <div class="mt-4">
                    <button class="btn btn-success me-2 px-4" onclick="Admin.saveItem()"><i class="fas fa-save me-2"></i> บันทึกรายการนี้</button> 
                    <button class="btn btn-outline-secondary" onclick="Admin.loadSection(Admin.currentSection)">ยกเลิก</button>
                </div>
            </div>
        `;
    },

    saveItem() {
        console.log('Saving list item...');
        const d = Storage.get();
        let item = this.editingIndex > -1 ? d[this.currentSection][this.editingIndex] : { id: Date.now() };
        
        try {
            if (this.currentSection === 'services' || this.currentSection === 'blog') {
                const kTitle = 'title';
                const kDesc = this.currentSection === 'blog' ? 'content' : 'desc';
                item[kTitle] = { th: document.getElementById(`f_${kTitle}_th`).value, en: document.getElementById(`f_${kTitle}_en`).value };
                item[kDesc] = { th: document.getElementById(`f_${kDesc}_th`).value, en: document.getElementById(`f_${kDesc}_en`).value };
                item.image = document.getElementById('f_img_url').value;
            } else if (this.currentSection === 'portfolio') {
                item.title = { th: document.getElementById(`f_title_th`).value, en: document.getElementById(`f_title_en`).value };
                item.desc = { th: document.getElementById(`f_desc_th`).value, en: document.getElementById(`f_desc_en`).value };
                item.image_before = document.getElementById('f_img_b_url').value;
                item.image_after = document.getElementById('f_img_a_url').value;
            }

            if (this.editingIndex === -1) d[this.currentSection].push(item);
            Storage.save(d);
            alert('บันทึกรายการสำเร็จ! 🎉');
            this.loadSection(this.currentSection);
        } catch (err) {
            console.error('Save Item Error:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกรายการ: ' + err.message);
        }
    },

    save() {
        const d = Storage.get();
        const s = this.currentSection;
        console.log('Global Save triggered for section:', s);

        // If currently editing an item in a list, call saveItem instead
        if (this.editingIndex !== -1 || (document.getElementById('item-form-container') && !document.getElementById('item-form-container').classList.contains('d-none'))) {
            this.saveItem();
            return;
        }

        try {
            if (s === 'hero') {
                d.hero.title = { th: document.getElementById('hero_title_th').value, en: document.getElementById('hero_title_en').value };
                d.hero.desc = { th: document.getElementById('hero_desc_th').value, en: document.getElementById('hero_desc_en').value };
                d.hero.bg_image = document.getElementById('hero_bg_url').value;
            } else if (s === 'about') {
                d.about.title = { th: document.getElementById('about_title_th').value, en: document.getElementById('about_title_en').value };
                d.about.desc = { th: document.getElementById('about_desc_th').value, en: document.getElementById('about_desc_en').value };
                d.about.image = document.getElementById('about_img_url').value;
                
                const listItems = document.querySelectorAll('#about-list-container .row');
                d.about.list = Array.from(listItems).map(row => {
                    const inputs = row.querySelectorAll('input');
                    return { th: inputs[0].value, en: inputs[1].value };
                }).filter(it => it.th || it.en);
            } else if (s === 'why') {
                d.why.title = { th: document.getElementById('why_section_title_th').value, en: document.getElementById('why_section_title_en').value };
                d.why.items.forEach((it, i) => {
                    it.icon = document.getElementById(`why_icon_${i}`).value;
                    it.title = { th: document.getElementById(`why_title_${i}_th`).value, en: document.getElementById(`why_title_${i}_en`).value };
                    it.desc = { th: document.getElementById(`why_desc_${i}_th`).value, en: document.getElementById(`why_desc_${i}_en`).value };
                });
            } else if (s === 'site') {
                d.site.logo_url = document.getElementById('site_logo_url').value;
                d.site.logo_width = document.getElementById('site_logo_width').value;
                d.site.logo_height = document.getElementById('site_logo_height').value;
                d.site.favicon_url = document.getElementById('site_favicon_url').value;
                d.site.name = { th: document.getElementById('site_name_th').value, en: document.getElementById('site_name_en').value };
                d.site.address = { th: document.getElementById('site_address_th').value, en: document.getElementById('site_address_en').value };
                d.site.phone = document.getElementById('site_phone').value;
                d.site.email = document.getElementById('site_email').value;
                d.site.line = document.getElementById('site_line').value;
                d.site.maps_url = document.getElementById('site_maps').value;
                d.site.footer_desc = { th: document.getElementById('site_footer_desc_th').value, en: document.getElementById('site_footer_desc_en').value };
            } else if (s === 'seo') {
                d.seo.title = { th: document.getElementById('seo_title_th').value, en: document.getElementById('seo_title_en').value };
                d.seo.desc = { th: document.getElementById('seo_desc_th').value, en: document.getElementById('seo_desc_en').value };
                d.seo.keywords = document.getElementById('seo_keywords').value;
            } else if (s === 'ui') {
                Object.keys(d.ui).forEach(key => {
                    const thEl = document.getElementById(`ui_${key}_th`);
                    const enEl = document.getElementById(`ui_${key}_en`);
                    if (thEl && enEl) {
                        d.ui[key] = { th: thEl.value, en: enEl.value };
                    }
                });
            } else if (s === 'legal') {
                d.legal.privacy = { th: document.getElementById('legal_privacy_th').value, en: document.getElementById('legal_privacy_en').value };
                d.legal.terms = { th: document.getElementById('legal_terms_th').value, en: document.getElementById('legal_terms_en').value };
                d.legal.cookie = { th: document.getElementById('legal_cookie_th').value, en: document.getElementById('legal_cookie_en').value };
            } else if (s === 'theme') {
                d.theme.primary = document.getElementById('theme_primary').value;
                d.theme.accent = document.getElementById('theme_accent').value;
            } else if (['services', 'portfolio', 'blog'].includes(s)) {
                this.loadSection(s);
                alert('บันทึกข้อมูลส่วนรายการสำเร็จ! (รายการในหน้านี้ถูกบันทึกแยกกันแล้วครับ)');
                return;
            } else { 
                console.warn('Unknown section for saving:', s);
                return; 
            }

            Storage.save(d);
            alert('บันทึกข้อมูลเรียบร้อยแล้วครับ! 🎉');
            this.loadSection(s);
        } catch (err) {
            console.error('Save Error:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลครับ: ' + err.message);
        }
    },

    logout() { sessionStorage.removeItem('admin_logged_in'); location.reload(); }
};

window.addEventListener('load', () => Admin.init());
