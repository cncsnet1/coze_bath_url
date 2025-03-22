
# 🛁 Coze Bath URL - Chrome 插件

一个用于提取和整理 Coze AI 批量跳转链接的 Chrome 浏览器扩展插件。便捷管理多个 Coze Bot 链接，提升使用效率。

> 项目地址：[cncsnet1/coze_bath_url](https://github.com/cncsnet1/coze_bath_url)

---

## 🚀 插件亮点

- ✅ 一键提取多个 Coze Bot 跳转链接  
- ✅ 快速生成链接页面便于集中展示与访问  
- ✅ 简洁 UI · 零配置 · 安装即用  
- ✅ 本地运行，无需联网

---

## 📁 插件结构说明

```
coze_bath_url/
├── manifest.json           插件核心配置文件
├── popup.html              插件弹出页面（UI界面）
├── popup.js                弹出页面逻辑脚本
├── style.css               样式文件
├── icon.png                插件图标
└── README.md               使用说明文档
```

---

## ⚙ 安装方法

### 1️⃣ 下载插件源码

```
git clone https://github.com/cncsnet1/coze_bath_url.git
```

### 2️⃣ 加载插件到 Chrome

1. 打开 Chrome 浏览器，进入 `chrome://extensions/`  
2. 开启右上角【开发者模式】  
3. 点击【加载已解压的扩展程序】  
4. 选择项目文件夹 `coze_bath_url/`

插件加载完成后，即可在浏览器工具栏中使用。

---

## 🔧 使用方法

1. 点击插件图标打开弹窗页面  
2. 插件自动读取配置中预设的 Coze Bot 链接  
3. 点击任意按钮跳转对应 Bot 页面

可在 `popup.js` 或 `config.js` 中自定义 Bot 列表：

```js
const bots = [
  { name: "聊天助手A", url: "https://www.coze.com/bot/xxxxxx" },
  { name: "问答机器人B", url: "https://www.coze.com/bot/yyyyyy" }
];
```

