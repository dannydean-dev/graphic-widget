<template>
  <div id="app">
    <!-- <header class="app-header">
      <div class="header-content">
        <h1>Graphic Designer</h1>
        <p class="subtitle">Create stunning 1920x1080 compositions</p>
      </div>
    </header> -->
    
    <main class="app-main">
      <GraphicWidget />
    </main>
    
    <!-- <footer class="app-footer">
      <p>&copy; 2024 Graphic Designer. Built with Vue 3 & Konva.js</p>
    </footer> -->
  </div>
</template>

<script>
import GraphicWidget from './components/GraphicWidget.vue'

export default {
  name: 'App',
  components: {
    GraphicWidget
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem 0;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.app-header h1 {
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.app-main {
  /* flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px); */
}

.app-footer {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 0;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .app-main {
    padding: 1rem;
  }
  
  .header-content {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 1.75rem;
  }
  
  .app-main {
    padding: 0.5rem;
  }
}
</style>
