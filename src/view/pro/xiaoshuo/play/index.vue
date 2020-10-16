<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title"></p>
            <div class="search">
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
            <FormItem label="" prop="id">
              <Input v-model="formInline.id" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="name">
              <Input v-model="formInline.name" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="line">
              <Input v-model="formInline.line" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="sets">
              <Input v-model="formInline.sets" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="url">
              <Input v-model="formInline.url" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="downUrl">
              <Input v-model="formInline.downUrl" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="createTime">
              <Input v-model="formInline.createTime" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="novelId">
              <Input v-model="formInline.novelId" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="syncStat">
              <Input v-model="formInline.syncStat" placeholder="请输入"/>
            </FormItem>
            <FormItem label="" prop="urlSize">
              <Input v-model="formInline.urlSize" placeholder="请输入"/>
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
import { getXiaoshuoNovellistPageList, deleteXiaoshuoNovellist, updateXiaoshuoNovellist, saveXiaoshuoNovellist, idsXiaoshuoNovellistDelete } from '@/api/xiaoshuoNovellist'
import userStore from '@/store/module/user'

export default {
  name: 'XiaoshuoNovellist',
  components: {
    Tables
  },
  data () {
    return {
      title: '添加',
      isCreate: this.authorities(''),
      isDelete: this.authorities(''),
      isUpdate: this.authorities(''),
      isRetrieve: this.authorities(''),
      selection: [],
      addFlag: false,
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        id: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        line: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        sets: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        downUrl: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        novelId: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        syncStat: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        urlSize: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left'
        },
        {
          title: '',
          key: 'id',
          fixed: 'left'
        },
        {
          title: '',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '',
          key: 'line',
          fixed: 'left'
        },
        {
          title: '',
          key: 'sets',
          fixed: 'left'
        },
        {
          title: '',
          key: 'url',
          fixed: 'left'
        },
        {
          title: '',
          key: 'downUrl',
          fixed: 'left'
        },
        {
          title: '',
          key: 'createTime',
          fixed: 'left'
        },
        {
          title: '',
          key: 'novelId',
          fixed: 'left'
        },
        {
          title: '',
          key: 'syncStat',
          fixed: 'left'
        },
        {
          title: '',
          key: 'urlSize',
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
        id: null,
        name: '',
        line: '',
        sets: '',
        url: '',
        downUrl: '',
        createTime: null,
        novelId: null,
        syncStat: '',
        urlSize: null
      }
      return formInline
    },
    reset () {
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加'
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      this.title = '编辑'
      let tableRow = this.tableData[index]
      this.formInline.id = tableRow.id + ''
      this.formInline.name = tableRow.name
      this.formInline.line = tableRow.line
      this.formInline.sets = tableRow.sets
      this.formInline.url = tableRow.url
      this.formInline.downUrl = tableRow.downUrl
      this.formInline.createTime = tableRow.createTime
      this.formInline.novelId = tableRow.novelId + ''
      this.formInline.syncStat = tableRow.syncStat
      this.formInline.urlSize = tableRow.urlSize + ''
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
            idsXiaoshuoNovellistDelete(params)
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
          deleteXiaoshuoNovellist(params)
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
            updateXiaoshuoNovellist(this.formInline)
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
            saveXiaoshuoNovellist(this.formInline)
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
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getXiaoshuoNovellistPageList(params)
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
