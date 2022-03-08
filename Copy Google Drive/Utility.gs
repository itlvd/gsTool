function getTimeNow() {
  timezone = "GMT+" + new Date().getTimezoneOffset() / 60;
  var date = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd HH:mm:ss");
  return date;
}


function getNumber(folderID){
  var folder = DriveApp.getFileById(folderID);
  var name = folder.getName();
  var number = 0;
  if(name.includes("count~")){
    name = name.split(" count~");
    number = parseInt(name[1]) + 1; // get number;
    folder.setName(name[0] + " count~" + number);
  }
  else{
    folder.setName(name + " count~" + number);
  }
  return number;
}

function setupTrigger(count) {
  var email = Session.getActiveUser().getEmail();
  var date = new Date();
  if(email.includes('@gmail.com')){
    if(count%20!=0 && count != 0){
      date.setMinutes(date.getMinutes() + 7);
    }
    else{
      //date.setDate(date.getDate() + 1);
      //date.setMinutes(date.getMinutes() + 1);
      deleteTrigger();
    }
  }
  else{
    if(count%20!=0 && count != 0){
      date.setMinutes(date.getMinutes() + 31);
    }
    else{
      //date.setDate(date.getDate() + 1);
      //date.setMinutes(date.getMinutes() + 1);
      deleteTrigger();
    }
  }
  ScriptApp.newTrigger('main').timeBased().at(date).create();
}

function deleteTrigger(){
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function createQuerry(arr) {
  if (arr.length == 0) return "";
  var querry = "";
  for (var i = 0; i < arr.length - 1; i++) {
    querry += 'title contains \"' + arr[i] + "\" or ";
    if (i == 100) break;
  }
  return querry + "title contains \"" + arr[arr.length - 1] + "\"";
}

function getAllNameItemsInFolder(folder,isFolder=0) {
  let arr = [];
  let items = null;
  if(isFolder==0){
    items = folder.getFiles();
  }
  else{
    items = folder.getFolders();
  }

  while (items.hasNext()) {
    let item = items.next();
    arr.push(item.getName());
  }
  return arr;
}
