<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">文件管理</p>
            <div class="search">
              <Input class="input" v-model="fileName" placeholder="文件名"/>
              <Button @click="search" :disabled="!isRetrieve">查询</Button>
              <Button class="add_button" :disabled="!isRetrieve" @click="reset">重置</Button>
              <Button class="add_button" :disabled="!isDelete" @click="deleteBathBtnClick" type="warning">删除</Button>
              <Button class="add_button" :disabled="!isCreate" @click="addBtnClick" type="primary">添加</Button>
            </div>
            <Table border @on-selection-change="tableOnSelect" ref="selection" :columns="columns" :data="tableData"></Table>
            <Page class="page" @on-page-size-change="onPageSizeChange" show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
        </Card>
      </Col>
      <Modal
        v-model="addFlag"
        title="上传文件"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <FormItem label="文件类型">
              <Select v-model="formInline.type" style="width:200px">
                <Option v-for="item in fileTypes" :value="item.valuestr" :key="item.valuestr">{{ item.valuestr }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Upload
                ref="uploadFile"
                multiple
                type="drag"
                :headers="headers"
                :action="uploadUrl+'oss/file/uploadMultipartFile'"
                :on-success="onUploadSuccess">
                <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>点击上传或拖拽上传。</p>
                </div>
              </Upload>
            </FormItem>
          </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
            &nbsp;&nbsp;<Button type="primary" :disabled="!isCreate" @click="handleSubmit('formInline')">确定</Button>
          </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { saveBatchProResourceFile, getProResourceFilePageList, deleteProResourceFile, idsProResourceFileDelete } from '@/api/proResourceFile'
import { getEnumList } from '@/api/enum'
import userStore from '@/store/module/user'

export default {
  name: 'ProResourceFile',
  components: {
    Tables
  },
  data () {
    return {
      isCreate: this.authorities('file_add'),
      isDelete: this.authorities('file_del'),
      isUpdate: this.authorities('file_add'),
      isRetrieve: this.authorities('file_select'),
      selection: [],
      addFlag: false,
      fileName: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      fileTypes: [],
      fromDatas: [],
      headers: {
        Authorization: 'Bearer ' + userStore.state.token
      },
      formInline: this.initFromInput(),
      ruleValidate: {
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
        ]
      },
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
    onUploadSuccess (response, file, fileList) {
      if (response.code !== 200) {
        this.$Message.error('上传失败')
      } else {
        let fileInfo = response.obj
        var formInline = {}
        formInline.type = this.formInline.type
        formInline.fileDns = fileInfo.fileDns
        formInline.fileName = fileInfo.fileName
        formInline.fileSize = fileInfo.fileSize
        formInline.physicsPath = fileInfo.physicsPath
        formInline.md5 = fileInfo.md5
        formInline.path = fileInfo.path
        formInline.sourceType = fileInfo.sourceType
        formInline.suffix = fileInfo.suffix
        this.fromDatas.push(formInline)
      }
    },
    initFromInput () {
      var formInline = {
        fileName: '',
        physicsPath: '',
        path: '',
        md5: '',
        fileSize: null,
        fileDns: '',
        type: '默认',
        suffix: '',
        sourceType: ''
      }

      this.fromDatas = []
      return formInline
    },
    reset () {
      this.fileName = ''
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
      if (this.fromDatas.length > 0) {
        saveBatchProResourceFile(this.fromDatas)
          .then(res => {
            if (res.code !== 200) {
              this.$Message.success('保存成功')
              this.initData()
              this.cancel()
              this.$refs.uploadFile.clearFiles()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
      } else {
        this.$Message.error('请上传文件')
      }
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
    },
    initFileTypes () {
      var params = {}
      params.type = 'oss'
      getEnumList(params)
        .then(res => {
          this.fileTypes = res.data.obj
        })
    }
  },
  mounted () {},
  created () {
    this.initData()
    this.initFileTypes()
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
