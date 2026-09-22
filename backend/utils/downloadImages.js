const fs = require('fs');
const https = require('https');
const path = require('path');

const IMAGES = {
  men: [
    { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80', name: 'men-tshirt-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1490114538077-0ec7de863df4?w=800&h=1000&fit=crop&q=80', name: 'men-shirt-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop&q=80', name: 'men-hoodie-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=80', name: 'men-polo-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=1000&fit=crop&q=80', name: 'men-jogger-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=80', name: 'men-jacket-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop&q=80', name: 'men-shirt-2.jpg' },
    { url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&h=1000&fit=crop&q=80', name: 'men-shorts-1.jpg' },
  ],
  women: [
    { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop&q=80', name: 'women-tshirt-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1485231183474-c79dbbe6e5f8?w=800&h=1000&fit=crop&q=80', name: 'women-top-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&q=80', name: 'women-dress-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop&q=80', name: 'women-sweater-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop&q=80', name: 'women-jogger-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1583496661160-fb5218519a40?w=800&h=1000&fit=crop&q=80', name: 'women-skirt-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1523381210434-271e8be8a52c?w=800&h=1000&fit=crop&q=80', name: 'women-jacket-1.jpg' },
  ],
  kids: [
    { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1000&fit=crop&q=80', name: 'kids-tshirt-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop&q=80', name: 'kids-set-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1518818419-fb7c8c17bde5?w=800&h=1000&fit=crop&q=80', name: 'kids-hoodie-1.jpg' },
  ],
};

const uploadDir = path.join(__dirname, '../uploads/products');

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadAll() {
  console.log('📥 Downloading images...\n');
  
  for (const [category, images] of Object.entries(IMAGES)) {
    console.log(`\n🔹 ${category.toUpperCase()}`);
    for (const img of images) {
      const filepath = path.join(uploadDir, img.name);
      try {
        await downloadImage(img.url, filepath);
      } catch (err) {
        console.error(`❌ Error downloading ${img.name}:`, err.message);
      }
    }
  }
  
  console.log('\n✅ All images downloaded!');
  console.log(`📁 Location: ${uploadDir}`);
}

downloadAll().catch(console.error);
