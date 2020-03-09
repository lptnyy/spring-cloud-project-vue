<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Row>
      <Col span="11">
        <Card :bordered="false">
          <p slot="title">菜单管理</p>
          <Tree show-checkbox :data="data1"></Tree>
        </Card>
      </Col>
      <Col span="11" offset="1">
        <Card :bordered="false">
          <p slot="title">菜单属性</p>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getMenuList } from '@/api/menu'

export default {
  name: 'admin',
  data () {
    return {
      tableData: [],
      data1: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: false,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ]
    }
  },
  methods: {
    tableOnChange(index) {
      console.log(index)
    },
    onPageSizeChange(index){
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
      getMenuList(params)
        .then(res => {
          const data = res.data.obj
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
