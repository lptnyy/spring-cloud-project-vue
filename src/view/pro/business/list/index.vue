<template>
  <div>
    <Row>
      <Col span="24">
        <Card :bordered="false" class="cardDiv">
          <p slot="title">商家管理 </p>
            <div class="search">
              <Input class="input floatDiv" v-model="name" placeholder="商家名称"/>
              <Input class="input floatDiv" v-model="abbreviation" placeholder="商家简称"/>
              <Select class="input floatDiv" @on-change="provincesChang" v-model="province" placeholder="省份">
                <Option v-for="item in provinces" :value="item.provinceId" :key="item.provinceId">{{ item.name }}</Option>
              </Select>
              <Select class="input floatDiv" @on-change="areaChang" v-model="city" placeholder="城市">
                <Option v-for="item in selectCitys" :value="item.cityId" :key="item.cityId">{{ item.name }}</Option>
              </Select>
              <Select class="input floatDiv" v-model="area" placeholder="地区">
                <Option v-for="item in selectAreas" :value="item.areaId" :key="item.areaId">{{ item.name }}</Option>
              </Select>
              <Select class="input floatDiv" v-model="typeId" placeholder="分类">
                <Option v-for="item in businessTypeList" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
              </Select>
              <Select class="input floatDiv" v-model="state" placeholder="状态">
                <Option v-for="item in businessStates" :value="item.valuestr" :key="item.valuestr">{{ item.keystr }}</Option>
              </Select>
              <Button class="add_button" @click="search" :disabled="!isRetrieve">查询</Button>
              <Button class="add_button" :disabled="!isRetrieve" @click="reset">重置</Button>
              <Button class="add_button" :disabled="!isDelete" @click="deleteBathBtnClick" type="warning">删除</Button>
              <Button class="add_button" :disabled="!isCreate" @click="addBtnClick" type="primary">添加</Button>
            </div>
            <Table class="tableDiv" border @on-selection-change="tableOnSelect" ref="selection" :columns="columns" :data="tableData"></Table>
            <Page class="page" @on-page-size-change="onPageSizeChange" show-total show-sizer @on-change="tableOnChange" :total="total" show-elevator />
        </Card>
      </Col>
      <Modal
        width="50%"
        v-model="addFlag"
        :title="title"
        :footer-hide=true>
          <Form ref="formInline" :model="formInline" :rules="ruleValidate">
            <Row>
              <Col span="8">
                <FormItem label="商家名称" prop="name">
                  <Input :disabled="disabled" v-model="formInline.name" placeholder="请输入商家名称"/>
                </FormItem>
                <FormItem label="商家简称" prop="abbreviation">
                  <Input :disabled="disabled" v-model="formInline.abbreviation" placeholder="请输入商家简称"/>
                </FormItem>
                <FormItem label="省份" prop="province">
                  <Select :disabled="disabled" @on-change="addProvincesChang" v-model="formInline.province" placeholder="请选择省份">
                    <Option v-for="item in provinces" :value="item.provinceId" :key="item.provinceId">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="城市" prop="city">
                  <Select :disabled="disabled" @on-change="addAreaChang" v-model="formInline.city" placeholder="请选择城市">
                    <Option v-for="item in addSelectCitys" :value="item.cityId" :key="item.cityId">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="地区" prop="area">
                  <Select :disabled="disabled" v-model="formInline.area" placeholder="请选择城市">
                    <Option v-for="item in addSelectAreas" :value="item.areaId" :key="item.areaId">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="详细地址" prop="address">
                  <Input :disabled="disabled" v-model="formInline.address" placeholder="请输入地址"/>
                </FormItem>
                <FormItem label="类型" prop="typeId">
                  <Select :disabled="disabled" v-model="formInline.typeId" placeholder="请选择类型">
                    <Option v-for="item in businessTypeList" :value="item.typeId + ''" :key="item.typeId">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="状态" prop="state">
                  <Select :disabled="disabled" v-model="formInline.state">
                    <Option v-for="item in businessStates" :value="item.valuestr" :key="item.valuestr">{{ item.keystr }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="15" offset="1">
                <FormItem label="商家logo" prop="logo">
                  <SelectImages :disabled="disabled" :files="logoFiles" style="width: 100%;" :size="1" @handleFile="logoHandleFile" @removeFile="logoremoveFile"></SelectImages>
                </FormItem>
                <FormItem label="商家图库" prop="imgs">
                  <SelectImages :disabled="disabled" :files="imgsFiles" style="width: 100%;" :size="4" @handleFile="handleFile" @removeFile="removeFile"></SelectImages>
                </FormItem>
                <FormItem label="坐标拾取" prop="longitude">
                  <Map @resultLocation="resultLocation" :updatePosition="updatePosition" :disabled="disabled" style="margin-top: 30px;"></Map>
                </FormItem>
                <FormItem label="介绍" prop="introduce">
                  <Input :disabled="disabled" type="textarea" :rows="4" v-model="formInline.introduce" placeholder="请输入介绍"/>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="foodl">
              <Button @click="cancel">取消</Button>
              &nbsp;&nbsp;<Button v-if="disabled===false" type="primary" :disabled="!isCreate" @click="handleSubmit('formInline')">确定</Button>
          </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getProBusinessPageList, deleteProBusiness, updateProBusiness, saveProBusiness, idsProBusinessDelete } from '@/api/proBusiness'
