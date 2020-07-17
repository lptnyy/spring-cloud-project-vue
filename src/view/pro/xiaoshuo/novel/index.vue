<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title"></p>
            <div class="search">
              <Input class="input" v-model="name" placeholder="小说名称"/>
              <Input class="input" v-model="broadcast" placeholder="主播"/>
              <Input class="input" v-model="typename" placeholder="分类名称"/>
              <Input class="input" v-model="author" placeholder="作者"/>
              <Select class="input" v-model="stat" placeholder="状态">
                <Option value="连载中">连载中</Option>
                <Option value="完结">完结</Option>
              </Select>
              <Button class="add_button" @click="search" :disabled="!isRetrieve">查询</Button>
              <Button class="add_button" :disabled="!isRetrieve" @click="reset">重置</Button>
              <Button class="add_button" :disabled="!isDelete" @click="deleteBathBtnClick" type="warning">删除</Button>
              <Button class="add_button" :disabled="!isCreate" @click="addBtnClick" type="primary">添加</Button>
            </div>
            <Table border @on-selection-change="tableOnSelect" ref="selection" :columns="columns" :data="tableData"></Table>
            <Page class="page" @on-page-size-change="onPageSizeChange" show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
        </Card>
      </Col>
      <Modal
        v-model="addFlag"
        :title="title"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <FormItem label="小说名称" prop="name">
              <Input v-model="formInline.name" placeholder="请输入小说名称"/>
            </FormItem>
            <FormItem label="介绍" prop="introduce">
              <Input v-model="formInline.introduce" placeholder="请输入介绍"/>
            </FormItem>
            <FormItem label="主播" prop="broadcast">
              <Input v-model="formInline.broadcast" placeholder="请输入主播"/>
            </FormItem>
            <FormItem label="作者" prop="author">
              <Input v-model="formInline.author" placeholder="请输入作者"/>
            </FormItem>
            <FormItem label="热搜条件" prop="seachkeys">
              <Input v-model="formInline.seachkeys" placeholder="请输入搜索key"/>
            </FormItem>
            <FormItem label="状态" prop="stat">
              <Select class="input" v-model="formInline.stat" placeholder="状态">
                <Option value="连载中">连载中</Option>
                <Option value="完结">完结</Option>
              </Select>
            </FormItem>
          </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
              &nbsp;&nbsp;<Button type="primary" :disabled="!isCreate" @click="handleSubmit('formInline')">确定</Button>
          </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getXiaoshuoNovelPageList, deleteXiaoshuoNovel, updateXiaoshuoNovel, saveXiaoshuoNovel, idsXiaoshuoNovelDelete } from '@/api/xiaoshuoNovel'
import userStore from '@/store/module/user'

