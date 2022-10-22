<template>
  <div class="app-container">
    <div style="margin: 10px 0">

      <el-input v-model="search_creator" placeholder="creator" style="width: 20%" clearable />
      <el-input v-model="search_algorithm" placeholder="algorithm" style="width: 20%;margin-left:15px" clearable />
      <el-button type="primary" style="margin-left: 15px" @click="handleFilter()">search</el-button>

    </div>
    <i :class="[refresh? 'el-icon-refresh go' : 'el-icon-refresh']" style="margin-top:10px" @click="iconClick" />
    <el-tag type="success" style="margin-left:49px" effect="dark">使用算法进行模糊查询时:0代表RandomForest 1代表AdaBoost</el-tag>
    <v-text text="对算法进行查询时:0代表RandomForest 1代表AdaBoost" style="width: 20%" clearable />
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column
        prop="id"
        label="id"
        sortable="custom"
        align="center"
        width="50"
        :class-name="getSortClass('id')"
      />
      <el-table-column prop="des" label="description" min-width="120px" align="center" />
      <el-table-column prop="algorithm" label="algorithm" width="130px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.algorithm | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="create_time" width="160px" align="center" />
      <el-table-column prop="creator" label="creator" width="110px" align="center" />
      <el-table-column
        prop="acc"
        label="accuracy"
        align="center"
      >
        <template slot-scope="scope">
          {{ fun(scope.row.acc) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="prec"
        label="precision"
        align="center"
      >
        <template slot-scope="scope">
          {{ fun(scope.row.prec) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="rec"
        label="recall"
        align="center"
      >
        <template slot-scope="scope">
          {{ fun(scope.row.rec) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="f1"
        label="f1"
        align="center"
      >
        <template slot-scope="scope">
          {{ fun(scope.row.f1) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="90" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleEdit(row)">
            Look
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      align="center"
      :current-page="currentPage"
      :page-sizes="[1,5,10,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="tableData.page"
      :limit.sync="tableData.limit"
      @pagination="load"
    />

    <el-dialog title="Details" :visible.sync="dialogVisible">
      <el-form v-model="form" border fit highlight-current-row style="width: 600px; margin-left:0px;">

        <el-link
          :underline="false"
          style="color:cornflowerblue"
          @click="download"
        >下载查看：训练数据
        </el-link>

        <el-form-item label="Classifier" width="120px" align="center" />
        <el-input v-model="form.param1" width="120px" align="center" disabled="false" />

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          Close
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { modellist } from '@/api/model'

const calendarTypeOptions = [
  { key: '0', display_name: 'RandomForest' },
  { key: '1', display_name: 'AdaBoost' }
]

// eslint-disable-next-line no-unused-vars
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: {},
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      URL,
      form: {},
      creator: '',
      algorithm: '',
      calendarTypeOptions,
      downloadLoading: false,
      dialogVisible: false,
      dialogStatus: '',
      tableData: [],
      refresh: false,
      search_creator: '',
      search_algorithm: '',
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10 // 每页的数据条数
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      modellist({}).then(res => {
        console.log(res)
        this.tableData = res.data.modellist
        this.total = res.data.total
      }).catch(error => {
        console.log(error)
      })
    },
    handleFilter() {
      modellist({
        'creator': this.search_creator,
        'algorithm': this.search_algorithm
      }).then(res => {
        console.log(res)
        this.tableData = res.data.modellist
        parseFloat(this.tableData).toFixed(2)
        this.total = res.data.total
      }).catch(error => {
        console.log(error)
      })
    },
    // 将表中数据保留2位小数
    fun(val) {
      return Number(val).toFixed(2)
    },
    // 转化路径变base64的路径
    convertBase64ToBlob(base64, fileType, slice) {
      return new Blob(
        atob(base64)
          .match(new RegExp(`([\\s\\S]{${slice}})|([\\s\\S]{1,${slice}})`, 'g'))
          .map(function(item) {
            return new Uint8Array(
              item.split('').map(function(s, i) {
                return item.charCodeAt(i)
              })
            )
          }),
        { type: fileType }
      )
    },
    getSortClass(key) {
      // const sort = this.tableData.sort
      // return sort === `+${key}` ? 'ascending' : 'descending'
    },
    download() {
      const file = this.convertBase64ToBlob(this.form.data, 'application/vhd.ms-excel', 1024)
      const link = document.createElement('a')
      link.download = '数据.csv'
      link.href = URL.createObjectURL(file)
      link.click()
      URL.revokeObjectURL(link.href)
    },
    downloadExcel(row) {
      const file = this.convertBase64ToBlob(row.data, 'application/vhd.ms-excel', 1024)
      const link = document.createElement('a')
      link.download = 'data.csv'
      link.href = URL.createObjectURL(file)
      link.click()
      URL.revokeObjectURL(link.href)
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    iconClick() {
      this.load()
      this.refresh = !this.refresh
      console.log(this.refresh)
      setTimeout(() => {
        this.refresh = !this.refresh
      }, 1000)
    },
    // 每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
    },
    // 当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    }
  }
}
</script>
