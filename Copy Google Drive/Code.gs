/*
Author: Lê Văn Đông - www.levandong.com
Refer: https://www.labnol.org/code/19979-copy-folders-drive
*/
var chunk = 100;
function main() {
  let src = "https://drive.google.com/drive/folders/ID";
  let des = "https://drive.google.com/drive/folders/ID";

  try { // Pass this if user input FolderID.
    src = src.match(/(?<=folders\/).*?((?=\?)|$)/g)[0].toString();
    des = des.match(/(?<=folders\/).*?((?=\?)|$)/g)[0].toString();
    var count = getNumber(des);
    setupTrigger(count);
    start(src, des);
  }
  catch (e) {
    Logger.log("Kiểm tra lại link. Lỗi: " + e);
  }
  deleteTrigger();
}

function start(sourceFolderID, targetFolder) {

  var source = DriveApp.getFolderById(sourceFolderID);
  var name = source.getName();
  var target = null;

  if (targetFolder == "") {
    Logger.log("Create folder" + name);
    targetFolder = "Copy of " + name;
    target = DriveApp.createFolder(targetFolder);
  }
  else {
    console.log("Go to target folder");
    target = DriveApp.getFolderById(targetFolder);
  }
  var sheet_id = initSheet(targetFolder);
  copyFolder(source, target, sheet_id);
}

function copyFolder(source, target, sheet_id) {
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
      copyFolder(ifolderInSource.next(), folder, sheet_id); // copy
      folder.setName(name); // Done in folder. Set name again.
    }

  }

  //Copy normal
  Logger.log("Scan source Folder");
  var srcSubfolders = getAllNameItemsInFolder(source, 1);
  var srcFiles = getAllNameItemsInFolder(source);
  Logger.log("Scan des Folder");
  var desSubfolders = getAllNameItemsInFolder(target, 1);
  var desFiles = getAllNameItemsInFolder(target);

  var diffFolders = srcSubfolders.filter(x => !desSubfolders.includes(x));
  var diffFiles = srcFiles.filter(x => !desFiles.includes(x));

  for (var j = 0; j < diffFiles.length; j += chunk) {
    var diffFilesChunk = diffFiles.slice(j, j + chunk);

    //Make querry
    var querryFile = createQuerry(diffFilesChunk);

    //Search and Copy
    if (querryFile != "") {
      var files = source.searchFiles(querryFile);

      //Copy files
      while (files.hasNext()) {
        var file = files.next();
        var name = file.getName();
        console.log("Make copy file: " + name);
        file.makeCopy(name, target);
        appendRow(sheet_id, [getTimeNow(), name, file.getSize()]);
      }
    }
  }

  for (var j = 0; j < diffFolders.length; j += chunk) {
    var diffFoldersChunk = diffFolders.slice(j, j + chunk);

    //Make querry
    var querryFolder = createQuerry(diffFoldersChunk);

    //Search and Copy
    if (querryFolder != "") {
      var folders = source.searchFolders(querryFolder);
      //Copy Folder
      while (folders.hasNext()) {
        var folder = folders.next();
        var name = folder.getName();
        Logger.log("Create folder: " + name);
        appendRow(sheet_id, [getTimeNow(), "Create Folder " + name]);
        var targetSub = target.createFolder("chuacopyxong " + name);
        copyFolder(folder, targetSub, sheet_id);
        targetSub.setName(name);
      }
    }
  }

}
