#!/bin/bash

echo "================================"
echo "分帳系統 - CLASP 部署腳本"
echo "================================"
echo ""

# 檢查是否已登入
echo "步驟 1: 檢查 CLASP 登入狀態..."
if clasp login --status 2>/dev/null; then
    echo "✓ 已登入 CLASP"
else
    echo "尚未登入，請執行登入..."
    clasp login
fi

echo ""
echo "步驟 2: 建立 Apps Script 專案..."
if [ -f ".clasp.json" ]; then
    echo "⚠ 專案已存在，跳過建立步驟"
else
    clasp create --type webapp --title "分帳系統"
fi

echo ""
echo "步驟 3: 推送程式碼到 Google Apps Script..."
clasp push

echo ""
echo "步驟 4: 部署網頁應用程式..."
clasp deploy --description "分帳系統 v1.0"

echo ""
echo "步驟 5: 開啟 Apps Script 編輯器..."
echo "請在瀏覽器中完成以下步驟："
echo "1. 點擊「部署」→「新增部署作業」"
echo "2. 選擇類型：網頁應用程式"
echo "3. 設定執行身分為「我」，存取權限為「所有人」"
echo "4. 點擊「部署」並複製網頁應用程式網址"
echo ""

read -p "按任意鍵開啟 Apps Script 編輯器..." -n1 -s
clasp open

echo ""
echo "================================"
echo "部署完成！"
echo "================================"
