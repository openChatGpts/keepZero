// content.js
(function () {
    'use strict';

    function keepCountAtZero() {
        let chatRequest = localStorage.getItem('chat-request');
        if (chatRequest) {
            try {
                let data = JSON.parse(chatRequest);
                if (data.count !== 0) {
                    data.count = 0;
                    localStorage.setItem('chat-request', JSON.stringify(data));
                }
            } catch (e) {
                console.error('解析chat-request时出错:', e);
            }
        }
    }

    // 初始执行
    keepCountAtZero();

    // 重写localStorage的setItem方法
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
        originalSetItem.call(this, key, value);
        if (key === 'chat-request') {
            keepCountAtZero();
        }
    };

    // 监听来自背景脚本的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "keepCountAtZero") {
            keepCountAtZero();
        }
    });

    console.log('聊天请求计数将始终为零。');
})();
