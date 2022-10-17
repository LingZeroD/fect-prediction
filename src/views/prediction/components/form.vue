<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item label="Model ID">
      <el-select v-model="form.model" placeholder="Please select a model" style="width: 300px">
        <el-option v-for="item in options" :key="item" :value="item">
          {{ item }}
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Data">
      <el-upload
        ref="upload2"
        accept=".csv"
        action=""
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :multiple="false"
        :http-request="uploadFile"
      >
        <el-button size="small" type="info" round>choose your file</el-button>
        <div slot="tip" class="el-upload__tip">
          Only ".csv" can be Upload.
        </div>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" round @click="submit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { predictionModel } from '@/api/model'
import { getModelID } from '@/api/model'
export default {
  data() {
    return {
      form: {
        model: '',
        creator: this.$store.getters.name
      },
      options: []
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    getOptions() {
      getModelID().then(res => {
        console.log(res)
        console.log(res.data)
        console.log(res.data.modellist)
        this.options = res.data.modellist
      })
    },
    uploadFile(f) {
      this.data = f.file
    },
    submit() {
      this.$refs.upload2.submit()
      const formData = new FormData()
      for (const key in this.form) {
        formData.append(key, this.form[key])
        console.log(formData.get(key))
      }
      formData.append('data', this.data)
      predictionModel(formData).then(res => {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

