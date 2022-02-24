# Backup Folder Google Drive

You can backup all files from another folder to your folder. When they add a new file or change a document google file, the script will be copying this file to your folder. You can using for Shared Drive.

## Using
Your ID folder is:
```
https://drive.google.com/drive/u/0/folders/ID
```

Make sure you change this variable in your script:
```javascript
var src_id = "Input source folder ID";
var des_id = "Input destination folder ID";
var reset = true;   // flex
```

## Mode

### Set true if you want to scan all files again.
Slower but completeness guaranteed.
```javascript
var reset = true;
```

### Set false if you only want to scan the modified file.
Faster but don't commit completeness.
```javascript
var reset = false;
```

I recommend you set ```reset = true```.