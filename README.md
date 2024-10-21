---

# Image Text Search

**Image Text Search** is a powerful web application designed to help you upload images, extract text from them using OCR (Optical Character Recognition), and search through the extracted text efficiently. This tool is ideal for quickly locating information within a large collection of images, but please note that since image processing is done entirely on the frontend, performance may slow down on low-end devices.

## 🎉 [Live Demo](https://anush47.github.io/Image-Text-Search/)

---

## 🚀 Features

- **Image Upload & Processing**: Easily upload images for text extraction.
- **OCR Text Extraction**: Powered by Tesseract.js, the app performs accurate text recognition from images.
- **Real-time Search**: Search through extracted text quickly in real time.
- **Responsive Design**: Optimized for mobile, tablet, and desktop for a smooth user experience.
- **Image Preview with Zoom**: View, zoom, and navigate through images for easy text verification.
- **Smooth Animations**: Interactive, fluid animations for a polished user interface.
- **Frontend Processing**: All image processing is done on the client side, which may slow down performance on low-end devices.

## 🛠️ Technologies Used

- **React** for the dynamic UI
- **TypeScript** for type-safe development
- **Vite** for a fast and efficient build setup
- **Tailwind CSS** for styling
- **Tesseract.js** for powerful OCR functionality
- **Framer Motion** for elegant animations
- **Shadcn UI** for accessible and customizable components

## 💻 Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anush47/Image-Text-Search.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd Image-Text-Search
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` to see the app running locally.

---

## 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

The production files will be generated in the `dist` directory.

---

## 📤 Deployment

The project is set up for automatic deployment to **GitHub Pages** using GitHub Actions. Every time you push to the `main` branch, the app will be built and deployed via the `.github/workflows/deploy.yml` file.

---

## 🤝 Contributing

We welcome contributions from the community! Feel free to fork the repo, make improvements, and submit a pull request. If you have suggestions or find issues, don't hesitate to open an issue.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
