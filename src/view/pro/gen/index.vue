<style lang="less">
  @import './index.less';
</style>
<template>
  <Row>
        <Col span="12">
            <Card :bordered="false">
                <p slot="title">数据库表</p>
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
        <Col span="10" offset="1">
         <Card :bordered="false">
                <p slot="title">生成器配置</p>
                  <Form :model="formItem" :label-width="120">
                    <FormItem label="数据库地址">
                      <Input v-model="formItem.mysql" placeholder="输入mysql连接字符串"/>
                    </FormItem>
                    <FormItem label="数据库驱动">
                      <Input v-model="formItem.mysqlDev" placeholder="输入数据库驱动"/>
                    </FormItem>
                    <FormItem label="数据库账号">
                      <Input v-model="formItem.mysqlUser" placeholder="输入输入库账号"/>
                    </FormItem>
                    <FormItem label="数据库密码">
                      <Input v-model="formItem.msyqlPass" placeholder="输入数据库密码"/>
                    </FormItem>
                    <FormItem label="Controller包名">
                      <Input v-model="formItem.controllerPkg" placeholder="com.wzy.controller"/>
                    </FormItem>
                    <FormItem label="api参数包名">
                      <Input v-model="formItem.apiPkg" placeholder="com.wzy.request"/>
                    </FormItem>
                    <FormItem label="Vo包名">
                      <Input v-model="formItem.voPkg" placeholder="com.wzy.vo"/>
                    </FormItem>
                    <FormItem label="Service接口包名">
                      <Input v-model="formItem.servicePkg" placeholder="com.wzy.service"/>
                    </FormItem>
                    <FormItem label="Service实现包名">
                      <Input v-model="formItem.serviceImplPkg" placeholder="com.wzy.service"/>
                    </FormItem>
                    <FormItem label="Feign服务名">
                      <Input v-model="formItem.feignClientService" placeholder="UserService"/>
                    </FormItem>
                    <FormItem label="网关访问根目录">
                      <Input v-model="formItem.gateWayPath" placeholder="/system"/>
                    </FormItem>
                      <FormItem label="Mapper包名">
                          <Input v-model="formItem.mapperPkg" placeholder="com.wzy.mapper"/>
                      </FormItem>
                      <FormItem label="Dto包名">
                          <Input v-model="formItem.dtoPgk" placeholder="com.wzy.dto"/>
                      </FormItem>
                      <FormItem>
                          <Button :disabled="!authorities('gen:connecnt')" type="primary" @click="getTableList">连接</Button>
                      </FormItem>
                  </Form>
            </Card>
        </Col>
    </Row>
</template>
<script>
import { getTableList, generator, downloadZip, generatorWeb } from '@/api/gen'
export default {
  name: 'gen',
  data () {
    return {
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
        gateWayPath: '/system'
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
  }
}
</script>
<style>
</style>
