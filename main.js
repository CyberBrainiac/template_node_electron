const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const readDOSFiles = require("./readDOSFiles");
const createFile = require("./createFile");
const transformData = require("./transformData");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 420,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  // Open DevTools in development (optional)
  // mainWindow.webContents.openDevTools();

  Menu.setApplicationMenu(null); //hide tool bar in window

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle folder selection
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const createFileName = `merged_${hours}-${minutes}`;
  const programInfo = {
    folderPath: "",
    status: "Success",
    createFileName,
    errReason: "",
  };

  let folderPath, readingFileResult, mergeFileResult, creatingFileResult;

  try {
    if (result.canceled) return null;
    folderPath = result.filePaths[0];

    //Read files in choosen folder
    readingFileResult = await readDOSFiles.getContent(folderPath);

    if (readingFileResult.status !== "Success") {
      // return programInfo
      throw new Error(readingFileResult.errReason);
    }

    mergeFileResult = transformData.mergeFiles(readingFileResult);
    creatingFileResult = await createFile.txt(
      folderPath,
      createFileName,
      mergeFileResult.data
    );

    if (creatingFileResult.status !== "Success") {
      // return programInfo
      console.log("Error: ", readingFileResult.errReason);

      throw new Error(creatingFileResult.errReason);
    }

    programInfo.folderPath = folderPath;
    return programInfo;
  } catch (error) {
    programInfo.folderPath = folderPath;
    programInfo.errReason = error.message;
    programInfo.status = "Failed";
    return programInfo;
  }
});
