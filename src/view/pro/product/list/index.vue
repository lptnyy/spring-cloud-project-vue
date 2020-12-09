<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false" class="cardDiv">
          <p slot="title">产品管理</p>
            <div class="search">
              <Input class="input floatDiv" v-model="titles" placeholder="标题"/>
              <treeselect class="input floatDiv" v-model="typeId" :multiple="false" :options="types" placeholder="分类"/>
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
        width="50%"
        v-model="addFlag"
        :title="title"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <Row>
              <Col span="11">
                <FormItem label="商品图片" prop="image">
                  <SelectImages :disabled="disabled" :files="logoFiles" style="width: 100%;" :size="1" @handleFile="logoHandleFile" @removeFile="logoremoveFile"></SelectImages>
                </FormItem>
                <FormItem label="商品图库" prop="images">
                  <SelectImages :disabled="disabled" :files="imgsFiles" style="width: 100%;" :size="4" @handleFile="handleFile" @removeFile="removeFile"></SelectImages>
                </FormItem>
                <FormItem label="商品名称" prop="title">
                  <Input :disabled="disabled" v-model="formInline.title" placeholder="商品名称"/>
                </FormItem>
                <FormItem label="商品标题" prop="subtitle">
                  <Input :disabled="disabled" v-model="formInline.subtitle" placeholder="商品标题"/>
                </FormItem>
                <FormItem label="商品分类" prop="typeId">
                  <treeselect :disabled="disabled" v-model="formInline.typeId" :multiple="false" :options="types" />
                </FormItem>
                <FormItem label="点赞数" prop="fabulousNum">
                  <Input :disabled="disabled" v-model="formInline.fabulousNum" placeholder="请输入点赞数"/>
                </FormItem>
                <FormItem label="评论数" prop="commentNum">
                  <Input :disabled="disabled" v-model="formInline.commentNum" placeholder="请输入评论数"/>
                </FormItem>
              </Col>
              <Col span="12" offset="1">
                <FormItem label="实际销量" prop="salesNum">
                  <Input :disabled="disabled" v-model="formInline.salesNum" placeholder="请输入销售数量"/>
                </FormItem>
                <FormItem label="分享数" prop="shareNum">
                  <Input :disabled="disabled" v-model="formInline.shareNum" placeholder="请输入分享数"/>
                </FormItem>
                <FormItem label="是否会员打折" prop="discountSts">
                  <RadioGroup v-model="formInline.discountSts">
                    <Radio v-for="item in discountSts" :disabled="disabled" :value="item.valuestr" :label="item.valuestr"  :key="item.valuestr" border>{{item.keystr}}</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="是否积分兑换" prop="integralSts">
                  <RadioGroup v-model="formInline.integralSts">
                    <Radio v-for="item in integralSts" :disabled="disabled" :value="item.valuestr" :label="item.valuestr"  :key="item.valuestr" border>{{item.keystr}}</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="产品状态" prop="state">
                  <RadioGroup v-model="formInline.state">
                    <Radio v-for="item in productStates" :disabled="disabled" :value="item.valuestr" :label="item.valuestr"  :key="item.valuestr" border>{{item.keystr}}</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="运费方式" prop="freightId">
                  <Input :disabled="disabled" v-model="formInline.freightId" placeholder="请输入运费方式"/>
                </FormItem>
                <FormItem label="排序" prop="sort">
                  <Input :disabled="disabled" v-model="formInline.sort" placeholder="请输入排序"/>
                </FormItem>
                <FormItem label="介绍" prop="introduce">
                  <Input :disabled="disabled" type="textarea" :rows="4" v-model="formInline.introduce" placeholder="请输入介绍"/>
                </FormItem>
              </Col>
            </Row>
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
import { getProProductPageList, deleteProProduct, updateProProduct, saveProProduct, idsProProductDelete, getProProductInfo, updateUpdateState } from '@/api/proProduct'
import userStore from '@/store/module/user'
import selectTree from '@/view/components/selectTree/selectTree'
import { getTypes } from '@/api/proProductType'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import SelectImages from '@/components/select-images/index'
import { getEnumList } from '@/api/enum'

