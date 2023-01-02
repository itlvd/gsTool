# Copy Folder Google Drive

You can copy all files from other folder to your folder. When they add a new file or change a document google file, the script won't be copying this file to your folder. You can using for Shared Drive.

```
⚠️Important: When you run the script after you see "Make copy file: ", you must cancel the script. 
The autorun will continue in the background. And then, you can exit a script tab. 
If you don't, App Script will create a 2 trigger and create duplicate files.
```
![](https://i.imgur.com/QGsO3sM.png)

## Lastest Version 

V3.3.1

## Using

Make sure you change this variable in your script:
```javascript
let src = "Input source folder URL";
let des = "Input destination folder URL";
```
## Features

- Auto Resume.
- Send an email notification when the copy is done or has an issue.
- Create a log sheet to monitor.

You can make copy this script:

https://script.google.com/d/1IcybQYnnb-rwAocoI5Sk7jaDkvuet30BGK2jPRsDqAZliFB5mGzzJdqa/edit?usp=sharing

![](./Copy-script.gif)

## Error

**Limit Exceeded: Drive**: Quota is exceeded. Please run the script again after 24 hours.

**Copy script file**: Cannot copy script file to the destination folder. The script is always copied to the root folder.

If you get an error, please create an issue. Thanks.
