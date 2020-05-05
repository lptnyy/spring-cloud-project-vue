<template>
  <div>
    <Modal
      width="60%"
      v-model="selectFileFlag"
      title="选择文件"
      :footer-hide=true>
        <div class="search">
          <Input class="input" v-model="fileName" placeholder="文件名"/>
          <Button @click="search" :disabled="!isRetrieve">查询</Button>
          <Button class="add_button" :disabled="!isRetrieve" @click="reset">重置</Button>
        </div>
        <Table border @on-selection-change="tableOnSelect" ref="selection" :columns="columns" :data="tableData"></Table>
        <Page class="page" @on-page-size-change="onPageSizeChange" show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getProResourceFilePageList } from '@/api/proResourceFile'
import userStore from '@/store/module/user'

export default {
  name: 'ProResourceFileComp',
  components: {
    Tables
  },
  props: {
    selectFileFlag: {
      type: Boolean
    },
    onSelect: {
      type: Function
    }
  },
  data () {
    return {
      isCreate: this.authorities('file_add'),
      isDelete: this.authorities('file_del'),
      isUpdate: this.authorities('file_add'),
      isRetrieve: this.authorities('file_select'),
      selection: [],
      fileName: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left'
        },
        {
          title: '文件名称',
          key: 'fileName',
          fixed: 'left'
        },
        {
          title: '文件大小',
          key: 'fileSize',
          fixed: 'left'
        },
        {
          title: '资源类型',
          key: 'type',
          fixed: 'left'
        },
        {
          title: '资源后缀',
          key: 'suffix',
          fixed: 'left'
        },
        {
          title: '储存源',
          key: 'sourceType',
          fixed: 'left'
        },
        {
          title: '上传时间',
          key: 'uploadTime',
          fixed: 'left'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  disabled: !this.isDelete
                },
                on: {
                  click: () => {
                    this.selectBtnClick(params.index)
                  }
                }
              }, '选择')
            ])
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    selectBtnClick (index) {
      var table = this.tableData[index]
      this.onSelect(table)
    },
    reset () {
      this.fileName = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    tableOnSelect (selection, row) {
      this.selection = selection
    },
    tableOnChange (index) {
      this.pageNum = index
      this.initData()
    },
    onPageSizeChange (index) {
      this.pageSize = index
      this.initData()
    },
    initData () {
      if (!this.isRetrieve) return
      var params = {}
      params.fileName = this.fileName
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProResourceFilePageList(params)
        .then(res => {
          if (res.code !== 200) {
            this.tableData = res.data.obj
            this.total = res.data.count
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    }
  },
  mounted () {},
  created () {
    this.initData()
  }
}
</script>
<style lang="less">
.page {
    margin-top: 10px;
}
.search {
    margin-top: 10px;
    margin-bottom: 10px;
    .input{
        width: 150px;
        margin-right: 10px;
    }
}
.add_button {
    margin-left: 10px;
}
.foodl{
    text-align: center;
    width: 100%;
}
</style>
