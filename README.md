# Vue 3 Graphic Widget

A browser-based widget built with Vue 3 and Konva.js that enables users to design and customize graphics interactively. Users can upload multiple images, resize them, and position them on a 1920x1080 canvas, then export the final composition.

## Features

- **Interactive Canvas**: 1920x1080 canvas for designing graphics
- **Image Upload**: Upload multiple images at once
- **Drag & Drop**: Move images around the canvas freely
- **Resize**: Click on images to show resize handles and adjust size
- **Export**: Download the final composition as a PNG file
- **Responsive Design**: Works on both desktop and mobile devices
- **Real-time Preview**: See changes instantly as you work

## Requirements

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vue3-graphic-widget
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run serve
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

1. **Upload Images**: Click the "Upload Images" button to select one or more image files
2. **Position Images**: Drag images around the canvas to position them where you want
3. **Resize Images**: Click on an image to select it, then drag the corner handles to resize
4. **Export**: Click "Export Image" to download your 1920x1080 composition as a PNG file
5. **Clear Canvas**: Use "Clear All" to remove all images and start over

## Technical Details

- **Framework**: Vue 3 with Composition API
- **Canvas Library**: Konva.js with vue-konva
- **Canvas Size**: 1920x1080 pixels (16:9 aspect ratio)
- **Export Format**: PNG with full resolution
- **Browser Support**: Modern browsers with canvas support

## Project Structure

```
src/
├── components/
│   └── GraphicWidget.vue    # Main widget component
├── App.vue                  # Root component
└── main.js                  # Application entry point
```

## Build for Production

```bash
npm run build
```

This will create a `dist` folder with the production-ready files.

## Customization

The widget can be easily customized by modifying the `GraphicWidget.vue` component:

- Change canvas size by updating `stageConfig`
- Modify image size limits in `handleFileUpload`
- Adjust styling in the `<style>` section
- Add new features like text overlays or filters

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is licensed under the MIT License.
