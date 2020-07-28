import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

export default class Main {
  private static main?: Main
  static window?: BrowserWindow
  static application: Electron.App

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      Main.application.quit()
    }
  }

  private static onClose() {
    // Dereference the window object.
    Main.window = undefined
  }

  private static onReady() {
    Main.window = new BrowserWindow({ width: 800, height: 600 })
    Main.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    Main.window.on('closed', Main.onClose)
  }

  constructor(app: Electron.App) {
    Main.application = app
    Main.application.on('window-all-closed', Main.onWindowAllClosed)
    Main.application.on('ready', Main.onReady)
  }
}
