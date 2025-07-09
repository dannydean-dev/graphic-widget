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
          @drag-end="handleDragEnd"
          @transform-end="handleTransformEnd"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import ImageLayer from './ImageLayer.vue'

export default {
  name: 'GraphicCanvas',
  components: {
    ImageLayer
  },
  props: {
    images: {
      type: Array,
      default: () => []
    },
    selectedImageId: {
      type: String,
      default: null
    }
  },
  emits: ['stage-click', 'drag-end', 'transform-end'],
  setup(props, { emit }) {
    const stage = ref(null)
    const layer = ref(null)
    
    const stageConfig = reactive({
      width: 960, // Half of 1920 to account for 0.5 scale
      height: 540, // Half of 1080 to account for 0.5 scale
      scaleX: 0.5,
      scaleY: 0.5
    })
    
    const handleStageClick = (e) => {
      emit('stage-click', e)
    }
    
    const handleDragEnd = (e) => {
      emit('drag-end', e)
    }
    
    const handleTransformEnd = (e) => {
      emit('transform-end', e)
    }
    
    const getStage = () => {
      return stage.value
    }
    
    return {
      stage,
      layer,
      stageConfig,
      handleStageClick,
      handleDragEnd,
      handleTransformEnd,
      getStage
    }
  }
}
</script> 