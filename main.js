const {app, BrowserWindow, Menu, globalShortcut, dialog, ipcMain} = require('electron')
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1000, height: 1200, resizable: false})

  // and load the index.html of the app.
  win.loadFile('src/index.html')


  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  const menu = Menu.buildFromTemplate([
    {
      label: 'Tools',
      submenu: [
        {
          label: 'VAC Importer',
          click(){
            win.loadFile('src/importer.html');
          }
        },
        {
          label: 'Sort Atoms',
          click(){
            win.loadFile('src/sorter.html');
          }
        },
        {
          label: 'Disable All Interactive On Play',
          click(){
            win.loadFile('src/setinteractive.html');
          }
        },
        {
          label: 'Randomize Style',
          click(){
            win.loadFile('src/stylerandomizer.html');
          }
        }
      ]
    },
    {
      label: 'About',
      submenu: [
        {
          label: 'By VAMDeluxe'
        }
      ]
    }
  ])

  let localFilePath;
  let localSceneData;

  ipcMain.on('sceneUpdated', function( event, message ){
    localSceneData = message;
    console.log('got new data');
  });

  Menu.setApplicationMenu(menu);

  globalShortcut.register('f5', function(){
    win.reload();
  });

  globalShortcut.register('CommandOrControl+R', function(){
    win.reload();
  });

  globalShortcut.register('CommandOrControl+Shift+I', function(){
    win.webContents.openDevTools()
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
