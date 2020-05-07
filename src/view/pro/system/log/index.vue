<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">操作日志管理</p>
            <div class="search">
              <Input class="input" v-model="logId" placeholder="请输入日志id"/>
              <Input class="input" v-model="name" placeholder="请输入日志名称"/>
              <Input class="input" v-model="value" placeholder="请输入日志内容"/>
              <Input class="input" v-model="className" placeholder="请输入函数类"/>
              <Input class="input" v-model="functionName" placeholder="请输入函数名"/>
              <Input class="input" v-model="runTime" placeholder="请输入执行时间ms"/>
              <Input class="input" v-model="source" placeholder="请输入日志来源"/>
              <Input class="input" v-model="body" placeholder="请输入参数内容"/>
              <Input class="input" v-model="returnBody" placeholder="请输入反馈数据"/>
              <Input class="input" v-model="createTime" placeholder="请输入创建时间"/>
              <Button @click="search" :disabled="!isRetrieve">查询</Button>
              <Button class="add_button" :disabled="!isRetrieve" @click="reset">重置</Button>
              <Button class="add_button" :disabled="!isDelete" @click="deleteBathBtnClick" type="warning">删除</Button>
            </div>
            <Table border @on-selection-change="tableOnSelect" ref="selection" :columns="columns" :data="tableData"></Table>
            <Page class="page" @on-page-size-change="onPageSizeChange" show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
        </Card>
      </Col>
      <Modal
        v-model="addFlag"
        title="添加操作日志"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <FormItem label="日志id" prop="logId">
              <Input v-model="formInline.logId" placeholder="请输入日志id"/>
            </FormItem>
            <FormItem label="日志名称" prop="name">
              <Input v-model="formInline.name" placeholder="请输入日志名称"/>
            </FormItem>
            <FormItem label="日志内容" prop="value">
              <Input v-model="formInline.value" placeholder="请输入日志内容"/>
            </FormItem>
            <FormItem label="函数类" prop="className">
              <Input v-model="formInline.className" placeholder="请输入函数类"/>
            </FormItem>
            <FormItem label="函数名" prop="functionName">
              <Input v-model="formInline.functionName" placeholder="请输入函数名"/>
            </FormItem>
            <FormItem label="执行时间ms" prop="runTime">
              <Input v-model="formInline.runTime" placeholder="请输入执行时间ms"/>
            </FormItem>
            <FormItem label="日志来源" prop="source">
              <Input v-model="formInline.source" placeholder="请输入日志来源"/>
            </FormItem>
            <FormItem label="参数内容" prop="body">
              <Input v-model="formInline.body" placeholder="请输入参数内容"/>
            </FormItem>
            <FormItem label="反馈数据" prop="returnBody">
              <Input v-model="formInline.returnBody" placeholder="请输入反馈数据"/>
            </FormItem>
            <FormItem label="创建时间" prop="createTime">
              <Input v-model="formInline.createTime" placeholder="请输入创建时间"/>
            </FormItem>
          </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
          </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getProLogPageList, deleteProLog, updateProLog, saveProLog, idsProLogDelete } from '@/api/proLog'
import userStore from '@/store/module/user'

export default {
  name: 'ProLog',
  components: {
    Tables
  },
  data () {
    return {
      isCreate: this.authorities('权限值'),
      isDelete: this.authorities('log_del'),
      isUpdate: this.authorities('log_info'),
      isRetrieve: this.authorities('log_select'),
      selection: [],
      addFlag: false,
      logId: null,
      name: '',
      value: '',
      className: '',
      functionName: '',
      runTime: null,
      source: '',
      body: '',
      returnBody: '',
      createTime: null,
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        logId: [
          { required: true, message: '请输入日志id', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入日志名称', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入日志内容', trigger: 'blur' }
        ],
        className: [
          { required: true, message: '请输入函数类', trigger: 'blur' }
        ],
        functionName: [
          { required: true, message: '请输入函数名', trigger: 'blur' }
        ],
        runTime: [
          { required: true, message: '请输入执行时间ms', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请输入日志来源', trigger: 'blur' }
        ],
        body: [
          { required: true, message: '请输入参数内容', trigger: 'blur' }
        ],
        returnBody: [
          { required: true, message: '请输入反馈数据', trigger: 'blur' }
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
          title: '日志id',
          key: 'logId',
          fixed: 'left'
        },
        {
          title: '日志名称',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '日志内容',
          key: 'value',
          fixed: 'left'
        },
        {
          title: '函数类',
          key: 'className',
          fixed: 'left'
        },
        {
          title: '函数名',
          key: 'functionName',
          fixed: 'left'
        },
        {
          title: '执行时间ms',
          key: 'runTime',
          fixed: 'left'
        },
        {
          title: '日志来源',
          key: 'source',
          fixed: 'left'
        },
        {
          title: '创建时间',
          key: 'createTime',
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
    initFromInput () {
      var formInline = {
        logId: null,
        name: '',
        value: '',
        className: '',
        functionName: '',
        runTime: null,
        source: '',
        body: '',
        returnBody: '',
        createTime: null
      }
      return formInline
    },
    reset () {
      this.logId = null
      this.name = ''
      this.value = ''
      this.className = ''
      this.functionName = ''
      this.runTime = null
      this.source = ''
      this.body = ''
      this.returnBody = ''
      this.createTime = null
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
      this.formInline.logId = tableRow.logId
      this.formInline.name = tableRow.name
      this.formInline.value = tableRow.value
      this.formInline.className = tableRow.className
      this.formInline.functionName = tableRow.functionName
      this.formInline.runTime = tableRow.runTime
      this.formInline.source = tableRow.source
      this.formInline.body = tableRow.body
      this.formInline.returnBody = tableRow.returnBody
      this.formInline.createTime = tableRow.createTime
      this.addFlag = true
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].logId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProLogDelete(params)
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
        logId: table.logId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProLog(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.logId !== null) {
            updateProLog(this.formInline)
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
            saveProLog(this.formInline)
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
      if (!this.isRetrieve) return
      var params = {}
      params.logId = this.logId
      params.name = this.name
      params.value = this.value
      params.className = this.className
      params.functionName = this.functionName
      params.runTime = this.runTime
      params.source = this.source
      params.body = this.body
      params.returnBody = this.returnBody
      params.createTime = this.createTime
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProLogPageList(params)
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
