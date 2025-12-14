// 設定 Google Sheet ID（部署後需要修改）
// 可以在 Script Properties 中設定，或直接在這裡填入
function getSpreadsheet() {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) {
    // 如果沒有設定，自動建立新的 Sheet
    var ss = SpreadsheetApp.create('分帳系統記錄');
    sheetId = ss.getId();
    PropertiesService.getScriptProperties().setProperty('SHEET_ID', sheetId);

    // 初始化表頭
    var sheet = ss.getSheets()[0];
    sheet.setName('分帳記錄');
    sheet.getRange(1, 1, 1, 6).setValues([[
      '日期', '消費項目', '總金額', '付款人', '分帳明細', '備註'
    ]]);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');

    Logger.log('已建立新的 Google Sheet: ' + ss.getUrl());
  }
  return SpreadsheetApp.openById(sheetId);
}

// 提供網頁介面
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('分帳系統')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 取得所有分帳記錄
function getRecords() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('分帳記錄');
    var data = sheet.getDataRange().getValues();

    // 移除表頭並轉換為物件陣列
    var records = [];
    for (var i = 1; i < data.length; i++) {
      var splitDetails = [];
      try {
        var jsonStr = data[i][4];
        if (jsonStr && typeof jsonStr === 'string') {
          splitDetails = JSON.parse(jsonStr);
        }
      } catch (e) {
        // 如果解析失敗，根據付款人自動生成
        Logger.log('解析失敗，自動生成分帳明細: ' + e.toString());
      }

      var payer = data[i][3];
      var amount = Math.abs(data[i][2]); // 使用絕對值

      // 如果沒有分帳明細，自動生成（付款人付，另一人欠）
      if (!splitDetails || splitDetails.length === 0) {
        var debtor = (payer === "女友") ? "你" : "女友";
        splitDetails = [{
          name: debtor,
          amount: amount
        }];
      }

      records.push({
        date: data[i][0],
        item: data[i][1],
        amount: data[i][2],
        payer: payer,
        splitDetails: splitDetails,
        note: data[i][5]
      });
    }

    return records;
  } catch (e) {
    Logger.log('取得記錄錯誤: ' + e.toString());
    return [];
  }
}

// 新增分帳記錄
function addRecord(data) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('分帳記錄');

    // 將分帳明細轉換為 JSON 字串儲存
    var splitDetailsJson = JSON.stringify(data.splitDetails || []);

    // 根據付款人決定金額正負號
    // 女友付 = 正數，你付 = 負數
    var amountWithSign = data.amount;
    if (data.payer === "你") {
      amountWithSign = -Math.abs(data.amount);
    } else {
      amountWithSign = Math.abs(data.amount);
    }

    // 新增資料到表格
    sheet.appendRow([
      new Date(),
      data.item,
      amountWithSign,
      data.payer,
      splitDetailsJson,
      data.note || ''
    ]);

    return {
      success: true,
      message: '記錄已成功新增',
      sheetUrl: ss.getUrl()
    };
  } catch (e) {
    Logger.log('新增記錄錯誤: ' + e.toString());
    return {
      success: false,
      message: '新增失敗: ' + e.toString()
    };
  }
}

// 計算結算資訊
function calculateSettlement() {
  try {
    var records = getRecords();
    var balances = {};

    Logger.log('總記錄數: ' + records.length);

    // 計算每個人的餘額
    records.forEach(function(record) {
      var payer = record.payer.trim();
      var absAmount = Math.abs(record.amount);

      Logger.log('處理記錄: ' + record.item + ', 付款人: ' + payer + ', 金額: ' + absAmount);
      Logger.log('分帳明細: ' + JSON.stringify(record.splitDetails));

      // 付款人先支付總金額（使用絕對值）
      if (!balances[payer]) balances[payer] = 0;
      balances[payer] += absAmount;

      // 每個分帳對象扣除他們應付的金額
      if (record.splitDetails && record.splitDetails.length > 0) {
        record.splitDetails.forEach(function(split) {
          var person = split.name.trim();
          var amount = parseFloat(split.amount) || 0;

          if (!balances[person]) balances[person] = 0;
          balances[person] -= amount;

          Logger.log(person + ' 欠 ' + amount);
        });
      } else {
        Logger.log('警告：沒有分帳明細！');
      }
    });

    Logger.log('最終餘額: ' + JSON.stringify(balances));

    // 轉換為陣列並排序
    var settlements = [];
    for (var person in balances) {
      settlements.push({
        person: person,
        balance: Math.round(balances[person] * 100) / 100
      });
    }

    Logger.log('結算陣列: ' + JSON.stringify(settlements));

    // 生成結算建議（需要複製陣列避免修改原始數據）
    var transactions = [];
    var debtors = settlements.filter(function(s) { return s.balance < 0; }).map(function(s) {
      return {person: s.person, balance: s.balance}; // 創建副本
    }).sort(function(a, b) { return a.balance - b.balance; });

    var creditors = settlements.filter(function(s) { return s.balance > 0; }).map(function(s) {
      return {person: s.person, balance: s.balance}; // 創建副本
    }).sort(function(a, b) { return b.balance - a.balance; });

    var i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      var debtor = debtors[i];
      var creditor = creditors[j];
      var amount = Math.min(Math.abs(debtor.balance), creditor.balance);

      if (amount > 0.01) {
        transactions.push({
          from: debtor.person,
          to: creditor.person,
          amount: Math.round(amount * 100) / 100
        });
      }

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (Math.abs(creditor.balance) < 0.01) j++;
    }

    return {
      balances: settlements,
      transactions: transactions
    };
  } catch (e) {
    Logger.log('計算結算錯誤: ' + e.toString());
    return {
      balances: [],
      transactions: []
    };
  }
}

// 取得 Google Sheet URL
function getSheetUrl() {
  try {
    var ss = getSpreadsheet();
    return ss.getUrl();
  } catch (e) {
    return '';
  }
}

// 測試函數：查看原始資料
function testGetData() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('分帳記錄');
    var data = sheet.getDataRange().getValues();

    Logger.log('總行數: ' + data.length);

    // 檢查前幾筆資料
    for (var i = 1; i < Math.min(5, data.length); i++) {
      Logger.log('=== 第 ' + i + ' 筆記錄 ===');
      Logger.log('日期: ' + data[i][0]);
      Logger.log('項目: ' + data[i][1]);
      Logger.log('金額: ' + data[i][2] + ' (類型: ' + typeof data[i][2] + ')');
      Logger.log('付款人: ' + data[i][3]);
      Logger.log('分帳明細(原始): ' + data[i][4] + ' (類型: ' + typeof data[i][4] + ')');
      Logger.log('備註: ' + data[i][5]);
    }

    // 測試解析
    var records = getRecords();
    Logger.log('解析後記錄數: ' + records.length);
    if (records.length > 0) {
      Logger.log('第一筆記錄: ' + JSON.stringify(records[0]));
    }

    // 測試結算
    var settlement = calculateSettlement();
    Logger.log('結算結果: ' + JSON.stringify(settlement));

    return '測試完成，請查看日誌';
  } catch (e) {
    Logger.log('測試錯誤: ' + e.toString());
    return '錯誤: ' + e.toString();
  }
}

// 清除所有記錄（保留表頭）
function clearAllRecords() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('分帳記錄');
    var lastRow = sheet.getLastRow();

    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }

    return {
      success: true,
      message: '所有記錄已清除'
    };
  } catch (e) {
    return {
      success: false,
      message: '清除失敗: ' + e.toString()
    };
  }
}
