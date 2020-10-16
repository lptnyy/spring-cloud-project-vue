<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">小说内容</p>
            <div class="search">
              <Input class="input" v-model="name" placeholder="名称"/>
              <Input class="input" v-model="broadcast" placeholder="播讲"/>
              <Input class="input" v-model="author" placeholder="作者"/>
              <Input class="input" v-model="typeName" placeholder="分类"/>
              <Select class="input" v-model="stat">
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
        width="60%"
        v-model="addFlag"
        :title="title"
        :footer-hide=true>
         <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <Row>
              <Col span="11">
                <p slot="title">小说详情</p>
                  <FormItem label="图片展示" prop="img">
                    <br /><img :src="this.downloadUrl + formInline.img" style="width:80px; height:80px;"><br />
                    <Button @click="btnFileSelect">上传图片</Button>
                  </FormItem>
                  <FormItem label="名称" prop="name">
                    <Input v-model="formInline.name" placeholder="请输入名称"/>
                  </FormItem>
                  <FormItem label="作者" prop="author">
                    <Input v-model="formInline.author" placeholder="请输入作者"/>
                  </FormItem>
                  <FormItem label="播讲" prop="broadcast">
                    <Input v-model="formInline.broadcast" placeholder="请输入播讲"/>
                  </FormItem>
                  <FormItem label="关键字">
                    <Input v-model="formInline.seachKeys" placeholder="请输入关键字"/>
                  </FormItem>
              </Col>
              <Col span="11" offset="1">
                  <FormItem label="集数" prop="pcount">
                    <Input v-model="formInline.pcount" placeholder="请输入集数"/>
                  </FormItem>
                  <FormItem label="状态" prop="stat">
                    <Select v-model="formInline.stat" placeholder="请输入状态">
                      <Option value="连载中">连载中</Option>
                      <Option value="完结">完结</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="分类" prop="typeId">
                    <Select v-model="formInline.typeId">
                        <Option v-for="item in typeList" :value="item.id + ''" :key="item.id+ ''">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="介绍" prop="introduce">
                    <Input v-model="formInline.introduce"  :rows="9"  type="textarea" placeholder="请输入介绍"/>
                  </FormItem>
              </Col>
            </Row>
         </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
              &nbsp;&nbsp;<Button type="primary" :disabled="!isCreate" @click="handleSubmit('formInline')">确定</Button>
          </div>
      </Modal>
    </Row>
     <FileComn :selectFileFlag="selectFileFlag" :cancel="cancel" :onSelect="fileSelect"/>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getXiaoshuoNovelPageList, deleteXiaoshuoNovel, updateXiaoshuoNovel, saveXiaoshuoNovel, idsXiaoshuoNovelDelete } from '@/api/xiaoshuoNovel'
import { getXiaoshuoNoveltypeList } from '@/api/xiaoshuoNoveltype'
import userStore from '@/store/module/user'
import FileComn from '@/view/pro/components/file/index'

