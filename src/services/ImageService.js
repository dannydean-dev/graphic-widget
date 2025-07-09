export class ImageService {
  constructor() {
    this.imageIdCounter = 0
  }
  
  processUploadedFiles(files) {
    const processedImages = []
    
    Array.from(files).forEach(file => {
      console.log('Processing file:', file.name, file.type)
      const reader = new FileReader()
      
      reader.onload = (e) => {
        console.log('File read successfully')
        const imageObj = new Image()
        
        imageObj.onload = () => {
          console.log('Image loaded:', imageObj.width, 'x', imageObj.height)
          
          // Calculate initial size to fit within canvas
          const maxWidth = 300
          const maxHeight = 200
          let { width, height } = imageObj
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }
          
          console.log('Resized to:', width, 'x', height)
          
          const newImage = {
            id: `image-${++this.imageIdCounter}`,
            imageObj: imageObj,
            x: 100, // Fixed position for testing
            y: 100, // Fixed position for testing
            width: width,
            height: height,
            originalWidth: imageObj.width,
            originalHeight: imageObj.height,
            previewUrl: e.target.result
          }
          
          console.log('Creating new image object:', newImage)
          processedImages.push(newImage)
        }
        
        imageObj.onerror = (error) => {
          console.error('Error loading image:', error)
        }
        
        imageObj.src = e.target.result
      }
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }
      
      reader.readAsDataURL(file)
    })
    
    return processedImages
  }
  
  updateImagePosition(imageId, x, y, images) {
    const image = images.find(img => img.id === imageId)
    if (image) {
      image.x = x
      image.y = y
    }
  }
  
  updateImageTransform(imageId, width, height, x, y, images) {
    const image = images.find(img => img.id === imageId)
    if (image) {
      image.width = width
      image.height = height
      image.x = x
      image.y = y
    }
  }
  
  deleteImage(imageId, images) {
    const index = images.findIndex(img => img.id === imageId)
    if (index !== -1) {
      images.splice(index, 1)
      return true
    }
    return false
  }
  
  clearImages(images) {
    images.length = 0
  }
} 