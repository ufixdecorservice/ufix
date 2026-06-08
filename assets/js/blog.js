const Blog = {
    render() {
        const container = document.querySelector('#blog-grid');
        if (!container) return;
        
        const data = Storage.get()?.blog || [];
        
        container.innerHTML = data.map(b => `
            <div class="col-md-6 mb-4" data-aos="fade-up">
                <div class="card h-100" onclick="Blog.open(${b.id})">
                    <img src="${b.image}" class="card-img-top" style="height:250px; object-fit:cover;" loading="lazy">
                    <div class="card-body">
                        <small class="text-muted">${b.date}</small>
                        <h5 class="card-title mt-2">${I18n.getLocalizedText(b.title)}</h5>
                        <p class="card-text text-muted">${I18n.getLocalizedText(b.content).substring(0, 100)}...</p>
                        <button class="btn btn-link p-0 text-accent">${I18n.t('nav_blog')} ...</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    open(id) {
        const article = Storage.get().blog.find(b => b.id === id);
        if (!article) return;
        
        const modalEl = document.getElementById('legalModal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        
        document.getElementById('legalModalLabel').innerText = I18n.getLocalizedText(article.title);
        document.getElementById('legalModalBody').innerHTML = `
            <img src="${article.image}" class="img-fluid rounded mb-4">
            <div class="blog-content">
                ${I18n.getLocalizedText(article.content)}
            </div>
            <hr>
            <p class="text-muted small">Published: ${article.date}</p>
        `;
        modal.show();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.I18n) {
        I18n.registerRenderer(() => Blog.render());
    }
});
