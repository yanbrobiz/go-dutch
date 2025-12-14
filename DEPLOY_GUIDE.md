# 分帳系統 - 完整部署指引

## 前置準備

確認已安裝：
- Node.js 和 npm
- @google/clasp（已安裝）

## 詳細部署步驟

### 步驟 1：CLASP 登入授權

執行以下指令：

```bash
clasp login --no-localhost
```

系統會顯示一個授權 URL，類似：
```
https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=...
```

**操作流程：**
1. 複製這個 URL
2. 在瀏覽器中開啟
3. 選擇你的 Google 帳號並授權
4. 授權完成後，瀏覽器會跳轉到一個 localhost URL（類似 `http://localhost:8888/?code=...`）
5. 複製整個 URL
6. 回到終端機，貼上這個 URL 並按 Enter

成功後會顯示：
```
✓ Logged in! You may close the page.
```

### 步驟 2：建立 Apps Script 專案

```bash
clasp create --type webapp --title "分帳系統"
```

這會：
- 在你的 Google Drive 建立一個新的 Apps Script 專案
- 產生 `.clasp.json` 檔案（包含專案 ID）

### 步驟 3：推送程式碼

```bash
clasp push
```

這會將以下檔案推送到 Google Apps Script：
- `appsscript.json`
- `Code.gs`
- `Index.html`

如果詢問是否覆蓋，輸入 `y` 確認。

### 步驟 4：部署網頁應用程式

#### 方法 A：使用 CLASP 部署（推薦）

```bash
clasp deploy --description "分帳系統 v1.0"
```

部署成功後，執行以下指令取得網址：

```bash
clasp deployments
```

會看到類似輸出：
```
- AKfycbx... @1 - 分帳系統 v1.0
```

#### 方法 B：透過 Apps Script 編輯器部署

1. 開啟專案：
```bash
clasp open
```

2. 在 Apps Script 編輯器中：
   - 點擊右上角「部署」→「新增部署作業」
   - 類型選擇：「網頁應用程式」
   - 設定：
     * **執行身分**：我
     * **具有存取權的使用者**：所有人
   - 點擊「部署」
   - **複製網頁應用程式網址**（這就是你的分帳系統網址！）

### 步驟 5：測試應用程式

1. 開啟部署後的網頁應用程式網址
2. 第一次載入可能需要授權
3. 新增一筆測試消費記錄
4. 檢查是否自動建立 Google Sheet
5. 查看「消費記錄」和「結算」功能是否正常

## 更新部署

當你修改程式碼後，需要重新部署：

### 更新現有部署

1. 推送新程式碼：
```bash
clasp push
```

2. 建立新版本部署：
```bash
clasp deploy --description "分帳系統 v1.1 - 更新說明"
```

或者更新現有部署：

```bash
# 查看部署 ID
clasp deployments

# 更新指定部署
clasp deploy --deploymentId <DEPLOYMENT_ID> --description "更新版本"
```

## 常見問題

### Q1: clasp login 無法開啟瀏覽器

使用 `clasp login --no-localhost` 並手動複製授權 URL

### Q2: 權限錯誤

確保在 Apps Script 編輯器中設定：
- 執行身分：我
- 存取權限：所有人

### Q3: 找不到 Google Sheet

第一次新增記錄時會自動建立，檢查：
```bash
clasp open
```

然後在 Apps Script 編輯器中：
- 左側選單點擊「專案設定」
- 找到「指令碼屬性」中的 SHEET_ID
- 或查看執行日誌找到 Sheet URL

### Q4: 網頁顯示錯誤

1. 檢查是否已授權所有必要權限
2. 查看錯誤日誌：
```bash
clasp logs
```

## 管理指令速查

```bash
# 查看專案資訊
clasp list

# 開啟專案
clasp open

# 拉取遠端程式碼
clasp pull

# 推送本地程式碼
clasp push

# 查看部署列表
clasp deployments

# 查看日誌
clasp logs

# 查看版本列表
clasp versions

# 登出
clasp logout
```

## 檔案結構

```
go dutch/
├── .clasp.json         # CLASP 設定檔（包含專案 ID）
├── appsscript.json     # Apps Script 專案設定
├── Code.gs             # 後端邏輯程式碼
├── Index.html          # 前端網頁介面
├── README.md           # 專案說明
├── DEPLOY_GUIDE.md     # 部署指引（本檔案）
└── deploy.sh           # 自動部署腳本
```

## 安全性建議

1. **保護 .clasp.json**：此檔案包含專案 ID，建議加入 `.gitignore`
2. **定期備份**：定期備份 Google Sheet 資料
3. **存取控制**：如需限制存取，在部署時選擇「僅限自己」

## 進階功能

### 綁定到現有 Google Sheet

如果想使用特定的 Google Sheet：

1. 開啟 Apps Script 編輯器：`clasp open`
2. 點擊左側「專案設定」
3. 在「指令碼屬性」新增：
   - 屬性：`SHEET_ID`
   - 值：你的 Google Sheet ID

### 自訂網域（需 Google Workspace）

如有 Google Workspace 帳號，可設定自訂網域：
1. 在 Apps Script 編輯器中部署
2. 選擇「測試部署」或「正式部署」
3. 設定自訂網址

## 需要協助？

遇到問題可以：
1. 查看 Apps Script 執行日誌：`clasp logs`
2. 檢查 Google Sheet 是否正確建立
3. 確認所有權限都已授權
4. 查看瀏覽器開發者工具的 Console

---

**祝你使用愉快！** 🎉
