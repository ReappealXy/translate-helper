// 翻译助手内容脚本 - content.js

// 配置选项
const config = {
  shortcutKey: { ctrl: true, shift: true, key: 'T' },
  floatButtonText: '📘',
  apiUrl: 'https://api.mymemory.translated.net/get',
  languages: {
    'zh': '中文',
    'en': '英语',
    'ja': '日语',
    'ko': '韩语',
    'fr': '法语',
    'de': '德语',
    'es': '西班牙语',
    'ru': '俄语',
    'pt': '葡萄牙语',
    'it': '意大利语',
    'ar': '阿拉伯语'
  },
  autoDetectThreshold: 0.7, // 简单的语言检测阈值
  maxCharsPerRequest: 500   // 每次翻译请求的最大字符数
};

// 主类：翻译助手
class TranslatorHelper {
  constructor() {
    this.isVisible = false;
    this.isDragging = false;
    this.panel = null;
    this.floatButton = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.sourceLang = 'en';
    this.targetLang = 'zh';
    
    // 初始化
    this.injectStyles();
    this.createFloatButton();
    this.createTranslatorPanel();
    this.setupEventListeners();
  }
  
  // 注入CSS样式
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .translator-float-button {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #4285f4;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        user-select: none;
        transition: all 0.3s ease;
      }
      
      .translator-float-button:hover {
        background-color: #5c9aff;
        transform: scale(1.05);
      }
      
