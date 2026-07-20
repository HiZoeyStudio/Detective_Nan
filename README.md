# 有楠必解侦探事务所

一个以“事务所电脑桌面”为入口的网页推理游戏原型。

## 当前体验流程

1. 打开桌面的“邮件”。
2. 阅读委托邮件并点击“接受委托”。
3. 系统提示新案件已添加至终端。
4. 打开“事务所终端”，查看案件资料。

进度保存在浏览器的 `localStorage` 中。

## 本地运行

项目兼容直接双击 `index.html` 从登录页开始，也可以通过本地静态服务器或 GitHub Pages 访问。登录后进入 `desktop.html` 桌面。

如需通过本地服务器运行，可在项目目录执行：

```powershell
python -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 添加新案件

1. 复制 `src/cases/case-001`，改名为新的案件 ID。
2. 修改案件包中的 `manifest`、`mails` 和 `database`，并注册到 `window.detectiveCases`。
3. 在 `src/cases/index.js` 中将新案件加入 `window.caseCatalog`。

核心桌面和 App 不需要随案件更新而修改。
