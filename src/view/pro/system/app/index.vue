<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">应用管理</p>
            <div class="search">
              <Input class="input" v-model="name" placeholder="应用名称"/>
              <Input class="input" v-model="appKey" placeholder="AppKey"/>
              <Button class="add_button" @click="search" :disabled="!isRetrieve">查询</Button>
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
        :title="title"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <FormItem label="应用名称" prop="name">
              <Input v-model="formInline.name" placeholder="请输入应用名称"/>
            </FormItem>
            <FormItem label="AppKey" prop="appKey">
              <Input v-model="formInline.appKey" placeholder="请输入AppKey"/>
            </FormItem>
            <FormItem label="AppSecret" prop="appSecret">
              <Input v-model="formInline.appSecret" placeholder="请输入AppSecret"/>
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
import { getProAppPageList, deleteProApp, updateProApp, saveProApp, idsProAppDelete } from '@/api/proApp'
import userStore from '@/store/module/user'

export default {
  name: 'ProApp',
  components: {
    Tables
  },
  data () {
    return {
      title: '添加应用管理',
      isCreate: this.authorities('app_create'),
      isDelete: this.authorities('app_del'),
      isUpdate: this.authorities('app_edit'),
      isRetrieve: this.authorities('app_select'),
      selection: [],
      addFlag: false,
      name: '',
      appKey: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        id: [
          { required: true, message: '请输入标示id', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        appKey: [
          { required: true, message: '请输入AppKey', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '请输入AppSecret', trigger: 'blur' }
        ],
        stat: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left'
        },
        {
          title: '应用名称',
          key: 'name',
          fixed: 'left'
        },
        {
          title: 'AppKey',
          key: 'appKey',
          fixed: 'left'
        },
        {
          title: 'AppSecret',
          key: 'appSecret',
          fixed: 'left'
        },
        {
          title: '状态',
          key: 'stat',
          fixed: 'left',
          width: 100,
          render: (h, params) => {
            return h('Tag', {
              props: {
                width: '100px',
                color: this.checkStatsColor(params.row.stat)
              }
            }, params.row.stat === 0 ? '未发布' : '已发布')
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 160,
          fixed: 'left'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  disabled: !this.isUpdate
                },
                on: {
                  click: () => {
                    this.pushStat(params.row)
                  }
                }
              }, params.row.stat === 0 ? '发布' : '取消'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  disabled: !this.isUpdate
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
    checkStatsColor (value) {
      if (value === 1) {
        return 'success'
      } else {
        return 'error'
      }
    },
    pushStat (row) {
      var params = {}
      params.id = row.id
      if (row.stat === 0) {
        params.stat = 1
      } else {
        params.stat = 0
      }
      updateProApp(params)
        .then(res => {
          if (res.data.code === 200) {
            this.$Message.success('修改成功')
            this.initData()
            this.cancel()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    initFromInput () {
      var formInline = {
        id: null,
        name: '',
        appKey: '',
        appSecret: '',
        stat: null,
        createTime: null
      }
      return formInline
    },
    reset () {
      this.name = ''
      this.appKey = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加应用管理'
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      this.title = '编辑应用管理'
      let tableRow = this.tableData[index]
      this.formInline.id = tableRow.id + ''
      this.formInline.name = tableRow.name
      this.formInline.appKey = tableRow.appKey
      this.formInline.appSecret = tableRow.appSecret
      this.formInline.stat = tableRow.stat + ''
      this.formInline.createTime = tableRow.createTime
      this.addFlag = true
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].id)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProAppDelete(params)
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
        id: table.id
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProApp(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.id !== null) {
            updateProApp(this.formInline)
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
            saveProApp(this.formInline)
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
      this.pageNum = 1
      this.pageSize = index
      this.initData()
    },
    initData () {
      if (!this.isRetrieve) return
      var params = {}
      if (this.name !== '') {
        params.name = this.name
      } else {
        params.name = null
      }
      if (this.appKey !== '') {
        params.appKey = this.appKey
      } else {
        params.appKey = null
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProAppPageList(params)
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
