function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function start(sourceFolderID, targetFolder) {
  var sourceFolderID = "1_9nXZGdlGT9AktfWPa5JQIxcvgIzEYUG";
  var targetFolder = "0ADWUkOWwzpYqUk9PVA";

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

function search(arr, x){
  let start=0
  let end=arr.length-1;

  while (start<=end){
    let mid = Math.floor((start+end)/2);

    if (arr[mid]==x) 
      return true;
    else if (arr[mid]< x)
      start = mid + 1;
    else
      end = mid - 1;
    }
  
    return false;
}

function getAllNameOfItemsInFolder(folder){
  let arr = [];
  var files = folder.getFiles();
  var folders = folder.getFolders();
  
  while(folders.hasNext()){
    var folder = folders.next();
    arr.push(folder.getName());
  }

  while(files.hasNext()){
    var file = files.next();
    arr.push(file.getName());
  }
  arr.sort();
  return arr;
  
}

function copyFolder(source, target) {

  var folders = source.getFolders();
  var files   = source.getFiles();
  let list_items = getAllNameOfItemsInFolder(target);

  while(files.hasNext()) {
    var file = files.next();
    if(search(list_items,file.getName()) ==false)
      file.makeCopy(file.getName(), target);
  }

  while(folders.hasNext()) {
    var subFolder = folders.next();
    var folderName = subFolder.getName();
    var check = search(list_items,folderName);
    var targetFolder = "";
    if(check == false){
      targetFolder = target.createFolder(folderName);
    }
    else{
      let x = target.getFoldersByName(folderName).next();
      x = x.getId();
      targetFolder = DriveApp.getFolderById(x);
    }

    copyFolder(subFolder, targetFolder);
  }

}