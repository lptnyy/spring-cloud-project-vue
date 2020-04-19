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
                    <Radio label="0">根目录</Radio>
                    <Radio label="1">子页面</Radio>
                    <Radio label="2">功能</Radio>
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
      title="添加菜单"
      :loading="loading"
      @on-ok="asyncOK">
    </Modal>
  </div>
</template>

<script>
import { getMenuList, menuSave, idsDelete, update } from '@/api/menu'

export default {
  name: 'menu',
  data () {
    return {
      parentVo: null,
      selecData: [],
      modal6: false,
      loading: false,
      isEdit: false,
      tableData: [],
      data1: [],
      formItem: {}
    }
  },
  methods: {
    blur () {
      this.isEdit = false
      this.formItem = {}
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
      console.log(this.formItem.type)
      if (this.parentVo !== null && this.formItem.type !== '0') {
        this.formItem.parentId = this.parentVo.menuId
        console.log(1)
      } else {
        this.formItem.parentId = 0
        console.log(2)
      }
      console.log(this.formItem)
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
