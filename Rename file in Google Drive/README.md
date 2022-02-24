# Copy Folder Google Drive

You can rename all files from special string by another string. You can using for Shared Drive.

## Using

Make sure you change this variable in your script:
```javascript
var folder = "https://drive.google.com/drive/folders/ID"; // URL Folder
var find = "0"; // find special string
var replace = ""; // replace by this string
```

## Example

This is my config
```javascript
var folder = "https://drive.google.com/drive/folders/abc"; // URL Folder
var find = ".png"; // find special string
var replace = ".jpg"; // replace by this string
```

This script find all file have a ".png" string and replace by ".jpg"

```
a.png -> a.jpg
b.png -> b.jpg
```
