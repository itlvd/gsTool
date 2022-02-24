function main(){
  var folder = "https://drive.google.com/drive/folders/ID";
  var find = "0";
  var replace = "";

  folderID = DriveApp.getFolderById(folder.split("folders/")[1].split("?usp=sharing")[0]);
  rename_file_folder(folderID, find, replace);
  Logger.log("Success");
}

function rename_file_folder(folderID, find_by, replace_by){
  let folders = folderID.getFolders();
  let files = folderID.getFiles();

  while(files.hasNext()){
    let file = files.next();
    let name = file.getName().replace(find_by,replace_by);
    if(name.split('.')[0] != ""){
      Logger.log("File: " + name);
      file.setName(name);
    }

  }

  while(folders.hasNext()){
    let folder = folders.next();
    let name = folder.getName().replace(find_by,replace_by);
    Logger.log("Folder: " + name);
    folder.setName(name);

    Logger.log("Go to folder: " + name);
    rename_file_folder(folder, find_by, replace_by);
  }
}