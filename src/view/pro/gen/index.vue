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
        <Table border :columns="genTableColumns" :data="genTableDatas"></Table>
        <div class="foodl">
          <Button @click="cancel">取消生成</Button>
          &nbsp;&nbsp;<Button type="primary" @click="genBack">生成后台</Button>
          &nbsp;&nbsp;<Button type="primary" @click="genWeb">生成前端</Button>
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
      productTypeList: [
        { id: 'eq', name: '精确查询' },
        { id: 'like', name: '模糊查询' }
      ],
      searchTypeList: [
        { id: 'zore', name: '未选择' },
        { id: 'text', name: '文本类型' },
        { id: 'select', name: '选择器' },
        { id: 'radio', name: '单选按钮' },
        { id: 'time', name: '时间类型(年月日)' },
        { id: 'timeyyyymmdd', name: '时间类型(年月日时分秒)' }
      ],
      sortTypeList: [
        { id: 'zore', name: '未选择' },
        { id: 'asc', name: '正序' },
        { id: 'desc', name: '倒序' }
      ],
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
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.genTableDatas[params.index].backSelectType, // 获取选择的下拉框的值
                size: 'small',
                transfer: true
              },
              on: {
                'on-change': e => {
                  this.genTableDatas[params.index].backSelectType = e // 改变下拉框赋值
                }
              }
            }, this.productTypeList.map((item) => { // this.productTypeList下拉框里的data
              return h('Option', { // 下拉框的值
                props: {
                  value: item.id,
                  label: item.name
                }
              })
            }))
          }
        },
        {
          title: '是否排序',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.genTableDatas[params.index].sort, // 获取选择的下拉框的值
                size: 'small',
                transfer: true
              },
              on: {
                'on-change': e => {
                  this.genTableDatas[params.index].sort = e // 改变下拉框赋值
                }
              }
            }, this.sortTypeList.map((item) => { // this.productTypeList下拉框里的data
              return h('Option', { // 下拉框的值
                props: {
                  value: item.id,
                  label: item.name
                }
              })
            }))
          }
        },
        {
          title: '前端生成设置',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.genTableDatas[params.index].webSelectType, // 获取选择的下拉框的值
                size: 'small',
                transfer: true
              },
              on: {
                'on-change': e => {
                  this.genTableDatas[params.index].webSelectType = e // 改变下拉框赋值
                }
              }
            }, this.searchTypeList.map((item) => { // this.productTypeList下拉框里的data
              return h('Option', { // 下拉框的值
                props: {
                  value: item.id,
                  label: item.name
                }
              })
            }))
          }
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
    genBack () {
      this.formItem.tableGenInfos = this.genTableDatas
      generator(this.formItem).then(res => {
        downloadZip()
      })
    },
    genWeb () {
      this.formItem.tableGenInfos = this.genTableDatas
      generatorWeb(this.formItem).then(res => {
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
          element.backSelectType = 'eq'
          element.webSelectType = 'zore'
          element.sort = 'zore'
        })
        this.genTableDatas = datas
        console.log(this.formItem)
      })
    },
    getTableInfoWeb () {
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
