const Portfolio = {
    render() {
        const container = document.querySelector('#portfolio-grid');
        if (!container) return;
        
        const data = Storage.get()?.portfolio || [];

        container.innerHTML = data.map(p => `
            <div class="col-md-4 mb-4 portfolio-item-wrapper" data-category="${p.category}" data-aos="zoom-in">
                <div class="portfolio-item" onclick="Portfolio.view(${p.id})">
                    <img src="${p.image_after}" class="img-fluid" loading="lazy">
                    <div class="portfolio-overlay">
                        <div class="p-3 text-center">
                            <h6>${I18n.getLocalizedText(p.title)}</h6>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    view(id) {
        const item = Storage.get().portfolio.find(p => p.id === id);
        if (!item) return;
        
        const modalEl = document.getElementById('legalModal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        
        document.getElementById('legalModalLabel').innerText = I18n.getLocalizedText(item.title);
        document.getElementById('legalModalBody').innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <p class="text-center fw-bold">BEFORE</p>
                    <img src="${item.image_before}" class="img-fluid rounded">
                </div>
                <div class="col-md-6 mb-3">
                    <p class="text-center fw-bold text-accent">AFTER</p>
                    <img src="${item.image_after}" class="img-fluid rounded">
                </div>
            </div>
            <p class="mt-3 text-muted">${I18n.getLocalizedText(item.desc)}</p>
        `;
        modal.show();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.I18n) {
        I18n.registerRenderer(() => Portfolio.render());
    }
});
