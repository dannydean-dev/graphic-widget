<template>
  <div class="graphic-widget">
    <!-- Toolbar Component -->
    <GraphicToolbar
      :image-count="images.length"
      :selected-image-id="selectedImageId"
      :text-count="texts.length"
      :selected-text-id="selectedTextId"
      @file-upload="handleFileUpload"
      @export="exportCanvas"
      @delete-selected="deleteSelectedImage"
      @add-text="addText"
      @clear="clearCanvas"
    />

    <!-- Canvas Component -->
    <GraphicCanvas
      ref="canvas"
      :images="images"
      :selected-image-id="selectedImageId"
      :texts="texts"
      :selected-text-id="selectedTextId"
      :scale="canvasScale"
      @stage-click="handleStageClick"
      @image-drag-end="handleImageDragEnd"
      @image-transform-end="handleImageTransformEnd"
      @text-drag-end="handleTextDragEnd"
      @text-transform-end="handleTextTransformEnd"
      @text-edit="handleTextEdit"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import GraphicToolbar from './Toolbar.vue'
import GraphicCanvas from './Canvas.vue'
import { ImageService } from '../services/ImageService.js'
import { TextService } from '../services/TextService.js'
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
    const texts = ref([])
    const selectedTextId = ref(null)
    const canvasScale = ref(0.5)
    
    const imageService = new ImageService()
    const textService = new TextService()
    
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
        selectedTextId.value = null
        return
      }
      
      // Check if clicked on an image
      if (e.target.getClassName() === 'Image') {
        selectedImageId.value = e.target.id()
        selectedTextId.value = null
        
        // Bring the selected image to the front so selection handles are visible
        e.target.moveToTop()
      }
      
      // Check if clicked on text
      if (e.target.getClassName() === 'Text') {
        selectedTextId.value = e.target.id()
        selectedImageId.value = null
        
        // Bring the selected text to the front so selection handles are visible
        e.target.moveToTop()
      }
    }
    
    const handleImageDragEnd = (e) => {
      const imageId = e.target.id()
      imageService.updateImagePosition(imageId, e.target.x(), e.target.y(), images.value)
    }
    
    const handleImageTransformEnd = (e) => {
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
    
    const handleTextDragEnd = (e) => {
      const textId = e.target.id()
      textService.updateTextPosition(textId, e.target.x(), e.target.y(), texts.value)
    }
    
    const handleTextTransformEnd = () => {
      // Text doesn't need transform handling for now
    }
    
    const handleTextEdit = (textId) => {
      const text = texts.value.find(t => t.id === textId)
      if (text) {
        const newContent = prompt('Edit text:', text.content)
        if (newContent !== null) {
          textService.updateTextContent(textId, newContent, texts.value)
        }
      }
    }
    
    const addText = () => {
      const newText = textService.createText(200, 200, 'Double click to edit')
      texts.value.push(newText)
      selectedTextId.value = newText.id
      selectedImageId.value = null
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
      textService.clearTexts(texts.value)
      selectedImageId.value = null
      selectedTextId.value = null
    }
    
    const deleteSelectedImage = () => {
      if (selectedImageId.value) {
        deleteImageById(selectedImageId.value)
      } else if (selectedTextId.value) {
        deleteTextById(selectedTextId.value)
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
    
    const deleteTextById = (textId) => {
      if (textService.deleteText(textId, texts.value)) {
        // Clear selection if this was the selected text
        if (selectedTextId.value === textId) {
          selectedTextId.value = null
        }
      }
    }
    
    const handleZoomIn = () => {
      canvasScale.value = Math.min(canvasScale.value * 1.2, 2.0)
    }
    
    const handleZoomOut = () => {
      canvasScale.value = Math.max(canvasScale.value / 1.2, 0.1)
    }
    
    const handleZoomReset = () => {
      canvasScale.value = 0.5
    }
    
    // Keyboard event handler
    const handleKeyDown = (event) => {
      // Delete key for delete selected image or text
      if (event.key === 'Delete' && (selectedImageId.value || selectedTextId.value)) {
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
      texts,
      selectedTextId,
      canvasScale,
      handleFileUpload,
      handleStageClick,
      handleImageDragEnd,
      handleImageTransformEnd,
      handleTextDragEnd,
      handleTextTransformEnd,
      handleTextEdit,
      addText,
      handleZoomIn,
      handleZoomOut,
      handleZoomReset,
      exportCanvas,
      clearCanvas,
      deleteSelectedImage,
      deleteImageById,
      deleteTextById
    }
  }
}
</script>

 