export default {
  name: 'XiaoshuoNovel',
  components: {
    Tables
  },
  data () {
    return {
      title: '添加',
      isCreate: this.authorities('xiaoshuo_novel_add'),
      isDelete: this.authorities('xiaoshuo_novel_del'),
      isUpdate: this.authorities('xiaoshuo_novel_edit'),
      isRetrieve: this.authorities('xiaoshuo_novel_list'),
      selection: [],
      addFlag: false,
      name: '',
      broadcast: '',
      stat: '',
      typename: '',
      author: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        id: [
          { required: true, message: '请输入标识id', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请输入图片地址', trigger: 'blur' }
        ],
        downimg: [
          { required: true, message: '请输入下载的图片地址', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入介绍', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入小说名称', trigger: 'blur' }
        ],
        broadcast: [
          { required: true, message: '请输入主播', trigger: 'blur' }
        ],
        popularity: [
          { required: true, message: '请输入人气', trigger: 'blur' }
        ],
        seachkeys: [
          { required: true, message: '请输入搜索key', trigger: 'blur' }
        ],
        downloads: [
          { required: true, message: '请输入下载次数', trigger: 'blur' }
        ],
        pcount: [
          { required: true, message: '请输入打开次数', trigger: 'blur' }
        ],
        stat: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        typename: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请输入更新时间', trigger: 'blur' }
        ],
        createtime: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        syncstat: [
          { required: true, message: '请输入同步状态', trigger: 'blur' }
        ],
        typeid: [
          { required: true, message: '请输入分类ID', trigger: 'blur' }
        ],
        imgsize: [
          { required: true, message: '请输入图片大小', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left'
        },
        {
          title: '图片',
          fixed: 'left',
          render: (h, params) => {
            return h('img', {
              /*  组件样式 */
              style: {
                'margin-top': '5px',
                width: '100px',
                height: '100px',
                'border-radius': '5%'
              },
              /*  html属性 */
              attrs: {
                /*  图片的路径,直接采用后台返回的键值 */
                src: params.row.img
              }
            })
          }
        },
        {
          title: '小说名称',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '分类名称',
          key: 'typename',
          fixed: 'left'
        },
        {
          title: '主播',
          key: 'broadcast',
          fixed: 'left'
        },
        {
          title: '作者',
          key: 'author',
          fixed: 'left'
        },
        {
          title: '人气',
          key: 'popularity',
          fixed: 'left'
        },
        {
          title: '下载次数',
          key: 'downloads',
          fixed: 'left'
        },
        {
          title: '打开次数',
          key: 'pcount',
          fixed: 'left'
        },
        {
          title: '状态',
          key: 'stat',
          fixed: 'left'
        },
        {
          title: '创建时间',
          key: 'createtime',
          fixed: 'left'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  disabled: !this.isUpdate
                },
                on: {
                  click: () => {
                    this.editBtnClick(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  disabled: !this.isDelete
                },
                on: {
                  click: () => {
                    this.deleteBtnClick(params.index)
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
    initFromInput () {
      var formInline = {
        id: null,
        img: '',
        downimg: '',
        introduce: '',
        name: '',
        broadcast: '',
        popularity: null,
        seachkeys: '',
        downloads: null,
        pcount: null,
        stat: '',
        typename: '',
        author: '',
        updateTime: null,
        createtime: null,
        syncstat: '',
        typeid: null,
        imgsize: null
      }
      return formInline
    },
    reset () {
      this.name = ''
      this.broadcast = ''
      this.stat = ''
      this.typename = ''
      this.author = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加'
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      this.title = '编辑'
      let tableRow = this.tableData[index]
      this.formInline.id = tableRow.id + ''
      this.formInline.img = tableRow.img
      this.formInline.downimg = tableRow.downimg
      this.formInline.introduce = tableRow.introduce
      this.formInline.name = tableRow.name
      this.formInline.broadcast = tableRow.broadcast
      this.formInline.popularity = tableRow.popularity + ''
      this.formInline.seachkeys = tableRow.seachkeys
      this.formInline.downloads = tableRow.downloads + ''
      this.formInline.pcount = tableRow.pcount + ''
      this.formInline.stat = tableRow.stat
      this.formInline.typename = tableRow.typename
      this.formInline.author = tableRow.author
      this.formInline.updateTime = tableRow.updateTime
      this.formInline.createtime = tableRow.createtime
      this.formInline.syncstat = tableRow.syncstat
      this.formInline.typeid = tableRow.typeid + ''
      this.formInline.imgsize = tableRow.imgsize + ''
      this.addFlag = true
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].id)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsXiaoshuoNovelDelete(params)
              .then(res => {
                this.initData()
                this.selection = []
              })
          }
        })
      }
    },
    tableOnSelect (selection, row) {
      this.selection = selection
    },
    deleteBtnClick (index) {
      let table = this.tableData[index]
      var params = {
        id: table.id
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteXiaoshuoNovel(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.id !== null) {
            updateXiaoshuoNovel(this.formInline)
              .then(res => {
                if (res.data.code === 200) {
                  this.$Message.success('修改成功')
                  this.initData()
                  this.cancel()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
          } else {
            saveXiaoshuoNovel(this.formInline)
              .then(res => {
                if (res.data.code === 200) {
                  this.$Message.success('保存成功')
                  this.initData()
                  this.cancel()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
          }
        }
      })
    },
    tableOnChange (index) {
      this.pageNum = index
      this.initData()
    },
    onPageSizeChange (index) {
      this.pageNum = 1
      this.pageSize = index
      this.initData()
    },
    initData () {
      if (!this.isRetrieve) return
      var params = {}
      if (this.name !== '') {
        params.name = this.name
      } else {
        params.name = null
      }
      if (this.broadcast !== '') {
        params.broadcast = this.broadcast
      } else {
        params.broadcast = null
      }
      if (this.stat !== '') {
        params.stat = this.stat
      } else {
        params.stat = null
      }
      if (this.typename !== '') {
        params.typename = this.typename
      } else {
        params.typename = null
      }
      if (this.author !== '') {
        params.author = this.author
      } else {
        params.author = null
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getXiaoshuoNovelPageList(params)
        .then(res => {
          if (res.code !== 200) {
            this.tableData = res.data.obj
            this.total = res.data.count
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
<style lang="less">
.page {
    margin-top: 10px;
}
.search {
    margin-top: 10px;
    margin-bottom: 10px;
    .input{
        width: 150px;
        margin-right: 10px;
    }
}
.add_button {
    margin-left: 10px;
}
.foodl{
    text-align: center;
    width: 100%;
}
</style>
