function appendRow(id_sheet, text) {
  var doc = SpreadsheetApp.openById(id_sheet);
  var sheet = doc.getSheetByName("Sheet1");
  sheet.appendRow(text);
}

function initSheet(id_folder) {
  var folder = DriveApp.getFolderById(id_folder);
  var sheet_itor = folder.searchFiles('title contains "LOG!"');
  if (sheet_itor.hasNext()) {//Log exists
    return sheet_itor.next().getId();
  }
  else {
    var newSheet = SpreadsheetApp.create("LOG!");
    Drive.Files.update({"parents": [{"id": id_folder}]}, newSheet.getId());
    var sheet = newSheet.getSheetByName("Sheet1");
    sheet.appendRow(['Time', 'File Name', 'Size Items','Total Items', 'Number Of Files', 'Number Of Folders', 'Total Size']);
    sheet.getRange("D2").setFormula("=COUNTA(B2:B)");//Total Items
    sheet.getRange("E2").setFormula('=COUNTA(C2:C)');//Number Of Files
    sheet.getRange("F2").setFormula('=COUNTA(B2:B) - COUNTA(C2:C)');//Number Of Folders
    sheet.getRange("G2").setFormula('=ROUND(SUM(C2:C)/1073741824;2) & " GB"');//Total Size
    return newSheet.getId();
  }
}
