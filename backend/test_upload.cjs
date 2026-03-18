const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const dummyPath1 = path.join(__dirname, 'dummy1.jpg');
    const dummyPath2 = path.join(__dirname, 'dummy2.jpg');
    fs.writeFileSync(dummyPath1, Buffer.alloc(1024, 'a')); // 1KB fake image
    fs.writeFileSync(dummyPath2, Buffer.alloc(1024, 'b'));

    const form = new FormData();
    form.append('projectId', '60b8d295f1d0a51c88123456'); // fake valid mongoose id
    form.append('mediaStage', 'real_project');
    
    // Test uploading multiple files
    form.append('media', fs.createReadStream(dummyPath1), 'dummy1.jpg');
    form.append('media', fs.createReadStream(dummyPath2), 'dummy2.jpg');

    console.log("Sending upload request...");
    const res = await axios.post('http://localhost:5000/api/categories/60b8d295f1d0a51c88123456/media', form, {
      headers: form.getHeaders(),
    });

    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("SERVER ERROR RESPONDED:", err.response.data);
    } else {
      console.error("AXIOS ERROR:", err.message);
    }
  }
}

run();