      .translator-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 360px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: none;
        font-family: Arial, sans-serif;
        overflow: hidden;
      }
      
      .translator-panel-header {
        background-color: #4285f4;
        color: white;
        padding: 12px 16px;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      }
      
      .translator-panel-close {
        cursor: pointer;
        font-size: 18px;
      }
      
      .translator-panel-body {
        padding: 16px;
      }
      
      .translator-input-area {
        margin-bottom: 12px;
      }
      
      .translator-input {
        width: 100%;
        height: 80px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: none;
        font-size: 14px;
        box-sizing: border-box;
      }
      
      .translator-language-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      
      .translator-language-select {
        padding: 6px;
        border-radius: 4px;
        border: 1px solid #ddd;
        background-color: white;
        font-size: 13px;
      }
      
      .translator-swap-btn {
        background-color: #f2f2f2;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .translator-swap-btn:hover {
        background-color: #e6e6e6;
      }
      
      .translator-buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      
      .translator-translate-btn {
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }
      
      .translator-translate-btn:hover {
        background-color: #5c9aff;
      }
      
      .translator-result-area {
        border: 1px solid #eeeeee;
        border-radius: 4px;
        padding: 12px;
        min-height: 60px;
        max-height: 150px;
        overflow-y: auto;
        font-size: 14px;
        background-color: #f9f9f9;
      }
      
      .translator-loading {
        text-align: center;
        color: #888;
        font-style: italic;
      }
      
      .translator-auto-detect {
        font-size: 12px;
        color: #888;
        font-style: italic;
        margin-top: 5px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // 创建悬浮按钮
  createFloatButton() {
    this.floatButton = document.createElement('div');
    this.floatButton.className = 'translator-float-button';
    this.floatButton.textContent = config.floatButtonText;
    document.body.appendChild(this.floatButton);
  }
  
  // 创建翻译面板
  createTranslatorPanel() {
    this.panel = document.createElement('div');
    this.panel.className = 'translator-panel';
    
    // 创建语言选择器选项
    let sourceOptions = '';
    let targetOptions = '';
    
    for (const [code, name] of Object.entries(config.languages)) {
      sourceOptions += `<option value="${code}">${name}</option>`;
      targetOptions += `<option value="${code}">${name}</option>`;
    }
    
    this.panel.innerHTML = `
      <div class="translator-panel-header">
        <div>多语言翻译助手</div>
        <div class="translator-panel-close">×</div>
      </div>
      <div class="translator-panel-body">
        <div class="translator-language-selector">
          <select class="translator-language-select translator-source">
            ${sourceOptions}
          </select>
          <div class="translator-swap-btn">⇄</div>
          <select class="translator-language-select translator-target">
            ${targetOptions}
          </select>
        </div>
        <div class="translator-input-area">
          <textarea class="translator-input" placeholder="请输入或粘贴需要翻译的文本..."></textarea>
          <div class="translator-auto-detect"></div>
        </div>
        <div class="translator-buttons">
          <button class="translator-translate-btn">翻译</button>
        </div>
        <div class="translator-result-area"></div>
        <div class="translator-footer" style="margin-top: 10px; font-size: 12px; color: #888; text-align: right;">
          <a href="https://www.rexy.xin" target="_blank" style="color: #4285f4; text-decoration: none;">© Rexy</a>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.panel);
    
    // 设置默认语言选择
    const sourceSelect = this.panel.querySelector('.translator-source');
    const targetSelect = this.panel.querySelector('.translator-target');
    
    sourceSelect.value = this.sourceLang;
    targetSelect.value = this.targetLang;
  }
  
  // 设置事件监听
  setupEventListeners() {
    // 悬浮按钮点击事件
    this.floatButton.addEventListener('click', () => this.togglePanel());
    
    // 关闭按钮事件
    const closeBtn = this.panel.querySelector('.translator-panel-close');
    closeBtn.addEventListener('click', () => this.hidePanel());
    
    // 翻译按钮事件
    const translateBtn = this.panel.querySelector('.translator-translate-btn');
    translateBtn.addEventListener('click', () => this.translateText());
    
    // 输入框内容变化时尝试自动检测语言
    const inputElement = this.panel.querySelector('.translator-input');
    inputElement.addEventListener('input', () => this.detectLanguage(inputElement.value));
    
    // 响应扩展图标点击事件
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'togglePanel') {
        this.togglePanel();
      }
    });
    
    // 语言选择器变化事件
    const sourceSelect = this.panel.querySelector('.translator-source');
    const targetSelect = this.panel.querySelector('.translator-target');
    
    sourceSelect.addEventListener('change', () => {
      this.sourceLang = sourceSelect.value;
    });
    
    targetSelect.addEventListener('change', () => {
      this.targetLang = targetSelect.value;
    });
    
    // 语言交换按钮事件
    const swapBtn = this.panel.querySelector('.translator-swap-btn');
    swapBtn.addEventListener('click', () => {
      // 交换语言选择
      const tempLang = sourceSelect.value;
      sourceSelect.value = targetSelect.value;
      targetSelect.value = tempLang;
      
      this.sourceLang = sourceSelect.value;
      this.targetLang = targetSelect.value;
      
      // 如果已有输入和结果，则交换它们
      const inputElement = this.panel.querySelector('.translator-input');
      const resultElement = this.panel.querySelector('.translator-result-area');
      
      if (inputElement.value && resultElement.textContent && 
          resultElement.textContent !== '翻译中...' && 
          !resultElement.textContent.includes('翻译失败') &&
          !resultElement.textContent.includes('翻译出错')) {
        const tempText = inputElement.value;
        inputElement.value = resultElement.textContent;
        resultElement.textContent = tempText;
      }
    });
    
    // 快捷键监听
    document.addEventListener('keydown', (e) => this.handleShortcut(e));
    
    // 拖动面板相关事件
    const header = this.panel.querySelector('.translator-panel-header');
    header.addEventListener('mousedown', (e) => this.startDragging(e));
    document.addEventListener('mousemove', (e) => this.dragPanel(e));
    document.addEventListener('mouseup', () => this.stopDragging());
  }
  
  // 显示面板
  showPanel() {
    const selectedText = this.getSelectedText();
    const inputElement = this.panel.querySelector('.translator-input');
    
    if (selectedText) {
      inputElement.value = selectedText;
      // 尝试检测所选文本的语言
      this.detectLanguage(selectedText);
    }
    
    this.panel.style.display = 'block';
    this.isVisible = true;
  }
  
  // 隐藏面板
  hidePanel() {
    this.panel.style.display = 'none';
    this.isVisible = false;
  }
  
  // 切换面板显示状态
  togglePanel() {
    if (this.isVisible) {
      this.hidePanel();
    } else {
      this.showPanel();
    }
  }
  
  // 开始拖动
  startDragging(e) {
    if (e.target.classList.contains('translator-panel-close')) {
      return;
    }
    
    this.isDragging = true;
    
    // 计算鼠标在面板中的相对位置
    const rect = this.panel.getBoundingClientRect();
    this.dragOffsetX = e.clientX - rect.left;
    this.dragOffsetY = e.clientY - rect.top;
    
    // 移除居中定位
    this.panel.style.top = rect.top + 'px';
    this.panel.style.left = rect.left + 'px';
    this.panel.style.transform = 'none';
  }
  
  // 拖动面板
  dragPanel(e) {
    if (!this.isDragging) return;
    
    const x = e.clientX - this.dragOffsetX;
    const y = e.clientY - this.dragOffsetY;
    
    this.panel.style.left = x + 'px';
    this.panel.style.top = y + 'px';
  }
  
  // 停止拖动
  stopDragging() {
    this.isDragging = false;
  }
  
  // 获取选中文本
  getSelectedText() {
    return window.getSelection().toString().trim();
  }
  
  // 处理快捷键
  handleShortcut(e) {
    const { ctrl, shift, key } = config.shortcutKey;
    
    if (
      (ctrl && e.ctrlKey) &&
      (shift && e.shiftKey) &&
      e.key.toUpperCase() === key
    ) {
      e.preventDefault();
      this.togglePanel();
    }
  }
  
  // 简单的语言检测（基于字符特征）
  detectLanguage(text) {
    if (!text) return;
    
    const autoDetectElement = this.panel.querySelector('.translator-auto-detect');
    const sourceSelect = this.panel.querySelector('.translator-source');
    const targetSelect = this.panel.querySelector('.translator-target');
    
    // 计算不同语言字符的比例
    const totalChars = text.length;
    let chineseChars = 0;
    let japaneseChars = 0;
    let koreanChars = 0;
    let cyrillicChars = 0;
    let arabicChars = 0;
    
    for (let i = 0; i < totalChars; i++) {
      const charCode = text.charCodeAt(i);
      // 判断是否为中文字符
      if (charCode >= 0x4e00 && charCode <= 0x9fff) {
        chineseChars++;
      }
      // 判断是否为日文特有字符（平假名、片假名）
      else if ((charCode >= 0x3040 && charCode <= 0x309F) || 
               (charCode >= 0x30A0 && charCode <= 0x30FF)) {
        japaneseChars++;
      }
      // 判断是否为韩文字符
      else if (charCode >= 0xAC00 && charCode <= 0xD7A3) {
        koreanChars++;
      }
      // 判断是否为俄文字符（西里尔字母）
      else if ((charCode >= 0x0400 && charCode <= 0x04FF) || 
               (charCode >= 0x0500 && charCode <= 0x052F)) {
        cyrillicChars++;
      }
      // 判断是否为阿拉伯文字符
      else if (charCode >= 0x0600 && charCode <= 0x06FF) {
        arabicChars++;
      }
    }
    
    const chineseRatio = chineseChars / totalChars;
    const japaneseRatio = japaneseChars / totalChars;
    const koreanRatio = koreanChars / totalChars;
    const cyrillicRatio = cyrillicChars / totalChars;
    const arabicRatio = arabicChars / totalChars;
    
    // 默认目标语言是中文，除非源语言被检测为中文
    let detectedLang = '';
    let detectedName = '';
    let targetLang = 'zh';
    
    // 基于比例判断语言
    if (chineseRatio > config.autoDetectThreshold) {
      detectedLang = 'zh';
      detectedName = '中文';
      targetLang = 'en'; // 如果检测到中文，目标语言设为英文
    } else if (japaneseRatio > 0.5) {
      detectedLang = 'ja';
      detectedName = '日语';
    } else if (koreanRatio > 0.5) {
      detectedLang = 'ko';
      detectedName = '韩语';
    } else if (cyrillicRatio > 0.5) {
      detectedLang = 'ru';
      detectedName = '俄语';
    } else if (arabicRatio > 0.5) {
      detectedLang = 'ar';
      detectedName = '阿拉伯语';
    } else if (totalChars > 0) {
      // 默认识别为英文（或拉丁字母语言）
      // 这里可以通过更复杂的算法区分不同拉丁文字语言
      detectedLang = 'en';
      detectedName = '英语/拉丁文字';
    }
    
    if (detectedLang) {
      sourceSelect.value = detectedLang;
      this.sourceLang = detectedLang;
      
      // 设置合适的目标语言
      if (targetSelect.value === detectedLang) {
        targetSelect.value = targetLang;
        this.targetLang = targetLang;
      }
      
      autoDetectElement.textContent = `检测到${detectedName}`;
    } else {
      // 无法确定语言
      autoDetectElement.textContent = '';
    }
  }
  
  // 翻译文本
  translateText() {
    const inputElement = this.panel.querySelector('.translator-input');
    const resultElement = this.panel.querySelector('.translator-result-area');
    const text = inputElement.value.trim();
    
    if (!text) {
      resultElement.textContent = '请输入需要翻译的文本';
      return;
    }
    
    // 显示加载状态
    resultElement.innerHTML = '<div class="translator-loading">翻译中...</div>';
    
    // 如果文本较短，直接翻译
    if (text.length <= config.maxCharsPerRequest) {
      this.performTranslation(text, resultElement);
    } else {
      // 长文本需要分段翻译
      this.translateLongText(text, resultElement);
    }
  }
  
  // 执行单次翻译请求
  performTranslation(text, resultElement) {
    const params = new URLSearchParams({
      q: text,
      langpair: `${this.sourceLang}|${this.targetLang}`
    });
    
    return fetch(`${config.apiUrl}?${params}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.responseData && data.responseData.translatedText) {
          if (resultElement) {
            resultElement.textContent = data.responseData.translatedText;
          }
          return data.responseData.translatedText;
        } else if (data && data.responseStatus && data.responseStatus === 403) {
          const errorMsg = 'API使用次数超限';
          if (resultElement) resultElement.textContent = errorMsg;
          throw new Error(errorMsg);
        } else if (data && data.responseDetails && data.responseDetails.includes('QUERY LENGTH LIMIT EXCEEDED')) {
          const errorMsg = '文本长度超出API限制';
          if (resultElement) resultElement.textContent = errorMsg;
          throw new Error(errorMsg);
        } else {
          console.error('翻译API返回:', data);
          const errorMsg = '翻译请求失败';
          if (resultElement) resultElement.textContent = errorMsg;
          throw new Error(errorMsg);
        }
      })
      .catch(error => {
        console.error('翻译出错:', error);
        if (resultElement) {
          resultElement.textContent = `翻译出错: ${error.message || '请检查网络连接'}`;
        }
        throw error;
      });
  }
  
  // 长文本分段翻译
  translateLongText(text, resultElement) {
    // 智能分段，尽量按句子或段落分割
    const segments = this.smartSplitText(text);
    let currentIndex = 0;
    let translatedResult = '';
    
    resultElement.innerHTML = '<div class="translator-loading">长文本翻译中 (0%)...</div>';
    
    // 逐段翻译并合并结果
    const translateNextSegment = () => {
      if (currentIndex >= segments.length) {
        // 所有段落翻译完成
        resultElement.textContent = translatedResult.trim();
        return;
      }
      
      // 更新进度
      const progress = Math.floor((currentIndex / segments.length) * 100);
      resultElement.innerHTML = `<div class="translator-loading">长文本翻译中 (${progress}%)...</div>`;
      
      // 翻译当前段落
      this.performTranslation(segments[currentIndex])
        .then(result => {
          translatedResult += result + ' ';
          currentIndex++;
          
          // 继续翻译下一段，增加间隔避免API限制
          setTimeout(translateNextSegment, 300);
        })
        .catch(error => {
          resultElement.textContent = `翻译错误: ${error.message}`;
        });
    };
    
    // 开始翻译第一段
    translateNextSegment();
  }
  
  // 智能分段文本
  smartSplitText(text) {
    const maxLen = config.maxCharsPerRequest;
    const segments = [];
    
    // 首先尝试按段落分割（双换行）
    const paragraphs = text.split(/\n\s*\n/);
    
    for (let para of paragraphs) {
      if (para.length <= maxLen) {
        segments.push(para);
      } else {
        // 段落过长，按句子分割（句号、问号、感叹号后跟空格）
        const sentences = para.split(/([.!?])\s+/);
        let currentSegment = '';
        
        for (let i = 0; i < sentences.length; i++) {
          // 如果是标点符号，附加到前一个片段
          if (sentences[i].match(/^[.!?]$/)) {
            currentSegment += sentences[i];
            continue;
          }
          
          // 检查加上当前句子是否会超出长度限制
          if (currentSegment.length + sentences[i].length <= maxLen) {
            currentSegment += sentences[i];
          } else {
            // 如果当前句子加上去会超出限制
            if (currentSegment) {
              segments.push(currentSegment);
              currentSegment = sentences[i];
            } else {
              // 如果单个句子就超出了限制，需要按字符硬分割
              let remainingText = sentences[i];
              while (remainingText.length > maxLen) {
                // 尝试在单词边界分割
                let splitPos = remainingText.lastIndexOf(' ', maxLen);
                if (splitPos === -1 || splitPos < maxLen / 2) {
                  // 如果没有合适的单词边界，直接在字符级别分割
                  splitPos = maxLen;
                }
                
                segments.push(remainingText.substring(0, splitPos));
                remainingText = remainingText.substring(splitPos);
              }
              
              currentSegment = remainingText;
            }
          }
        }
        
        if (currentSegment) {
          segments.push(currentSegment);
        }
      }
    }
    
    return segments;
  }
}

// 初始化翻译助手
const translator = new TranslatorHelper(); 