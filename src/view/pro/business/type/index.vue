<template>
  <div>
    <Row>
      <Col span="24" class="cardDiv">
        <Card :bordered="false">
          <p slot="title">商家类型 </p>
            <div class="search">
              <Input class="input floatDiv" v-model="name" placeholder="类型名称"/>
              <Button class="add_button" @click="search" :disabled="!isRetrieve">查询</Button>
              <Button class="add_button" :disabled="!isRetrieve" @click="reset">重置</Button>
              <Button class="add_button" :disabled="!isDelete" @click="deleteBathBtnClick" type="warning">删除</Button>
              <Button class="add_button" :disabled="!isCreate" @click="addBtnClick" type="primary">添加</Button>
            </div>
            <Table class="tableDiv" border @on-selection-change="tableOnSelect" ref="selection" :columns="columns" :data="tableData"></Table>
            <Page class="page" @on-page-size-change="onPageSizeChange" show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
        </Card>
      </Col>
      <Modal
        v-model="addFlag"
        :title="title"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <FormItem label="类型名称" prop="name">
              <Input :disabled="disabled" v-model="formInline.name" placeholder="请输入类型名称"/>
            </FormItem>
          </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
              &nbsp;&nbsp;<Button v-if="disabled===false" type="primary" :disabled="!isCreate" @click="handleSubmit('formInline')">确定</Button>
          </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getProBusinessTypePageList, deleteProBusinessType, updateProBusinessType, saveProBusinessType, idsProBusinessTypeDelete } from '@/api/proBusinessType'
import userStore from '@/store/module/user'

export default {
  name: 'ProBusinessType',
  components: {
    Tables
  },
  data () {
    return {
      disabled: false,
      title: '添加商家类型 ',
      isCreate: this.authorities('business_type_add'),
      isDelete: this.authorities('business_type_del'),
      isUpdate: this.authorities('business_type_update'),
      isRetrieve: this.authorities('business_type_select'),
      selection: [],
      addFlag: false,
      name: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        typeId: [
          { required: true, message: '请输入类型id', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
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
          title: '类型名称',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '创建时间',
          key: 'createTime',
          fixed: 'left',
          width: 160
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  disabled: !this.isRetrieve
                },
                on: {
                  click: () => {
                    this.infoBtnClick(params.index)
                  }
                }
              }, '详情'),
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
        typeId: null,
        name: '',
        createTime: null
      }
      return formInline
    },
    reset () {
      this.name = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加商家类型 '
      this.formInline = this.initFromInput()
      this.addFlag = true
      this.disabled = false
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    infoBtnClick (index) {
      this.title = '编辑商家类型 '
      let tableRow = this.tableData[index]
      this.formInline.typeId = tableRow.typeId + ''
      this.formInline.name = tableRow.name
      this.formInline.createTime = tableRow.createTime
      this.addFlag = true
      this.disabled = true
    },
    editBtnClick (index) {
      this.title = '编辑商家类型 '
      let tableRow = this.tableData[index]
      this.formInline.typeId = tableRow.typeId + ''
      this.formInline.name = tableRow.name
      this.formInline.createTime = tableRow.createTime
      this.addFlag = true
      this.disabled = false
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].typeId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProBusinessTypeDelete(params)
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
        typeId: table.typeId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProBusinessType(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.typeId !== null) {
            updateProBusinessType(this.formInline)
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
            saveProBusinessType(this.formInline)
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
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProBusinessTypePageList(params)
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
    .floatDiv {
      float: left;
    }
}
.add_button {
    margin-left: 10px;
}
.foodl{
    text-align: center;
    width: 100%;
}
.cardDiv {
  width: 100%;
}
.tableDiv {
  width: 100%;
}
</style>
