<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">产品分类 </p>
            <div class="search">
              <Input class="input" v-model="name" placeholder="分类名称"/>
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
            <FormItem label="图标" prop="icon">
              <img style="width: 80px; height: 80px;" :src="this.downloadUrl + formInline.icon"/><br />
              <Button @click="btnFileSelect">上传图片</Button>
            </FormItem>
            <FormItem label="分类名称" prop="name">
              <Input :disabled="disabled" v-model="formInline.name" placeholder="请输入分类名称"/>
            </FormItem>
            <FormItem label="排序" prop="sort">
              <Input :disabled="disabled" v-model="formInline.sort" placeholder="请输入排序"/>
            </FormItem>
            <FormItem label="父级目录" prop="parentId">
              <Select :disabled="disabled" v-model="formInline.parentId" placeholder="请选择目录">
                <Option v-for="item in parents" :value="item.typeId + ''" :key="item.typeId">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
              &nbsp;&nbsp;<Button v-if="disabled===false" type="primary" :disabled="!isCreate" @click="handleSubmit('formInline')">确定</Button>
          </div>
      </Modal>
    </Row>
    <FileComn :selectFileFlag="selectFileFlag" :cancel="cancel" :onSelect="fileSelect"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getProProductTypePageList, deleteProProductType, updateProProductType, saveProProductType, idsProProductTypeDelete, getProProductTypeList } from '@/api/proProductType'
import userStore from '@/store/module/user'
import FileComn from '@/view/pro/components/file/index'

export default {
  name: 'ProProductType',
  components: {
    Tables,
    FileComn
  },
  data () {
    return {
      selectFileFlag: false,
      parents: [],
      disabled: false,
      title: '添加产品分类 ',
      isCreate: this.authorities('product_type_add'),
      isDelete: this.authorities('product_type_del'),
      isUpdate: this.authorities('product_type_update'),
      isRetrieve: this.authorities('product_type_select'),
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
        icon: [
          { required: true, message: '请选择图标', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请输入父级目录', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择父级目录', trigger: 'blur' }
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
          title: '图标',
          fixed: 'left',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: this.downloadUrl + params.row.icon
                },
                style: {
                  width: '80px',
                  height: '80px',
                  'margin-top': '5px'
                }
              })
            ])
          }
        },
        {
          title: '分类名称',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '排序',
          key: 'sort',
          fixed: 'left'
        },
        {
          title: '父目录',
          key: 'parentName',
          fixed: 'left'
        },
        {
          title: '类型',
          key: 'stats',
          width: 100,
          fixed: 'center',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                props: {
                  width: '100px',
                  color: this.checkStatsColor(params.row.parentId)
                }
              }, this.checkStats(params.row.parentId))
            ])
          }
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
    btnFileSelect () {
      this.selectFileFlag = true
    },
    fileSelect (files) {
      this.formInline.icon = files.path
      this.selectFileFlag = false
    },
    checkStats (value) {
      if (value === 0) {
        return '根目录'
      } else {
        return '子目录'
      }
    },
    checkStatsColor (value) {
      if (value === 0) {
        return 'warning'
      } else {
        return 'success'
      }
    },
    initFromInput () {
      var formInline = {
        typeId: null,
        name: '',
        sort: null,
        parentId: null,
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
      this.initPtypes()
      this.title = '添加产品分类 '
      this.formInline = this.initFromInput()
      this.addFlag = true
      this.disabled = false
    },
    cancel () {
      this.selectFileFlag = false
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    infoBtnClick (index) {
      this.title = '编辑产品分类 '
      let tableRow = this.tableData[index]
      this.formInline.typeId = tableRow.typeId + ''
      this.formInline.name = tableRow.name
      this.formInline.sort = tableRow.sort + ''
      this.formInline.parentId = tableRow.parentId + ''
      this.formInline.createTime = tableRow.createTime
      this.formInline.icon = tableRow.icon
      this.addFlag = true
      this.disabled = true
    },
    editBtnClick (index) {
      this.initPtypes()
      this.title = '编辑产品分类 '
      let tableRow = this.tableData[index]
      this.formInline.typeId = tableRow.typeId + ''
      this.formInline.name = tableRow.name
      this.formInline.sort = tableRow.sort + ''
      this.formInline.parentId = tableRow.parentId + ''
      this.formInline.createTime = tableRow.createTime
      this.formInline.icon = tableRow.icon
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
            idsProProductTypeDelete(params)
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
          deleteProProductType(params)
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
            updateProProductType(this.formInline)
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
            saveProProductType(this.formInline)
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
      getProProductTypePageList(params)
        .then(res => {
          if (res.code !== 200) {
            this.tableData = res.data.obj
            this.total = res.data.count
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    initPtypes () {
      var params = {}
      params.parentId = 0
      getProProductTypeList(params)
        .then(res => {
          if (res.code !== 200) {
            this.parents = res.data.obj
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
