/*
Author: Lê Văn Đông
Refer: https://www.labnol.org/code/19979-copy-folders-drive
*/
function setup(){
  var src_id = "idfolder"; //Input source folder here. Đặt Folder ID của folder nguồn tại đây.
  var des_id = "idfolder"; // Input destination folder here. Đặt Folder ID của folder đích tại đây.
  var reset = false; // Set true if you want to scan all files again. Set false if you only want to scan the modified file. Recommend set true. Để true nếu như bạn muốn quét lại toàn bộ file, false nếu như bạn chỉ muốn quét những file đã bị sửa đổi. Khuyến khích để true, nếu bạn muốn copy đầy đủ, false nếu bạn muốn copy nhanh.

  var src = DriveApp.getFolderById(src_id);
  var des = DriveApp.getFolderById(des_id);

  try{
    copy(src,des,reset);
  }
  catch (e){
    Logger.log("Please check src_id and des_id again!");
    Logger.log("Error: " + e);
  }
}

function writelog(timestamp,folder){
  files = folder.getFilesByName("log.txt");
  if(files.hasNext()){
    files.next().setContent(timestamp);
  }
  else{
    folder.createFile("log.txt",timestamp);
  }
}

function getLog(folder){
  files = folder.getFilesByName("log.txt");
  if(files.hasNext()){
    return files.next().getBlob().getDataAsString();
  }
  else{
    return "1971-12-20T01:04:04.501Z";
  }
}

function copy(src,des,reset){

  //Create query
  var query = 'modifiedDate > "1971-12-20T01:04:04.501Z"';
  if(reset == false){
    var time= getLog(des);
    query = 'modifiedDate > "' + time + '"';
  }

  //Get list file and folder
  Logger.log("Search file, folder");
  var files = src.searchFiles(query);
  var folders = src.getFolders();

  while(files.hasNext()){
    var file = files.next();
    var namefile = file.getName();
    var file_itor = des.getFilesByName(namefile);
    var mimetype = file.getMimeType();
    if(!file_itor.hasNext()){
      Logger.log("Make copy file: " + namefile);
      file.makeCopy(namefile, des);
    }
    else{
      Logger.log( namefile + " already exists");
      if((mimetype == "application/vnd.google-apps.document" || mimetype == "application/vnd.google-apps.presentation" || mimetype == "application/vnd.google-apps.spreadsheet") && (file.getLastUpdated().toISOString() > getLog(des))){
        Logger.log("This document has changed!!! Don't worry, I will copy this file again!");
        file_itor.next().setTrashed(true);
        file.makeCopy(namefile, des);
      }
    }
  }

  while(folders.hasNext()){
    var subfolder = folders.next();
    var namefolder = subfolder.getName();
    var folder = des.getFoldersByName(namefolder);
    if(folder.hasNext()){
      folder = folder.next();
    }
    else{
      Logger.log("Create new folder:" + subfolder.getName());
      folder = des.createFolder(subfolder.getName());
    }
    Logger.log("Go to: " + folder.getName());
    copy(subfolder,folder,reset);
  }

  Logger.log("Write log at: " + des.getName());
  writelog((new Date).toISOString(),des);
}