// content.js
(function () {
    'use strict';

    console.log('Content script 已加载');

    // 将 chat-request 的 count 保持为 0
    function keepCountAtZero() {
        let chatRequest = localStorage.getItem('chat-request');
        if (chatRequest) {
            try {
                let data = JSON.parse(chatRequest);
                if (data.count !== 0) {
                    console.log('发现 count 不为 0，正在重置为 0');
                    data.count = 0;
                    localStorage.setItem('chat-request', JSON.stringify(data));
                }
            } catch (e) {
                console.error('解析 chat-request 时出错:', e);
            }
        }
    }

    // 初始执行
    keepCountAtZero();

    // 重写 localStorage 的 setItem 方法
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
        originalSetItem.call(this, key, value);
        if (key === 'chat-request') {
            console.log('localStorage 中的 chat-request 被更新');
            keepCountAtZero();
        }
    };

    // 监听来自 background.js 的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "keepCountAtZero") {
            console.log('收到 keepCountAtZero 消息');
            keepCountAtZero();
        }
    });

    console.log('聊天请求计数将始终为零。');
})();
