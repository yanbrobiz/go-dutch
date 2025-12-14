# 分帳系統 - Google Apps Script

一個簡單易用的分帳系統，可以記錄消費、自動計算每人應付金額，並提供結算建議。

## 功能特色

- 新增消費記錄（記錄誰付款、分帳對象）
- 自動計算每人應付金額
- 查看所有消費記錄
- 智能結算建議（最少轉帳次數）
- 所有資料自動儲存到 Google Sheet
- 響應式網頁介面，支援手機使用

## 部署步驟

### 1. 登入 CLASP

首先需要登入你的 Google 帳號：

```bash
clasp login
```

這會開啟瀏覽器讓你授權 CLASP 存取你的 Google 帳號。

### 2. 建立新的 Apps Script 專案

```bash
clasp create --type webapp --title "分帳系統"
```

這會在你的 Google Drive 建立一個新的 Apps Script 專案。

### 3. 推送程式碼

```bash
clasp push
```

這會將本地的程式碼推送到 Google Apps Script。

### 4. 部署為網頁應用程式

```bash
clasp deploy --description "分帳系統 v1.0"
```

### 5. 開啟專案設定

```bash
clasp open
```

這會在瀏覽器中開啟 Apps Script 編輯器。

### 6. 在 Apps Script 編輯器中完成部署

1. 點擊右上角的「部署」→「新增部署作業」
2. 選擇類型：「網頁應用程式」
3. 設定：
   - 說明：分帳系統 v1.0
   - 執行身分：我
   - 具有存取權的使用者：所有人
4. 點擊「部署」
5. 複製網頁應用程式網址

## 使用方式

1. 開啟部署後的網頁應用程式網址
2. 在「新增消費」頁面輸入消費資訊
3. 系統會自動計算每人應付金額
4. 在「消費記錄」頁面查看所有記錄
5. 在「結算」頁面查看餘額和結算建議
6. 所有資料會自動儲存到 Google Sheet

## 專案結構

```
.
├── appsscript.json  # Apps Script 設定檔
├── Code.gs          # 後端程式碼（處理資料和 Google Sheet）
├── Index.html       # 前端網頁介面
└── README.md        # 說明文件
```

## 主要功能說明

### 新增消費記錄
- 輸入消費項目、總金額、付款人、分帳對象
- 系統自動計算每人應付金額
- 可選填備註

### 消費記錄
- 顯示所有消費記錄（最新的在上方）
- 包含日期、項目、金額、付款人、分帳對象等資訊
- 可重新整理更新記錄

### 結算資訊
- 顯示每個人的餘額（應收或應付）
- 提供最佳結算建議（最少轉帳次數）
- 清楚標示誰應該付錢給誰

## 常用 CLASP 指令

```bash
# 查看版本
clasp version

# 拉取遠端程式碼
clasp pull

# 推送本地程式碼
clasp push

# 開啟專案
clasp open

# 查看部署列表
clasp deployments

# 取消部署
clasp undeploy <deploymentId>

# 查看日誌
clasp logs
```

## 注意事項

1. 第一次使用時，系統會自動建立一個新的 Google Sheet
2. Google Sheet 的連結會在新增第一筆記錄後顯示
3. 可以直接在 Google Sheet 中查看和編輯資料
4. 建議定期備份 Google Sheet 資料

## 技術架構

- **前端**：HTML + CSS + JavaScript
- **後端**：Google Apps Script (JavaScript)
- **資料庫**：Google Sheets
- **部署工具**：CLASP

## 授權

此專案供個人使用，可自由修改和分享。
