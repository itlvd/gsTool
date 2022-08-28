/*Thanks Stéphane Giron for create folderColor script.
	- Medium: https://medium.com/@stephane.giron/change-google-drive-folder-color-with-apps-script-259743ab1c30
*/
function autoSetColor(){
  var root_folder = DriveApp.getRootFolder();
  var folders = root_folder.getFolders();

  while(folders.hasNext()){
    var folder = folders.next();
    Logger.log("Go to: " + folder.getName());
    var color = folderColor.getName(folder.getId());
    recur_setColor(folder,color);
  }
}

function recur_setColor(folderParent,color){

  var folders = folderParent.getFolders();

  while(folders.hasNext()){
    var folder = folders.next();
    folderColor.setColorByName(folder.getId(),color);
    recur_setColor(folder,color);
  }
}


/**
 * Use folderColor to manage Folder color
 * Get color Name or Hexadecimal code
 * Change color by Name or Hexadecimal code
 */
 
var folderColor = {}

/**
 * Set methods
 */

// Set folder color by name

folderColor.setColorByName = function(id,name){
  if(!colorPalette[name]){
    throw "Name is not valid, please check name in colorPalette.";
  }
  this.setColor(id,colorPalette[name]);
  return true;
}

// Set folder color by Hexadecimal code

folderColor.setColorByHexa = function(id,hexa){
  for(var key in colorPalette){
    if(hexa == colorPalette[key]){
      break;
    }
    throw "Hexadecimal color code is not a valid code.";
  }
  this.setColor(id,hexa);
  return true;
}

/**
 * Get methods
 */

// Get Hexadecimal code of the color used

folderColor.getHexa = function(id){
  var color = this.getColor(id);
  return color.folderColorRgb;
}

//Get Color name

folderColor.getName = function(id){
  var hexa = this.getHexa(id);
  //Logger.log(hexa)
  for(var key in colorPalette){
    //Logger.log(key + ' : ' + colorPalette[key])
    if(hexa == colorPalette[key]){
      return key
    }
  }
  throw "Error to get the color name please check Hexa value : "+hexa;
}

/**
 * Helper methods for request and scope
 */

// Just there for scope

folderColor.init = function(){
  //This function do nothing, there just for scope
  //DriveApp.createFile(blob); For scope to be sure esit of files is possible.
  return this;
}

// Helper to query API and get color parameter

folderColor.getColor = function(id){
  var url = 'https://www.googleapis.com/drive/v2/files/'+id+'?fields=folderColorRgb';
   var param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()}
  };
  var html = UrlFetchApp.fetch(url,param).getContentText();
  return JSON.parse(html);
}

// Helper to query API for setting color parameter

folderColor.setColor = function(id,hexa){
  var url = 'https://www.googleapis.com/drive/v2/files/'+id+'?fields=folderColorRgb';
  var param = {
    method      : "patch",
    contentType: 'application/json',
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    payload: JSON.stringify({folderColorRgb:hexa})
  };
  var html = UrlFetchApp.fetch(url,param).getContentText();
  
  return html;
}

// Color Palette, list of color available.

var colorPalette = {
  "Chocolate ice cream":"#ac725e",
  "Old brick red":"#d06b64",
  "Cardinal":"#f83a22",
  "Wild straberries":"#fa573c",
  "Mars orange":"#ff7537",
  "Yellow cab":"#ffad46",
  "Spearmint":"#42d692",
  "Vern fern":"#16a765",
  "Asparagus":"#7bd148",
  "Slime green":"#b3dc6c",
  "Desert sand":"#fbe983",
  "Macaroni":"#fad165",
  "Sea foam":"#92e1c0",
  "Pool":"#9fe1e7",
  "Denim":"#9fc6e7",
  "Rainy sky":"#4986e7",
  "Blue velvet":"#9a9cff",
  "Purple dino":"#b99aff",
  "Mouse":"#8f8f8f",
  "Mountain grey":"#cabdbf",
  "Earthworm":"#cca6ac",
  "Bubble gum":"#f691b2",
  "Purple rain":"#cd74e6",
  "Toy eggplant":"#a47ae2"
 };
