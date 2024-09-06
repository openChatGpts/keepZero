#!/bin/bash

# 设置插件名称和版本号
PLUGIN_NAME="keep_chat_request_count_zero"
VERSION="0.1"

# 创建打包目录
mkdir -p dist

# 创建一个临时目录用于打包
cp -r background.js content.js manifest.json temp_extension/
cp -r  icons/* temp_extension/icons/

# 打包Chrome/Edge扩展 (zip格式)
echo "正在打包 Chrome/Edge 插件..."
zip -r "dist/$PLUGIN_NAME-chrome-edge-$VERSION.zip" temp_extension/

# 为Firefox打包扩展 (xpi格式)
echo "正在打包 Firefox 插件..."
zip -r "dist/$PLUGIN_NAME-firefox-$VERSION.xpi" temp_extension/

# 打包为CRX
echo "正在打包 Chrome 插件为 CRX..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./temp_extension 

# 移动生成的CRX到dist目录
if [ -f ./temp_extension.crx ]; then
    mv ./temp_extension.crx ./dist/$PLUGIN_NAME-$VERSION.crx
    echo "CRX 文件打包成功"
else
    echo "CRX 文件未生成，请检查打包过程中的错误"
fi

# 清理临时目录
rm -rf temp_extension

echo "打包完成，文件保存在 dist 目录中"
