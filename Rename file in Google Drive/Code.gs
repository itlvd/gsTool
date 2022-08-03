function main(){
  var folder = "https://drive.google.com/drive/folders/ID";
  var find = "";
  var replace = "";
  var folderid = folder.split("folders/")[1].split("?usp=sharing")[0];
  var folderID = DriveApp.getFolderById(folderid);
  rename_file_folder(folderID, find, replace);
  Logger.log("Success");
}

function rename_file_folder(folderID, find_by, replace_by){
  var folders = folderID.getFolders();
  var files = folderID.getFiles();

  while(files.hasNext()){
    var file = files.next();
    var name = file.getName();
    if(name.includes(find_by)){
      name = name.replace(find_by,replace_by);
      Logger.log(name);
      file.setName(name);
    }
  }

  while(folders.hasNext()){
    var folder = folders.next();
    rename_file_folder(folder, find_by,replace_by);
  }
}
