<template>
  <div class="app-container">
    <div style="margin: 10px 0">
      <el-input v-model="search_creator" placeholder="creator" style="width: 20%" clearable />
      <el-input v-model="search_algorithm" placeholder="algorithm" style="width: 20%;margin-left:15px" clearable />
      <el-button type="primary" style="margin-left: 15px" @click="handleFilter()">search</el-button>

      <!--        <el-button type="primary" style="margin-left: 5px" @click=handleDownload()>export</el-button>-->
    </div>

    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="id" label="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')" />
      <el-table-column prop="des" label="description" min-width="150px" align="center" />
      <el-table-column prop="algorithm" label="algorithm" width="90px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.algorithm | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="create_time" width="160px" align="center" />
      <el-table-column prop="creator" label="creator" width="110px" align="center" />
      <el-table-column prop="accuracy" label="accuracy" width="90px" align="center" />
      <el-table-column prop="prec" label="precision" width="90px" align="center" />
      <el-table-column prop="rec" label="recall" width="90px" align="center" />
      <el-table-column
        label="训练数据"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template scope="scope">
          <div name="downloadfile" style="color:cornflowerblue" @click="downloadExcel(scope.row)">data.csv</div>
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

    <pagination v-show="total>0" :total="total" :page.sync="tableData.page" :limit.sync="tableData.limit" @pagination="load" />

    <el-dialog title="Details" :visible.sync="dialogVisible">
      <el-form v-model="form" border fit highlight-current-row style="width: 600px; margin-left:0px;">

        <el-link
          :underline="false"
          style="color:cornflowerblue"
          @click="download"
        >下载查看：训练数据</el-link>

        <el-form-item label="param1" width="120px" align="center" />
        <el-input v-model="form.param1" width="120px" align="center" disabled="false" />

        <el-form-item label="param2" width="120px" align="center" />
        <el-input v-model="form.param2" width="120px" align="center" disabled="false" />

        <el-form-item label="param3" width="120px" align="center" />
        <el-input v-model="form.param3" width="120px" align="center" disabled="false" />

        <el-form-item label="param4" width="120px" align="center" />
        <el-input v-model="form.param4" width="120px" align="center" disabled="false" />

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
  { key: '0', display_name: '算法1' },
  { key: '1', display_name: '算法2' }
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
      currentPage: 1,
      total: 0,
      creator: '',
      algorithm: '',
      calendarTypeOptions,
      downloadLoading: false,
      dialogVisible: false,
      dialogStatus: '',
      tableData: [],
      search_creator: '',
      search_algorithm: ''
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
        this.total = res.data.total
      }).catch(error => {
        console.log(error)
      })
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
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['create_time', 'creator', 'algorithm', 'accuracy']
    //     const filterVal = ['create_time', 'creator', 'algorithm', 'accuracy']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    }
  }
}
</script>
