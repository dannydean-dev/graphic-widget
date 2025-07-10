export class TextService {
  constructor() {
    this.textIdCounter = 0
  }
  
  createText(x = 200, y = 200, content = 'Double click to edit') {
    return {
      id: `text-${++this.textIdCounter}`,
      x: x,
      y: y,
      content: content,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000'
    }
  }
  
  updateTextPosition(textId, x, y, texts) {
    const text = texts.find(t => t.id === textId)
    if (text) {
      text.x = x
      text.y = y
    }
  }
  
  updateTextContent(textId, content, texts) {
    const text = texts.find(t => t.id === textId)
    if (text) {
      text.content = content
    }
  }
  
  deleteText(textId, texts) {
    const index = texts.findIndex(t => t.id === textId)
    if (index !== -1) {
      texts.splice(index, 1)
      return true
    }
    return false
  }
  
  clearTexts(texts) {
    texts.length = 0
  }
} 