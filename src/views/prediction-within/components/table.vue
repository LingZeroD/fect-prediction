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
        default-sort="{prop: 'createTime', order: 'ascending'}"
      >

        <el-table-column type="expand">
          <template slot-scope="{row}">

            <div style="white-space: pre-wrap" v-html="formatResult(row.result)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="Id"
          sortable
          align="center"
          width="60px"
        >
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dataset" label="Dataset" width="110px" align="center">
          <template slot-scope="{row}">
            <el-tag>{{ row.dataset }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="pythonArgs" label="pythonArgs" width="300px" align="center">
          <template slot-scope="{row}">
            <div
              v-for="(value,key,index) in JSON.parse(row.pythonArgs)"
              :class="index % 2 === 0 ? 'tag-even' : 'tag-odd'"
            >
              <el-tag
                :class="{ 'color-blue': key === 'target_epochs', 'color-green': key === 'exp_name', 'color-red': key!=='target_epochs' && key!=='exp_name' }"
              >
                {{ key }}:</el-tag>
              <el-tag style="color: black">{{ value }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="resultPath"
          label="Result"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            <div v-for="result in JSON.parse(row.resultPath)">
              <el-link
                style="color:cornflowerblue"
                @click="copyResultPath(result)"
              >{{ result.release[0] }}
              </el-link>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="Create_time" sortable width="155px" align="center" />
        <el-table-column prop="finishTime" label="Finish_time" sortable width="155px" align="center" />
        <el-table-column label="Status" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.state | statusFilter }}
              <!-- {{ row.status }} -->
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

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="tableData.page"
      :limit.sync="tableData.limit"
      @pagination="load"
    />
  </div>
</template>

<script>
import { preWithinList } from '@/api/model'

const statusType = [
  { key: '0', display_name: '训练中' },
  { key: '1', display_name: '已完成' }
]
const statusTypeKeyValue = statusType.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'Table',
  components: {},
  filters: {
    statusFilter(type) {
      return statusTypeKeyValue[type]
    }
  },
  data() {
    return {
      URL,
      form: {},
      creator: '',
      tableData: [],
      refresh: false,
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 10 // 每页的数据条数
    }
  },
  created() {
    this.load()
    console.log(1256764345543454)
  },
  methods: {
    load() {
      preWithinList({ 'username': this.$store.getters.name }).then(res => {
        console.log(res)
        this.tableData = res.data.result_list

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
    copyResultPath(result) {
      // 获取文件路径
      const filePath = result.path[0]

      // 创建一个新的textarea元素，并将文件路径设置为其值
      const textarea = document.createElement('textarea')
      textarea.value = filePath

      // 将textarea元素添加到DOM中
      document.body.appendChild(textarea)

      // 选中textarea元素中的文本内容
      textarea.select()

      // 将选中的文本内容复制到剪贴板中
      document.execCommand('copy')

      // 删除添加的textarea元素
      document.body.removeChild(textarea)

      // 弹出提示框提示用户已将内容复制到剪贴板中
      this.$message.success('文件路径已复制到剪贴板')
    },
    formatResult(result) {
      const regex = /(Precision|F1|AUC):\s*([\d.]+)/g
      let formattedResult = result.replace(regex, `<el-tag style='color:blue'>$1:</el-tag> <span style='color:#228a43'>$2</span>`)
      const regex2 = /(generating prediction of release):\s*([\S.]+)/g
      formattedResult = formattedResult.replace(regex2, `<el-tag style="color:#7031ef">$1:</el-tag> <span style="color:#0092f8">$2</span>`)
      return formattedResult
    },
    getSortClass: function(key) {
      const sort = this.tableData.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    sortTable(column) {
      // 排序方法
      console.log('apd123')
      const sortKey = column.property
      const sortOrder = column.order === 'descending' ? -1 : 1
      this.tableData.sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal < bVal) return -1 * sortOrder
        if (aVal > bVal) return sortOrder
        return 0
      })
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
<style scoped>
.tag-even {
  background-color: #f5f5f5;
}
.tag-odd {
  background-color: #fff;
}
.color-blue{
  color: blue;
}
.color-red {
  color: red;
}

.color-green {
  color: green;
}
</style>
