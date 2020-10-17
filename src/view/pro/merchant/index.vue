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
          <p slot="title">商户表 </p>
            <div class="search">
              <Input class="input" v-model="name" placeholder="企业全名"/>
              <Input class="input" v-model="abbreviation" placeholder="企业简称"/>
              <Select class="input" v-model="province" placeholder="省份">
                <Option value="0">需要编码</Option>
              </Select>
              <Select class="input" v-model="city" placeholder="城市">
                <Option value="0">需要编码</Option>
              </Select>
              <Select class="input" v-model="address" placeholder="地区">
                <Option value="0">需要编码</Option>
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
        v-model="addFlag"
        :title="title"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <FormItem label="标示列" prop="merchantId">
              <Input v-model="formInline.merchantId" placeholder="请输入标示列"/>
            </FormItem>
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
              <Input v-model="formInline.logoUrl" placeholder="请输入logo图片"/>
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
            <FormItem label="状态(枚举表 enterprise_stat)" prop="stat">
              <Input v-model="formInline.stat" placeholder="请输入状态(枚举表 enterprise_stat)"/>
            </FormItem>
            <FormItem label="创建时间" prop="createTime">
              <Input v-model="formInline.createTime" placeholder="请输入创建时间"/>
            </FormItem>
            <FormItem label="" prop="updateTime">
              <Input v-model="formInline.updateTime" placeholder="请输入"/>
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
import { getProMerchantPageList, deleteProMerchant, updateProMerchant, saveProMerchant, idsProMerchantDelete } from '@/api/proMerchant'
import userStore from '@/store/module/user'

export default {
  name: 'ProMerchant',
  components: {
    Tables
  },
  data () {
    return {
      title: '添加商户表 ',
      isCreate: this.authorities('merchant_add'),
      isDelete: this.authorities('merchant_del'),
      isUpdate: this.authorities('merchant_update'),
      isRetrieve: this.authorities('merchant_select'),
      selection: [],
      addFlag: false,
      abbreviation: '',
      userName: '',
      name: '',
      province: '',
      city: '',
      address: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        merchantId: [
          { required: true, message: '请输入标示列', trigger: 'blur' }
        ],
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
        ],
        createTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        updateTime: [
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
          title: 'logo图片',
          key: 'logoUrl',
          fixed: 'left'
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
          title: '固定电话',
          key: 'tel',
          fixed: 'left'
        },
        {
          title: '手机号码',
          key: 'phone',
          fixed: 'left'
        },
        {
          title: '邮箱',
          key: 'email',
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
          title: '更新时间',
          key: 'updateTime',
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
        updateTime: null
      }
      return formInline
    },
    reset () {
      this.abbreviation = ''
      this.userName = ''
      this.name = ''
      this.province = ''
      this.city = ''
      this.address = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加商户表 '
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      this.title = '编辑商户表 '
      let tableRow = this.tableData[index]
      this.formInline.merchantId = tableRow.merchantId + ''
      this.formInline.abbreviation = tableRow.abbreviation
      this.formInline.userName = tableRow.userName
      this.formInline.passWord = tableRow.passWord
      this.formInline.logoUrl = tableRow.logoUrl
      this.formInline.name = tableRow.name
      this.formInline.qualification = tableRow.qualification
      this.formInline.margin = tableRow.margin
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
      this.formInline.stat = tableRow.stat + ''
      this.formInline.createTime = tableRow.createTime
      this.formInline.updateTime = tableRow.updateTime
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
      this.pageNum = 1
      this.pageSize = index
      this.initData()
    },
    initData () {
      if (!this.isRetrieve) return
      var params = {}
      if (this.abbreviation !== '') {
        params.abbreviation = this.abbreviation
      } else {
        params.abbreviation = null
      }
      if (this.userName !== '') {
        params.userName = this.userName
      } else {
        params.userName = null
      }
      if (this.name !== '') {
        params.name = this.name
      } else {
        params.name = null
      }
      if (this.province !== '') {
        params.province = this.province
      } else {
        params.province = null
      }
      if (this.city !== '') {
        params.city = this.city
      } else {
        params.city = null
      }
      if (this.address !== '') {
        params.address = this.address
      } else {
        params.address = null
      }
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
    }
  },
  mounted () {},
  created () {
    this.initData()
  }
}
</script>
