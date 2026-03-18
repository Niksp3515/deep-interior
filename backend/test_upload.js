import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    const dummyPath1 = path.join(__dirname, 'dummy1.jpg');
    const dummyPath2 = path.join(__dirname, 'dummy2.jpg');
    fs.writeFileSync(dummyPath1, Buffer.alloc(1024, 'a')); // 1KB fake image
    fs.writeFileSync(dummyPath2, Buffer.alloc(1024, 'b'));

    const form = new FormData();
    form.append('projectId', '60b8d295f1d0a51c88123456'); // fake valid mongoose id
    form.append('mediaStage', 'real_project');
    
    // In Node fetch FormData, we use Blob
    const blob1 = new Blob([fs.readFileSync(dummyPath1)], { type: 'image/jpeg' });
    const blob2 = new Blob([fs.readFileSync(dummyPath2)], { type: 'image/jpeg' });

    // Test uploading multiple files
    form.append('media', blob1, 'dummy1.jpg');
    form.append('media', blob2, 'dummy2.jpg');

    console.log("Sending upload request...");
    const res = await fetch('http://localhost:5000/api/categories/60b8d295f1d0a51c88123456/media', {
      method: 'POST',
      body: form
    });
    
    const data = await res.json();
    if (!res.ok) {
       console.error("SERVER ERROR RESPONDED:", data);
    } else {
       console.log("Success:", data);
    }
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
}

run();
