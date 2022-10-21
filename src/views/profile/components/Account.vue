<template>
  <el-form>
    <el-form ref="updateForm" :model="updateForm" :rules="rules">
      <el-form-item label="新密码" prop="npwd">
        <el-input v-model.trim="updateForm.npwd" />
      </el-form-item>
      <el-form-item label="确认密码" prop="cpwd">
        <el-input v-model.trim="updateForm.cpwd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(updateForm)">更新</el-button>
      </el-form-item>
    </el-form>
  </el-form>
</template>

<script>
import { alterPassword } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data() {
    return {
      updateForm: {
        npwd: '',
        cpwd: ''
      },
      rules: {
        npwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        cpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.updateForm.npwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submit(updateForm, name) {
      // name: this.$store.getters.name, password: updateForm.npwd
      console.log(this.$store.getters.name)
      console.log(updateForm.npwd)
      console.log(this.$store.getters.email)
      alterPassword({ username: this.$store.getters.name, password: updateForm.npwd, email: this.$store.getters.email }).then(res => {
        this.$message({
          message: '更改成功',
          type: 'success'
        })
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
