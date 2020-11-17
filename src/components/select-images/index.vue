<template>
  <div>
    <div class="demo-upload-list" :style="{width: width, height: height}" v-bind:key="item.url" v-for="item in defaultList">
        <img :src="downloadUrl + item.url" :style="{'width': width, 'height': height, 'line-height': height}">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
    </div>
    <div class="demo-upload-add">
      <Icon @click="btnFileSelect" style="font-size: 65px;" type="ios-add" />
    </div>
    <FileComn :selectFileFlag="selectFileFlag" @cancel="cancel" :onSelect="fileSelect"/>
  </div>
</template>
<script>
import FileComn from '@/view/pro/components/file/index'
import userStore from '@/store/module/user'

export default {
  name: 'selectImages',
  props: {
    width: {
      default: '80px'
    },
    height: {
      default: '80px'
    },
    size: {
      default: 0
    },
    files: {
      type: Array,
      default: () => []
    }
  },
  components: {
    FileComn
  },
  data () {
    return {
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      selectFileFlag: false,
      defaultList: this.files,
      url: '',
      visible: false
    }
  },
  methods: {
    message (type, value) {
      this.$Message[type]({
        background: true,
        content: value
      })
    },
    cancel (value) {
      this.selectFileFlag = value
    },
    btnFileSelect () {
      this.selectFileFlag = true
    },
    fileSelect (files) {
      console.log(files)
      if (this.size !== 0) {
        if (this.defaultList.length >= this.size) {
          this.message('error', '最多选择' + this.size + '张图片')
          this.selectFileFlag = false
          this.$emit('handleFile', this.defaultList)
          return
        }
      }
      this.defaultList.push({
        files
      })
      this.selectFileFlag = false
      this.$emit('handleFile', this.defaultList)
    },
    confirm () {
      this.$Modal.confirm({
        render: (h) => {
          return h('img', {
            props: {
              width: '200px',
              src: this.url
            }
          })
        }
      })
    },
    handleView (url) {
      this.url = url
      this.visible = true
      this.confirm()
    },
    handleRemove (file) {
      const fileList = this.defaultList
      this.defaultList.splice(fileList.indexOf(file), 1)
    }
  },
  mounted () {

  }
}
</script>

<style scoped>
  .demo-upload-add{
    margin-left: 10px;
    display: inline-block;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    border: 1px solid transparent;
    border-color: #bebebe;
    position: relative;
    overflow: hidden;
  }
  .demo-upload-list{
    display: inline-block;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
