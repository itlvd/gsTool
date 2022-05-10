function getTimeNow() {
  timezone = "GMT+" + new Date().getTimezoneOffset() / 60;
  var date = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd HH:mm:ss");
  return date;
}

function setupTrigger() {
  var email = Session.getActiveUser().getEmail();

  if (email.includes('@gmail.com')) {
    ScriptApp.newTrigger("main")
      .timeBased()
      .everyMinutes(10)
      .create();
  }
  else {
    ScriptApp.newTrigger("main")
      .timeBased()
      .everyMinutes(30)
      .create();
  }

}

function deleteTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function getAllNameItemsInFolder(folder, isFolder = 0) {
  let arr = [];
  let items = null;
  if (isFolder == 0) {
    items = folder.getFiles();
  }
  else {
    items = folder.getFolders();
  }

  while (items.hasNext()) {
    let item = items.next();
    arr.push(item.getName());
  }
  return arr;
}

function sendMail(bug) {
  var scriptURL = 'https://script.google.com/macros/d/' + ScriptApp.getScriptId() + '/edit';
  var email = Session.getActiveUser().getEmail();
  var header = "Có lỗi trong quá trình Copy.";
  var body = '<p style="font-size:20px;">Chào bạn, <br><br>Đã có lỗi trong quá trình Copy. Vui lòng liên hệ với tôi bằng cách tạo issue <a href="https://github.com/itlvd/gsTool">tại đây</a> và báo lỗi bên dưới:<br><br>' + bug + '<br><br>​<a style="color:red;">Script đã tắt tính năng auto resume. Bạn vui lòng chạy lại script lần nữa để kích hoạt lại tính năng auto resume</a>. Bạn có thể truy cập script nhanh <a href="' + scriptURL + '">tại đây</a> .<br><br>Thân,<br><br>gsTool.</p>';
  MailApp.sendEmail({
    to: email,
    subject: header,
    htmlBody: body,
  });
}

function sendEmailComplete(url) {
  var email = Session.getActiveUser().getEmail();
  var header = "Đã Copy thành công.";
  var body = '<p style="font-size:20px;">Chào bạn, <br><br>Folder của bạn đã được copy thành công. Bạn có thể truy cập folder của bạn <a href="'+url+'"> tại đây</a>.<br><br>Thân,<br><br>gsTool';
  MailApp.sendEmail({
    to: email,
    subject: header,
    htmlBody: body,
  });
}

//Because the appscript read file text will be appear error Drive limit. 
function setupAutoResume(folder, turnOn = 1) {
  var onAutoResumeFile = folder.getFilesByName("AutoResumeOn");
  var offAutoResumeFile = folder.getFilesByName("AutoResumeOff");
  if (onAutoResumeFile.hasNext()) {
    if (!turnOn) {
      var file = onAutoResumeFile.next();
      file.setName("AutoResumeOff");
      Logger.log("Turn off Auto Resume");
    } else Logger.log("Auto Resume is enable.");
    return;
  }

  if (offAutoResumeFile.hasNext()) {
    if (turnOn) {
      var file = offAutoResumeFile.next();
      file.setName("AutoResumeOn");
      Logger.log("Auto Resume is enable.");
    } else Logger.log("Auto Resume is disable.");
    return;
  }

  if (turnOn) {
    folder.createFile("AutoResumeOn", 1);
    Logger.log("Create a new flag\nAuto Resume is enable.");
  }
  else {
    folder.createFile("AutoResumeOff", 1);
    Logger.log("Create a new file\nAuto Resume is disable");
  }
}

function getStatusAutoResume(folder) { //If don't have AutoResumeController file, this function return 0.

  var triggerExist = ScriptApp.getProjectTriggers().length;

  var onAutoResumeFile = folder.getFilesByName("AutoResumeOn");
  var offAutoResumeFile = folder.getFilesByName("AutoResumeOff");
  if (onAutoResumeFile.hasNext()) {
    if (triggerExist == 0) { // trigger does not exist
      return 0;
    }
    return 1;
  }
  deleteTrigger();
  return 0;
}
