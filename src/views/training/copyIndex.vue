<template>
  <div>
    <div>
      <el-form ref="form" :model="form" label-width="80px" label-position="left" size="small" style="border:1px solid #C4E1C5;padding:20px;">
        <div style="margin:30px" />
        <!-- <el-form-item label="Model Traning" label-width="300px" /> -->
        <!-- 选择算法 -->
        <el-form-item label="Algorithm">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in algorithms"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 选择训练参数 -->
        <el-form-item label="Parameter">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">ALL</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="checkedParameters" @change="handleCheckedParametersChange">
            <el-checkbox v-for="parameter in parameters" :key="parameter" :label="parameter">{{ parameter }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 选择数据文件 -->
        <el-form-item label="File">
          <el-upload :action="action" :file-list="modeList" :http-request="modeUpload">
            <el-button size="small" type="info" round>choose your file</el-button>
          </el-upload>
        </el-form-item>

        <!-- 开始训练 -->
        <el-form-item>
          <el-button type="primary" round @click="upload"><span>Submit</span></el-button>
          <!-- <el-button type="primary">提交</el-button>
            <el-button>取消</el-button> -->
        </el-form-item>
        <br>
      </el-form>
    </div>

    <!-- 训练记录 -->
    <div class="app-container">
      <el-input v-model="filename" placeholder="Please enter the file name (default excel-list)" style="width:350px;" prefix-icon="el-icon-document" />
      <el-button :loading="downloadLoading" style="margin-bottom:20px" icon="el-icon-document" @click="handleDownload">
        Export Selected Items
      </el-button>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <!-- 用户名、模型名称、数据文件名、操作时间、状态 -->
        <el-table-column type="selection" align="center" />
        <el-table-column align="center" label="User" width="100">
          <!-- <template slot-scope="scope">
                {{ scope.$index }}
              </template> -->
        </el-table-column>
        <el-table-column label="Model" align="center">
          <!-- <template slot-scope="scope">
                {{ scope.row.title }}
              </template> -->
        </el-table-column>
        <el-table-column label="File" align="center">
          <!-- <template slot-scope="scope">
                <el-tag>{{ scope.row.author }}</el-tag>
              </template> -->
        </el-table-column>
        <el-table-column align="center" label="Time" width="220">
          <!-- <template slot-scope="scope">
                <i class="el-icon-time" />
                <span>{{ scope.row.display_time }}</span>
              </template> -->
        </el-table-column>
        <el-table-column label="Status" width="115" align="center">
          <!-- <template slot-scope="scope">
                {{ scope.row.pageviews }}
              </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const parameterOptions = ['1', '2', '3', '4']
import { fetchList } from '@/api/model'
export default {
  name: 'SelectExcel',
  data() {
    return {
      value: ['algorithm1', 'algorithm2'],
      algorithms: [{
        value: 'algorithm1',
        label: 'algorithm1'
      }, {
        value: 'algorithm2',
        label: 'algorithm2'
      }],
      checkAll: false,
      checkedParameters: ['1', '2'],
      parameters: parameterOptions,
      isIndeterminate: true,
      list: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      filename: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedParameters = val ? parameterOptions : []
      this.isIndeterminate = false
    },
    handleCheckedParametersChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.parameters.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.parameters.length
    },
    fetchData() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
          const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
          const list = this.multipleSelection
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          })
          this.$refs.multipleTable.clearSelection()
          this.downloadLoading = false
        })
      } else {
        this.$message({
          message: 'Please select at least one item',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

    <style>
    /* .el-button--submit{
      color:coral
    } */
    </style>

