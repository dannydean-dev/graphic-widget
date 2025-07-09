<template>
  <div class="graphic-widget">
    <!-- Toolbar Component -->
    <GraphicToolbar
      :image-count="images.length"
      :selected-image-id="selectedImageId"
      @file-upload="handleFileUpload"
      @export="exportCanvas"
      @delete-selected="deleteSelectedImage"
      @clear="clearCanvas"
    />

    <!-- Canvas Component -->
    <GraphicCanvas
      ref="canvas"
      :images="images"
      :selected-image-id="selectedImageId"
      @stage-click="handleStageClick"
      @drag-end="handleDragEnd"
      @transform-end="handleTransformEnd"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import GraphicToolbar from './Toolbar.vue'
import GraphicCanvas from './Canvas.vue'
import { ImageService } from '../services/ImageService.js'
import { ExportService } from '../services/ExportService.js'
import './GraphicWidget.css'

export default {
  name: 'GraphicWidget',
  components: {
    GraphicToolbar,
    GraphicCanvas
  },
  setup() {
    const canvas = ref(null)
    const images = ref([])
    const selectedImageId = ref(null)
    
    const imageService = new ImageService()
    
    const handleFileUpload = (event) => {
      const files = event.target.files
      console.log('Files selected:', files.length)
      
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
              id: `image-${++imageService.imageIdCounter}`,
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
            images.value.push(newImage)
            console.log('Image added to array. Total images:', images.value.length)
            console.log('Current images array:', images.value)
            
            // Force reactivity update
            images.value = [...images.value]
            
            // Clear file input
            event.target.value = ''
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
    }
    
    const handleStageClick = (e) => {
      const clickedOnEmpty = e.target === e.target.getStage()
      
      if (clickedOnEmpty) {
        selectedImageId.value = null
        return
      }
      
      // Check if clicked on an image
      if (e.target.getClassName() === 'Image') {
        selectedImageId.value = e.target.id()
        
        // Bring the selected image to the front so selection handles are visible
        e.target.moveToTop()
      }
    }
    
    const handleDragEnd = (e) => {
      const imageId = e.target.id()
      imageService.updateImagePosition(imageId, e.target.x(), e.target.y(), images.value)
    }
    
    const handleTransformEnd = (e) => {
      const imageId = e.target.id()
      const width = e.target.width() * e.target.scaleX()
      const height = e.target.height() * e.target.scaleY()
      const x = e.target.x()
      const y = e.target.y()
      
      imageService.updateImageTransform(imageId, width, height, x, y, images.value)
      
      // Reset scale to 1 after applying transform
      e.target.scaleX(1)
      e.target.scaleY(1)
    }
    
    const exportCanvas = () => {
      if (canvas.value) {
        const stage = canvas.value.getStage()
        if (stage) {
          ExportService.exportCanvas(stage)
        }
      }
    }
    
    const clearCanvas = () => {
      imageService.clearImages(images.value)
      selectedImageId.value = null
    }
    
    const deleteSelectedImage = () => {
      if (selectedImageId.value) {
        deleteImageById(selectedImageId.value)
      }
    }
    
    const deleteImageById = (imageId) => {
      if (imageService.deleteImage(imageId, images.value)) {
        // Clear selection if this was the selected image
        if (selectedImageId.value === imageId) {
          selectedImageId.value = null
        }
      }
    }
    
    // Keyboard event handler
    const handleKeyDown = (event) => {
      // Delete key for delete selected image
      if (event.key === 'Delete' && selectedImageId.value) {
        event.preventDefault()
        deleteSelectedImage()
      }
    }
    
    onMounted(() => {
      // Add keyboard event listener for delete key
      document.addEventListener('keydown', handleKeyDown)
    })
    
    onUnmounted(() => {
      // Remove keyboard event listener
      document.removeEventListener('keydown', handleKeyDown)
    })
    
    return {
      canvas,
      images,
      selectedImageId,
      handleFileUpload,
      handleStageClick,
      handleDragEnd,
      handleTransformEnd,
      exportCanvas,
      clearCanvas,
      deleteSelectedImage,
      deleteImageById
    }
  }
}
</script>

 