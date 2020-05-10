<style lang="less">
  @import './index.less';
</style>
<template>
  <Row>
    <Col span="24">
      <Card :bordered="false">
        <p slot="title">数据库表(请先设置生成器在使用此功能)</p>
        <div class="search">
          <Button @click="getTableList">链接数据库</Button>
        </div>
        <Table border :columns="columns12" :data="data6">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="success" size="small" style="margin-right: 5px" @click="getTableInfo(row.tableName)">生成后端</Button>
            <Button type="success" size="small" style="margin-right: 5px" @click="getTableInfoWeb(row.tableName)">生成前端</Button>
          </template>
        </Table>
      </Card>
    </Col>
  </Row>
</template>
<script>
import { getTableList, generator, downloadZip, generatorWeb, getGenOption } from '@/api/gen'
export default {
  name: 'Gen',
  data () {
    return {
      tableName: '',
      formItem: {
        mysql: 'jdbc:mysql://localhost:3306/pro_user',
        mysqlUser: 'root',
        msyqlPass: 'wangyang',
        mysqlDev: 'com.mysql.jdbc.Driver',
        apiPkg: 'com.wzy.system.request',
        controllerPkg: 'com.wzy.system.controller',
        voPkg: 'com.wzy.system.vo',
        servicePkg: 'com.wzy.system',
        serviceImplPkg: 'com.wzy.system.service',
        mapperPkg: 'com.wzy.system.mapper',
        dtoPgk: 'com.wzy.system.dto',
        feignClientService: 'system-service',
        gateWayPath: '/system',
        logSourceName: 'admin-app'
      },
      columns12: [
        {
          title: '表名',
          key: 'tableName'
        },
        {
          title: '备注',
          key: 'tableComment'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '操作',
          slot: 'action',
          width: 190,
          align: 'center'
        }
      ],
      data6: []
    }
  },
  methods: {
    init () {
      var par = {}
      getGenOption(par)
        .then(res => {
          var data = res.data
          if (data.code !== 200) {
            this.$Message.error(data.msg)
          } else {
            this.formItem = res.data.obj
          }
        })
    },
    getTableList () {
      getTableList(this.formItem)
        .then(res => {
          var data = res.data
          if (data.code !== 200) {
            this.$Message.error(data.msg)
          } else {
            this.data6 = data.obj
            this.$Message.success('链接成功')
          }
        })
    },
    getTableInfo (tableName) {
      this.formItem.tableName = tableName
      generator(this.formItem).then(res => {
        downloadZip()
      })
    },
    getTableInfoWeb (tableName) {
      this.formItem.tableName = tableName
      generatorWeb(this.formItem).then(res => {
        downloadZip()
      })
    }
  },
  mounted () {},
  created () {
    this.init()
  }
}
</script>
<style>
</style>
