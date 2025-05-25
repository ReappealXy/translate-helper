// 翻译助手主脚本 - translator.js

// 配置选项
const config = {
  shortcutKey: { ctrl: true, shift: true, key: 'T' },
  floatButtonText: '📘',
<<<<<<< HEAD
  apiUrl: 'https://api.mymemory.translated.net/get',
=======
  // 百度翻译 API 配置
  apiConfig: {
    appid: '20250525002365812', // 需要填入你的百度翻译 APP ID
    key: '0r4PIFDkuiQkNWqU2TeT',   // 需要填入你的百度翻译密钥
    apiUrl: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
    salt: Date.now(), // 随机数
  },
>>>>>>> cf0de47 (Initial commit)
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
<<<<<<< HEAD
    'ar': '阿拉伯语'
  },
  autoDetectThreshold: 0.7, // 简单的语言检测阈值
  maxCharsPerRequest: 500   // 每次翻译请求的最大字符数
=======
    'ar': '阿拉伯语',
    'th': '泰语',
    'vi': '越南语',
    'id': '印尼语',
    'ms': '马来语',
    'tr': '土耳其语',
    'pl': '波兰语',
    'nl': '荷兰语',
    'cs': '捷克语',
    'el': '希腊语'
  },
  autoDetectThreshold: 0.7, // 简单的语言检测阈值
  maxCharsPerRequest: 2000,   // 百度翻译API单次请求最大支持2000字符
  // 本地存储配置
  storage: {
    historyKey: 'translator_history',
    vocabularyKey: 'translator_vocabulary',
    maxHistoryItems: 50,
    maxVocabularyItems: 100
  }
>>>>>>> cf0de47 (Initial commit)
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
<<<<<<< HEAD
    
    // 初始化
=======
    this.history = [];
    this.vocabulary = [];
    
    // 初始化
    this.loadFromStorage();
>>>>>>> cf0de47 (Initial commit)
    this.injectStyles();
    this.createFloatButton();
    this.createTranslatorPanel();
    this.setupEventListeners();
  }
  
<<<<<<< HEAD
=======
  // 从本地存储加载数据
  loadFromStorage() {
    try {
      const historyData = localStorage.getItem(config.storage.historyKey);
      const vocabularyData = localStorage.getItem(config.storage.vocabularyKey);
      
      this.history = historyData ? JSON.parse(historyData) : [];
      this.vocabulary = vocabularyData ? JSON.parse(vocabularyData) : [];
    } catch (error) {
      console.error('加载本地存储数据失败:', error);
      this.history = [];
      this.vocabulary = [];
    }
  }
  
  // 保存数据到本地存储
  saveToStorage() {
    try {
      localStorage.setItem(config.storage.historyKey, JSON.stringify(this.history));
      localStorage.setItem(config.storage.vocabularyKey, JSON.stringify(this.vocabulary));
    } catch (error) {
      console.error('保存到本地存储失败:', error);
    }
  }
  
  // 添加翻译历史
  addToHistory(sourceText, translatedText, fromLang, toLang) {
    const historyItem = {
      sourceText,
      translatedText,
      fromLang,
      toLang,
      timestamp: Date.now()
    };

    this.history.unshift(historyItem);
    if (this.history.length > config.storage.maxHistoryItems) {
      this.history.pop();
    }
    this.saveToStorage();
    this.updateHistoryPanel();
  }
  
  // 添加生词
  addToVocabulary(sourceText, translatedText, fromLang, toLang) {
    const vocabularyItem = {
      sourceText,
      translatedText,
      fromLang,
      toLang,
      timestamp: Date.now(),
      notes: ''
    };

    // 检查是否已存在
    const exists = this.vocabulary.some(item => 
      item.sourceText === sourceText && 
      item.fromLang === fromLang && 
      item.toLang === toLang
    );

    if (!exists) {
      this.vocabulary.unshift(vocabularyItem);
      if (this.vocabulary.length > config.storage.maxVocabularyItems) {
        this.vocabulary.pop();
      }
      this.saveToStorage();
      this.updateVocabularyPanel();
    }
  }
  
  // 从生词本中移除
  removeFromVocabulary(index) {
    this.vocabulary.splice(index, 1);
    this.saveToStorage();
    this.updateVocabularyPanel();
  }
  
  // 更新生词备注
  updateVocabularyNote(index, note) {
    if (this.vocabulary[index]) {
      this.vocabulary[index].notes = note;
      this.saveToStorage();
      this.updateVocabularyPanel();
    }
  }
  
