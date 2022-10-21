<template>
  <div class="app-container">

    <el-card>
      <i :class="[refresh? 'el-icon-refresh go' : 'el-icon-refresh']" style="margin-top:10px" @click="iconClick" />
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column prop="id" label="Id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')" />
        <el-table-column prop="des" label="Description" min-width="150px" align="center" />
        <el-table-column prop="algorithm" label="Algorithm" width="120px" align="center">
          <template slot-scope="{row}">
            <el-tag>{{ row.algorithm | typeFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="Create_time" width="160px" align="center" />
        <el-table-column prop="creator" label="Creator" width="110px" align="center" />
        <el-table-column prop="param1" label="Classifier" width="90px" align="center" />
        <!-- <el-table-column prop="param2" label="Param2" width="90px" align="center" />
      <el-table-column prop="param3" label="Param3" width="90px" align="center" />
      <el-table-column prop="param4" label="Param4" width="90px" align="center" /> -->
        <el-table-column
          label="Dataset"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template scope="scope">
            <div name="downloadfile" style="color:cornflowerblue" @click="downloadExcel(scope.row)">data.csv</div>
          </template>
        </el-table-column>

        <el-table-column prop="state" label="Status" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.state | statusFilter }}
            </el-tag>
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
    </el-card>
    <pagination v-show="total>0" :total="total" :page.sync="tableData.page" :limit.sync="tableData.limit" @pagination="load" />
  </div>

</template>

<script>
import { modellist } from '@/api/model'
const calendarTypeOptions = [
  { key: '0', display_name: 'RandomForest' },
  { key: '1', display_name: 'AdaBoost' }
]
const statusType = [
  { key: '0', display_name: '训练中' },
  { key: '1', display_name: '已完成' }
]

// eslint-disable-next-line no-unused-vars
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const statusTypeKeyValue = statusType.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: {},
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    statusFilter(type) {
      return statusTypeKeyValue[type]
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
      modellist({ 'creator': this.$store.getters.name }).then(res => {
        console.log(res)
        this.tableData = res.data.modellist
        console.log(this.tableData)
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
    downloadExcel(row) {
      const file = this.convertBase64ToBlob(row.data, 'application/vhd.ms-excel', 1024)
      const link = document.createElement('a')
      link.download = 'data.csv'
      link.href = URL.createObjectURL(file)
      link.click()
      URL.revokeObjectURL(link.href)
    },
    getSortClass(key) {
      // const sort = this.tableData.sort
      // return sort === `+${key}` ? 'ascending' : 'descending'
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
