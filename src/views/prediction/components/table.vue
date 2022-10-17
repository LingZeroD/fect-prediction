<template>
  <div class="app-container">

    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="id" label="Id" sortable="custom" align="center" width="110" :class-name="getSortClass('id')" />
      <el-table-column prop="model" label="ModelID" width="90px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.model }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="Create_time" width="330px" align="center" />
      <el-table-column prop="username" label="Creator" width="150px" align="center" />
      <el-table-column
        label="Dataset"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template scope="scope">
          <div name="downloadfile" style="color:cornflowerblue" @click="downloadExcel(scope.row)">data.csv</div>
        </template>
      </el-table-column>

      <el-table-column label="Status" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            status
            <!-- {{ row.status }} -->
          </el-tag>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="tableData.page" :limit.sync="tableData.limit" @pagination="load" />
  </div>
</template>

<script>
import { preList } from '@/api/model'

export default {
  name: 'ComplexTable',
  components: {},
  data() {
    return {
      URL,
      form: {},
      currentPage: 1,
      total: 0,
      creator: '',
      tableData: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      preList({ 'username': this.$store.getters.name }).then(res => {
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
    }
  }
}
</script>