>>>>>>> cf0de47 (Initial commit)
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
<<<<<<< HEAD
        width: 360px;
        background-color: white;
        border-radius: 8px;
=======
        width: 480px;
        background-color: white;
        border-radius: 12px;
>>>>>>> cf0de47 (Initial commit)
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: none;
        font-family: Arial, sans-serif;
        overflow: hidden;
      }
      
      .translator-panel-header {
        background-color: #4285f4;
        color: white;
<<<<<<< HEAD
        padding: 12px 16px;
=======
        padding: 16px;
>>>>>>> cf0de47 (Initial commit)
        font-size: 16px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      }
      
      .translator-panel-close {
        cursor: pointer;
<<<<<<< HEAD
        font-size: 18px;
      }
      
      .translator-panel-body {
        padding: 16px;
      }
      
      .translator-input-area {
        margin-bottom: 12px;
=======
        font-size: 20px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      
      .translator-panel-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      
      .translator-panel-body {
        padding: 20px;
      }
      
      .translator-tabs {
        display: flex;
        margin-bottom: 16px;
        border-bottom: 1px solid #eee;
      }
      
      .translator-tab {
        padding: 8px 16px;
        cursor: pointer;
        color: #666;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
      }
      
      .translator-tab.active {
        color: #4285f4;
        border-bottom-color: #4285f4;
      }
      
      .translator-tab:hover {
        color: #4285f4;
      }
      
      .translator-tab-content {
        display: none;
      }
      
      .translator-tab-content.active {
        display: block;
      }
      
      .translator-input-area {
        margin-bottom: 16px;
>>>>>>> cf0de47 (Initial commit)
      }
      
      .translator-input {
        width: 100%;
<<<<<<< HEAD
        height: 80px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: none;
        font-size: 14px;
        box-sizing: border-box;
=======
        height: 100px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        resize: none;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }
      
      .translator-input:focus {
        border-color: #4285f4;
        outline: none;
>>>>>>> cf0de47 (Initial commit)
      }
      
      .translator-language-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;
<<<<<<< HEAD
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
=======
        margin-bottom: 16px;
      }
      
      .translator-language-select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #ddd;
        background-color: white;
        font-size: 14px;
        min-width: 120px;
        cursor: pointer;
        transition: border-color 0.2s;
      }
      
      .translator-language-select:focus {
        border-color: #4285f4;
        outline: none;
      }
      
      .translator-swap-btn {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: 18px;
>>>>>>> cf0de47 (Initial commit)
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .translator-swap-btn:hover {
<<<<<<< HEAD
        background-color: #e6e6e6;
=======
        background-color: #e8e8e8;
        transform: rotate(180deg);
>>>>>>> cf0de47 (Initial commit)
      }
      
      .translator-buttons {
        display: flex;
        justify-content: space-between;
<<<<<<< HEAD
        margin-bottom: 12px;
      }
      
      .translator-translate-btn {
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
=======
        margin-bottom: 16px;
      }
      
      .translator-btn {
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 6px;
>>>>>>> cf0de47 (Initial commit)
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }
      
<<<<<<< HEAD
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
=======
      .translator-btn:hover {
        background-color: #5c9aff;
      }
      
      .translator-btn.secondary {
        background-color: #f5f5f5;
        color: #666;
      }
      
      .translator-btn.secondary:hover {
        background-color: #e8e8e8;
      }
      
      .translator-result-area {
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
        min-height: 80px;
        max-height: 200px;
        overflow-y: auto;
        font-size: 14px;
        background-color: #f9f9f9;
        line-height: 1.6;
>>>>>>> cf0de47 (Initial commit)
      }
      
      .translator-loading {
        text-align: center;
        color: #888;
        font-style: italic;
<<<<<<< HEAD
=======
        padding: 20px;
      }
      
      .translator-error {
        color: #d32f2f;
        padding: 12px;
        background-color: #ffebee;
        border-radius: 6px;
        margin-top: 8px;
>>>>>>> cf0de47 (Initial commit)
      }
      
      .translator-auto-detect {
        font-size: 12px;
        color: #888;
        font-style: italic;
<<<<<<< HEAD
        margin-top: 5px;
=======
        margin-top: 8px;
      }
      
      .translator-history-item,
      .translator-vocabulary-item {
        padding: 12px;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 8px;
        background-color: white;
      }
      
      .translator-history-item:hover,
      .translator-vocabulary-item:hover {
        border-color: #4285f4;
      }
      
      .translator-item-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 12px;
        color: #888;
      }
      
      .translator-item-content {
        margin-bottom: 8px;
      }
      
      .translator-item-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      
      .translator-item-btn {
        padding: 4px 8px;
        font-size: 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #f5f5f5;
        color: #666;
        transition: all 0.2s;
      }
      
      .translator-item-btn:hover {
        background-color: #e8e8e8;
      }
      
      .translator-item-btn.primary {
        background-color: #4285f4;
        color: white;
      }
      
      .translator-item-btn.primary:hover {
        background-color: #5c9aff;
      }
      
      .translator-item-btn.danger {
        background-color: #ffebee;
        color: #d32f2f;
      }
      
      .translator-item-btn.danger:hover {
        background-color: #ffcdd2;
      }
      
      .translator-notes {
        margin-top: 8px;
        padding: 8px;
        background-color: #f5f5f5;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .translator-notes textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: vertical;
        min-height: 60px;
        font-size: 12px;
        margin-top: 4px;
>>>>>>> cf0de47 (Initial commit)
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
<<<<<<< HEAD
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
=======
        <div class="translator-tabs">
          <div class="translator-tab active" data-tab="translate">翻译</div>
          <div class="translator-tab" data-tab="history">历史记录</div>
          <div class="translator-tab" data-tab="vocabulary">生词本</div>
        </div>
        
        <div class="translator-tab-content active" id="translate-tab">
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
            <button class="translator-btn translator-translate-btn">翻译</button>
            <button class="translator-btn secondary translator-add-vocabulary-btn" style="display: none;">添加到生词本</button>
          </div>
          <div class="translator-result-area"></div>
        </div>
        
        <div class="translator-tab-content" id="history-tab">
          <div class="translator-history-list"></div>
        </div>
        
        <div class="translator-tab-content" id="vocabulary-tab">
          <div class="translator-vocabulary-list"></div>
        </div>
>>>>>>> cf0de47 (Initial commit)
      </div>
    `;
    
    document.body.appendChild(this.panel);
    
    // 设置默认语言选择
    const sourceSelect = this.panel.querySelector('.translator-source');
    const targetSelect = this.panel.querySelector('.translator-target');
    
    sourceSelect.value = this.sourceLang;
    targetSelect.value = this.targetLang;
<<<<<<< HEAD
=======
    
    // 初始化历史记录和生词本面板
    this.updateHistoryPanel();
    this.updateVocabularyPanel();
  }
  
  // 更新历史记录面板
  updateHistoryPanel() {
    const historyList = this.panel.querySelector('.translator-history-list');
    if (!historyList) return;

    if (this.history.length === 0) {
      historyList.innerHTML = '<div class="translator-loading">暂无翻译历史</div>';
      return;
    }

    historyList.innerHTML = this.history.map((item, index) => `
      <div class="translator-history-item">
        <div class="translator-item-header">
          <span>${config.languages[item.fromLang]} → ${config.languages[item.toLang]}</span>
          <span>${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <div class="translator-item-content">
          <div>${item.sourceText}</div>
          <div style="color: #666; margin-top: 4px;">${item.translatedText}</div>
        </div>
        <div class="translator-item-actions">
          <button class="translator-item-btn" onclick="window.translatorHelper.reuseTranslation(${index})">重用</button>
          <button class="translator-item-btn primary" onclick="window.translatorHelper.addToVocabularyFromHistory(${index})">添加到生词本</button>
        </div>
      </div>
    `).join('');
  }
  
  // 更新生词本面板
  updateVocabularyPanel() {
    const vocabularyList = this.panel.querySelector('.translator-vocabulary-list');
    if (!vocabularyList) return;

    if (this.vocabulary.length === 0) {
      vocabularyList.innerHTML = '<div class="translator-loading">暂无生词</div>';
      return;
    }

    vocabularyList.innerHTML = this.vocabulary.map((item, index) => `
      <div class="translator-vocabulary-item">
        <div class="translator-item-header">
          <span>${config.languages[item.fromLang]} → ${config.languages[item.toLang]}</span>
          <span>${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <div class="translator-item-content">
          <div>${item.sourceText}</div>
          <div style="color: #666; margin-top: 4px;">${item.translatedText}</div>
        </div>
        <div class="translator-notes">
          <div>备注：</div>
          <textarea onchange="window.translatorHelper.updateVocabularyNote(${index}, this.value)">${item.notes}</textarea>
        </div>
        <div class="translator-item-actions">
          <button class="translator-item-btn" onclick="window.translatorHelper.reuseTranslationFromVocabulary(${index})">重用</button>
          <button class="translator-item-btn danger" onclick="window.translatorHelper.removeFromVocabulary(${index})">删除</button>
        </div>
      </div>
    `).join('');
  }
  
  // 重用历史记录中的翻译
  reuseTranslation(index) {
    const item = this.history[index];
    if (!item) return;

    const inputElement = this.panel.querySelector('.translator-input');
    const sourceSelect = this.panel.querySelector('.translator-source');
    const targetSelect = this.panel.querySelector('.translator-target');

    inputElement.value = item.sourceText;
    sourceSelect.value = item.fromLang;
    targetSelect.value = item.toLang;

    this.sourceLang = item.fromLang;
    this.targetLang = item.toLang;

    // 切换到翻译标签
    this.switchTab('translate');
  }
  
  // 从历史记录添加到生词本
  addToVocabularyFromHistory(index) {
    const item = this.history[index];
    if (!item) return;

    this.addToVocabulary(item.sourceText, item.translatedText, item.fromLang, item.toLang);
  }
  
  // 重用生词本中的翻译
  reuseTranslationFromVocabulary(index) {
    const item = this.vocabulary[index];
    if (!item) return;

    const inputElement = this.panel.querySelector('.translator-input');
    const sourceSelect = this.panel.querySelector('.translator-source');
    const targetSelect = this.panel.querySelector('.translator-target');

    inputElement.value = item.sourceText;
    sourceSelect.value = item.fromLang;
    targetSelect.value = item.toLang;

    this.sourceLang = item.fromLang;
    this.targetLang = item.toLang;

    // 切换到翻译标签
    this.switchTab('translate');
  }
  
  // 切换标签页
  switchTab(tabName) {
    const tabs = this.panel.querySelectorAll('.translator-tab');
    const contents = this.panel.querySelectorAll('.translator-tab-content');

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    contents.forEach(content => {
      content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
>>>>>>> cf0de47 (Initial commit)
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
    
<<<<<<< HEAD
    // 输入框内容变化时尝试自动检测语言
    const inputElement = this.panel.querySelector('.translator-input');
    inputElement.addEventListener('input', () => this.detectLanguage(inputElement.value));
=======
    // 添加到生词本按钮事件
    const addVocabularyBtn = this.panel.querySelector('.translator-add-vocabulary-btn');
    addVocabularyBtn.addEventListener('click', () => {
      const inputElement = this.panel.querySelector('.translator-input');
      const resultElement = this.panel.querySelector('.translator-result-area');
      
      if (inputElement.value && resultElement.textContent && 
          !resultElement.textContent.includes('翻译中') && 
          !resultElement.textContent.includes('翻译失败')) {
        this.addToVocabulary(
          inputElement.value,
          resultElement.textContent,
          this.sourceLang,
          this.targetLang
        );
        addVocabularyBtn.style.display = 'none';
      }
    });
    
    // 标签页切换事件
    const tabs = this.panel.querySelectorAll('.translator-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
    
    // 输入框内容变化时尝试自动检测语言
    const inputElement = this.panel.querySelector('.translator-input');
    inputElement.addEventListener('input', () => {
      this.detectLanguage(inputElement.value);
      // 隐藏添加到生词本按钮
      this.panel.querySelector('.translator-add-vocabulary-btn').style.display = 'none';
    });
>>>>>>> cf0de47 (Initial commit)
    
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
  
<<<<<<< HEAD
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
          return data.responseData.translatedText;
        } else if (data && data.responseStatus && data.responseStatus === 403) {
          throw new Error('API使用次数超限');
        } else if (data && data.responseDetails && data.responseDetails.includes('QUERY LENGTH LIMIT EXCEEDED')) {
          throw new Error('文本长度超出API限制');
        } else {
          console.error('翻译API返回:', data);
          throw new Error('翻译请求失败');
        }
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
      this.performTranslation(segments[currentIndex], resultElement)
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
    
=======
  // 执行翻译
  async performTranslation(text, resultElement) {
    if (!text.trim()) {
      resultElement.innerHTML = '<div class="translator-loading">请输入要翻译的文本</div>';
      return;
    }

    resultElement.innerHTML = '<div class="translator-loading">翻译中...</div>';

    try {
      const apiUrl = 'https://api.mymemory.translated.net/get';
      const params = new URLSearchParams({
        q: text,
        langpair: `${this.sourceLang}|${this.targetLang}`
      });

      const response = await fetch(`${apiUrl}?${params.toString()}`);
      const data = await response.json();

      if (data.responseData && data.responseData.translatedText) {
        const translatedText = data.responseData.translatedText;
        resultElement.innerHTML = translatedText;
        this.addToHistory(text, translatedText, this.sourceLang, this.targetLang);
        this.panel.querySelector('.translator-add-vocabulary-btn').style.display = 'inline-block';
      } else {
        resultElement.innerHTML = '<div class="translator-error">翻译结果为空</div>';
      }
    } catch (error) {
      console.error('翻译出错:', error);
      resultElement.innerHTML = `<div class="translator-error">翻译失败: ${error.message}</div>`;
    }
  }

  // 长文本翻译
  async translateLongText(text, resultElement) {
    const segments = this.smartSplitText(text);
    let translatedText = '';
    
    for (const segment of segments) {
      await this.performTranslation(segment, resultElement);
      translatedText += resultElement.textContent + '\n';
    }
    
    resultElement.innerHTML = translatedText;
  }
  
  // 智能分段
  smartSplitText(text) {
    const maxLength = config.maxCharsPerRequest;
    if (text.length <= maxLength) {
      return [text];
    }

    const segments = [];
    let currentSegment = '';
    const sentences = text.split(/([.!?。！？\n])/);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      if (currentSegment.length + sentence.length <= maxLength) {
        currentSegment += sentence;
      } else {
        if (currentSegment) {
          segments.push(currentSegment);
        }
        currentSegment = sentence;
      }
    }

    if (currentSegment) {
      segments.push(currentSegment);
    }

>>>>>>> cf0de47 (Initial commit)
    return segments;
  }
}

// 初始化翻译助手
document.addEventListener('DOMContentLoaded', () => {
  window.translatorHelper = new TranslatorHelper();
});

// 如果页面已经加载完成，立即初始化
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  window.translatorHelper = new TranslatorHelper();
<<<<<<< HEAD
=======
}

// MD5 加密函数
function md5(string) {
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  function md51(s) {
    const n = s.length,
      state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    }
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  function md5blk(s) {
    const md5blks = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  const hex_chr = '0123456789abcdef'.split('');

  function rhex(n) {
    let s = '', j = 0;
    for (; j < 4; j++) {
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] +
        hex_chr[(n >> (j * 8)) & 0x0F];
    }
    return s;
  }

  function hex(x) {
    for (let i = 0; i < x.length; i++) {
      x[i] = rhex(x[i]);
    }
    return x.join('');
  }

  function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
  }

  return hex(md51(string));
>>>>>>> cf0de47 (Initial commit)
} 