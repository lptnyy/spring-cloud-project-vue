<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">会员管理</p>
            <div class="search">
              <Input class="input" v-model="memberNo" placeholder="会员号"/>
              <Input class="input" v-model="nickName" placeholder="会员昵称"/>
              <Input class="input" v-model="userName" placeholder="会员账号"/>
              <Select class="input" v-model="province">
                <Option value="0">需要编码</Option>
              </Select>
              <Select class="input" v-model="city">
                <Option value="0">需要编码</Option>
              </Select>
              <Select class="input" v-model="area">
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
            <FormItem label="头像" prop="headPortrait">
              <img style="width: 60px;" :src="this.downloadUrl + formInline.headPortrait"/><br />
              <Button @click="btnFileSelect">上传图片</Button>
            </FormItem>
            <FormItem label="会员号" prop="memberNo">
              <Input v-model="formInline.memberNo" placeholder="请输入会员号"/>
            </FormItem>
            <FormItem label="会员昵称" prop="nickName">
              <Input v-model="formInline.nickName" placeholder="请输入会员昵称"/>
            </FormItem>
            <FormItem label="会员账号" prop="userName">
              <Input v-model="formInline.userName" placeholder="请输入会员账号"/>
            </FormItem>
            <FormItem label="会员密码" prop="passWord">
              <Input v-model="formInline.passWord" placeholder="请输入会员密码"/>
            </FormItem>
            <FormItem label="会员简介" prop="ntroduction">
              <Input v-model="formInline.ntroduction" placeholder="请输入会员简介"/>
            </FormItem>
            <FormItem label="性别" prop="sex">
              <Select v-model="formInline.sex">
                <Option v-for="item in sexTypes" :value="item.valuestr" :key="item.valuestr">{{ item.keystr }}</Option>
              </Select>
            </FormItem>
            <FormItem label="年龄" prop="age">
              <Input v-model="formInline.age" placeholder="请输入年龄"/>
            </FormItem>
            <FormItem label="省份" prop="province">
              <Input v-model="formInline.province" placeholder="请输入省份"/>
            </FormItem>
            <FormItem label="城市" prop="city">
              <Input v-model="formInline.city" placeholder="请输入城市"/>
            </FormItem>
            <FormItem label="区" prop="area">
              <Input v-model="formInline.area" placeholder="请输入区"/>
            </FormItem>
            <FormItem label="学校" prop="school">
              <Input v-model="formInline.school" placeholder="请输入学校"/>
            </FormItem>
            <FormItem label="会员等级" prop="levelId">
              <Input v-model="formInline.levelId" placeholder="请输入会员等级"/>
            </FormItem>
            <FormItem label="会员状态" prop="state">
              <Select v-model="formInline.state">
                <Option v-for="item in stateTypes" :value="item.valuestr" :key="item.valuestr">{{ item.keystr }}</Option>
              </Select>
            </FormItem>
            <FormItem label="充值密码" prop="payPassword">
              <Input v-model="formInline.payPassword" placeholder="请输入充值密码"/>
            </FormItem>
            <FormItem label="提现密码" prop="withdrawalPassword">
              <Input v-model="formInline.withdrawalPassword" placeholder="请输入提现密码"/>
            </FormItem>
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
import { getProMemberPageList, deleteProMember, updateProMember, saveProMember, idsProMemberDelete } from '@/api/proMember'
import userStore from '@/store/module/user'
import FileComn from '@/view/pro/components/file/index'
import { getEnumList } from '@/api/enum'

