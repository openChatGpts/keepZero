# vecmul.com


* python 版
``` python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import websockets

app = FastAPI()


# 转发客户端消息到目标WebSocket服务器
async def forward_messages(
    client_ws: WebSocket, target_ws: websockets.WebSocketClientProtocol
):
    try:
        async for message in client_ws.iter_text():
            print("发送到目标端的消息", message)
            await target_ws.send(message)
    except WebSocketDisconnect:
        print("客户端断开连接")
    except Exception as e:
        print(f"转发消息时出错: {e}")


# 接收目标WebSocket服务器的消息并转发给客户端
async def receive_messages(
    client_ws: WebSocket, target_ws: websockets.WebSocketClientProtocol
):
    try:
        async for message in target_ws:
            print("返回的消息", message)
            await client_ws.send_text(message)
    except websockets.exceptions.ConnectionClosedError as e:
        print(f"目标WebSocket连接关闭: {e}")
    except Exception as e:
        print(f"接收消息时出错: {e}")


@app.websocket("/ws")
async def websocket_endpoint(client_ws: WebSocket):
    await client_ws.accept()  # 接受客户端的WebSocket连接
    uri = "wss://api.vecmul.com/ws"
    headers = {
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "Upgrade",
        "Host": "api.vecmul.com",
        "Origin": "https://www.vecmul.com",
        "Pragma": "no-cache",
        "Sec-Websocket-Extensions": "permessage-deflate; client_max_window_bits",
        "Sec-Websocket-Key": "xGU1aHRzy0ZxflrpbkhSpA==",
        "Sec-Websocket-Version": "13",
        "Upgrade": "websocket",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    }

    try:
        # 连接到目标WebSocket服务器
        async with websockets.connect(
            uri, extra_headers=headers, max_size=None
        ) as target_ws:
            # 创建两个并发任务，一个用于转发消息，一个用于接收消息
            forward_task = asyncio.create_task(forward_messages(client_ws, target_ws))
            receive_task = asyncio.create_task(receive_messages(client_ws, target_ws))
            await asyncio.gather(forward_task, receive_task)  # 等待两个任务完成
    except Exception as e:
        print(f"连接目标WebSocket服务器时出错: {e}")
        await client_ws.close()  # 关闭客户端WebSocket连接


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # 启动FastAPI服务器
```

* node 版

``` javascript
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', async (clientWs) => {
    console.log('客户端连接成功');

    const uri = 'wss://api.vecmul.com/ws';
    const headers = {
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'Upgrade',
        'Host': 'api.vecmul.com',
        'Origin': 'https://www.vecmul.com',
        'Pragma': 'no-cache',
        'Sec-Websocket-Extensions': 'permessage-deflate; client_max_window_bits',
        'Sec-Websocket-Key': 'xGU1aHRzy0ZxflrpbkhSpA==',
        'Sec-Websocket-Version': '13',
        'Upgrade': 'websocket',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    };

    try {
        const targetWs = new WebSocket(uri, { headers });

        targetWs.on('open', () => {
            console.log('连接到目标WebSocket服务器成功');

            clientWs.on('message', (message) => {
                console.log('发送到目标端的消息', message.toString());
                targetWs.send(message.toString());
            });

            targetWs.on('message', (message) => {
                console.log('返回的消息', message.toString());
                clientWs.send(message.toString());
            });

            clientWs.on('close', () => {
                console.log('客户端断开连接');
                targetWs.close();
            });

            targetWs.on('close', () => {
                console.log('目标WebSocket连接关闭');
                clientWs.close();
            });
        });

        targetWs.on('error', (error) => {
            console.error('目标WebSocket连接错误:', error);
            clientWs.close();
        });
    } catch (error) {
        console.error('连接目标WebSocket服务器时出错:', error);
        clientWs.close();
    }
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`WebSocket服务器运行在 ws://localhost:${PORT}`);
});
``



* -9999999版本

```
// ==UserScript==
// @name         将聊天请求计数保持为零
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  始终将localStorage中chat-request项的计数保持为0
// @match        https://www.vecmul.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function keepCountAtZero() {
        let chatRequest = localStorage.getItem('chat-request');
        if (chatRequest) {
            try {
                let data = JSON.parse(chatRequest);
                data.count = -999999999999999999;
                localStorage.setItem('chat-request', JSON.stringify(data));
            } catch (e) {
                console.error('解析chat-request时出错:', e);
            }
        }
    }

    // 初始执行
    keepCountAtZero();

    // 重写localStorage的setItem方法
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        originalSetItem.call(this, key, value);
        if (key === 'chat-request') {
            keepCountAtZero();
        }
    };

    console.log('聊天请求计数将始终为零。');
})();
```

* keep 0
```
// ==UserScript==
// @name         将聊天请求计数保持为零
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  始终将localStorage中chat-request项的计数保持为0
// @match        https://www.vecmul.com/*
// @grant        none
// ==/UserScript==

(function() {
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
    Storage.prototype.setItem = function(key, value) {
        originalSetItem.call(this, key, value);
        if (key === 'chat-request') {
            keepCountAtZero();
        }
    };

    console.log('聊天请求计数将始终为零。');
})();
```


- https://github.com/Doutianbao/c-Academic
- https://github.com/snailyp/vecmul-reverse
- https://hub.docker.com/r/hxzzz/vecmul