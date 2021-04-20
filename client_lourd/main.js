const {
    app,
    BrowserWindow
  } = require('electron')
  const url = require("url");
  const path = require("path");
  
  let appWindow
  
  function initWindow() {
    appWindow = new BrowserWindow({
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
      },
      resizable: false,
      show: false
    })
    appWindow.once("ready-to-show", () => {
      appWindow.webContents.setZoomFactor(1.0);
      appWindow.maximize();
      appWindow.show();
    });
    
  
    // Electron Build Path
    appWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/client/index.html`),
        protocol: "file:",
        slashes: true
      })
    );
    //appWindow.setMenuBarVisibility(false)
  
    // Initialize the DevTools.
    // appWindow.webContents.openDevTools()
  
    appWindow.on('closed', function () {
      appWindow = null
    })
  }
  
  app.on('ready', initWindow)
  
  // Close when all windows are closed.
  app.on('window-all-closed', function () {
  
    // On macOS specific close process
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', function () {
    if (appWindow === null) {
      initWindow()
    }
  })