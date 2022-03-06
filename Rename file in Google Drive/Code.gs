function main(){
  var folder = "https://drive.google.com/drive/u/0/folders/ID";
  var find = "";
  var replace = "";

  folderID = DriveApp.getFolderById(folder.split("folders/")[1].split("?usp=sharing")[0]);
  rename_file_folder(folderID, find, replace);
  Logger.log("Success");
}

function rename_file_folder(folderID, find_by, replace_by){
  var folders = folderID.getFolders();
  var files = folderID.searchFiles('title contains "'+find_by+'"');

  while(files.hasNext()){
    var file = files.next();
    var name = file.getName();
    name = name.replace(find_by,replace_by);
    Logger.log(name);
    file.setName(name);
  }

  while(folders.hasNext()){
    var folder = folders.next();
    rename_file_folder(folder, find_by,replace_by);
  }
}
