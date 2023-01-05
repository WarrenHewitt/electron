/*
 * @LastEditTime: 2023-01-05 18:25:44
 */
const { app, BrowserWindow, globalShortcut, Menu, session } = require('electron')
const path = require('path')

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    /* 加载本地文件 */
    // mainWindow.loadFile('./dist/index.html')
    /* 加载URL */
    mainWindow.loadURL('http://localhost:3010/#/')
    

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    /* 注册快捷键 */
    const ret = globalShortcut.register('Alt+P', () => {
        BrowserWindow.getFocusedWindow().webContents.openDevTools();
    })

    if (!ret) {
        console.log('registration failed')
    }
    // 检查快捷键是否注册成功
    console.log(globalShortcut.isRegistered('CommandOrControl+X'))


    /* 设置 Cookie */
    const filter = { urls: ['http://*/*'] };
    session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
        if (details.responseHeaders && details.responseHeaders['Set-Cookie']) {
            for (let i = 0; i < details.responseHeaders['Set-Cookie'].length; i++) {
                details.responseHeaders['Set-Cookie'][i] += ';SameSite=None;Secure';
            }
        }
        callback({ responseHeaders: details.responseHeaders });
    });

    createWindow()


    /* 菜单 */
    // const menuList = [
    //     {
    //         label: '首页',
    //         submenu: [
    //             {
    //                 label: '返回首页'
    //             }
    //         ]
    //     }
    // ]
    // const menu = Menu.buildFromTemplate(menuList)
    // Menu.setApplicationMenu(menu)

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const dependency of ['chrome', 'node', 'electron']) {
//     replaceText(`${dependency}-version`, process.versions[dependency])
//   }
// })