export default {
  name: 'ProProduct',
  components: {
    Tables,
    selectTree,
    Treeselect,
    SelectImages
  },
  data () {
    return {
      productSource: [],
      productStateBtns: [],
      imgsFiles: [],
      logoFiles: [],
      discountSts: [],
      integralSts: [],
      productStates: [],
      productStateColors: [],
      selectFileFlag: false,
      selectViews: {},
      multiple: false,
      types: [],
      disabled: false,
      title: '添加产品',
      isCreate: this.authorities('product_add'),
      isDelete: this.authorities('product_del'),
      isUpdate: this.authorities('product_update'),
      isRetrieve: this.authorities('product_select'),
      selection: [],
      addFlag: false,
      typeId: null,
      titles: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        productId: [
          { required: true, message: '请输入产品id', trigger: 'blur' }
        ],
        enterpriseId: [
          { required: true, message: '请输入企业id', trigger: 'blur' }
        ],
        typeId: [
          { type: 'number', required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        subtitle: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请选择商品图片', trigger: 'blur' }
        ],
        images: [
          { required: true, message: '请选择商品图片', trigger: 'blur' }
        ],
        fabulousNum: [
          { required: true, message: '请输入点赞数', trigger: 'blur' }
        ],
        commentNum: [
          { required: true, message: '请输入评论数', trigger: 'blur' }
        ],
        salesNum: [
          { required: true, message: '请输入实际销量', trigger: 'blur' }
        ],
        shareNum: [
          { required: true, message: '请输入分享数', trigger: 'blur' }
        ],
        discountSts: [
          { required: true, message: '请输入是否会员打折', trigger: 'blur' }
        ],
        integralSts: [
          { required: true, message: '请输入是否积分兑换', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请输入产品状态', trigger: 'blur' }
        ],
        freightId: [
          { required: true, message: '请输入运费方式', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请输入更新时间', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入产品介绍', trigger: 'blur' }
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
          title: '商品图片',
          fixed: 'left',
          width: 118,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: this.downloadUrl + params.row.image
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
          title: '商品名称',
          key: 'title',
          fixed: 'left'
        },
        {
          title: '商品分类',
          key: 'typeName',
          fixed: 'left',
          width: 95
        },
        {
          title: '实际销量',
          key: 'salesNum',
          fixed: 'left',
          width: 95
        },
        {
          title: '点赞数',
          key: 'fabulousNum',
          fixed: 'left',
          width: 95
        },
        {
          title: '评论数',
          key: 'commentNum',
          fixed: 'left',
          width: 95
        },
        {
          title: '分享数',
          key: 'shareNum',
          fixed: 'left',
          width: 95
        },
        {
          title: '商品排序',
          key: 'sort',
          fixed: 'left',
          width: 95
        },
        {
          title: '创建时间',
          key: 'createTime',
          fixed: 'left',
          width: 150
        },
        {
          title: '产品状态',
          fixed: 'left',
          width: 95,
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                props: {
                  width: '100px',
                  color: this.checkStatsColor(params.row.state)
                }
              }, params.row.stateStr)
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 200,
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
                    this.updateState(params.index)
                  }
                }
              }, this.checkState(params.row.state)),
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
    updateState (index) {
      let tableRow = this.tableData[index]
      var params = {}
      params.productId = tableRow.productId
      if (tableRow.state === 1) {
        params.state = 2
      } else {
        params.state = 1
      }
      updateUpdateState(params)
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
    checkState (state) {
      for (var i = 0; i < this.productStateBtns.length; i++) {
        var res = this.productStateBtns[i]
        if ((state + '') === res.keystr) {
          return res.valuestr
        }
      }
    },
    logoHandleFile (files) {
      this.formInline.image = files.path
      this.logoFiles.push(files)
    },
    logoremoveFile (files) {
      this.formInline.image = ''
      const fileList = this.logoFiles
      this.logoFiles.splice(fileList.indexOf(files), 1)
    },
    handleFile (files) {
      this.imgsFiles.push(files)
      this.formInline.images = JSON.stringify(this.imgsFiles)
    },
    removeFile (files) {
      const fileList = this.imgsFiles
      this.imgsFiles.splice(fileList.indexOf(files), 1)
      if (this.imgsFiles.length > 0) {
        this.formInline.images = JSON.stringify(this.imgsFiles)
      } else {
        this.formInline.images = ''
      }
    },
    checkStatsColor (value) {
      for (var i = 0; i < this.productStateColors.length; i++) {
        var res = this.productStateColors[i]
        if ((value + '') === res.keystr) {
          return res.valuestr
        }
      }
    },
    imgCancel () {
      this.selectFileFlag = false
    },
    btnFileSelect () {
      this.selectFileFlag = true
    },
    fileSelect (files) {
      this.formInline.image = files.path
      this.selectFileFlag = false
    },
    initFromInput () {
      var formInline = {
        productId: null,
        enterpriseId: null,
        typeId: null,
        title: '',
        subtitle: '',
        image: '',
        images: '',
        fabulousNum: null,
        commentNum: null,
        salesNum: null,
        shareNum: null,
        discountSts: null,
        integralSts: null,
        state: null,
        freightId: null,
        sort: null,
        introduce: null,
        updateTime: null,
        createTime: null
      }
      return formInline
    },
    reset () {
      this.typeId = null
      this.title = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加产品'
      this.formInline = this.initFromInput()
      this.addFlag = true
      this.disabled = false
      this.logoFiles = []
      this.imgsFiles = []
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    infoBtnClick (index) {
      this.title = '产品详情'
      let tableRow = this.tableData[index]
      var params = {}
      params.productId = tableRow.productId
      getProProductInfo(params)
        .then(res => {
          tableRow = res.data.obj
          this.formInline.productId = tableRow.productId + ''
          this.formInline.enterpriseId = tableRow.enterpriseId + ''
          this.formInline.typeId = tableRow.typeId
          this.formInline.title = tableRow.title
          this.formInline.subtitle = tableRow.subtitle
          this.formInline.image = tableRow.image
          this.formInline.fabulousNum = tableRow.fabulousNum + ''
          this.formInline.commentNum = tableRow.commentNum + ''
          this.formInline.salesNum = tableRow.salesNum + ''
          this.formInline.shareNum = tableRow.shareNum + ''
          this.formInline.discountSts = tableRow.discountSts + ''
          this.formInline.integralSts = tableRow.integralSts + ''
          this.formInline.state = tableRow.state + ''
          this.formInline.freightId = tableRow.freightId + ''
          this.formInline.sort = tableRow.sort + ''
          this.formInline.updateTime = tableRow.updateTime
          this.formInline.createTime = tableRow.createTime
          this.formInline.images = tableRow.images
          this.formInline.introduce = tableRow.introduce
          this.addFlag = true
          this.disabled = true
          this.logoFiles = []
          this.imgsFiles = []
          this.logoFiles.push({
            name: '',
            path: tableRow.image
          })
          var imgs = JSON.parse(tableRow.images)
          this.imgsFiles = imgs
        })
    },
    editBtnClick (index) {
      this.title = '编辑产品'
      let tableRow = this.tableData[index]
      var params = {}
      params.productId = tableRow.productId
      getProProductInfo(params)
        .then(res => {
          tableRow = res.data.obj
          this.formInline.productId = tableRow.productId + ''
          this.formInline.enterpriseId = tableRow.enterpriseId + ''
          this.formInline.typeId = tableRow.typeId
          this.formInline.title = tableRow.title
          this.formInline.subtitle = tableRow.subtitle
          this.formInline.image = tableRow.image
          this.formInline.fabulousNum = tableRow.fabulousNum + ''
          this.formInline.commentNum = tableRow.commentNum + ''
          this.formInline.salesNum = tableRow.salesNum + ''
          this.formInline.shareNum = tableRow.shareNum + ''
          this.formInline.discountSts = tableRow.discountSts + ''
          this.formInline.integralSts = tableRow.integralSts + ''
          this.formInline.state = tableRow.state + ''
          this.formInline.freightId = tableRow.freightId + ''
          this.formInline.sort = tableRow.sort + ''
          this.formInline.updateTime = tableRow.updateTime
          this.formInline.createTime = tableRow.createTime
          this.formInline.images = tableRow.images
          this.formInline.introduce = tableRow.introduce
          this.addFlag = true
          this.disabled = false
          this.logoFiles = []
          this.imgsFiles = []
          this.logoFiles.push({
            name: '',
            path: tableRow.image
          })
          var imgs = JSON.parse(tableRow.images)
          this.imgsFiles = imgs
        })
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].productId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProProductDelete(params)
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
        productId: table.productId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProProduct(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.productId !== null) {
            updateProProduct(this.formInline)
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
            saveProProduct(this.formInline)
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
      if (this.typeId !== '') {
        params.typeId = this.typeId
      } else {
        params.typeId = null
      }
      if (this.titles !== '') {
        params.title = this.titles
      } else {
        params.title = null
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProProductPageList(params)
        .then(res => {
          if (res.code !== 200) {
            this.tableData = res.data.obj
            this.total = res.data.count
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    initTypes () {
      var params = {}
      getTypes(params)
        .then(res => {
          if (res.code !== 200) {
            this.types = res.data.obj
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    initDiscountSts () {
      var params = {}
      params.type = 'discount_sts'
      getEnumList(params)
        .then(res => {
          this.discountSts = res.data.obj
        })
    },
    initIntegralSts () {
      var params = {}
      params.type = 'integral_sts'
      getEnumList(params)
        .then(res => {
          this.integralSts = res.data.obj
        })
    },
    initProductState () {
      var params = {}
      params.type = 'product_state'
      getEnumList(params)
        .then(res => {
          this.productStates = res.data.obj
        })
    },
    initProductStateColors () {
      var params = {}
      params.type = 'product_state_color'
      getEnumList(params)
        .then(res => {
          this.productStateColors = res.data.obj
        })
    },
    initproductStateBtns () {
      var params = {}
      params.type = 'product_state_btn'
      getEnumList(params)
        .then(res => {
          this.productStateBtns = res.data.obj
        })
    },
    initproductSource () {
      var params = {}
      params.type = 'product_source'
      getEnumList(params)
        .then(res => {
          this.productSource = res.data.obj
        })
    }
  },
  mounted () {},
  created () {
    this.initproductStateBtns()
    this.initData()
    this.initTypes()
    this.initIntegralSts()
    this.initProductState()
    this.initDiscountSts()
    this.initProductStateColors()
    this.initproductSource()
  }
}
</script>
<style lang="less">
.page {
    margin-top: 10px;
}
.add_button {
    margin-left: 10px;
}
.foodl{
    text-align: center;
    width: 100%;
}
.imgpand{
  margin: 3px;
}
.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.search {
    margin-top: 10px;
    margin-bottom: 10px;
    .input {
        width: 150px;
        margin-right: 10px;
    }
    .floatDiv {
      float: left;
    }
}
.cardDiv {
  width: 100%;
}
.tableDiv {
  width: 100%;
}
</style>
