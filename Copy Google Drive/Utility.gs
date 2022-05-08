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

function createQuerry(arr) {
  if (arr.length == 0) return "";
  var querry = "";
  for (var i = 0; i < arr.length - 1; i++) {
    querry += 'title contains \"' + arr[i] + "\" or ";
    if (i == 100) break;
  }
  return querry + "title contains \"" + arr[arr.length - 1] + "\"";
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
  var email = Session.getActiveUser().getEmail();
  var header = "Có lỗi trong quá trình Copy.";
  var body = '<p style="font-size:20px;">Chào bạn, <br><br>Đã có lỗi trong quá trình Copy. Vui lòng liên hệ với tôi bằng cách tạo issue <a href="https://github.com/itlvd/gsTool">tại đây</a> và báo lỗi bên dưới:<br><br>'+bug+'<br><br>​<a style="color:red;">script đã xóa trigger hiện tại, Vui lòng tạo trigger mới</a>. Tính năng tự tạo trigger chỉ được bật ở lần đầu tiên chạy script, nếu trigger bị xóa thì bạn phải tự tạo trigger bằng tay. Cách cài đặt Trigger tự động, bạn có thể xem <a href="https://www.levandong.com/huong-dan-su-dung-app-script/">tại đây</a> ở mục <strong>Cài đặt trigger</strong>.<br><br>Thân<br><br>gsTool.</p>';
  MailApp.sendEmail({
    to: email,
    subject: header,
    htmlBody: body,
  });
}
