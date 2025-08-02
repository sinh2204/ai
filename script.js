let model;
const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const result = document.getElementById('result');

// Tải mô hình khi trang được mở
window.onload = async () => {
  const URL = "model/";
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");
  console.log("✅ Mô hình đã sẵn sàng!");

  // Mở camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("❌ Không thể mở camera:", err);
      alert("Trình duyệt không cho phép truy cập camera.");
    });
};

// Tải ảnh từ máy
function loadImage(event) {
  const file = event.target.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
  }
}

// Chụp ảnh từ camera
function capture() {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageDataURL = canvas.toDataURL('image/png');
  preview.src = imageDataURL;
}

// Phân loại ảnh
async function predict() {
  if (!model) {
    alert("Mô hình chưa được tải!");
    return;
  }

  const image = document.getElementById('preview');
  const predictions = await model.predict(image);

  let highest = predictions[0];
  for (let p of predictions) {
    if (p.probability > highest.probability) {
      highest = p;
    }
  }

  result.innerText = `Kết quả: ${highest.className} (${(highest.probability * 100).toFixed(2)}%)`;
}
