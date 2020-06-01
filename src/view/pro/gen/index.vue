<style lang="less">
  @import './index.less';
</style>
<template>
  <Row>
    <Col span="24">
      <Modal
        width="800"
        v-model="genModalVisible"
        title="生成设置"
        :footer-hide=true>
        <Table border :columns="genTableColumns" :data="genTableDatas">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row }" slot="backSelectType">
            <i-select v-model="row.backSelectType">
                <i-option value="zore">无选择</i-option>
                <i-option value="like">模糊查询</i-option>
                <i-option value="eq">精确查询</i-option>
                <i-option value="range">范围查询</i-option>
            </i-select>
          </template>
          <template slot-scope="{ row }" slot="webSelectType">
            <i-select v-model="row.webSelectType">
                <i-option value="zore">无选择</i-option>
                <i-option value="like">模糊查询</i-option>
                <i-option value="eq">精确查询</i-option>
                <i-option value="range">范围查询</i-option>
            </i-select>
          </template>
          <!-- <template slot-scope="{ row, index }" slot="action">
            <Button type="success" size="small" style="margin-right: 5px" @click="getTableInfoBack(row.tableName)">生成后端</Button>
            <Button type="success" size="small" style="margin-right: 5px" @click="getTableInfoWeb(row.tableName)">生成前端</Button>
          </template> -->
        </Table>
        <div class="foodl">
          <Button @click="cancel">取消生成</Button>
          &nbsp;&nbsp;<Button type="primary" @click="ok">生成后台</Button>
          &nbsp;&nbsp;<Button type="primary" @click="handleSubmit('formInline')">生成前端</Button>
        </div>
      </Modal>
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
            <Button type="success" size="small" style="margin-right: 5px" @click="getTableInfoBack(row.tableName)">生成</Button>
          </template>
        </Table>
      </Card>
    </Col>
  </Row>
</template>
<script>
import { getTableList, generator, downloadZip, generatorWeb, getGenOption, getTableInfo } from '@/api/gen'
export default {
  name: 'Gen',
  data () {
    return {
      genModalVisible: false,
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
      genTableColumns: [
        {
          title: '列名',
          key: 'columnName'
        },
        {
          title: '备注',
          key: 'columnComment'
        },
        {
          title: '数据类型',
          key: 'dataType'
        },
        {
          title: '后台生成设置',
          slot: 'backSelectType'
        },
        {
          title: '前端生成设置',
          slot: 'webSelectType'
        }
      ],
      genTableDatas: [

      ],
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
          width: 100,
          align: 'center'
        }
      ],
      data6: []
    }
  },
  methods: {
    ok () {
      console.log(this.genTableDatas)
      this.formItem.tableGenInfos = this.genTableDatas
      generator(this.formItem).then(res => {
        downloadZip()
      })
    },
    cancel () {
      this.genModalVisible = false
      this.genTableDatas = []
    },
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
    getTableInfoBack (tableName) {
      this.formItem.tableName = tableName
      getTableInfo(this.formItem).then(res => {
        this.genModalVisible = true
        var datas = res.data.obj
        datas.forEach(element => {
          element.backSelectType = 'zore'
          element.webSelectType = 'zore'
        })
        this.genTableDatas = datas
        console.log(this.formItem)
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
