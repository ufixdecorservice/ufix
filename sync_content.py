import json
import os

def write_txt(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(str(content))

# Use relative paths based on the script location for compatibility
current_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(current_dir, 'assets', 'data', 'content.json')
base_path = os.path.join(current_dir, 'assets', 'Edit-body')

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Branding & Contact
write_txt(os.path.join(base_path, 'Branding_Contact', 'Logo_URL.txt'), data['site']['logo_url'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Logo_Width.txt'), data['site']['logo_width'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Logo_Height.txt'), data['site']['logo_height'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Favicon_URL.txt'), data['site']['favicon_url'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'CompanyName_TH.txt'), data['site']['name']['th'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'CompanyName_EN.txt'), data['site']['name']['en'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Phone.txt'), data['site']['phone'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Email.txt'), data['site']['email'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Line.txt'), data['site']['line'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Address_TH.txt'), data['site']['address']['th'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Address_EN.txt'), data['site']['address']['en'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Maps_Embed_URL.txt'), data['site']['maps_url'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Footer_Desc_TH.txt'), data['site']['footer_desc']['th'])
write_txt(os.path.join(base_path, 'Branding_Contact', 'Footer_Desc_EN.txt'), data['site']['footer_desc']['en'])

# 1.1 Hero Section
write_txt(os.path.join(base_path, 'Hero_Section', 'หัวข้อหลัก (Title) (TH).txt'), data['hero']['title']['th'])
write_txt(os.path.join(base_path, 'Hero_Section', 'หัวข้อหลัก (Title) (EN).txt'), data['hero']['title']['en'])
write_txt(os.path.join(base_path, 'Hero_Section', 'คำโปรย (Description) (TH).txt'), data['hero']['desc']['th'])
write_txt(os.path.join(base_path, 'Hero_Section', 'คำโปรย (Description) (EN).txt'), data['hero']['desc']['en'])

# 2. SEO
write_txt(os.path.join(base_path, 'SEO_Settings', 'Site_Title_TH.txt'), data['seo']['title']['th'])
write_txt(os.path.join(base_path, 'SEO_Settings', 'Site_Title_EN.txt'), data['seo']['title']['en'])
write_txt(os.path.join(base_path, 'SEO_Settings', 'Meta_Description_TH.txt'), data['seo']['desc']['th'])
write_txt(os.path.join(base_path, 'SEO_Settings', 'Meta_Description_EN.txt'), data['seo']['desc']['en'])
write_txt(os.path.join(base_path, 'SEO_Settings', 'Keywords.txt'), data['seo']['keywords'])

# 3. About
write_txt(os.path.join(base_path, 'About_Us', 'Title_TH.txt'), data['about']['title']['th'])
write_txt(os.path.join(base_path, 'About_Us', 'Title_EN.txt'), data['about']['title']['en'])
write_txt(os.path.join(base_path, 'About_Us', 'Description_TH.txt'), data['about']['desc']['th'])
write_txt(os.path.join(base_path, 'About_Us', 'Description_EN.txt'), data['about']['desc']['en'])

# 4. Why Us
for i, item in enumerate(data['why']['items']):
    write_txt(os.path.join(base_path, 'Why_Us', f'Item_{i+1}_Title_TH.txt'), item['title']['th'])
    write_txt(os.path.join(base_path, 'Why_Us', f'Item_{i+1}_Title_EN.txt'), item['title']['en'])
    write_txt(os.path.join(base_path, 'Why_Us', f'Item_{i+1}_Desc_TH.txt'), item['desc']['th'])
    write_txt(os.path.join(base_path, 'Why_Us', f'Item_{i+1}_Desc_EN.txt'), item['desc']['en'])

# 6. Legal
write_txt(os.path.join(base_path, 'Legal', 'Privacy_TH.txt'), data['legal']['privacy']['th'])
write_txt(os.path.join(base_path, 'Legal', 'Privacy_EN.txt'), data['legal']['privacy']['en'])
write_txt(os.path.join(base_path, 'Legal', 'Terms_TH.txt'), data['legal']['terms']['th'])
write_txt(os.path.join(base_path, 'Legal', 'Terms_EN.txt'), data['legal']['terms']['en'])
write_txt(os.path.join(base_path, 'Legal', 'Cookie_TH.txt'), data['legal']['cookie']['th'])
write_txt(os.path.join(base_path, 'Legal', 'Cookie_EN.txt'), data['legal']['cookie']['en'])

# 8. Services
for i, item in enumerate(data['services']):
    folder = os.path.join(base_path, 'Services', f'Item_{i+1}')
    write_txt(os.path.join(folder, 'Title_TH.txt'), item['title']['th'])
    write_txt(os.path.join(folder, 'Title_EN.txt'), item['title']['en'])
    write_txt(os.path.join(folder, 'Desc_TH.txt'), item['desc']['th'])
    write_txt(os.path.join(folder, 'Desc_EN.txt'), item['desc']['en'])

print("Sync completed!")
