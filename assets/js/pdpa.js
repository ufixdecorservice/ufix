const PDPA = {
    init() {
        const consent = localStorage.getItem('ufix_cookie_consent');
        if (!consent) {
            const banner = document.querySelector('.cookie-banner');
            if (banner) banner.style.display = 'block';
        }
        this.initButtons();
        
        // Register for re-render if needed (the banner text is handled by data-i18n)
    },

    initButtons() {
        const acceptAll = document.querySelector('#cookie-accept-all');
        const reject = document.querySelector('#cookie-reject');
        
        if (acceptAll) {
            acceptAll.addEventListener('click', () => this.setConsent('all'));
        }
        if (reject) {
            reject.addEventListener('click', () => this.setConsent('necessary'));
        }
    },

    setConsent(type) {
        localStorage.setItem('ufix_cookie_consent', type);
        const banner = document.querySelector('.cookie-banner');
        if (banner) banner.style.display = 'none';
    },

    openLegal(type) {
        const data = Storage.get().legal;
        const modalEl = document.getElementById('legalModal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        
        let title = '', content = '';
        if (type === 'privacy') {
            title = I18n.t('footer_privacy');
            content = I18n.getLocalizedText(data.privacy);
        } else if (type === 'terms') {
            title = I18n.t('footer_terms');
            content = I18n.getLocalizedText(data.terms);
        } else if (type === 'cookie') {
            title = I18n.t('footer_cookie_policy');
            content = I18n.getLocalizedText(data.cookie);
        }

        document.getElementById('legalModalLabel').innerText = title;
        document.getElementById('legalModalBody').innerHTML = content;
        modal.show();
    }
};

document.addEventListener('DOMContentLoaded', () => PDPA.init());
