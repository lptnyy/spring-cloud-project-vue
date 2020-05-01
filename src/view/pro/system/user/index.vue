<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Row>
      <Col span="18">
        <Card :bordered="false">
          <p slot="title">管理员管理</p>
          <div class="search">
            <Input class="input" v-model="username" placeholder="用户名"/>
            <Button @click="search">查询</Button>
            <Button class="add_button" @click="addBtnClick" type="primary">添加</Button>
          </div>
          <Table border :columns="columns" :data="tableData"></Table>
          <Page class="page" @on-page-size-change="onPageSizeChange" show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
        </Card>
      </Col>
      <Col span="5" offset="1">
        <Card :bordered="false">
          <p slot="title">角色设置</p>
          <CheckboxGroup v-model="roleCheckDatas">
            <Checkbox v-for="(item, index) in roleDatas" :key="index" :label="item.roleId" border>{{ item.name }}</Checkbox>
          </CheckboxGroup>
          <br/>
          <Button @click="all">全选</Button>&nbsp;&nbsp;
          <Button @click="notAll">反选</Button>&nbsp;&nbsp;
          <Button @click="saveOption" type="primary">保存</Button>
        </Card>
      </Col>
    </Row>
    <Modal
      v-model="addFlag"
      title="添加管理员"
      :footer-hide=true>
        <Form ref="formInline" :model="formInline" :rules="ruleValidate">
          <FormItem label="头像" prop="headImg">
            <img style="width: 60px;" :src="this.downloadUrl + formInline.headImg"/>
            <Upload :show-upload-list="false" :on-success="onUploadSuccess" :format="['jpg','jpeg','png']" :headers="headers" :action="uploadUrl+'oss/file/uploadMultipartFile'">
              <Button icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
          </FormItem>
          <FormItem label="账户名" prop="userName">
            <Input v-model="formInline.userName" placeholder="输入账户" />
          </FormItem>
          <FormItem label="密码" prop="passWord">
            <Input v-model="formInline.passWord" placeholder="输入密码" />
          </FormItem>
          <FormItem label="重复密码" prop="resPassWord">
            <Input v-model="formInline.resPassWord" placeholder="输入密码" />
          </FormItem>
       </Form>
        <div class="foodl">
          <Button @click="cancel">取消</Button>
          &nbsp;&nbsp;<Button type="primary" @click="handleSubmit('formInline')">确定</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserList, updateStats, deleteUser, saveUser, updateUser } from '@/api/user'
import { getRoleList, saveAdminRole } from '@/api/role'
import userStore from '@/store/module/user'