export default {
  name: 'ProMember',
  components: {
    Tables,
    FileComn
  },
  data () {
    return {
      stateTypes: [],
      sexTypes: [],
      selectFileFlag: false,
      title: '会员管理',
      isCreate: this.authorities('member_add'),
      isDelete: this.authorities('member_delete'),
      isUpdate: this.authorities('member_update'),
      isRetrieve: this.authorities('member_select'),
      selection: [],
      addFlag: false,
      memberNo: '',
      nickName: '',
      userName: '',
      province: '',
      city: '',
      area: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        memberId: [
          { required: true, message: '请输入会员id', trigger: 'blur' }
        ],
        memberNo: [
          { required: true, message: '请输入会员号', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入会员昵称', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入会员账号', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入会员密码', trigger: 'blur' }
        ],
        headPortrait: [
          { required: true, message: '请输入会员头像', trigger: 'blur' }
        ],
        ntroduction: [
          { required: true, message: '请输入会员简介', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入性别', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入区', trigger: 'blur' }
        ],
        school: [
          { required: true, message: '请输入学校', trigger: 'blur' }
        ],
        levelId: [
          { required: true, message: '请输入会员等级', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请输入会员状态', trigger: 'blur' }
        ],
        payPassword: [
          { required: true, message: '请输入充值密码', trigger: 'blur' }
        ],
        withdrawalPassword: [
          { required: true, message: '请输入提现密码', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请输入更新时间', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left'
        },
        {
          title: '会员头像',
          fixed: 'left',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: this.downloadUrl + params.row.headPortrait
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
          title: '会员号',
          key: 'memberNo',
          fixed: 'left'
        },
        {
          title: '会员昵称',
          key: 'nickName',
          fixed: 'left'
        },
        {
          title: '会员账号',
          key: 'userName',
          fixed: 'left'
        },
        {
          title: '性别',
          key: 'sexStr',
          fixed: 'left'
        },
        {
          title: '年龄',
          key: 'age',
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
          title: '区',
          key: 'area',
          fixed: 'left'
        },
        {
          title: '学校',
          key: 'school',
          fixed: 'left'
        },
        {
          title: '会员等级',
          key: 'levelId',
          fixed: 'left'
        },
        {
          title: '会员状态',
          key: 'stateStr',
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
    btnFileSelect () {
      this.selectFileFlag = true
    },
    fileSelect (files) {
      this.formInline.headPortrait = files.path
      this.selectFileFlag = false
    },
    initFromInput () {
      var formInline = {
        memberId: null,
        memberNo: '',
        nickName: '',
        userName: '',
        passWord: '',
        headPortrait: '',
        ntroduction: '',
        sex: '',
        age: '',
        province: '',
        city: '',
        area: '',
        school: '',
        levelId: null,
        state: '',
        payPassword: '',
        withdrawalPassword: '',
        createTime: null,
        updateTime: null
      }
      return formInline
    },
    reset () {
      this.memberNo = ''
      this.nickName = ''
      this.userName = ''
      this.province = ''
      this.city = ''
      this.area = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加会员'
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.selectFileFlag = false
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      this.title = '编辑会员'
      let tableRow = this.tableData[index]
      this.formInline.memberId = tableRow.memberId + ''
      this.formInline.memberNo = tableRow.memberNo
      this.formInline.nickName = tableRow.nickName
      this.formInline.userName = tableRow.userName
      this.formInline.passWord = tableRow.passWord
      this.formInline.headPortrait = tableRow.headPortrait
      this.formInline.ntroduction = tableRow.ntroduction
      this.formInline.sex = tableRow.sex
      this.formInline.age = tableRow.age
      this.formInline.province = tableRow.province
      this.formInline.city = tableRow.city
      this.formInline.area = tableRow.area
      this.formInline.school = tableRow.school
      this.formInline.levelId = tableRow.levelId + ''
      this.formInline.state = tableRow.state
      this.formInline.payPassword = tableRow.payPassword
      this.formInline.withdrawalPassword = tableRow.withdrawalPassword
      this.addFlag = true
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].memberId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProMemberDelete(params)
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
        memberId: table.memberId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProMember(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.memberId !== null) {
            updateProMember(this.formInline)
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
            saveProMember(this.formInline)
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
      if (this.memberNo !== '') {
        params.memberNo = this.memberNo
      } else {
        params.memberNo = null
      }
      if (this.nickName !== '') {
        params.nickName = this.nickName
      } else {
        params.nickName = null
      }
      if (this.userName !== '') {
        params.userName = this.userName
      } else {
        params.userName = null
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
      if (this.area !== '') {
        params.area = this.area
      } else {
        params.area = null
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProMemberPageList(params)
        .then(res => {
          if (res.code !== 200) {
            this.tableData = res.data.obj
            this.total = res.data.count
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    initFileTypes () {
      var params = {}
      params.type = 'member_stat'
      getEnumList(params)
        .then(res => {
          this.stateTypes = res.data.obj
        })
    },
    initSexTypes () {
      var params = {}
      params.type = 'sex'
      getEnumList(params)
        .then(res => {
          this.sexTypes = res.data.obj
        })
    }
  },
  mounted () {},
  created () {
    this.initData()
    this.initFileTypes()
    this.initSexTypes()
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
