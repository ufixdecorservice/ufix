import os
import urllib.request
import re

# กำหนดโฟลเดอร์สำหรับเซฟรูป
image_dir = r"D:\Document\Desktop2024\AI\AI\NARIN\ufix\assets\images"
os.makedirs(image_dir, exist_ok=True)

# อัปเดตและจัดระบบรูปภาพ Unsplash ใหม่ให้พรีเมียมและสวยงาม
image_mappings = {
    # 1. หน้าแรก Hero section bg
    "hero_bg.jpg": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920",
    
    # 2. รูปหน้าเกี่ยวกับเรา (คนงานก่อสร้าง)
    "about_img.jpg": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    
    # 3. รูปบริการงานกระเบื้องและตกแต่งภายใน
    "tiling_interior.jpg": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    
    # 4. รูปบริการงานทำถนนและปรับปรุงผิวจราจร (รูปเครื่องจักรทำถนน)
    "road_paving.jpg": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    
    # 5. รูปบทความกฎหมายอาคาร
    "building_laws.jpg": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    
    # 6. รูปผลงานในพอร์ต (ตึกสูงกระจกสะท้อนฟ้า)
    "portfolio_highrise.jpg": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    
    # 7. รูปบริการงานทาสีและรีโนเวท (ช่างทาสีผนัง/ทาสีบ้าน เพื่อไม่ให้ซ้ำกับรูปผลงานทาสีอาคารพาณิชย์)
    "service_painting.jpg": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

print("Starting premium image downloads...")

for filename, url in image_mappings.items():
    filepath = os.path.join(image_dir, filename)
    print(f"Downloading {filename} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            with open(filepath, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Successfully downloaded {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

# อัปเดตไฟล์ HTML
html_path = r"D:\Document\Desktop2024\AI\AI\NARIN\ufix\index.html"
if os.path.exists(html_path):
    print("Updating index.html with local premium image paths...")
    with open(html_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # แทนที่รูปภาพใน HTML ให้ชี้ไปยัง local file ทั้งหมด
    # 1. Hero Background
    content = content.replace(
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920",
        "assets/images/hero_bg.jpg"
    )
    
    # 2. About Image
    content = content.replace(
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
        "assets/images/about_img.jpg"
    )
    
    # 3. Tiling Image
    content = content.replace(
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
        "assets/images/tiling_interior.jpg"
    )
    
    # 4. Road Image
    content = re.sub(
        r'https://images\.unsplash\.com/photo-1515162305285-0293e4767cc2[^\'"\s>]*',
        'assets/images/road_paving.jpg',
        content
    )
    
    # 5. Building Laws
    content = content.replace(
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
        "assets/images/building_laws.jpg"
    )
    
    # 6. Portfolio Highrise
    content = content.replace(
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        "assets/images/portfolio_highrise.jpg"
    )
    
    # 7. บริการงานทาสีและรีโนเวท (เปลี่ยนจาก assets/images/portfolio_painting.png ไปเป็น assets/images/service_painting.jpg ในส่วนของการ์ดบริการ เพื่อไม่ให้ซ้ำกับในผลงาน)
    # เราจะหา tag img บริการงานทาสีโดยตรง
    # รูปภาพงานโรยตัว = assets/images/rope_access.png
    # รูปภาพระบบกันซึม = assets/images/waterproofing.png
    # รูปภาพงานทาสีบริการ = assets/images/portfolio_painting.png (ซึ่งซ้ำ เราจะเปลี่ยนรูปนี้รูปเดียวในการ์ดบริการ)
    # สังเกตว่าใน HTML บรรทัด 230 คือ: <img src="assets/images/portfolio_painting.png" class="card-img-top service-img" alt="งานทาสี">
    content = content.replace(
        '<img src="assets/images/portfolio_painting.png" class="card-img-top service-img" alt="งานทาสี">',
        '<img src="assets/images/service_painting.jpg" class="card-img-top service-img" alt="งานทาสี">'
    )
    
    with open(html_path, 'w', encoding='utf-8') as file:
        file.write(content)
    print("Successfully updated index.html with local paths!")
else:
    print("index.html not found!")
