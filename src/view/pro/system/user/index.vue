<template>
  <div>
    <Card>
         <Table border :columns="columns" :data="tableData"></Table>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserList } from '@/api/user'

export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '用户名',
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
          title: '登录时间',
          key: 'lastLoginTime',
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
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, '注销'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
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
    search () {
      //
    },
    initData () {
      getUserList()
        .then(res => {
          const data = res.data.obj
          this.tableData = data
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
