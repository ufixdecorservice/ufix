const Admin = {
    user: 'admin',
    pass: 'admin123',
    currentSection: 'hero',
    editingIndex: -1,
    directoryHandle: null,
    fileMapping: {
        "site.name.th": "Branding_Contact/CompanyName_TH.txt",
        "site.name.en": "Branding_Contact/CompanyName_EN.txt",
        "site.phone": "Branding_Contact/Phone.txt",
        "site.email": "Branding_Contact/Email.txt",
        "site.line": "Branding_Contact/Line.txt",
        "site.address.th": "Branding_Contact/Address_TH.txt",
        "site.address.en": "Branding_Contact/Address_EN.txt",
        "site.maps_url": "Branding_Contact/Maps_Embed_URL.txt",
        "site.footer_desc.th": "Branding_Contact/Footer_Desc_TH.txt",
        "site.footer_desc.en": "Branding_Contact/Footer_Desc_EN.txt",
        "seo.title.th": "SEO_Settings/Site_Title_TH.txt",
        "seo.title.en": "SEO_Settings/Site_Title_EN.txt",
        "seo.desc.th": "SEO_Settings/Meta_Description_TH.txt",
        "seo.desc.en": "SEO_Settings/Meta_Description_EN.txt",
        "seo.keywords": "SEO_Settings/Keywords.txt",
        "hero.title.th": "Hero_Section/หัวข้อหลัก (Title) (TH).txt",
        "hero.title.en": "Hero_Section/หัวข้อหลัก (Title) (EN).txt",
        "hero.desc.th": "Hero_Section/คำโปรย (Description) (TH).txt",
        "hero.desc.en": "Hero_Section/คำโปรย (Description) (EN).txt",
        "about.title.th": "About_Us/Title_TH.txt",
        "about.title.en": "About_Us/Title_EN.txt",
        "about.desc.th": "About_Us/Description_TH.txt",
        "about.desc.en": "About_Us/Description_EN.txt",
        "legal.privacy.th": "Legal/Privacy_TH.txt",
        "legal.privacy.en": "Legal/Privacy_EN.txt",
        "legal.terms.th": "Legal/Terms_TH.txt",
        "legal.terms.en": "Legal/Terms_EN.txt",
        "legal.cookie.th": "Legal/Cookie_TH.txt",
        "legal.cookie.en": "Legal/Cookie_EN.txt",
        "theme.primary": "Theme/Primary.txt",
        "theme.accent": "Theme/Accent.txt"
    },
    
    init() {
        console.log('Admin CMS Elite V1.1 Initializing...');
        
        // Add Why Us to mapping
        for(let i=1; i<=3; i++) {
            this.fileMapping[`why.items.${i-1}.title.th`] = `Why_Us/Item_${i}_Title_TH.txt`;
            this.fileMapping[`why.items.${i-1}.title.en`] = `Why_Us/Item_${i}_Title_EN.txt`;
            this.fileMapping[`why.items.${i-1}.desc.th`] = `Why_Us/Item_${i}_Desc_TH.txt`;
            this.fileMapping[`why.items.${i-1}.desc.en`] = `Why_Us/Item_${i}_Desc_EN.txt`;
        }

        if (sessionStorage.getItem('admin_logged_in') === 'true') {
            this.showPanel();
        }

        const form = document.getElementById('login-form');
        console.log("Admin: Form element found:", !!form);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log("Login form submit intercepted!");
                
                const u = document.getElementById('username').value;
                const p = document.getElementById('password').value;
                
                console.log("Login Attempt - User:", u, "Pass:", p);
                console.log("Expected - User:", this.user, "Pass:", this.pass);

                if (u === this.user && p === this.pass) {
                    console.log("Login Success!");
                    sessionStorage.setItem('admin_logged_in', 'true');
                    this.showPanel();
                } else {
                    console.error("Login Failed: Incorrect credentials.");
                    const err = document.getElementById('login-error');
                    if (err) err.classList.remove('d-none');
                    alert("Login Failed! Check console (F12) for details.");
                }
            });
        }
        this.initNavigation();
        window.Admin = this;
    },

    async connectFolder() {
        try {
            this.directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });
            document.getElementById('btn-connect-folder').classList.replace('btn-primary', 'btn-success');
            document.getElementById('btn-connect-folder').innerHTML = '✅ เชื่อมต่อแล้ว';
            alert('เชื่อมต่อโฟลเดอร์สำเร็จ! ระบบจะบันทึกลงไฟล์ .txt โดยตรงครับ');
        } catch (err) {
            console.error('Directory Picker Error:', err);
            alert('ไม่สามารถเชื่อมต่อโฟลเดอร์ได้: ' + err.message);
        }
    },

    async saveToPhysicalFiles(data) {
        if (!this.directoryHandle) {
            console.warn('Not connected to a folder. Saving to browser only.');
            return false;
        }

        const promises = Object.entries(this.fileMapping).map(async ([jsonPath, filePath]) => {
            const val = this.getDeepValue(data, jsonPath);
            if (val !== undefined) {
                try {
                    const parts = filePath.split('/');
                    let currentHandle = this.directoryHandle;
                    
                    // Navigate to subfolder
                    if (parts.length > 1) {
                        currentHandle = await this.directoryHandle.getDirectoryHandle(parts[0], { create: true });
                    }
                    
                    const fileHandle = await currentHandle.getFileHandle(parts[parts.length - 1], { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(val);
                    await writable.close();
                } catch (e) {
                    console.error(`Failed to write ${filePath}`, e);
                }
            }
        });

        // Also save UI Labels (safely with try-catch)
        Object.keys(data.ui).forEach(key => {
            promises.push((async () => {
                try {
                    const folder = await this.directoryHandle.getDirectoryHandle('UI_Labels', { create: true });
                    
                    const thHandle = await folder.getFileHandle(`${key}_TH.txt`, { create: true });
                    const thW = await thHandle.createWritable();
                    await thW.write(data.ui[key].th || '');
                    await thW.close();

                    const enHandle = await folder.getFileHandle(`${key}_EN.txt`, { create: true });
                    const enW = await enHandle.createWritable();
                    await enW.write(data.ui[key].en || '');
                    await enW.close();
                } catch (e) {
                    console.error(`Failed to write UI Label: ${key}`, e);
                }
            })());
        });

        // Also save Services dynamically (safely with try-catch)
        if (data.services) {
            data.services.forEach((item, i) => {
                promises.push((async () => {
                    try {
                        const folder = await this.directoryHandle.getDirectoryHandle('Services', { create: true });
                        const itemFolder = await folder.getDirectoryHandle(`Item_${i+1}`, { create: true });
                        
                        const thHandle = await itemFolder.getFileHandle('Title_TH.txt', { create: true });
                        const thW = await thHandle.createWritable();
                        await thW.write(item.title?.th || '');
                        await thW.close();

                        const enHandle = await itemFolder.getFileHandle('Title_EN.txt', { create: true });
                        const enW = await enHandle.createWritable();
                        await enW.write(item.title?.en || '');
                        await enW.close();

                        const descTHHandle = await itemFolder.getFileHandle('Desc_TH.txt', { create: true });
                        const descTHW = await descTHHandle.createWritable();
                        await descTHW.write(item.desc?.th || '');
                        await descTHW.close();

                        const descENHandle = await itemFolder.getFileHandle('Desc_EN.txt', { create: true });
                        const descENW = await descENHandle.createWritable();
                        await descENW.write(item.desc?.en || '');
                        await descENW.close();
                    } catch (e) {
                        console.error(`Failed to write Service Item ${i+1}`, e);
                    }
                })());
            });
        }

        await Promise.all(promises);
        return true;
    },

    getDeepValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
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
        let data = Storage.get();
        if (!data) {
            console.warn('Storage data is empty. Falling back to fallbackData.');
            data = Storage.fallbackData;
        } else {
            // Guarantee all necessary sections exist from fallbackData if missing
            const fallback = Storage.fallbackData;
            ['hero', 'about', 'why', 'services', 'portfolio', 'blog', 'site', 'seo', 'ui', 'legal', 'theme'].forEach(key => {
                if (data[key] === undefined || data[key] === null) {
                    data[key] = JSON.parse(JSON.stringify(fallback[key]));
                }
            });
        }
        const container = document.getElementById('editor-container');
        if (!container) return;

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

    renderToolbar(targetId) {
        return `
            <div class="btn-group btn-group-sm mb-1">
                <button type="button" class="btn btn-outline-secondary" title="Bold" onclick="Admin.insertTag('${targetId}', 'b')"><i class="fas fa-bold"></i></button>
                <button type="button" class="btn btn-outline-secondary" title="Italic" onclick="Admin.insertTag('${targetId}', 'i')"><i class="fas fa-italic"></i></button>
                <button type="button" class="btn btn-outline-secondary" title="Highlight Primary" onclick="Admin.insertTag('${targetId}', 'span', 'text-primary')"><i class="fas fa-paint-brush text-primary"></i></button>
                <button type="button" class="btn btn-outline-secondary" title="Highlight Accent" onclick="Admin.insertTag('${targetId}', 'span', 'text-accent')"><i class="fas fa-paint-brush text-warning"></i></button>
                <div class="btn btn-outline-secondary p-0 d-flex align-items-center justify-content-center" style="width: 32px; position: relative;" title="เลือกสีเอง">
                    <i class="fas fa-palette" style="font-size: 10px;"></i>
                    <input type="color" style="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer;" onchange="Admin.insertColor('${targetId}', this.value)">
                </div>
                <button type="button" class="btn btn-outline-secondary" title="New Line" onclick="Admin.insertText('${targetId}', '<br>')"><i class="fas fa-level-down-alt"></i></button>
            </div>
        `;
    },

    insertColor(id, color) {
        const el = document.getElementById(id);
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selectedText = el.value.substring(start, end);
        const replacement = `<span style="color: ${color}">${selectedText}</span>`;
        el.value = el.value.substring(0, start) + replacement + el.value.substring(end);
        el.focus();
        const newCursorPos = start + replacement.length;
        el.setSelectionRange(newCursorPos, newCursorPos);
    },

    insertTag(id, tag, className = '') {
        const el = document.getElementById(id);
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selectedText = el.value.substring(start, end);
        const replacement = `<${tag}${className ? ' class="' + className + '"' : ''}>${selectedText}</${tag}>`;
        el.value = el.value.substring(0, start) + replacement + el.value.substring(end);
        el.focus();
        const newCursorPos = start + replacement.length;
        el.setSelectionRange(newCursorPos, newCursorPos);
    },

    insertText(id, text) {
        const el = document.getElementById(id);
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.value = el.value.substring(0, start) + text + el.value.substring(end);
        el.focus();
        el.setSelectionRange(start + text.length, start + text.length);
    },

    renderMultilingual(label, idPrefix, data, isTextarea = false) {
        return `
            <div class="row mb-3">
                <div class="col-md-6">
                    <div class="d-flex justify-content-between align-items-end">
                        <label class="fw-bold small mb-1">${label} (TH)</label>
                        ${this.renderToolbar(idPrefix + '_th')}
                    </div>
                    ${isTextarea ? 
                        `<textarea class="form-control" id="${idPrefix}_th" rows="3">${data?.th || ''}</textarea>` : 
                        `<input type="text" class="form-control" id="${idPrefix}_th" value="${data?.th || ''}">`}
                </div>
                <div class="col-md-6">
                    <div class="d-flex justify-content-between align-items-end">
                        <label class="fw-bold small mb-1">${label} (EN)</label>
                        ${this.renderToolbar(idPrefix + '_en')}
                    </div>
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

        const fileName = file.name;
        const localPath = `assets/images/${fileName}`;
        
        // Suggest local path to user
        if (confirm(`คุณต้องการใช้พาธไฟล์ในโปรเจกต์ (${localPath}) แทนการใช้รหัสรูปภาพยาวๆ หรือไม่?\n\n(แนะนำ: วิธีนี้จะทำให้ไฟล์ไม่หนักเครื่องและอัปโหลดขึ้น GitHub ได้ง่ายกว่าครับ)`)) {
            const urlEl = document.getElementById(urlInputId);
            const imgEl = document.getElementById(imgId);
            if (urlEl) urlEl.value = localPath;
            if (imgEl) imgEl.src = localPath; // Note: will only show if file is already in the folder
            alert(`เรียบร้อยครับ! อย่าลืมก๊อปปี้ไฟล์ ${fileName} ไปวางไว้ในโฟลเดอร์ assets/images/ ของโปรเจกต์ด้วยนะครับ`);
            return;
        }

        // Fallback to Base64 for quick preview/temporary use
        if (file.size > 1024 * 1024) {
            alert('รูปภาพมีขนาดใหญ่เกินไป (จำกัด 1MB สำหรับโหมดชั่วคราว) แนะนำให้ใช้การบันทึกแบบพาธไฟล์แทนครับ');
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

    async save() {
        const d = Storage.get();
        const s = this.currentSection;
        console.log('Global Save triggered for section:', s);

        // If currently editing an item in a list, call saveItem instead
        if (this.editingIndex !== -1 || (document.getElementById('item-form-container') && !document.getElementById('item-form-container').classList.contains('d-none'))) {
            this.saveItem();
            return;
        }

        try {
            // ... (rest of the save logic remains the same)
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
            }

            Storage.save(d);
            const physicalSaved = await this.saveToPhysicalFiles(d);
            
            this.loadSection(s);
            
            if (physicalSaved) {
                alert('🚀 บันทึกลงไฟล์ .txt ในเครื่องสำเร็จแล้วครับ!');
            } else {
                this.showSyncModal();
            }
        } catch (err) {
            console.error('Save Error:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลครับ: ' + err.message);
        }
    },

    showSyncModal() {
        const data = Storage.get();
        const jsonCode = JSON.stringify(data, null, 2);
        
        // Remove existing modal if any
        document.getElementById('sync-modal')?.remove();

        const modalHtml = `
            <div class="modal fade" id="sync-modal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title"><i class="fas fa-check-circle me-2"></i> บันทึกใน Browser สำเร็จ!</h5>
                            <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                        </div>
                        <div class="modal-body">
                            <p class="fw-bold text-danger">⚠️ ขั้นตอนสุดท้ายเพื่อบันทึกลงไฟล์ (D:\\...\\ufix):</p>
                            <ol>
                                <li>ก๊อปปี้รหัส JSON ด้านล่างนี้ทั้งหมด</li>
                                <li>นำไปวางในแชทแล้วบอก <b>"จาวิช อัปเดตไฟล์ content.json ให้หน่อย"</b></li>
                                <li>ผมจะทำการเขียนไฟล์ลงในเครื่องเจ้านายให้ทันทีครับ!</li>
                            </ol>
                            <textarea class="form-control font-monospace small" rows="10" readonly id="json-copy-area">${jsonCode}</textarea>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" onclick="Admin.copyToClipboard()">ก๊อปปี้รหัสและปิดหน้าต่างนี้</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    copyToClipboard() {
        const area = document.getElementById('json-copy-area');
        area.select();
        document.execCommand('copy');
        alert('ก๊อปปี้รหัสเรียบร้อย! ส่งให้จาวิชในแชทได้เลยครับ');
        document.getElementById('sync-modal').remove();
    },

    logout() { sessionStorage.removeItem('admin_logged_in'); location.reload(); }
};

window.addEventListener('load', () => Admin.init());
