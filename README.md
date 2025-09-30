# 📸 Meme Maker (React + Capacitor)

A simple **Meme Maker** app built with **React** and wrapped with **Capacitor** to run on both **Web** and **Mobile (Android/iOS)**.

---

## ✨ Features
- Pick image from gallery (Capacitor Camera API or file input on web)
- Add text on top of the image (Canvas rendering)
- Save meme:
  - **Web** → downloads `.png`
  - **Mobile** → saves to app's Documents folder
- Share meme using system’s native share dialog
- Dark/Light mode toggle (optional)
- (Optional extension) Add filters & preset frames

---

## 📦 Tech Stack
- **React** (Frontend)
- **Capacitor** (Native bridge)
- **Capacitor Plugins**
  - `@capacitor/camera`
  - `@capacitor/filesystem`
  - `@capacitor/share`

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/meme-maker.git
cd meme-maker


