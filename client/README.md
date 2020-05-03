# Client App

## run a watcher

npm run watcher

It will listen to localhost:1110

## run the client in command line

npm start localhost:1110

This will launch a command line client connect to the local watcher.

npm start will launch a GUI client, where you can try out.

## Build clients

### Build commandline using pkg

npm run pkg to build a command line only tool using pkg. It is smaller than
electron.

run \$0 -h for usage.

### Build using electron

npm run pack to build a dual interface tool (command line and GUI) using
electron
