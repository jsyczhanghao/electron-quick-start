var Tree = {}, TreeItem = {};

Object.assign(TreeItem, {
  name: 'tree-item',
  components: {
    Tree
  },
  template: '\
    <li class="tree-item" @drop="onFileDrop">\
      <a href="javascript:" class="tree-item-path" @click="toggleChildren">\
        <i :class="[\'fa\', info.type == \'file\' ? \'fa-file\' : isOpenChildren ? \'fa-folder-open\' : \'fa-folder\']"></i>\
        {{info.path || info.realpath}}\
      </a>\
      <tree :source="info.children" v-if="info.children" v-show="isOpenChildren" @file:drop="onTreeFileDrop" />\
    </li>\
  ',
  props: {
    info: {
      type: Object
    }
  },

  data(){
    return {
      isOpenChildren: false
    }
  },

  methods: {
    toggleChildren(){
      this.isOpenChildren = !this.isOpenChildren;
    },

    onFileDrop(e, files){
      if(this.info.type == 'dir'){
        var files = e.dataTransfer.files;
        this.$emit('file:drop', files, this.info);
        e.stopPropagation(); 
        this.isOpenChildren = true;
      }

      e.preventDefault();
    },

    onTreeFileDrop(files, target){
      this.$emit('file:drop', files, target);
    }
  }
});

Object.assign(Tree, {
  name: 'tree',
  components: {
    TreeItem
  },
  template: '\
    <ul class="tree">\
      <tree-item v-for="item of source" :info="item" @file:drop="onFileDrop" />\
    </ul>\
  ',
  props: {
    source: {
      type: Array
    }
  },

  data(){
    return {
      isDragEnter: false
    };
  },

  methods: {
    onFileDrop(files, target){
      this.$emit('file:drop', files, target);
    }
  }
});

module.exports = Tree;