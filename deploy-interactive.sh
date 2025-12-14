#!/bin/bash

echo "========================================"
echo "  分帳系統 - 互動式部署"
echo "========================================"
echo ""

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}步驟 1/4: CLASP 授權${NC}"
echo "--------------------------------------"
echo ""
echo "請按照以下步驟完成授權："
echo ""
echo "1. 複製下面的授權 URL"
echo "2. 在瀏覽器中開啟這個 URL"
echo "3. 選擇你的 Google 帳號並授權"
echo "4. 授權完成後，瀏覽器會跳轉到 localhost 網址"
echo "5. 複製完整的 localhost 網址（包含 ?code=...）"
echo "6. 回到這裡貼上並按 Enter"
echo ""
echo -e "${YELLOW}準備好了嗎？按 Enter 繼續...${NC}"
read

echo ""
echo "正在啟動授權流程..."
echo ""

# 執行登入
clasp login --no-localhost

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ 授權成功！${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}✗ 授權失敗，請重試${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}步驟 2/4: 建立 Apps Script 專案${NC}"
echo "--------------------------------------"
echo ""

if [ -f ".clasp.json" ]; then
    echo -e "${YELLOW}⚠ 專案已存在，跳過建立步驟${NC}"
else
    clasp create --type webapp --title "分帳系統"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 專案建立成功${NC}"
    else
        echo -e "${RED}✗ 專案建立失敗${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}步驟 3/4: 推送程式碼${NC}"
echo "--------------------------------------"
echo ""

clasp push -f
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 程式碼推送成功${NC}"
else
    echo -e "${RED}✗ 程式碼推送失敗${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}步驟 4/4: 部署網頁應用程式${NC}"
echo "--------------------------------------"
echo ""
echo "正在部署..."
echo ""

DEPLOY_OUTPUT=$(clasp deploy --description "分帳系統 v1.0" 2>&1)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 部署成功${NC}"
    echo ""
    echo "$DEPLOY_OUTPUT"
else
    echo -e "${YELLOW}⚠ 指令部署可能失敗，改用手動部署${NC}"
fi

echo ""
echo "========================================"
echo "  完成部署設定！"
echo "========================================"
echo ""
echo "接下來請手動完成最後步驟："
echo ""
echo -e "${YELLOW}1. 執行以下指令開啟 Apps Script 編輯器：${NC}"
echo "   clasp open"
echo ""
echo -e "${YELLOW}2. 在編輯器中點擊「部署」→「新增部署作業」${NC}"
echo ""
echo -e "${YELLOW}3. 設定：${NC}"
echo "   - 類型：網頁應用程式"
echo "   - 執行身分：我"
echo "   - 存取權限：所有人"
echo ""
echo -e "${YELLOW}4. 點擊「部署」並複製網頁應用程式網址${NC}"
echo ""
echo -e "${GREEN}5. 開啟網址就能使用分帳系統了！${NC}"
echo ""
echo "========================================"
echo ""
echo -e "${BLUE}現在要開啟 Apps Script 編輯器嗎？ (y/n)${NC}"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "正在開啟編輯器..."
    clasp open
else
    echo ""
    echo "稍後你可以執行 'clasp open' 來開啟編輯器"
fi

echo ""
echo -e "${GREEN}部署流程完成！${NC}"
echo ""
