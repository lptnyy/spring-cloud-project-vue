<style lang="less">
  @import './index.less';
</style>
<template>
  <div>
    <Row>
      <Col span="8">
        <Card :bordered="false">
          <p slot="title">菜单管理</p>
          <Tree @on-check-change="checkSelect" @on-select-change="downBtn" class="buttontop" :data="data1" show-checkbox></Tree>
          <p><Button type="primary" @click="blur">新建</Button>&nbsp;&nbsp;<Button @click="btnMenuDelete" type="warning">删除</Button></p>
        </Card>
      </Col>
      <Col span="10" offset="1">
        <Card :bordered="false">
          <p slot="title">菜单属性</p>
          <Form :model="formItem" :label-width="100">
            <FormItem label="名称">
                <Input v-model="formItem.title" placeholder="名称"></Input>
            </FormItem>
            <FormItem label="图标">
                <Input v-model="formItem.icon" placeholder="图标"></Input>
            </FormItem>
            <FormItem label="组件名称">
                <Input v-model="formItem.name" placeholder="组件名称"></Input>
            </FormItem>
            <FormItem label="组件路径">
                <Input v-model="formItem.path" placeholder="文件物理路径"></Input>
            </FormItem>
            <FormItem label="访问权限">
                <Input v-model="formItem.jurisdiction" placeholder="权限配置"></Input>
            </FormItem>
            <FormItem label="类型">
                <RadioGroup v-model="formItem.type">
                    <Radio v-for="item in fileTypes" :label="item.valuestr" :key="item.valuestr">{{item.keystr}}</Radio>
                    <!--<Radio label="1">子页面</Radio>-->
                    <!--<Radio label="2">功能</Radio>-->
                    <!--<Radio label="3">连接</Radio>-->
                </RadioGroup>
            </FormItem>
            <FormItem>
                <Button type="primary">
                  <span @click="btnMenuSave" v-if="this.isEdit === false">添加</span>
                  <span @click="btnMenuUpdate" v-if="this.isEdit === true">保存</span>
                </Button>
            </FormItem>
        </Form>
        </Card>
      </Col>
    </Row>
    <Modal
      v-model="modal6"
      :title="title"
      :loading="loading"
      @on-ok="asyncOK">
    </Modal>
  </div>
</template>

<script>
import { getMenuList, menuSave, idsDelete, update } from '@/api/menu'
import { getEnumList } from '@/api/enum'

export default {
  name: 'MenuComponents',
  data () {
    return {
      title: '添加菜单',
      parentVo: null,
      selecData: [],
      modal6: false,
      loading: false,
      isEdit: false,
      tableData: [],
      data1: [],
      fileTypes: [],
      formItem: {
        title: '',
        icon: '',
        name: '',
        path: '',
        jurisdiction: '',
        type: ''
      }
    }
  },
  methods: {
    blur () {
      this.isEdit = false
      this.formItem = {
        title: '',
        icon: '',
        name: '',
        path: '',
        jurisdiction: '',
        type: ''
      }
    },
    checkSelect (values) {
      var ids = []
      for (var i = 0; i < values.length; i++) {
        var value = values[i]
        ids.push(value.menuId)
      }
      this.selecData = ids
    },
    downBtn (row) {
      this.parentVo = row[0]
      this.formItem = row[0]
      this.isEdit = true
    },
    asyncOK () {
      this.modal6 = false
    },
    initData () {
      var params = {}
      params.userName = this.username
      params.pageNum = 1
      params.pageSize = this.pageSize
      getMenuList(params)
        .then(res => {
          const data = res.data.obj
          this.data1 = data
        })
    },
    btnMenuSave () {
      if (this.parentVo !== null && this.formItem.type !== '0') {
        this.formItem.parentId = this.parentVo.menuId
      } else {
        this.formItem.parentId = 0
      }
      menuSave(this.formItem)
        .then(res => {
          const code = res.data.code
          if (code === 200) {
            this.formItem = {}
            this.$Message.success('操作成功')
            this.initData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    btnMenuDelete () {
      var params = {
        ids: this.selecData
      }
      idsDelete(params)
        .then(res => {
          const code = res.data.code
          if (code === 200) {
            this.$Message.success('操作成功')
            this.initData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    btnMenuUpdate () {
      update(this.formItem)
        .then(res => {
          const code = res.data.code
          if (code === 200) {
            this.$Message.success('操作成功')
            this.initData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    initFileTypes () {
      var params = {}
      params.type = 'menu'
      getEnumList(params)
        .then(res => {
          this.fileTypes = res.data.obj
        })
    }
  },
  mounted () {},
  created () {
    this.initData()
    this.initFileTypes()
  }
}
</script>
<style>
</style>
