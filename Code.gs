/*
License: GPLv3 
Author: Lê Văn Đông
Refer: https://www.labnol.org/code/19979-copy-folders-drive
*/
function main(){
  let src = "https://drive.google.com/drive/folders/1_9nXZGdlGT9AktfWPa5JQIxcvgIzEYUG?usp=sharing";
  let des = "https://drive.google.com/drive/folders/0APgVE4H8erK0Uk9PVA";

  src = src.split("folders/")[1].split("?usp=sharing")[0];
  des = des.split("folders/")[1].split("?usp=sharing")[0];

  start(src, des);

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

/*Get last time when folder changed
Input folder to get timestamp.
Return timestamp
=========================================================
*/
function getTimeChange(folder){
  let request = {
    "pageSize": 1,
    "ancestorName": ""
  }

  let value = "items/"+ folder.getId();
  request.ancestorName = value;
  let response = DriveActivity.Activity.query(request);
  let activities = response.activities;

  return new Date(activities[0].timestamp).getTime();
}

/*Read logs
Input folder.
Return timestamp
=========================================================
Find the file with the name is log.txt in this folder and read it. 
If the result equals -1. This folder wasn't copied.
logs have a timestamp of the last activity source folder.
*/
function getTimeCopy(folder){
  let content = -1;
  let files = folder.getFilesByName("log");

  if (files.hasNext())
    content = Number(files.next().getBlob().getDataAsString());

  return content;
}

/*Write logs
Input: 
  - timestamp - timestamp of source folder.
  - folder - folder to write
No return
=========================================================
Write to the file with name log.txt.
Default value is -1;
If this function is call, this folder copied.
Write timestamp of source folder.
*/
function writelog(timestamp,folder){

  files = folder.getFilesByName("log");

  if(files.hasNext()){
    file = files.next();
    file.setContent(timestamp);
  }
  else{
    folder.createFile("log",timestamp);
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

function getAllNameOfFilesInFolder(folder){
  let arr = [];
  let files = folder.getFiles();
  
  while(files.hasNext()){
    let file = files.next();
    console.log("Scan file: " + file.getName());
    arr.push(file.getName());
    
  }
  arr.sort();
  return arr;
  
}

function getAllNameOfSubfolderInFolder(folder){
  let arr = [];
  let folders = folder.getFolders();
  
  while(folders.hasNext()){
    let folder = folders.next();
    console.log("Scan folder: " + folder.getName());
    arr.push(folder.getName());
  }
  arr.sort();
  return arr;
  
}

function copyFolder(source, target) {

  let folders = source.getFolders();
  let files   = source.getFiles();

  Logger.log("check out the changes...");
  let timesrc = getTimeChange(source);
  let timetarget = getTimeCopy(target);

  if(timesrc == timetarget){
    Logger.log("No changed");
    return; // Don't change. Don't Copy.
  } 

  let list_file = getAllNameOfFilesInFolder(target);
  let list_folder = getAllNameOfSubfolderInFolder(target);

  while(files.hasNext()) {
    let file = files.next();
    if(search(list_file,file.getName()) ==false){
      console.log("Make copy file: " + file.getName());
      file.makeCopy(file.getName(), target);
    }
  }

  while(folders.hasNext()) {
    let subFolder = folders.next();
    let folderName = subFolder.getName();
    let check = search(list_folder,folderName);
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
  Logger.log("Write log: " + source.getName());
  writelog(timesrc, target);
}
