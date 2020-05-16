<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">商户管理</p>
            <div class="search">
              <Input class="input" v-model="name" placeholder="企业名称"/>
              <Input class="input" v-model="province" placeholder="省份 城市 地区"/>
              <Select v-model="stat" style="width:200px">
                  <Option v-for="item in statTypes" :value="item.valuestr" :key="item.valuestr">{{ item.keystr }}</Option>
              </Select>
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
        width="80%"
        v-model="addFlag"
        :title="title"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <Row>
              <Col span="11">
                <FormItem label="企业简称" prop="abbreviation">
                  <Input v-model="formInline.abbreviation" placeholder="请输入企业简称"/>
                </FormItem>
                <FormItem label="账号" prop="userName">
                  <Input v-model="formInline.userName" placeholder="请输入账号"/>
                </FormItem>
                <FormItem label="密码" prop="passWord">
                  <Input v-model="formInline.passWord" placeholder="请输入密码"/>
                </FormItem>
                <FormItem label="logo图片" prop="logoUrl">
                  <br />
                  <img style="width: 120px;" :src="this.downloadUrl + formInline.logoUrl"/><br />
                  <Button @click="btnFileSelect">上传图片</Button>
                </FormItem>
                <FormItem label="企业全名" prop="name">
                  <Input v-model="formInline.name" placeholder="请输入企业全名"/>
                </FormItem>
                <FormItem label="商户资质材料" prop="qualification">
                  <Input v-model="formInline.qualification" placeholder="请输入商户资质材料"/>
                </FormItem>
                <FormItem label="保证金额" prop="margin">
                  <Input v-model="formInline.margin" placeholder="请输入保证金额"/>
                </FormItem>
                <FormItem label="收款账号" prop="collectMoney">
                  <Input v-model="formInline.collectMoney" placeholder="请输入收款账号"/>
                </FormItem>
                <FormItem label="固定电话" prop="tel">
                  <Input v-model="formInline.tel" placeholder="请输入固定电话"/>
                </FormItem>
              </Col>
              <Col span="11" offset="2">
                <FormItem label="手机号码" prop="phone">
                  <Input v-model="formInline.phone" placeholder="请输入手机号码"/>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                  <Input v-model="formInline.email" placeholder="请输入邮箱"/>
                </FormItem>
                <FormItem label="省份" prop="province">
                  <Input v-model="formInline.province" placeholder="请输入省份"/>
                </FormItem>
                <FormItem label="城市" prop="city">
                  <Input v-model="formInline.city" placeholder="请输入城市"/>
                </FormItem>
                <FormItem label="地区" prop="area">
                  <Input v-model="formInline.area" placeholder="请输入地区"/>
                </FormItem>
                <FormItem label="详细地址" prop="address">
                  <Input v-model="formInline.address" placeholder="请输入详细地址"/>
                </FormItem>
                <FormItem label="qq号码" prop="qq">
                  <Input v-model="formInline.qq" placeholder="请输入qq号码"/>
                </FormItem>
                <FormItem label="企业官网" prop="homeUrl">
                  <Input v-model="formInline.homeUrl" placeholder="请输入企业官网"/>
                </FormItem>
                <FormItem label="企业状态" prop="stat">
                  <Select v-model="formInline.stat">
                    <Option v-for="item in statTypes" :value="item.valuestr" :key="item.valuestr">{{ item.keystr }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
              &nbsp;&nbsp;<Button type="primary" :disabled="!isCreate" @click="handleSubmit('formInline')">确定</Button>
          </div>
      </Modal>
    </Row>
     <FileComn :selectFileFlag="selectFileFlag" :cancel="cancel" :onSelect="fileSelect"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import FileComn from '@/view/pro/components/file/index'
import { getProMerchantPageList, deleteProMerchant, updateProMerchant, saveProMerchant, idsProMerchantDelete } from '@/api/proMerchant'
import userStore from '@/store/module/user'
import { getEnumList } from '@/api/enum'

export default {
  name: 'ProMerchant',
  components: {
    Tables, FileComn
  },
  data () {
    return {
      selectFileFlag: false,
      title: '添加商户',
      isCreate: this.authorities('merchant_add'),
      isDelete: this.authorities('merchant_del'),
      isUpdate: this.authorities('merchant_edit'),
      isRetrieve: this.authorities('merchant_select'),
      selection: [],
      addFlag: false,
      merchantId: null,
      abbreviation: '',
      userName: '',
      passWord: '',
      logoUrl: '',
      name: '',
      qualification: '',
      margin: null,
      collectMoney: '',
      tel: '',
      phone: '',
      email: '',
      province: '',
      city: '',
      area: '',
      address: '',
      qq: '',
      homeUrl: '',
      stat: null,
      createTime: null,
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      statTypes: [],
      formInline: this.initFromInput(),
      ruleValidate: {
        abbreviation: [
          { required: true, message: '请输入企业简称', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        logoUrl: [
          { required: true, message: '请输入logo图片', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入企业全名', trigger: 'blur' }
        ],
        qualification: [
          { required: true, message: '请输入商户资质材料', trigger: 'blur' }
        ],
        margin: [
          { required: true, message: '请输入保证金额', trigger: 'blur' }
        ],
        collectMoney: [
          { required: true, message: '请输入收款账号', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入固定电话', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入地区', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        qq: [
          { required: true, message: '请输入qq号码', trigger: 'blur' }
        ],
        homeUrl: [
          { required: true, message: '请输入企业官网', trigger: 'blur' }
        ],
        stat: [
          { required: true, message: '请输入状态(枚举表 enterprise_stat)', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left'
        },
        {
          title: 'logo图片',
          key: 'logoUrl',
          fixed: 'left',
          render: (h, params) => {
              return h('div', [
                  h('img', {
                      attrs: {
                          src: this.downloadUrl +params.row.logoUrl
                      },
                      style: {
                          width: '80px',
                          height: '80px'
                      }
                  }),
              ]);
          }
        },
        
        {
          title: '企业简称',
          key: 'abbreviation',
          fixed: 'left'
        },
        {
          title: '企业全名',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '省份',
          key: 'province',
          fixed: 'left'
        },
        {
          title: '城市',
          key: 'city',
          fixed: 'left'
        },
        {
          title: '地区',
          key: 'area',
          fixed: 'left'
        },
        {
          title: '企业状态',
          key: 'stat',
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
    btnFileSelect () {
      this.selectFileFlag = true
    },
    fileSelect (files) {
      this.formInline.logoUrl = files.path
      this.selectFileFlag = false
    },
    initFromInput () {
      var formInline = {
        merchantId: null,
        abbreviation: '',
        userName: '',
        passWord: '',
        logoUrl: '',
        name: '',
        qualification: '',
        margin: null,
        collectMoney: '',
        tel: '',
        phone: '',
        email: '',
        province: '',
        city: '',
        area: '',
        address: '',
        qq: '',
        homeUrl: '',
        stat: null
      }
      return formInline
    },
    reset () {
      this.merchantId = null
      this.abbreviation = ''
      this.userName = ''
      this.passWord = ''
      this.logoUrl = ''
      this.name = ''
      this.qualification = ''
      this.margin = null
      this.collectMoney = ''
      this.tel = ''
      this.phone = ''
      this.email = ''
      this.province = ''
      this.city = ''
      this.area = ''
      this.address = ''
      this.qq = ''
      this.homeUrl = ''
      this.stat = null
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加商户'
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.selectFileFlag = false
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      this.title = '编辑商户'
      let tableRow = this.tableData[index]
      this.formInline.merchantId = tableRow.merchantId
      this.formInline.abbreviation = tableRow.abbreviation
      this.formInline.userName = tableRow.userName
      this.formInline.passWord = tableRow.passWord
      this.formInline.logoUrl = tableRow.logoUrl
      this.formInline.name = tableRow.name
      this.formInline.qualification = tableRow.qualification
      this.formInline.margin = tableRow.margin + ''
      this.formInline.collectMoney = tableRow.collectMoney
      this.formInline.tel = tableRow.tel
      this.formInline.phone = tableRow.phone
      this.formInline.email = tableRow.email
      this.formInline.province = tableRow.province
      this.formInline.city = tableRow.city
      this.formInline.area = tableRow.area
      this.formInline.address = tableRow.address
      this.formInline.qq = tableRow.qq
      this.formInline.homeUrl = tableRow.homeUrl
      this.formInline.stat = tableRow.stat+''
      this.addFlag = true
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].merchantId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProMerchantDelete(params)
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
        merchantId: table.merchantId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProMerchant(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.merchantId !== null) {
            updateProMerchant(this.formInline)
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
            saveProMerchant(this.formInline)
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
      params.merchantId = this.merchantId
      params.abbreviation = this.abbreviation
      params.userName = this.userName
      params.passWord = this.passWord
      params.logoUrl = this.logoUrl
      params.name = this.name
      params.qualification = this.qualification
      params.margin = this.margin
      params.collectMoney = this.collectMoney
      params.tel = this.tel
      params.phone = this.phone
      params.email = this.email
      params.province = this.province
      params.city = this.city
      params.area = this.area
      params.address = this.address
      params.qq = this.qq
      params.homeUrl = this.homeUrl
      params.stat = this.stat
      params.createTime = this.createTime
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProMerchantPageList(params)
        .then(res => {
          if (res.code !== 200) {
            this.tableData = res.data.obj
            this.total = res.data.count
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    initStatTypes () {
      var params = {}
      params.type = 'merchant_stat'
      getEnumList(params)
        .then(res => {
          this.statTypes = res.data.obj
        })
    }
  },
  mounted () {},
  created () {
    this.initData()
    this.initStatTypes()
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
