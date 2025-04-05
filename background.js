// 后台脚本 - background.js

// 处理扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 向内容脚本发送消息，切换翻译面板
  chrome.tabs.sendMessage(tab.id, { action: 'togglePanel' });
}); 