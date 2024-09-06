// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 检查网页是否加载完成
    if (changeInfo.status === 'complete' && (tab.url.includes("https://www.vecmul.com/") || tab.url.includes("https://api.vecmul.com/"))) {
        // 向内容脚本发送消息
        chrome.tabs.sendMessage(tabId, { action: "keepCountAtZero" });
    }
});
