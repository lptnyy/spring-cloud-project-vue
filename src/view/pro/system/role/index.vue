<style lang="less">
  @import './index.less';
</style>
<template>
  <Row>
    <Col span="18">
      <Card :bordered="false">
        <p slot="title">角色管理</p>
        <div class="search">
          <Input class="input" v-model="username" placeholder="用户名"/>
          <Button @click="search">查询</Button>
          <Button class="add_button" @click="addBtnClick" type="primary">添加</Button>
        </div>
        <Table border :columns="columns" :data="tableData"></Table>
        <Page class="page" @on-page-size-change="onPageSizeChange"  show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
      </Card>
    </Col>
    <Col span="5" offset="1">
      <Card :bordered="false">
        <p slot="title">菜单设置</p>
        <Tree ref="tree" class="buttontop" :data="data1" show-checkbox></Tree>
        <Button @click="AllElection">全选</Button>&nbsp;&nbsp;
        <Button @click="reverseElection">反选</Button>&nbsp;&nbsp;
        <Button @click="saveRoleMenus" type="primary">保存</Button>
      </Card>
    </Col>
    <Modal
      v-model="addFlag"
      :title="title"
      :footer-hide=true>
        <Form ref="formInline" :model="formInline" :rules="ruleValidate">
          <FormItem label="角色名称" prop="name">
            <Input v-model="formInline.name" placeholder="输入角色名称"></Input>
          </FormItem>
       </Form>
        <div class="foodl">
          <Button @click="cancel">取消</Button>
          &nbsp;&nbsp;<Button type="primary" @click="handleSubmit('formInline')">确定</Button>
        </div>
    </Modal>
  </Row>
</template>

<script>
import Tables from '_c/tables'
import { getRolePageList, deleteRole, saveRole, saveRoleMenu, updateRole } from '@/api/role'
import { getMenuList } from '@/api/menu'

export default {
  name: 'role',
  components: {
    Tables
  },
  data () {
    return {
      title: '添加角色',
      selecData: [],
      ruleValidate: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      formInline: {
        name: ''
      },
      addFlag: false,
      data1: [],
      username: '',
      total: 0,
      pageSize: 10,
      tableSelectId: 0,
      columns: [
        {
          title: '角色名称',
          key: 'name',
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
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.updateBtnClick(params.index)
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
                    this.tableOption(params.row)
                  }
                }
              }, '菜单'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteButton(params.row)
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
    saveRoleMenus () {
      this.selecData = this.$refs.tree.getCheckedNodes()
      var dataSelects = []
      for (var i = 0; i < this.selecData.length; i++) {
        var data = this.selecData[i]
        dataSelects.push(data.menuId)
      }
      var params = {}
      params.roleId = this.tableSelectId
      params.ids = dataSelects
      saveRoleMenu(params)
        .then(res => {
          if (res.data.code === 200) {
            this.$Message.success('操作成功')
            this.initData(1)
          } else {
            this.$Message.error('操作失败')
          }
        })
    },
    AllElection () {
      var params = {}
      params.pageNum = 1
      params.pageSize = this.pageSize
      getMenuList(params)
        .then(res => {
          const result = res.data.obj
          for (var i = 0; i < result.length; i++) {
            var data = result[i]
            data.checked = true
            for (var k = 0; k < data.children.length; k++) {
              var child = data.children[k]
              child.checked = true
            }
          }
          this.data1 = result
        })
      this.selecData = this.$refs.tree.getCheckedNodes()
    },
    reverseElection () {
      var params = {}
      params.pageNum = 1
      params.pageSize = this.pageSize
      getMenuList(params)
        .then(res => {
          const result = res.data.obj
          for (var i = 0; i < result.length; i++) {
            var data = result[i]
            data.checked = false
            for (var k = 0; k < data.children.length; k++) {
              var child = data.children[k]
              child.checked = false
            }
          }
          this.data1 = result
        })
      this.selecData = this.$refs.tree.getCheckedNodes()
    },
    tableOption (row) {
      this.$Message.success('请勾选择菜单')
      this.tableSelectId = row.roleId
      var params = {}
      params.pageNum = 1
      params.pageSize = this.pageSize
      getMenuList(params)
        .then(res => {
          const result = res.data.obj
          if (result.length > 0) {
            for (var i = 0; i < row.proRoleMenuVos.length; i++) {
              var value = row.proRoleMenuVos[i]
              for (var j = 0; j < result.length; j++) {
                var data = result[j]
                if (data.menuId === value.menuId) {
                  data.checked = true
                } else {
                  for (var k = 0; k < data.children.length; k++) {
                    var child = data.children[k]
                    if (child.menuId === value.menuId) {
                      child.checked = true
                    }
                  }
                }
              }
            }
          }
          this.data1 = result
        })
      this.selecData = this.$refs.tree.getCheckedNodes()
    },
    addBtnClick () {
      this.formInline.roleId = null
      this.title = '添加角色'
      this.addFlag = true
    },
    updateBtnClick (index) {
      this.title = '编辑角色'
      let role = this.tableData[index]
      this.addFlag = true
      this.formInline.name = role.name
      this.formInline.roleId = role.roleId
    },
    handleSubmit (name) {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.roleId !== null) {
            updateRole(this.formInline)
              .then(res => {
                if (res.data.code === 200) {
                  this.$Message.success('修改成功')
                  this.formInline.name = ''
                  this.addFlag = false
                  this.initData(1)
                } else {
                  this.$Message.error('操作失败')
                }
              })
          } else {
            saveRole(this.formInline)
              .then(res => {
                if (res.data.code === 200) {
                  this.$Message.success('操作成功')
                  this.formInline.name = ''
                  this.addFlag = false
                  this.initData(1)
                } else {
                  this.$Message.error('操作失败')
                }
              })
          }
        } else {

        }
      })
    },
    cancel () {
      this.addFlag = false
      this.formInline.name = ''
    },
    tableOnChange (index) {
      this.initData(index)
    },
    onPageSizeChange (index) {
      this.pageSize = index
      this.initData(1)
    },
    search () {
      this.initData(1)
    },
    deleteButton (role) {
      var params = {
        roleId: role.roleId
      }
      this.$Modal.confirm({
        title: '是否删除角色?',
        width: 280,
        onOk: () => {
          deleteRole(params)
            .then(res => {
              this.initData(1)
            })
        }
      })
    },
    initData (pageNum) {
      var params = {}
      params.name = this.username
      params.pageNum = pageNum
      params.pageSize = this.pageSize
      getRolePageList(params)
        .then(res => {
          const data = res.data.obj
          this.tableData = data
          this.total = res.data.count
        })
    },
    initMenuData () {
      var params = {}
      params.pageNum = 1
      params.pageSize = this.pageSize
      getMenuList(params)
        .then(res => {
          const data = res.data.obj
          this.data1 = data
        })
    }
  },
  mounted () {},
  created () {
    this.initData(1)
    this.initMenuData()
  }
}
</script>
<style>
</style>
