const {ipcMain, dialog} = require('electron');

var _ = require('./lib');
var config = require('./cfg');
var watch = require('watch');
var WORKSPACE_DIR;

ipcMain.on('webview:ready', (e) => {
  //e.sender.send('filesync:start');
  initWorSpace().then((dir) => {
    WORKSPACE_DIR = dir;
    syncFiles(e);

    //监听本地文件变化
    watch.createMonitor(dir, (monitor) => {
      //monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
      monitor.on('created', () => {
        syncFiles(e);
      });
      monitor.on('removed', () => {
        syncFiles(e);
      }); 
    });
  });
});

//当有文件拖动的时候
ipcMain.on('file:drop', (e, info) => {
  _.cp(info.source, info.target, (err) => {
    console.log(info.source, info.target, err);
    syncFiles(e);
  });
});

function treeDir(dir){
  return [
    {
      realpath: dir,
      type: 'dir',
      children: _.readdirsByTree(dir)
    }
  ];
}

function syncFiles(e){
  e.sender.send('filesync:start');
  //读取后获取列表
  e.sender.send('filesync:end', treeDir(WORKSPACE_DIR));
}

function initWorSpace(){
  var info = _.readJson(config.NATIVE_WORKSPACE_INFO_FILE);

  return new Promise(function(resolve, reject){
    var callee = arguments.callee;

    if(info.dir){
      return resolve(info.dir);
    }

    dialog.showMessageBox({ 
      type: 'warning',
      message: '您还未设置本地工作目录，请点击确认并进行设置'
    }, () => {
      dialog.showOpenDialog({
        properties: ['openDirectory'],
        buttonLabel: '设置为工作目录'
      }, (paths) => {
        if(!paths){
          callee(resolve, reject);
        }else{
          info.dir = paths[0];
          _.writeJson(config.NATIVE_WORKSPACE_INFO_FILE, info);
          resolve(info.dir);
        }
      });
    });
  });
}

