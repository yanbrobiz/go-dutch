# 快速開始 - 三步驟部署分帳系統

## 第一步：登入 CLASP

```bash
clasp login --no-localhost
```

1. 複製顯示的授權 URL
2. 在瀏覽器開啟並授權
3. 複製瀏覽器跳轉後的完整 URL（http://localhost:8888/?code=...）
4. 貼回終端機

## 第二步：建立並推送專案

```bash
# 建立專案
clasp create --type webapp --title "分帳系統"

# 推送程式碼
clasp push
```

詢問是否覆蓋時，輸入 `y`

## 第三步：部署網頁

### 選項 A：指令部署（快速）

```bash
clasp deploy --description "v1.0"
clasp deployments  # 查看部署網址
```

### 選項 B：手動部署（推薦）

```bash
clasp open  # 開啟 Apps Script 編輯器
```

然後在瀏覽器中：
1. 點擊「部署」→「新增部署作業」
2. 選擇「網頁應用程式」
3. 執行身分：**我**
4. 存取權限：**所有人**
5. 點擊「部署」
6. **複製網頁應用程式網址** ✨

## 完成！

開啟網址即可使用分帳系統。

## 常用指令

```bash
clasp push          # 更新程式碼
clasp open          # 開啟編輯器
clasp logs          # 查看日誌
clasp deployments   # 查看部署
```

## 需要詳細說明？

請參考 `DEPLOY_GUIDE.md` 獲得完整部署指引。
