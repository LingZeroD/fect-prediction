<template>
  <div class="register-container">
    <article class="header">
      <header>
        <el-avatar icon="el-icon-user-solid" :src="url" shape="circle" />
        <span class="login" style="margin-top:15px">
          <a class="bold" href="/login">已有账号？</a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
        autocomplete="off"
        hide-required-asterisk="true"
        size="medium"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" class="register-form" type="用户名" />
        </el-form-item>
        <div style="padding-top: 10px">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"
              class="register-form"
            />
          </el-form-item>

          <el-form-item label="密码" prop="pwd">
            <el-input v-model="ruleForm.pwd" class="register-form" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="cpwd">
            <el-input v-model="ruleForm.cpwd" class="register-form" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 30%; margin-left:85px"
              @click="register"
            >注册</el-button>
          </el-form-item>
        </div>
      </el-form>
    </section>

    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
import { register } from '@/api/register'

export default {
  name: 'Register',
  data() {
    return {
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.gmz88.com%2Fuploadimg%2Fimage%2F20190116%2F15476240655c3ede81c64116.77854307.jpeg&refer=http%3A%2F%2Fimg.gmz88.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1667038105&t=0374e9cdf9ecb5833b85cbe9bae9a4c8',
      error: '',
      isDisable: false,
      codeLoading: false,
      ruleForm: {
        username: '',
        email: '',
        pwd: '',
        cpwd: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        }, { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }],
        cpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pwd) {
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
    // 用户注册
    register: function() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const user = {
            username: this.ruleForm.username,
            password: this.ruleForm.pwd,
            email: this.ruleForm.email
          }
          register(user).then(res => {
            this.$message({
              showClose: true,
              message: '注册成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.push('/')
            }, 2000)
          }).catch(error => {
            console.log(error)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray:dodgerblue;
$cursor: dodgerblue;

@supports (-webkit-mask: none) and (not (cater-color: dodgerblue)) {
  .register-container .el-input input {
    color: dodgerblue;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 20px;
    width: 95%;

    input {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      -webkit-appearance: none;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 40px;
      caret-color: dodgerblue;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: dodgerblue !important;
      }
    }
  }

  .el-form-item {
    label {
      font-style: normal;
      font-size: 15px;
      color: $light_gray;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray:dodgerblue;
$light_gray: dodgerblue;

.register-container {
  /*
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  */

  width: 100%;
  height: 100%;
  background-image: url("../../assets/login/back2.png");
  background-size: cover;
  background-position: center;
  position: relative;

  .register-form {
    position: relative;
    width: 300px;
    background-position: center;
  }

  .header {
    border-bottom: 2px solid rgb(235, 232, 232);
    min-width: 980px;
    color: dodgerblue;

    header {
      margin: 0 auto;
      padding: 10px 0;
      width: 980px;

      .login {
        float: right;
      }

      .bold {
        font-style: normal;
        color: dodgerblue;
      }
    }
  }

  > section {
    margin: 0 auto 100px;
    padding-top: 30px;
    width: 690px;
    min-height: 300px;
    padding-right: 100px;
    box-sizing: border-box;

    .status {
      font-size: 12px;
      margin-left: 20px;
      color: #e6a23c;
    }

    .error {
      color: red;
    }
  }

  .tips {
    float: right;
    font-size: 14px;
    color: dodgerblue;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
}
</style>

<style scoped>
/* 修改验证器样式 */
/deep/ .el-form-item.is-error .el-input__inner {
  border-color: dodgerblue;
}
/deep/ .el-form-item.is-error .el-input__validateIcon {
  color: dodgerblue;
}
/deep/ .el-form-item__error {
  color: dodgerblue;
}
</style>

