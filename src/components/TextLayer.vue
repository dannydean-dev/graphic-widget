<template>
  <div>
    <!-- Text elements -->
    <v-text
      v-for="text in texts"
      :key="text.id"
      :config="{
        x: text.x,
        y: text.y,
        text: text.content,
        fontSize: text.fontSize,
        fontFamily: text.fontFamily,
        fill: text.color,
        draggable: true,
        id: text.id
      }"
      @dragend="handleDragEnd"
      @transformend="handleTransformEnd"
      @dblclick="handleDoubleClick"
    />
    
    <!-- Text transformer for selected text -->
    <v-transformer
      ref="transformer"
      :config="{
        boundBoxFunc: (oldBox, newBox) => {
          // Limit minimum size
          if (newBox.width < 50 || newBox.height < 20) {
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
  name: 'TextLayer',
  props: {
    texts: {
      type: Array,
      default: () => []
    },
    selectedTextId: {
      type: String,
      default: null
    },
    layer: {
      type: Object,
      default: null
    }
  },
  emits: ['drag-end', 'transform-end', 'text-edit'],
  setup(props, { emit }) {
    const transformer = ref(null)
    
    const handleDragEnd = (e) => {
      emit('drag-end', e)
    }
    
    const handleTransformEnd = (e) => {
      emit('transform-end', e)
    }
    
    const handleDoubleClick = (e) => {
      const textId = e.target.id()
      emit('text-edit', textId)
    }
    
    const updateTransformers = () => {
      // Remove transformer from all nodes
      if (transformer.value) {
        const transformerNode = transformer.value.getNode()
        if (transformerNode) {
          transformerNode.nodes([])
        }
      }
      
      // Add transformer to selected text
      if (props.selectedTextId && props.layer) {
        const layerNode = props.layer.getNode()
        if (layerNode) {
          const textNode = layerNode.findOne(`#${props.selectedTextId}`)
          if (textNode && transformer.value) {
            const transformerNode = transformer.value.getNode()
            if (transformerNode) {
              transformerNode.nodes([textNode])
            }
          }
        }
      }
    }
    
    // Watch for changes in selectedTextId to update transformers
    watch(() => props.selectedTextId, () => {
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
      handleDoubleClick,
      updateTransformers
    }
  }
}
</script> 