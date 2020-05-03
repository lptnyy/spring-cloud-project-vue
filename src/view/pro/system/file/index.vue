<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">文件管理</p>
            <div class="search">
              <Input class="input" v-model="fileId" placeholder="请输入内容"/>
              <Input class="input" v-model="fileName" placeholder="请输入内容"/>
              <Input class="input" v-model="physicsPath" placeholder="请输入内容"/>
              <Input class="input" v-model="path" placeholder="请输入内容"/>
              <Input class="input" v-model="md5" placeholder="请输入内容"/>
              <Input class="input" v-model="fileSize" placeholder="请输入内容"/>
              <Input class="input" v-model="fileDns" placeholder="请输入内容"/>
              <Input class="input" v-model="type" placeholder="请输入内容"/>
              <Input class="input" v-model="suffix" placeholder="请输入内容"/>
              <Input class="input" v-model="sourceType" placeholder="请输入内容"/>
              <Input class="input" v-model="uploadTime" placeholder="请输入内容"/>
              <Button @click="search">查询</Button>
              <Button class="add_button" @click="reset">重置</Button>
              <Button class="add_button" @click="deleteBathBtnClick" type="warning">删除</Button>
              <Button class="add_button" @click="addBtnClick" type="primary">添加</Button>
            </div>
            <Table border @on-selection-change="tableOnSelect" ref="selection" :columns="columns" :data="tableData"></Table>
            <Page class="page" @on-page-size-change="onPageSizeChange" show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
        </Card>
      </Col>
      <Modal
        v-model="addFlag"
        title="添加文件"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <FormItem label="文件id" prop="fileId">
              <Input v-model="formInline.fileId" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="文件名称" prop="fileName">
              <Input v-model="formInline.fileName" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="物理地址" prop="physicsPath">
              <Input v-model="formInline.physicsPath" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="相对路径" prop="path">
              <Input v-model="formInline.path" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="文件指纹" prop="md5">
              <Input v-model="formInline.md5" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="文件大小" prop="fileSize">
              <Input v-model="formInline.fileSize" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="访问域名" prop="fileDns">
              <Input v-model="formInline.fileDns" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="资源类型" prop="type">
              <Input v-model="formInline.type" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="资源后缀" prop="suffix">
              <Input v-model="formInline.suffix" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="储存源" prop="sourceType">
              <Input v-model="formInline.sourceType" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="上传时间" prop="uploadTime">
              <Input v-model="formInline.uploadTime" placeholder="请输入内容"/>
            </FormItem>
          </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
              &nbsp;&nbsp;<Button type="primary" @click="handleSubmit('formInline')">确定</Button>
          </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getProResourceFilePageList, deleteProResourceFile, updateProResourceFile, saveProResourceFile, idsProResourceFileDelete } from '@/api/proResourceFile'
import userStore from '@/store/module/user'

export default {
  name: 'ProResourceFile',
  components: {
    Tables
  },
  data () {
    return {
      selection: [],
      addFlag: false,
      fileId: null,
      fileName: '',
      physicsPath: '',
      path: '',
      md5: '',
      fileSize: null,
      fileDns: '',
      type: '',
      suffix: '',
      sourceType: '',
      uploadTime: null,
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        fileId: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        fileName: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        physicsPath: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        md5: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        fileSize: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        fileDns: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        suffix: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        sourceType: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        uploadTime: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left'
        },
        {
          title: '文件id',
          key: 'fileId',
          fixed: 'left'
        },
        {
          title: '文件名称',
          key: 'fileName',
          fixed: 'left'
        },
        {
          title: '物理地址',
          key: 'physicsPath',
          fixed: 'left'
        },
        {
          title: '相对路径',
          key: 'path',
          fixed: 'left'
        },
        {
          title: '文件指纹',
          key: 'md5',
          fixed: 'left'
        },
        {
          title: '文件大小',
          key: 'fileSize',
          fixed: 'left'
        },
        {
          title: '访问域名',
          key: 'fileDns',
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
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editBtnClick(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteBtnClick(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    initFromInput () {
      var formInline = {
        fileId: null,
        fileName: '',
        physicsPath: '',
        path: '',
        md5: '',
        fileSize: null,
        fileDns: '',
        type: '',
        suffix: '',
        sourceType: '',
        uploadTime: null
      }
      return formInline
    },
    reset () {
      this.fileId = null
      this.fileName = ''
      this.physicsPath = ''
      this.path = ''
      this.md5 = ''
      this.fileSize = null
      this.fileDns = ''
      this.type = ''
      this.suffix = ''
      this.sourceType = ''
      this.uploadTime = null
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      let tableRow = this.tableData[index]
      this.formInline.fileId = tableRow.fileId
      this.formInline.fileName = tableRow.fileName
      this.formInline.physicsPath = tableRow.physicsPath
      this.formInline.path = tableRow.path
      this.formInline.md5 = tableRow.md5
      this.formInline.fileSize = tableRow.fileSize
      this.formInline.fileDns = tableRow.fileDns
      this.formInline.type = tableRow.type
      this.formInline.suffix = tableRow.suffix
      this.formInline.sourceType = tableRow.sourceType
      this.formInline.uploadTime = tableRow.uploadTime
      this.addFlag = true
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].fileId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProResourceFileDelete(params)
              .then(res => {
                this.initData()
                this.selection = []
              })
          }
        })
      }
    },
    tableOnSelect (selection, row) {
      this.selection = selection
    },
    deleteBtnClick (index) {
      let table = this.tableData[index]
      var params = {
        fileId: table.fileId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProResourceFile(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.fileId !== null) {
            updateProResourceFile(this.formInline)
              .then(res => {
                if (res.data.code === 200) {
                  this.$Message.success('修改成功')
                  this.initData()
                  this.cancel()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
          } else {
            saveProResourceFile(this.formInline)
              .then(res => {
                if (res.data.code === 200) {
                  this.$Message.success('保存成功')
                  this.initData()
                  this.cancel()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
          }
        }
      })
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
      var params = {}
      params.fileId = this.fileId
      params.fileName = this.fileName
      params.physicsPath = this.physicsPath
      params.path = this.path
      params.md5 = this.md5
      params.fileSize = this.fileSize
      params.fileDns = this.fileDns
      params.type = this.type
      params.suffix = this.suffix
      params.sourceType = this.sourceType
      params.uploadTime = this.uploadTime
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
