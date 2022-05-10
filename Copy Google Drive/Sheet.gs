function appendRow(id_sheet, text, sheetName) {
  var doc = SpreadsheetApp.openById(id_sheet);
  var sheet = doc.getSheetByName(sheetName);
  sheet.appendRow(text);
}

function initSheet(id_folder) {
  var folder = DriveApp.getFolderById(id_folder);
  Logger.log("Find: Log of " + id_folder);
  var sheet_itor = folder.searchFiles('title contains "Log of ' + id_folder + '"');
  if (sheet_itor.hasNext()) {//Log exists
    Logger.log("Log of " + id_folder + " does exist.");
    return sheet_itor.next().getId();
  }
  else {
    Logger.log("Log of " + id_folder + " doesn't exist. Create a new log file.");
    var newSheet = SpreadsheetApp.create("Log of " + id_folder);
    var sheet_file = DriveApp.getFileById(newSheet.getId());
    sheet_file.moveTo(folder); // move sheet to destination Drive.

    var listSheet = newSheet.getSheets()[0];
    var name = listSheet.getSheetName();
    var sheet = newSheet.getSheetByName(name);
    sheet.appendRow(['Time', 'File Name', 'Size Items', 'Total Items', 'Number Of Files', 'Number Of Folders', 'Total Size']);
    sheet.getRange("D2").setFormula("=COUNTA(B2:B)");//Total Items
    sheet.getRange("E2").setFormula('=COUNTA(C2:C)');//Number Of Files
    sheet.getRange("F2").setFormula('=COUNTA(B2:B) - COUNTA(C2:C)');//Number Of Folders
    sheet.getRange("G2").setFormula('=ROUND(SUM(C2:C)/1073741824;2) & " GB"');//Total Size
    return newSheet.getId();
  }
}

function getsheetName(id_sheet) {
  var doc = SpreadsheetApp.openById(id_sheet);
  var listSheet = doc.getSheets()[0];
  var name = listSheet.getSheetName();

  return name;
}
