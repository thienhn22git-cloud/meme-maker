import React, { useRef, useState } from "react";
import "./App.css";
import { Camera, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const canvasRef = useRef(null);

  // chọn ảnh từ thư viện (mobile: Capacitor, web: input fallback)
  const pickImage = async () => {
    try {
      const photo = await Camera.getPhoto({
        source: CameraSource.Photos,
        resultType: "dataUrl",
      });
      setImage(photo.dataUrl);
    } catch (err) {
      console.log("Camera pick cancelled or error", err);
      document.getElementById("fileInput").click(); // fallback cho web
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (jpg, jpeg, png).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const drawMeme = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // text overlay
      ctx.font = "80px Impact";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, canvas.height - 50);
      ctx.strokeText(text, canvas.width / 2, canvas.height - 50);
    };
  };

  const saveMeme = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const base64Data = dataUrl.split(",")[1];

    const platform = Capacitor.getPlatform();

    if (platform === "web") {
      // 💻 Web: trigger file download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `meme-${Date.now()}.png`;
      link.click();
    } else {
      // 📱 Mobile (Android/iOS): save with Filesystem
      try {
        await Filesystem.writeFile({
          path: `meme-${Date.now()}.png`,
          data: base64Data,
          directory: Directory.Documents,
        });
        alert("Meme saved to Documents!");
      } catch (err) {
        console.error("Save error", err);
      }
    }
  };

  const shareMeme = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");

    try {
      await Share.share({
        title: "Check out my meme!",
        text: "Made with Meme Maker 😂",
        url: dataUrl,
        dialogTitle: "Share Meme",
      });
    } catch (err) {
      console.error("Share error", err);
    }
  };

  return (
    <div className="app">
      <h1>Meme Maker</h1>

      <div className="controls">
        <button onClick={pickImage}>Pick Image</button>
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <input
          type="text"
          placeholder="Enter meme text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={drawMeme}>Generate Meme</button>
        <button onClick={saveMeme}>Save Meme</button>
        <button onClick={shareMeme}>Share Meme</button>
      </div>

      <canvas ref={canvasRef} className="meme-canvas"></canvas>
    </div>
  );
}

export default App;
