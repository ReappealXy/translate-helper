// 后台脚本 - background.js

// 处理扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 向内容脚本发送消息，切换翻译面板
  chrome.tabs.sendMessage(tab.id, { action: 'togglePanel' });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'baidu-translate') {
    fetch(request.url)
      .then(res => res.json())
      .then(data => sendResponse({ data }))
      .catch(err => sendResponse({ error: err.message }));
    return true; // 异步响应
  }
}); 