<template>
  <div class="graphic-widget">
    <!-- Simple Toolbar -->
    <div class="toolbar">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept="image/*"
        multiple
        style="display: none"
      />
      <button @click="$refs.fileInput.click()" class="btn" title="Upload">
        📁
      </button>
      <button @click="exportCanvas" class="btn" title="Export">
        💾
      </button>
      <button 
        v-if="selectedImageId" 
        @click="deleteSelectedImage" 
        class="btn"
        title="Delete"
      >
        🗑️
      </button>
      <button @click="clearCanvas" class="btn" title="Clear">
        🗑️
      </button>
      <div class="toolbar-info">
        <span>Images: {{ images.length }}</span>
        <span>| Layers: {{ images.length }}</span>
        <span v-if="selectedImageId">| Selected</span>
      </div>
    </div>

    <!-- Canvas Area -->
    <div class="canvas-area">
          <v-stage
            ref="stage"
            :config="stageConfig"
            @click="handleStageClick"
            @touchstart="handleStageClick"
          >
            <v-layer ref="layer">

              
              <!-- Uploaded images -->
              <v-image
                v-for="image in images"
                :key="image.id"
                :config="{
                  x: image.x,
                  y: image.y,
                  image: image.imageObj,
                  width: image.width,
                  height: image.height,
                  draggable: true,
                  id: image.id
                }"
                @dragend="handleDragEnd"
                @transformend="handleTransformEnd"
              />
              

              
              <!-- Single transformer for selected image -->
              <v-transformer
                ref="transformer"
                :config="{
                  boundBoxFunc: (oldBox, newBox) => {
                    // Limit minimum size
                    if (newBox.width < 50 || newBox.height < 50) {
                      return oldBox;
                    }
                    return newBox;
                  },
                  anchorSize: 8,
                  anchorStroke: '#007bff',
                  anchorFill: '#ffffff',
                  anchorStrokeWidth: 2
                }"
              />
            </v-layer>
          </v-stage>
        </div>

  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import './GraphicWidget.css'

export default {
  name: 'GraphicWidget',
  setup() {
    const stage = ref(null)
    const layer = ref(null)
    const fileInput = ref(null)
    const transformer = ref(null)
    
    const stageConfig = reactive({
      width: 960, // Half of 1920 to account for 0.5 scale
      height: 540, // Half of 1080 to account for 0.5 scale
      scaleX: 0.5,
      scaleY: 0.5
    })
    
    const images = ref([])
    const selectedImageId = ref(null)
    const instructionsCollapsed = ref(false)
    
    let imageIdCounter = 0
    
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
              id: `image-${++imageIdCounter}`,
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
        updateTransformers()
        return
      }
      
      // Check if clicked on an image
      if (e.target.getClassName() === 'Image') {
        selectedImageId.value = e.target.id()
        updateTransformers()
      }
    }

    const updateTransformers = () => {
      // Remove transformer from all nodes
      if (transformer.value) {
        const transformerNode = transformer.value.getNode()
        if (transformerNode) {
          transformerNode.nodes([])
        }
      }
      
      // Add transformer to selected image
      if (selectedImageId.value) {
        const layerNode = layer.value.getNode()
        if (layerNode) {
          const imageNode = layerNode.findOne(`#${selectedImageId.value}`)
          if (imageNode && transformer.value) {
            const transformerNode = transformer.value.getNode()
            if (transformerNode) {
              transformerNode.nodes([imageNode])
            }
          }
        }
      }
    }
    
    const handleDragEnd = (e) => {
      const imageId = e.target.id()
      const image = images.value.find(img => img.id === imageId)
      if (image) {
        image.x = e.target.x()
        image.y = e.target.y()
      }
    }
    
    const handleTransformEnd = (e) => {
      const imageId = e.target.id()
      const image = images.value.find(img => img.id === imageId)
      if (image) {
        image.width = e.target.width() * e.target.scaleX()
        image.height = e.target.height() * e.target.scaleY()
        image.x = e.target.x()
        image.y = e.target.y()
        
        // Reset scale to 1 after applying transform
        e.target.scaleX(1)
        e.target.scaleY(1)
      }
    }
    
    const exportCanvas = () => {
      // Hide UI elements temporarily
      const toolbar = document.querySelector('.toolbar')
      const canvasHeader = document.querySelector('.canvas-header')
      const layerPanel = document.querySelector('.layer-panel')
      
      if (toolbar) toolbar.style.display = 'none'
      if (canvasHeader) canvasHeader.style.display = 'none'
      if (layerPanel) layerPanel.style.display = 'none'
      

      

      
      // Export the canvas
      const canvas = stage.value.getNode().toCanvas({
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
    
    const getCanvasBlob = () => {
      return new Promise((resolve) => {
        // Hide UI elements temporarily
        const toolbar = document.querySelector('.toolbar')
        const canvasHeader = document.querySelector('.canvas-header')
        const layerPanel = document.querySelector('.layer-panel')
        
        if (toolbar) toolbar.style.display = 'none'
        if (canvasHeader) canvasHeader.style.display = 'none'
        if (layerPanel) layerPanel.style.display = 'none'
        

        

        
        const canvas = stage.value.getNode().toCanvas({
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
    
    
    const clearCanvas = () => {
      images.value = []
      selectedImageId.value = null
      updateTransformers()
    }
    
    const deleteSelectedImage = () => {
      if (selectedImageId.value) {
        deleteImageById(selectedImageId.value)
      }
    }
    
    const deleteImageById = (imageId) => {
      const index = images.value.findIndex(img => img.id === imageId)
      if (index !== -1) {
        // Remove the image
        images.value.splice(index, 1)
        
        // Clear selection if this was the selected image
        if (selectedImageId.value === imageId) {
          selectedImageId.value = null
          updateTransformers()
        }
      }
    }
    

    
    const toggleInstructions = () => {
      instructionsCollapsed.value = !instructionsCollapsed.value
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
      stage,
      layer,
      fileInput,
      transformer,
      stageConfig,
      images,
      selectedImageId,
      instructionsCollapsed,
      handleFileUpload,
      handleStageClick,
      handleDragEnd,
      handleTransformEnd,
      exportCanvas,
      getCanvasBlob,
      clearCanvas,
      deleteSelectedImage,
      deleteImageById,
      toggleInstructions
    }
  }
}
</script>

 