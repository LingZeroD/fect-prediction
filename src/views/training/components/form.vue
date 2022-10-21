<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item label="Description">
      <el-input v-model="form.des" type="textarea" placeholder="Add your description..." style="width: 600px" />
    </el-form-item>
    <el-form-item label="Algorithm">
      <el-select v-model="form.algorithm" placeholder="Please select an algorithm" style="width: 250px">
        <el-option label="RandomForest" value="0" />
        <el-option label="AdaBoost" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="Classifier">
      <el-input v-model="form.param1" placeholder="Please input your parameter" style="width: 250px" />
    </el-form-item>
    <!-- <el-form-item label="Parameter②">
      <el-input v-model="form.param2" style="width: 250px" />
    </el-form-item> -->
    <!-- <el-form-item label="Parameter③">
      <el-input v-model="form.param3" style="width: 250px" />
    </el-form-item>
    <el-form-item label="Parameter④">
      <el-input v-model="form.param4" style="width: 250px" />
    </el-form-item> -->

    <el-form-item label="Data">
      <el-upload
        ref="uploadExcel"
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
import { trainModel } from '@/api/model'
export default {
  data() {
    return {
      form: {
        algorithm: '',
        des: '',
        creator: this.$store.getters.name,
        // param3: '',
        // param4: '',
        param1: '',
        param2: '0'
      }
    }
  },
  methods: {
    uploadFile(f) {
      this.data = f.file
    },
    submit() {
      this.$refs.uploadExcel.submit()
      const formData = new FormData()
      formData.append('data', this.data)
      for (const key in this.form) {
        formData.append(key, this.form[key])
      }
      trainModel(formData).then(res => {
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
