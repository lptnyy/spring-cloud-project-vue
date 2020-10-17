<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">会员等级</p>
            <div class="search">
              <Input class="input" v-model="levelName" placeholder="等级名称"/>
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
            <FormItem label="等级名称" prop="levelName">
              <Input :disabled="disabled" v-model="formInline.levelName" placeholder="请输入等级名称"/>
            </FormItem>
            <FormItem label="展示图片" prop="image">
              <img style="width: 200px;" :src="this.downloadUrl + formInline.image"/>
              <br />
              <Button :disabled="disabled" @click="btnFileSelect">上传图片</Button>
            </FormItem>
            <FormItem label="等级积分" prop="integral">
              <Input :disabled="disabled" v-model="formInline.integral" placeholder="请输入等级积分"/>
            </FormItem>
            <FormItem label="等级价格" prop="price">
              <Input :disabled="disabled" v-model="formInline.price" placeholder="请输入等级价格"/>
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
import { getProLevelPageList, deleteProLevel, updateProLevel, saveProLevel, idsProLevelDelete } from '@/api/proLevel'
import userStore from '@/store/module/user'
import FileComn from '@/view/pro/components/file/index'

export default {
  name: 'ProLevel',
  components: {
    Tables,
    FileComn
  },
  data () {
    return {
      disabled: false,
      selectFileFlag: false,
      title: '添加等级',
      isCreate: this.authorities('level_add'),
      isDelete: this.authorities('level_del'),
      isUpdate: this.authorities('level_update'),
      isRetrieve: this.authorities('level_select'),
      selection: [],
      addFlag: false,
      levelName: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        levelId: [
          { required: true, message: '请输入等级id', trigger: 'blur' }
        ],
        levelName: [
          { required: true, message: '请输入等级名称', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请输入展示图片', trigger: 'blur' }
        ],
        integral: [
          { required: true, message: '请输入等级积分', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入等级价格', trigger: 'blur' }
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
          title: '展示图片',
          key: 'image',
          fixed: 'left',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: this.downloadUrl + params.row.image
                },
                style: {
                  width: '200px',
                  height: '80px',
                  'margin-top': '5px'
                }
              })
            ])
          }
        },
        {
          title: '等级名称',
          key: 'levelName',
          fixed: 'left'
        },
        {
          title: '等级积分',
          key: 'integral',
          fixed: 'left'
        },
        {
          title: '等级价格',
          key: 'price',
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
      this.formInline.image = files.path
      this.selectFileFlag = false
    },
    initFromInput () {
      var formInline = {
        levelId: null,
        levelName: '',
        image: '',
        integral: null,
        price: null,
        createTime: null
      }
      return formInline
    },
    reset () {
      this.levelName = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加等级'
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
      this.title = '编辑等级'
      let tableRow = this.tableData[index]
      this.formInline.levelId = tableRow.levelId + ''
      this.formInline.levelName = tableRow.levelName
      this.formInline.image = tableRow.image
      this.formInline.integral = tableRow.integral + ''
      this.formInline.price = tableRow.price + ''
      this.formInline.createTime = tableRow.createTime
      this.addFlag = true
      this.disabled = true
    },
    editBtnClick (index) {
      this.disabled = false
      this.title = '编辑等级'
      let tableRow = this.tableData[index]
      this.formInline.levelId = tableRow.levelId + ''
      this.formInline.levelName = tableRow.levelName
      this.formInline.image = tableRow.image
      this.formInline.integral = tableRow.integral + ''
      this.formInline.price = tableRow.price + ''
      this.formInline.createTime = tableRow.createTime
      this.addFlag = true
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].levelId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProLevelDelete(params)
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
        levelId: table.levelId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProLevel(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.levelId !== null) {
            updateProLevel(this.formInline)
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
            saveProLevel(this.formInline)
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
      if (this.levelName !== '') {
        params.levelName = this.levelName
      } else {
        params.levelName = null
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProLevelPageList(params)
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
