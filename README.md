# Electron App

## Overview
This is a cross-platform desktop application built using [Electron](https://www.electronjs.org/) and Node.js. The project leverages Electron's capabilities to create a native-like experience with web technologies.

## Features
- merge text files in one file for .T00 file extensions

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation
Clone the repository and install dependencies:

```sh
git clone https://github.com/your-repo/electron-app.git
cd node_electron
npm install
```

## Running the Application
To start the app in development mode:

```sh
    "start": "electron .",
```

To build the application for distribution:

```sh
    "build-portable": "electron-builder --win portable"
```

## Dependencies
- [Electron](https://www.npmjs.com/package/electron)
- [Electron Builder](https://www.electron.build/)
- Other dependencies listed in `package.json`