export default {
  name: 'XiaoshuoNovel',
  components: {
    Tables,
    FileComn
  },
  data () {
    return {
      title: '添加小说内容',
      isCreate: this.authorities('xiaoshuo_novel_add'),
      isDelete: this.authorities('xiaoshuo_novel_del'),
      isUpdate: this.authorities('xiaoshuo_novel_edit'),
      isRetrieve: this.authorities('xiaoshuo_novel_list'),
      typeList: [],
      selection: [],
      addFlag: false,
      playAddFlag: false,
      showPlayStatFlag: true,
      selectFileFlag: false,
      novelId: '',
      name: '',
      broadcast: '',
      stat: '',
      typeName: '',
      author: '',
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        id: [
          { required: true, message: '请输入标示id', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请输入图片展示', trigger: 'blur' }
        ],
        downImg: [
          { required: true, message: '请输入图片展示', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入介绍', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        broadcast: [
          { required: true, message: '请输入播讲', trigger: 'blur' }
        ],
        popularity: [
          { required: true, message: '请输入人气', trigger: 'blur' }
        ],
        downloads: [
          { required: true, message: '请输入下载次数', trigger: 'blur' }
        ],
        pcount: [
          { required: true, message: '请输入集数', trigger: 'blur' }
        ],
        stat: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        typeName: [
          { required: true, message: '请输入分类', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请输入更新时间', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        syncStat: [
          { required: true, message: '请输入同步状态', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        imgSize: [
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
          title: '展示图',
          fixed: 'left',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: this.downloadUrl + params.row.img
                },
                style: {
                  width: '80px',
                  height: '80px',
                  'margin-top': '5px'
                }
              })
            ])
          }
        },
        {
          title: '名称',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '播讲',
          key: 'broadcast',
          fixed: 'left'
        },
        {
          title: '作者',
          key: 'author',
          fixed: 'left'
        },
        {
          title: '关键字',
          key: 'seachKeys',
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
          title: '集数',
          key: 'pcount',
          fixed: 'left'
        },
        {
          title: '状态',
          key: 'stat',
          fixed: 'left'
        },
        {
          title: '分类',
          key: 'typeName',
          fixed: 'left'
        },
        {
          title: '更新时间',
          key: 'updateTime',
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
          width: 130,
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
    playCancel () {
      this.playAddFlag = false
    },
    showPlays (index) {
      this.novelId = this.tableData[index].id + ''
      this.playAddFlag = true
    },
    btnFileSelect () {
      this.selectFileFlag = true
    },
    fileSelect (files) {
      this.formInline.img = files.path
      this.selectFileFlag = false
    },
    initFromInput () {
      var formInline = {
        id: null,
        img: '',
        downImg: '',
        introduce: '',
        name: '',
        broadcast: '',
        popularity: null,
        seachKeys: '',
        downloads: null,
        pcount: null,
        stat: '',
        typeName: '',
        author: '',
        updateTime: null,
        createTime: null,
        syncStat: '',
        typeId: null,
        imgSize: null
      }
      return formInline
    },
    reset () {
      this.name = ''
      this.broadcast = ''
      this.stat = ''
      this.typeName = ''
      this.author = ''
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加小说内容'
      this.formInline = this.initFromInput()
      this.addFlag = true
    },
    cancel () {
      this.addFlag = false
      this.selectFileFlag = false
      this.formInline = this.initFromInput()
    },
    editBtnClick (index) {
      this.title = '编辑小说内容'
      let tableRow = this.tableData[index]
      this.formInline.id = tableRow.id + ''
      this.formInline.img = tableRow.img
      this.formInline.downImg = tableRow.downImg
      this.formInline.introduce = tableRow.introduce
      this.formInline.name = tableRow.name
      this.formInline.broadcast = tableRow.broadcast
      this.formInline.popularity = tableRow.popularity + ''
      this.formInline.seachKeys = tableRow.seachKeys
      this.formInline.downloads = tableRow.downloads + ''
      this.formInline.pcount = tableRow.pcount + ''
      this.formInline.stat = tableRow.stat
      this.formInline.typeName = tableRow.typeName
      this.formInline.author = tableRow.author
      this.formInline.updateTime = tableRow.updateTime
      this.formInline.createTime = tableRow.createTime
      this.formInline.syncStat = tableRow.syncStat
      this.formInline.typeId = tableRow.typeId + ''
      this.formInline.imgSize = tableRow.imgSize + ''
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
    initTypeData () {
      var params = {}
      getXiaoshuoNoveltypeList(params)
        .then(res => {
          if (res.code !== 200) {
            this.typeList = res.data.obj
          } else {
            this.$Message.error(res.data.msg)
          }
        })
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
      if (this.typeName !== '') {
        params.typeName = this.typeName
      } else {
        params.typeName = null
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
    this.initTypeData()
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
