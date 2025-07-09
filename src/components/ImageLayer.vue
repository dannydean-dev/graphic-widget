<template>
  <div>
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
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'ImageLayer',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    selectedImageId: {
      type: String,
      default: null
    },
    layer: {
      type: Object,
      default: null
    }
  },
  emits: ['drag-end', 'transform-end', 'update-transformers'],
  setup(props, { emit }) {
    const transformer = ref(null)
    
    const handleDragEnd = (e) => {
      emit('drag-end', e)
    }
    
    const handleTransformEnd = (e) => {
      emit('transform-end', e)
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
      if (props.selectedImageId && props.layer) {
        const layerNode = props.layer.getNode()
        if (layerNode) {
          const imageNode = layerNode.findOne(`#${props.selectedImageId}`)
          if (imageNode && transformer.value) {
            const transformerNode = transformer.value.getNode()
            if (transformerNode) {
              transformerNode.nodes([imageNode])
            }
          }
        }
      }
    }
    
    // Watch for changes in selectedImageId to update transformers
    watch(() => props.selectedImageId, () => {
      updateTransformers()
    })
    
    // Watch for changes in layer to update transformers
    watch(() => props.layer, () => {
      updateTransformers()
    })
    
    return {
      transformer,
      handleDragEnd,
      handleTransformEnd,
      updateTransformers
    }
  }
}
</script> 