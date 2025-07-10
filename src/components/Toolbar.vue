<template>
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    </button>
    <button 
      @click="$emit('export')" 
      class="btn" 
      :class="{ 'btn-disabled': imageCount === 0 }"
      :disabled="imageCount === 0"
      :title="imageCount === 0 ? 'No images to export' : 'Export'"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17,8 12,3 7,8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    </button>
    <button 
      v-if="selectedImageId" 
      @click="$emit('delete-selected')" 
      class="btn"
      title="Delete Selected"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88"/>
        <line x1="14.47" y1="14.48" x2="20" y2="20"/>
        <line x1="8.12" y1="8.12" x2="12" y2="12"/>
      </svg>
    </button>
    <button @click="$emit('add-text')" class="btn" title="Add Text">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="17" y1="10" x2="3" y2="10"/>
        <line x1="21" y1="6" x2="3" y2="6"/>
        <line x1="21" y1="14" x2="3" y2="14"/>
        <line x1="7" y1="18" x2="3" y2="18"/>
      </svg>
    </button>
    <button @click="$emit('clear')" class="btn" title="Clear All">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    </button>
    <div class="toolbar-info">
      <span>Images: {{ imageCount }}</span>
      <span>| Layers: {{ imageCount }}</span>
      <span v-if="selectedImageId">| Selected</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'GraphicToolbar',
  props: {
    imageCount: {
      type: Number,
      default: 0
    },
    selectedImageId: {
      type: String,
      default: null
    }
  },
  emits: ['file-upload', 'export', 'delete-selected', 'add-text', 'clear'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    
    const handleFileUpload = (event) => {
      emit('file-upload', event)
    }
    
    return {
      fileInput,
      handleFileUpload
    }
  }
}
</script> 