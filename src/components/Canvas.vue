<template>
  <div class="canvas-area">
    <v-stage
      ref="stage"
      :config="stageConfig"
      @click="handleStageClick"
      @touchstart="handleStageClick"
    >
      <v-layer ref="layer">
        <ImageLayer
          :images="images"
          :selected-image-id="selectedImageId"
          :layer="layer"
          @drag-end="handleImageDragEnd"
          @transform-end="handleImageTransformEnd"
        />
        <TextLayer
          :texts="texts"
          :selected-text-id="selectedTextId"
          :layer="layer"
          @drag-end="handleTextDragEnd"
          @transform-end="handleTextTransformEnd"
          @text-edit="handleTextEdit"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import ImageLayer from './ImageLayer.vue'
import TextLayer from './TextLayer.vue'

export default {
  name: 'GraphicCanvas',
  components: {
    ImageLayer,
    TextLayer
  },
  props: {
    images: {
      type: Array,
      default: () => []
    },
    selectedImageId: {
      type: String,
      default: null
    },
    texts: {
      type: Array,
      default: () => []
    },
    selectedTextId: {
      type: String,
      default: null
    },
    scale: {
      type: Number,
      default: 0.5
    }
  },
  emits: ['stage-click', 'image-drag-end', 'image-transform-end', 'text-drag-end', 'text-transform-end', 'text-edit'],
  setup(props, { emit }) {
    const stage = ref(null)
    const layer = ref(null)
    
    const stageConfig = reactive({
      width: 960, // Half of 1920 to account for 0.5 scale
      height: 540, // Half of 1080 to account for 0.5 scale
      scaleX: props.scale,
      scaleY: props.scale
    })
    
    const handleStageClick = (e) => {
      emit('stage-click', e)
    }
    
    const handleImageDragEnd = (e) => {
      emit('image-drag-end', e)
    }
    
    const handleImageTransformEnd = (e) => {
      emit('image-transform-end', e)
    }
    
    const handleTextDragEnd = (e) => {
      emit('text-drag-end', e)
    }
    
    const handleTextTransformEnd = (e) => {
      emit('text-transform-end', e)
    }
    
    const handleTextEdit = (textId) => {
      emit('text-edit', textId)
    }
    
    const getStage = () => {
      return stage.value
    }
    
    return {
      stage,
      layer,
      stageConfig,
      handleStageClick,
      handleImageDragEnd,
      handleImageTransformEnd,
      handleTextDragEnd,
      handleTextTransformEnd,
      handleTextEdit,
      getStage
    }
  }
}
</script> 