// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

document.ondragover = function (e) {
    e.preventDefault();  //只有在ondragover中阻止默认行为才能触发 ondrop 而不是 ondragleave
};

document.ondrop = function (e) {
    e.preventDefault();  //阻止 document.ondrop的默认行为  *** 在新窗口中打开拖进的图片
};

const { ipcRenderer } = require('electron');

//发送准备好的信号
ipcRenderer.send('webview:ready');

ipcRenderer.on('filesync:start', function(){
  new Notification('新提示', {
      body: '正在同步工作目录文件'
  }); 
}); 

var Vue = require('vue/dist/vue');
new Vue({
  el: '#app',
  components: {
    Tree: require('./tree.js')
  },

  data(){
    return {
      list: []
    };
  },

  mounted(){
    ipcRenderer.on('filesync:end', (e, list) => {
      this.list = list;
      new Notification('新提示', {
        body: '文件同步成功'
      })
    });   
  },

  methods: {
    onFileDrop(files, target){
      ipcRenderer.send('file:drop', {
        source: [].map.call(files, (file => file.path)),
        target: target.realpath
      });
    }
  }
});