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

<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">api管理</p>
            <div class="search">
              <Input class="input" v-model="name" placeholder="Api名"/>
              <Input class="input" v-model="nameAs" placeholder="Api别名"/>
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
            <FormItem label="Api名" prop="name">
              <Input v-model="formInline.name" placeholder="请输入功能名"/>
            </FormItem>
            <FormItem label="Api别名" prop="nameAs">
              <Input v-model="formInline.nameAs" placeholder="请输入功能别名"/>
            </FormItem>
            <FormItem label="接口地址" prop="api">
              <Input v-model="formInline.api" placeholder="请输入接口地址"/>
            </FormItem>
            <FormItem label="状态" prop="stat">
              <Select v-model="formInline.stat">
                <Option v-for="item in apiStats" :value="item.valuestr" :key="item.valuestr">{{ item.keystr }}</Option>
              </Select>
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
import { getProApiPageList, deleteProApi, updateProApi, saveProApi, idsProApiDelete } from '@/api/proApi'
import userStore from '@/store/module/user'
import { getEnumList } from '@/api/enum'

export default {
  name: 'ProApi',
  components: {
    Tables
  },
  data () {
    return {
      apiStats: [],
      title: '添加api管理',
      isCreate: this.authorities('api_add'),
      isDelete: this.authorities('api_del'),
      isUpdate: this.authorities('api_update'),
      isRetrieve: this.authorities('api_select'),
      selection: [],
      addFlag: false,
      name: '',
      nameAs: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        apiId: [
          { required: true, message: '请输入标识id', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入功能名', trigger: 'blur' }
        ],
        nameAs: [
          { required: true, message: '请输入功能别名', trigger: 'blur' }
        ],
        api: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
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
          title: 'Api名',
          key: 'name',
          fixed: 'left',
          width: 140
        },
        {
          title: 'Api别名',
          key: 'nameAs',
          fixed: 'left',
          width: 140
        },
        {
          title: '接口地址',
          key: 'api',
          fixed: 'left'
        },
        {
          title: '状态',
          key: 'statStr',
          fixed: 'center',
          width: 83,
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                props: {
                  width: '100px',
                  color: this.checkStatsColor(params.row.stat)
                }
              }, params.row.statStr)
            ])
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
        apiId: null,
        name: '',
        nameAs: '',
        api: '',
        stat: null,
        createTime: null
      }
      return formInline
    },
    reset () {
      this.name = ''
      this.nameAs = ''
      this.pageNum = 1
      this.initData()
    },
    checkStatsColor (value) {
      if (value === 0) {
        return 'success'
      } else {
        return 'error'
      }
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加api管理'
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      this.title = '编辑api管理'
      let tableRow = this.tableData[index]
      this.formInline.apiId = tableRow.apiId + ''
      this.formInline.name = tableRow.name
      this.formInline.nameAs = tableRow.nameAs
      this.formInline.api = tableRow.api
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
          ids.push(this.selection[i].apiId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProApiDelete(params)
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
        apiId: table.apiId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProApi(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.apiId !== null) {
            updateProApi(this.formInline)
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
            saveProApi(this.formInline)
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
    initStats () {
      var params = {}
      params.type = 'api_stat'
      getEnumList(params)
        .then(res => {
          this.apiStats = res.data.obj
        })
    },
    initData () {
      if (!this.isRetrieve) return
      var params = {}
      if (this.name !== '') {
        params.name = this.name
      } else {
        params.name = null
      }
      if (this.nameAs !== '') {
        params.nameAs = this.nameAs
      } else {
        params.nameAs = null
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProApiPageList(params)
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
    this.initStats()
  }
}
</script>
