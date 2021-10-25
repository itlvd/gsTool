function main(){
  let src = "https://drive.google.com/drive/folders/1_9nXZGdlGT9AktfWPa5JQIxcvgIzEYUG";
  let des = "https://drive.google.com/drive/folders/0ADWUkOWwzpYqUk9PVA";

  src = src.split("folders/")[1].split("?usp=sharing")[0];
  des = des.split("folders/")[1].split("?usp=sharing")[0];

  start(src, des);

}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function start(sourceFolderID, targetFolder) {
  //var sourceFolderID = "1_9nXZGdlGT9AktfWPa5JQIxcvgIzEYUG";
  //var targetFolder = "0ADWUkOWwzpYqUk9PVA";

  let folderID = DriveApp.getFolderById(sourceFolderID);
  let name = folderID.getName();

  var source = DriveApp.getFoldersByName(name);
  if(targetFolder == ""){
    console.log("Create folder" + name);
    targetFolder = "Copy of " + name;
    target = DriveApp.createFolder(targetFolder);
  }
  else{
    console.log("Go to target folder");
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

function logs(str,id_sheet){
  let open_sheet = SpreadsheetApp.openById(id_sheet);
  let sheet = open_sheet.getSheets()[0];
  sheet.appendRow([new Date(), str]);
}

function getAllNameOfItemsInFolder(folder){
  let arr = [];
  let files = folder.getFiles();
  let folders = folder.getFolders();
  
  while(folders.hasNext()){
    let folder = folders.next();
    console.log("Scan folder: " + folder.getName());
    arr.push(folder.getName());
    
  }

  while(files.hasNext()){
    let file = files.next();
    console.log("Scan file: " + file.getName());
    arr.push(file.getName());
    
  }
  arr.sort();
  return arr;
  
}

function copyFolder(source, target) {

  let folders = source.getFolders();
  let files   = source.getFiles();
  let list_items = getAllNameOfItemsInFolder(target);

  while(files.hasNext()) {
    let file = files.next();
    if(search(list_items,file.getName()) ==false){
      console.log("Make copy file: " + file.getName());
      file.makeCopy(file.getName(), target);
    }
  }

  while(folders.hasNext()) {
    let subFolder = folders.next();
    let folderName = subFolder.getName();
    let check = search(list_items,folderName);
    let targetFolder = "";
    if(check == false){
      console.log("Create subfolder: " + folderName);
      targetFolder = target.createFolder(folderName);
    }
    else{
      let x = target.getFoldersByName(folderName).next();
      x = x.getId();
      console.log("Go to subfolder: " + folderName);
      targetFolder = DriveApp.getFolderById(x);
    }

    copyFolder(subFolder, targetFolder);
  }

}