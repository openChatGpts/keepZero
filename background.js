chrome.runtime.onInstalled.addListener(() => {
    console.log('Service Worker 已安装');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && (tab.url.includes("https://www.vecmul.com/") || tab.url.includes("https://api.vecmul.com/"))) {
        console.log(`网页加载完成: ${tab.url}`);
        chrome.tabs.sendMessage(tabId, { action: "keepCountAtZero" });
    }
});
