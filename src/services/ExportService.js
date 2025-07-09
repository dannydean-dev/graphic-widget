export class ExportService {
  static exportCanvas(stage) {
    // Hide UI elements temporarily
    const toolbar = document.querySelector('.toolbar')
    const canvasHeader = document.querySelector('.canvas-header')
    const layerPanel = document.querySelector('.layer-panel')
    
    if (toolbar) toolbar.style.display = 'none'
    if (canvasHeader) canvasHeader.style.display = 'none'
    if (layerPanel) layerPanel.style.display = 'none'
    
    // Export the canvas
    const canvas = stage.getNode().toCanvas({
      width: 960,
      height: 540,
      pixelRatio: 1
    })
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'graphic-composition.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Restore UI elements
      if (toolbar) toolbar.style.display = ''
      if (canvasHeader) canvasHeader.style.display = ''
      if (layerPanel) layerPanel.style.display = ''
    }, 'image/png')
  }
  
  static getCanvasBlob(stage) {
    return new Promise((resolve) => {
      // Hide UI elements temporarily
      const toolbar = document.querySelector('.toolbar')
      const canvasHeader = document.querySelector('.canvas-header')
      const layerPanel = document.querySelector('.layer-panel')
      
      if (toolbar) toolbar.style.display = 'none'
      if (canvasHeader) canvasHeader.style.display = 'none'
      if (layerPanel) layerPanel.style.display = 'none'
      
      const canvas = stage.getNode().toCanvas({
        width: 960,
        height: 540,
        pixelRatio: 1
      })
      
      canvas.toBlob((blob) => {
        // Restore UI elements
        if (toolbar) toolbar.style.display = ''
        if (canvasHeader) canvasHeader.style.display = ''
        if (layerPanel) layerPanel.style.display = ''
        
        resolve(blob)
      }, 'image/png')
    })
  }
} 