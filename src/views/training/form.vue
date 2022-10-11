<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :label-width="data.width">

      <el-form-item v-for="(item,k) in data.items" v-show="!item.hide" :key="k" :label="item.label" :prop="item.prop">

        <template v-if="item.type=='slot'">
          <slot :name="item.slot_name" />
        </template>

        <el-input
          v-if="item.type=='Input'"
          v-show="!item.hide"
          v-model="ruleForm[item.prop]"
          :placeholder="item.placeholder"
          :style="{width: item.width}"
          :readonly="item.readonly"
          :show-password="item.password"
        />

        <el-select v-if="item.type=='Select'" v-model="ruleForm[item.prop]" :placeholder="item.placeholder">
          <el-option v-for="(o,i) in item.options" :key="i" :label="o.label" :value="o.value" />
        </el-select>

        <!-- :action="action" -->
        <!-- https://blog.csdn.net/weixin_40030173/article/details/102742827 -->
        <el-upload
          v-if="item.type=='Upload'"
          v-model="ruleForm[item.prop]"
          action="服务器地址"
          accept=".xlsx, .xls"
          :limit="limitNum"
          :auto-upload="true"
          :before-upload="beforeUploadFile"
          :on-change="fileChange"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :data="QQQ"
        >
          <el-button size="small" type="info" round>choose your file</el-button>
          <div slot="tip" class="el-upload__tip">
            Only ".xlsx"  ".xls" can be Upload.
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button v-for="(b,k) in data.buttons" :key="k" :type="b.type" @click="callSelf('ruleForm',b.action,b.call)">{{ b.label }}</el-button>
      </el-form-item>

    </el-form>

    <div class="app-container">
      <el-input v-model="filename" placeholder="Please enter the file name (default excel-list)" style="width:350px;" prefix-icon="el-icon-document" />
      <el-button :loading="downloadLoading" style="margin-bottom:20px" icon="el-icon-document" @click="handleDownload">
        Export Selected Items
      </el-button>
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading```"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <!-- 用户名、模型名称、数据文件名、操作时间、状态 -->
        <el-table-column type="selection" align="center" />
        <el-table-column align="center" label="User" width="100">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="Model" align="center">
          <!-- <template slot-scope="scope">
                {{ scope.row.title }}
              </template> -->
        </el-table-column>
        <el-table-column label="File" align="center">
          <!-- <te=bvlate slot-scope="scope">
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
// import { fetchList } from '@/api/article'

export default {
  name: 'Form',
  props: {
    data: Object
  },
  data() {
    return {
      ruleForm: {
      },
      rules: {
      },
      watchKes: [],
      limitNum: 1,
      fileList: []
    }
  },
  watch: {
    data: {
      handler(newVal) {
        // console.log(newVal)
        this.init(newVal)
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // this.init()
    // this.fetchData()
  },
  methods: {
    callSelf(formName, action, callback) {
      if (action === 'submit') {
        this.submitForm(formName, callback)
      } else if (action === 'reset') {
        this.resetForm()
        callback && callback()
      } else {
        callback && callback()
      }
    },
    submitForm(formName, callback) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
          callback && callback(this.ruleForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setForm(row) {
      for (const key in row) {
        this.ruleForm[key] = row[key]
      }
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    init(data) {
      const form = {}
      let box = []
      data.items.forEach((item) => {
        switch (item.type) {
          case 'Checkbox':
            if (item.default) {
              if (Array.isArray(item.default)) {
                box = box.concat(item.default)
              } else {
                box.push(item.default)
              }
            }
            form[item.prop] = box
            break

          case 'Date':
          case 'Datetime':
          case 'Time':
            if (item.default) {
              form[item.prop] = new Date(item.default)
            }

            break
          default:
            form[item.prop] = item.default
            break
        }
      })

      this.ruleForm = form

      this.rules = this.data.rules
    },
    // fetchData() {
    //   this.listLoading = true
    //   fetchList(this.listQuery).then(response => {
    //     this.list = response.data.items
    //     this.listLoading = false
    //   })
    // },
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
            filename: this.filename })
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

<style scoped>

</style>