export default {
  name: 'admin',
  components: {
    Tables
  },
  data () {
    const that = this
    const validatePassCheck = function (rule, value, callback) {
      if (value === '') {
        return callback(new Error('请输入重复密码'))
      } else if (value !== that.formInline.passWord) {
        return callback(new Error('两次密码不一致'))
      }
      callback()
    }

    return {
      optionId: 0,
      roleCheckDatas: [],
      roleDatas: [],
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      addFlag: false,
      ruleValidate: {
        headImg: [
          { required: true, message: '请上传头像', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入账号名', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        resPassWord: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      },
      formInline: {
        userName: '',
        headImg: '',
        passWord: '',
        resPassWord: ''
      },
      username: '',
      total: 0,
      headers: {
        Authorization: 'Bearer ' + userStore.state.token
      },
      pageSize: 10,
      columns: [
        {
          title: this.$t('usertable.userName'),
          key: 'userName',
          fixed: 'left'
        },
        {
          title: '登录次数',
          key: 'loginNum',
          width: 100,
          fixed: 'left'
        },
        {
          title: '状态',
          key: 'stats',
          width: 100,
          fixed: 'left',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                props: {
                  width: '100px',
                  color: this.checkStatsColor(params.row.stats)
                }
              }, this.checkStats(params.row.stats))
            ])
          }
        },
        {
          title: '登录时间',
          width: 150,
          key: 'lastLoginTime',
          fixed: 'left'
        },
        {
          title: '创建时间',
          width: 150,
          key: 'createTime',
          fixed: 'left'
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
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editButton(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.option(params.row)
                  }
                }
              }, '角色'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.buttionUpdateStats(params.index)
                  }
                }
              }, this.checkStatsButton(params.row.stats)),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteButton(params.row.stats)
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
    option (row) {
      this.optionId = row.userId
      this.roleCheckDatas = row.ids
      this.$Message.success('请勾选择角色')
    },
    saveOption () {
      if (this.optionId === 0) {
        this.$Message.error('请在列表当中选择数据（设置）')
      } else {
        var adminRole = {}
        adminRole.userId = this.optionId
        adminRole.ids = this.roleCheckDatas
        saveAdminRole(adminRole)
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
    },
    all (row) {
      for (var i = 0; i < this.roleDatas.length; i++) {
        this.roleCheckDatas.push(this.roleDatas[i].roleId)
      }
    },
    notAll () {
      this.roleCheckDatas = []
    },
    cancel () {
      this.addFlag = false
      this.formInline = {
        userName: '',
        headImg: '',
        passWord: '',
        resPassWord: ''
      }
    },
    handleSubmit (name) {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          this.formInline.userPass = this.formInline.passWord
          console.log(this.formInline.userId)
          if (this.formInline.userId !== null) {
            updateUser(this.formInline)
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
            saveUser(this.formInline)
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
    onUploadSuccess (response, file, fileList) {
      if (response.code !== 200) {
        this.$Message.error('上传失败')
      } else {
        this.formInline.headImg = response.obj.path
        this.$Message.success('上传成功')
      }
    },
    addBtnClick () {
      this.addFlag = true
      this.formInline = {
        userName: '',
        headImg: '',
        passWord: '',
        resPassWord: ''
      }
    },
    tableOnChange (index) {
      console.log(index)
    },
    onPageSizeChange (index) {
      console.log(index)
      this.pageSize = index
      this.initData()
    },
    search () {
      this.initData()
    },
    editButton (index) {
      let user = this.tableData[index]
      this.addFlag = true
      this.formInline = {
        userId: user.userId,
        userName: user.userName,
        headImg: user.headImg,
        passWord: user.userPass,
        resPassWord: user.userPass
      }
    },
    deleteButton (index) {
      var user = this.tableData[index]
      var params = {
        userId: user.userId
      }
      this.$Modal.confirm({
        title: '是否删除管理员?',
        width: 280,
        onOk: () => {
          deleteUser(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    buttionUpdateStats (index) {
      var user = this.tableData[index]
      var stats = user.stats
      var statmessage
      if (stats === 1) {
        stats = 0
        statmessage = '恢复'
      } else {
        stats = 1
        statmessage = '注销'
      }
      var params = {
        userId: user.userId,
        stats: stats
      }
      this.$Modal.confirm({
        title: '是否' + statmessage + '管理员?',
        width: 280,
        onOk: () => {
          updateStats(params)
            .then(res => {
              if (res.code !== 200) {
                this.$Message.success('操作成功')
                this.initData()
              } else {
                this.$Message.error('操作失败')
              }
            })
        }
      })
    },
    checkStatsButton (value) {
      if (value === 0) {
        return '注销'
      } else {
        return '恢复'
      }
    },
    checkStats (value) {
      if (value === 0) {
        return '正常'
      } else {
        return '已注销'
      }
    },
    checkStatsColor (value) {
      if (value === 0) {
        return 'success'
      } else {
        return 'error'
      }
    },
    initData () {
      var params = {}
      params.userName = this.username
      params.pageNum = 1
      params.pageSize = this.pageSize
      getUserList(params)
        .then(res => {
          const data = res.data.obj
          this.tableData = data
          this.total = res.data.count
        })
    },
    initRoleData () {
      var params = {}
      getRoleList(params)
        .then(res => {
          const data = res.data.obj
          this.roleDatas = data
        })
    }
  },
  mounted () {},
  created () {
    this.initData()
    this.initRoleData()
  }
}
</script>
<style>
</style>
