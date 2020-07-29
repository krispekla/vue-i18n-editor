import { BrowserWindow, protocol, app } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

export default class Main {
  private static main?: Main
  static window?: BrowserWindow
  static application: Electron.App

  private static onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      Main.application.quit()
    }
  }

  private static createWindow(): void {
    Main.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      },
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      Main.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
      if (!process.env.IS_TEST) Main.window.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      Main.window.loadURL('app://./index.html')
    }

    Main.window.on('closed', Main.onClose)
  }

  private static onActivate(): void {
    if (Main.window === null) {
      Main.createWindow()
    }
  }

  private static onClose(): void {
    // Dereference the window object.
    Main.window = undefined
  }

  private onExitFromDevMode(): void {
    if (isDevelopment) {
      if (process.platform === 'win32') {
        process.on('message', data => {
          if (data === 'graceful-exit') {
            Main.application.quit()
          }
        })
      } else {
        process.on('SIGTERM', () => {
          Main.application.quit()
        })
      }
    }
  }

  private static async onReady() {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS)
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }

    Main.createWindow()
  }

  constructor() {
    protocol.registerSchemesAsPrivileged([
      { scheme: 'app', privileges: { secure: true, standard: true } },
    ])

    Main.application = app
    Main.application.on('window-all-closed', Main.onWindowAllClosed)
    Main.application.on('ready', Main.onReady)
    Main.application.on('activate', Main.onActivate)

    this.onExitFromDevMode()
  }

  public static getMain() {
    if (Main.main === undefined) Main.main = new Main()

    return Main.main
  }
}

Main.getMain()
