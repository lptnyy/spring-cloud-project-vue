<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Card>
      <div class="search">
        <Input class="input" v-model="username" placeholder="用户名"/><Button @click="search" type="primary">查询</Button>
      </div>
      <Table border :columns="columns" :data="tableData"></Table>
      <Page class="page" @on-page-size-change="onPageSizeChange"  show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserList, updateStats, deleteUser } from '@/api/user'

export default {
  name: 'admin',
  components: {
    Tables
  },
  data () {
    return {
      username: '',
      total: 0,
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
          width: 120,
          render: (h, params) => {
            return h('div', [
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
                this.$Message.error('操作成功')
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
    }
  },
  mounted () {},
  created () {
    this.initData()
  }
}
</script>
<style>
</style>
