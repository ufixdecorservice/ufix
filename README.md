# Ufix Decor Service Website

A production-ready premium single-page website for **Ufix Decor Service Co., Ltd.** designed with high performance, PWA capabilities, and a Serverless CMS.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5, FontAwesome 6, AOS (Animate on Scroll)
- **Core Logic**: Vanilla JavaScript (ES6+)
- **Data Management**: LocalStorage & physical `.txt` files sync
- **PWA Support**: Offline caching and manifest configuration
- **Multilingual**: Native i18n support (Thai/English)

## 📁 Project Structure & CMS Workflow
The website uses a hybrid CMS approach that is completely Serverless, making it perfect for GitHub Pages:

1. **Physical Files (`assets/Edit-body/`)**: These are static text files that hold the content displayed on the website. Loading these files keeps the initial load fast and SEO-friendly.
2. **Browser Storage (LocalStorage)**: When visiting `admin.html`, the administrator can edit the website's content. Changes are saved instantly to the browser's LocalStorage.
3. **Saving Changes Back to Project**:
   - **Local Development**: Click **"📁 เชื่อมต่อ Edit-body"** in the CMS panel to authorize browser File System Access API. Saving will write directly to the local files.
   - **Production (GitHub Pages)**: If local folder connection is not active, saving will prompt a JSON modal. You can copy the updated JSON database.

## 🔄 How to Sync Changes with Python
If you modify `assets/data/content.json` manually or download a JSON backup from the CMS:
1. Run the Python sync script to distribute the JSON database content into physical text files:
   ```bash
   python sync_content.py
   ```
2. Commit the changes and push them to GitHub.

## 🚀 Hosting on GitHub Pages
1. Push all files to a GitHub repository (ensure `admin.html` and assets are uploaded).
2. Go to **Settings > Pages** in your GitHub repository.
3. Select the branch (e.g., `main` or `master`) and directory (`/root`) to deploy.
4. Enjoy your fast, serverless, and easily manageable website!

## 🔐 Admin Access
- **CMS URL**: `admin.html`
- **Default Username**: `admin`
- **Default Password**: `admin123`
- *Note: Since the CMS operates on the client side, there are no database vulnerabilities or backend attack vectors.*