import { getProBusinessTypeList } from '@/api/proBusinessType'
import { getProvince, getCity, getArea } from '@/api/regin'
import userStore from '@/store/module/user'
import { getEnumList } from '@/api/enum'
import Map from '@/components/map/index'
import SelectImages from '@/components/select-images/index'

export default {
  name: 'ProBusiness',
  components: {
    Tables, Map, SelectImages
  },
  data () {
    return {
      logoFiles: [],
      imgsFiles: [],
      updatePosition: [],
      modelDisPlay: false,
      searchName: '',
      placeSearch: null,
      center: null,
      lists: [],
      businessStateColors: [],
      markers: [],
      addSelectAreas: [],
      addSelectCitys: [],
      selectAreas: [],
      areas: [],
      provinces: [],
      citys: [],
      selectCitys: [],
      businessTypeList: [],
      businessStates: [],
      disabled: false,
      title: '添加商家',
      isCreate: this.authorities('business_add'),
      isDelete: this.authorities('business_del'),
      isUpdate: this.authorities('business_update'),
      isRetrieve: this.authorities('business_select'),
      selection: [],
      addFlag: false,
      name: '',
      abbreviation: '',
      province: '',
      city: '',
      area: '',
      typeId: null,
      state: null,
      uploadUrl: userStore.state.baseUrl,
      downloadUrl: userStore.state.downloadUrl,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      formInline: this.initFromInput(),
      ruleValidate: {
        businessId: [
          { required: true, message: '请输入商家id', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入商家名称', trigger: 'blur' }
        ],
        abbreviation: [
          { required: true, message: '请输入商家简称', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请输入商家logo', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入区', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度纬度', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入介绍', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请输入类型id', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        imgs: [
          { required: true, message: '请输入商家图库', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请输入更新时间', trigger: 'blur' }
        ],
        isDel: [
          { required: true, message: '请输入删除标记', trigger: 'blur' }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left'
        },
        {
          title: 'Logo',
          fixed: 'left',
          width: 118,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: this.downloadUrl + params.row.logo
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
          title: '商家名称',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '商家简称',
          key: 'abbreviation',
          fixed: 'left'
        },
        {
          title: '省份',
          key: 'provinceName',
          fixed: 'left'
        },
        {
          title: '城市',
          key: 'cityName',
          fixed: 'left'
        },
        {
          title: '区',
          key: 'areaName',
          fixed: 'left'
        },
        {
          title: '商户类型',
          key: 'typeName',
          fixed: 'left'
        },
        {
          title: '创建时间',
          key: 'createTime',
          fixed: 'left',
          width: 160
        },
        {
          title: '更新时间',
          key: 'updateTime',
          fixed: 'left',
          width: 160
        },
        {
          title: '状态',
          fixed: 'left',
          width: 95,
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                props: {
                  width: '100px',
                  color: this.checkStatsColor(params.row.state)
                }
              }, params.row.stateName)
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  disabled: !this.isRetrieve
                },
                on: {
                  click: () => {
                    this.infoBtnClick(params.index)
                  }
                }
              }, '详情'),
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
    logoHandleFile (files) {
      this.formInline.logo = files.path
      this.logoFiles.push(files)
    },
    logoremoveFile (files) {
      this.formInline.logo = ''
      const fileList = this.logoFiles
      this.logoFiles.splice(fileList.indexOf(files), 1)
    },
    handleFile (files) {
      this.imgsFiles.push(files)
      this.formInline.imgs = JSON.stringify(this.imgsFiles)
    },
    removeFile (files) {
      const fileList = this.imgsFiles
      this.imgsFiles.splice(fileList.indexOf(files), 1)
      if (this.imgsFiles.length > 0) {
        this.formInline.imgs = JSON.stringify(this.imgsFiles)
      } else {
        this.formInline.imgs = ''
      }
    },
    resultLocation (lat, lng) {
      this.formInline.latitude = lat + ''
      this.formInline.longitude = lng + ''
    },
    checkStatsColor (value) {
      for (var i = 0; i < this.businessStateColors.length; i++) {
        var res = this.businessStateColors[i]
        if ((value + '') === res.keystr) {
          console.log(res)
          return res.valuestr
        }
      }
    },
    initFromInput () {
      var formInline = {
        businessId: null,
        name: '',
        abbreviation: '',
        logo: '',
        province: '',
        city: '',
        area: '',
        address: '',
        longitude: '',
        latitude: '',
        introduce: '',
        typeId: null,
        state: null,
        imgs: '',
        createTime: null,
        updateTime: null,
        isDel: null
      }
      return formInline
    },
    addAreaChang (op) {
      this.initAddAreaDatas(op)
    },
    initAddCityDatas (op) {
      this.addSelectCitys = []
      this.citys.forEach(city => {
        if (city.province === op) {
          this.addSelectCitys.push(city)
        }
      })
    },
    initAreaDatas (op) {
      this.selectAreas = []
      this.areas.forEach(area => {
        if (area.cityId === op) {
          this.selectAreas.push(area)
        }
      })
    },
    initAddAreaDatas (op) {
      this.addSelectAreas = []
      this.areas.forEach(area => {
        if (area.cityId === op) {
          this.addSelectAreas.push(area)
        }
      })
    },
    addProvincesChang (op) {
      this.initAddCityDatas(op)
    },
    areaChang (op) {
      this.initAreaDatas(op)
    },
    provincesChang (op) {
      this.initCityDatas(op)
    },
    initCityDatas (op) {
      this.selectCitys = []
      this.citys.forEach(city => {
        if (city.province === op) {
          this.selectCitys.push(city)
        }
      })
    },
    reset () {
      this.name = ''
      this.abbreviation = ''
      this.province = ''
      this.city = ''
      this.area = ''
      this.typeId = null
      this.state = null
      this.pageNum = 1
      this.initData()
    },
    search () {
      this.initData()
    },
    addBtnClick () {
      this.title = '添加商家 '
      this.formInline = this.initFromInput()
      this.addFlag = true
      this.disabled = false
      this.imgsFiles = []
      this.logoFiles = []
    },
    cancel () {
      this.addFlag = false
      this.formInline = this.initFromInput()
    },
    infoBtnClick (index) {
      this.title = '编辑商家 '
      let tableRow = this.tableData[index]
      this.formInline.businessId = tableRow.businessId + ''
      this.formInline.name = tableRow.name
      this.formInline.abbreviation = tableRow.abbreviation
      this.formInline.logo = tableRow.logo
      this.formInline.province = tableRow.province
      this.formInline.city = tableRow.city
      this.formInline.area = tableRow.area
      this.formInline.address = tableRow.address
      this.formInline.longitude = tableRow.longitude
      this.formInline.latitude = tableRow.latitude
      this.formInline.introduce = tableRow.introduce
      this.formInline.typeId = tableRow.typeId + ''
      this.formInline.state = tableRow.state + ''
      this.formInline.imgs = tableRow.imgs
      this.formInline.createTime = tableRow.createTime
      this.formInline.updateTime = tableRow.updateTime
      this.formInline.isDel = tableRow.isDel + ''
      this.initAddCityDatas(tableRow.province)
      this.initAddAreaDatas(tableRow.city)
      this.addFlag = true
      this.disabled = true
      this.updatePosition = []
      this.updatePosition.push(parseFloat(tableRow.longitude))
      this.updatePosition.push(parseFloat(tableRow.latitude))
      this.logoFiles = []
      this.imgsFiles = []
      this.logoFiles.push({
        name: '',
        path: tableRow.logo
      })
      var imgs = JSON.parse(tableRow.imgs)
      this.imgsFiles.push(imgs)
    },
    editBtnClick (index) {
      this.title = '编辑商家 '
      let tableRow = this.tableData[index]
      this.formInline.businessId = tableRow.businessId + ''
      this.formInline.name = tableRow.name
      this.formInline.abbreviation = tableRow.abbreviation
      this.formInline.logo = tableRow.logo
      this.formInline.province = tableRow.province
      this.formInline.city = tableRow.city
      this.formInline.area = tableRow.area
      this.formInline.address = tableRow.address
      this.formInline.longitude = tableRow.longitude
      this.formInline.latitude = tableRow.latitude
      this.formInline.introduce = tableRow.introduce
      this.formInline.typeId = tableRow.typeId + ''
      this.formInline.state = tableRow.state + ''
      this.formInline.imgs = tableRow.imgs
      this.formInline.createTime = tableRow.createTime
      this.formInline.updateTime = tableRow.updateTime
      this.formInline.isDel = tableRow.isDel + ''
      this.initAddCityDatas(tableRow.province)
      this.initAddAreaDatas(tableRow.city)
      this.addFlag = true
      this.disabled = false
      this.updatePosition = []
      this.updatePosition.push(parseFloat(tableRow.longitude))
      this.updatePosition.push(parseFloat(tableRow.latitude))
      this.logoFiles = []
      this.imgsFiles = []
      this.logoFiles.push({
        name: '',
        path: tableRow.logo
      })
      var imgs = JSON.parse(tableRow.imgs)
      this.imgsFiles.push(imgs)
    },
    deleteBathBtnClick () {
      if (this.selection.length === 0) {
        this.$Message.error('没有选择数据')
      } else {
        var ids = []
        for (let i = 0; i < this.selection.length; i++) {
          ids.push(this.selection[i].businessId)
        }
        var params = {
          ids: ids
        }
        this.$Modal.confirm({
          title: '是否删除枚举?',
          width: 280,
          onOk: () => {
            idsProBusinessDelete(params)
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
        businessId: table.businessId
      }
      this.$Modal.confirm({
        title: '是否删除枚举?',
        width: 280,
        onOk: () => {
          deleteProBusiness(params)
            .then(res => {
              this.initData()
            })
        }
      })
    },
    handleSubmit () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (this.formInline.businessId !== null) {
            updateProBusiness(this.formInline)
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
            saveProBusiness(this.formInline)
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
    initBusinessState () {
      var params = {}
      params.type = 'business_state'
      getEnumList(params)
        .then(res => {
          this.businessStates = res.data.obj
        })
    },
    initBusinessStateColor () {
      var params = {}
      params.type = 'business_state_color'
      getEnumList(params)
        .then(res => {
          this.businessStateColors = res.data.obj
        })
    },
    initProBusinessTypeList () {
      var params = {}
      getProBusinessTypeList(params)
        .then(res => {
          this.businessTypeList = res.data.obj
        })
    },
    initRegion () {
      var params = {}
      params.pageNum = 1
      params.pageSize = 10000000
      getProvince(params)
        .then(res => {
          this.provinces = res.data.obj
        })
      getCity(params)
        .then(res => {
          this.citys = res.data.obj
        })
      getArea(params)
        .then(res => {
          this.areas = res.data.obj
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
      if (this.abbreviation !== '') {
        params.abbreviation = this.abbreviation
      } else {
        params.abbreviation = null
      }
      if (this.province !== '') {
        params.province = this.province
      } else {
        params.province = null
      }
      if (this.city !== '') {
        params.city = this.city
      } else {
        params.city = null
      }
      if (this.area !== '') {
        params.area = this.area
      } else {
        params.area = null
      }
      if (this.typeId !== '') {
        params.typeId = this.typeId
      } else {
        params.typeId = null
      }
      if (this.state !== '') {
        params.state = this.state
      } else {
        params.state = null
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      getProBusinessPageList(params)
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
    this.initBusinessState()
    this.initProBusinessTypeList()
    this.initRegion()
    this.initBusinessStateColor()
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
    .input {
      width: 150px;
      margin-right: 10px;
    }
    .floatDiv {
      float: left;
    }
}
.cardDiv {
  width: 100%;
}
.tableDiv {
  width: 100%;
}
.add_button {
    margin-left: 10px;
}
.foodl{
    text-align: center;
    width: 100%;
}
.mapDiv {
  width: 200px;
  height: 200px;
}
.maps {
  width: 100%;
  height: 300px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
