function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function start(sourceFolderID, targetFolder) {
  //var sourceFolderID = "1_9nXZGEYUG";
  //var targetFolder = "1SUDWEtNSnrI3";

  var folderID = DriveApp.getFolderById(sourceFolderID);
  var name = folderID.getName();

  var source = DriveApp.getFoldersByName(name);
  if(targetFolder == ""){
    targetFolder = "Copy of " + name;
    target = DriveApp.createFolder(targetFolder);
  }
  else{
    target = DriveApp.getFolderById(targetFolder);
  }

  if (source.hasNext()) {
    copyFolder(source.next(), target);
  }
}

function checkExitsFiles(fileName, folder){
  var files = folder.getFiles();
  while(files.hasNext()){
    var file = files.next();
    if(file.getName() == fileName){
      return true;
    }
  }
  return false;
}

function checkExitsFolder(folderName, folder){
  var folders = folder.getFolders();
  while(folders.hasNext()){
    var folder = folders.next();
    if(folder.getName() == folderName){
      return folderName;
    }
  }
  return "";
}

function copyFolder(source, target) {

  var folders = source.getFolders();
  var files   = source.getFiles();

  while(files.hasNext()) {
    var file = files.next();
    if(!checkExitsFiles(file.getName(), target))
      file.makeCopy(file.getName(), target);
  }

  while(folders.hasNext()) {
    var subFolder = folders.next();
    var folderName = subFolder.getName();
    var check = checkExitsFolder(folderName, target);
    var targetFolder = "";
    if(check == ""){
      targetFolder = target.createFolder(folderName);
    }
    else{
      var x = target.getFoldersByName(check).next();
      x = x.getId();
      targetFolder = DriveApp.getFolderById(x);
    }

    copyFolder(subFolder, targetFolder);
  }

}