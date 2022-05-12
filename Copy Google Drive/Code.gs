/*
Author: Lê Văn Đông - www.levandong.com
Refer: https://www.labnol.org/code/19979-copy-folders-drive
*/
function main() {
  let src = "https://drive.google.com/drive/folders/ID";
  let des = "https://drive.google.com/drive/folders/ID";

  src = src.match(/(?<=folders\/).*?((?=\?)|$)/g)[0].toString();
  des = des.match(/(?<=folders\/).*?((?=\?)|$)/g)[0].toString();

  start(src, des);
}

//Preprocess the copy.
function start(sourceFolderID, targetFolder) {

  var source = DriveApp.getFolderById(sourceFolderID);
  var name = source.getName();
  var target = null;
  var sheet_id = initSheet(targetFolder); // get ID of Sheet LOG!
  var sheet_name = getsheetName(sheet_id); // get Sheet name

  //If user do not input destination folder ID, create a new folder in root folder My Drive.
  //Else, the script goes to the destination folder.
  if (targetFolder == "") {
    Logger.log("Create folder" + name);
    targetFolder = "Copy of " + name;
    target = DriveApp.createFolder(targetFolder);
  }
  else {
    console.log("Go to target folder");
    target = DriveApp.getFolderById(targetFolder);
  }

  if (getStatusAutoResume(target) == 0) { // Status auto resume is turn off.
    Logger.log("Set up trigger.");
    setupAutoResume(target, 1); // turn on auto resume.
    setupTrigger(); // Create trigger.
  }
  else {
    Logger.log("Skip set up trigger");
  }

  try {
    copyFolder(source, target, sheet_id, sheet_name);
  }
  catch (e) {
    Logger.log("Sending email Error");
    sendMail(e);
    deleteTrigger(); // delete trigger when this script has an issue.
    setupAutoResume(target, 0); // Turn off auto resume.
    return;
  }
  Logger.log("Done. Delete triggers. Turn off Auto Resume. Sending email notification.");
  deleteTrigger();// Finish copy;
  sendEmailComplete(target.getUrl());
}

function copyFolder(source, target, sheet_id, sheetName) {
  //Folder copy incomplete
  //Change the symbol at target folder (Folder don't already copy)
  var ispecialFolders = target.searchFolders('title contains \"chuacopyxong\"');
  while (ispecialFolders.hasNext()) {
    var folder = ispecialFolders.next();
    var name = folder.getName().split("chuacopyxong ")[1];

    //Find same folder in source
    var ifolderInSource = source.getFoldersByName(name); // itor
    while (ifolderInSource.hasNext()) { // has a
      Logger.log("Go to: " + name);
      copyFolder(ifolderInSource.next(), folder, sheet_id, sheetName); // copy
      folder.setName(name); // Done in folder. Set name again.
    }

  }

  //Copy normal
  Logger.log("Scan source Folder: " + source.getName());
  var srcSubfolders = getAllNameItemsInFolder(source, isFolder = 1);
  var srcFiles = getAllNameItemsInFolder(source);

  Logger.log("Scan des Folder: " + target.getName());
  var desSubfolders = getAllNameItemsInFolder(target, isFolder = 1);
  var desFiles = getAllNameItemsInFolder(target);

  var diffFolders = srcSubfolders.filter(x => !desSubfolders.includes(x));
  var diffFiles = srcFiles.filter(x => !desFiles.includes(x));

  for (var j = 0; j < diffFiles.length; j++) {

    var files = source.getFilesByName(diffFiles[j]);

    //Copy files
    if (files.hasNext()) {
      var file = files.next();
      var name = file.getName();
      console.log("Make copy file: " + name);
      file.makeCopy(name, target);
      appendRow(sheet_id, [getTimeNow(), name, file.getSize()], sheetName);
    }
  }


  for (var j = 0; j < diffFolders.length; j++) {
    var folders = source.getFoldersByName(diffFolders[j]);
    //Copy Folder
    if (folders.hasNext()) {
      var folder = folders.next();
      var name = folder.getName();
      Logger.log("Create folder: " + name);
      appendRow(sheet_id, [getTimeNow(), "Create Folder " + name], sheetName);
      var targetSub = target.createFolder("chuacopyxong " + name);
      copyFolder(folder, targetSub, sheet_id, sheetName);
      targetSub.setName(name);
    }
  }
}
