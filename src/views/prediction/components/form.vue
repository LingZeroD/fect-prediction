<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="Model ID">
        <el-select v-model="form.model" placeholder="Please select a model" style="width: 300px">
          <el-option v-for="item in options" :key="item" :value="item">
            {{ item }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Dataset">
            <el-select v-model="form.params.dataset">
              <el-option v-for="(item, index) in datasets" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Embed Dim">
            <el-input v-model.number="form.params.embed_dim" type="number" placeholder="请输入词嵌入大小" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Word GRU Hidden Dim">
            <el-input v-model.number="form.params.word_gru_hidden_dim" type="number" placeholder="请输入词级别GRU隐藏层大小" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Sent GRU Hidden Dim">
            <el-input v-model.number="form.params.sent_gru_hidden_dim" type="number" placeholder="请输入句子级别GRU隐藏层大小" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Word GRU Num Layers">
            <el-input v-model.number="form.params.word_gru_num_layers" type="number" placeholder="请输入词级别GRU层数" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Sent GRU Num Layers">
            <el-input v-model.number="form.params.sent_gru_num_layers" type="number" placeholder="请输入句子级别GRU层数" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Exp Name">
            <el-input v-model="form.params.exp_name" placeholder="请输入实验名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Target Epochs">
            <el-input v-model.number="form.params.target_epochs" type="number" placeholder="请输入要加载模型的目标轮次" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Dropout">
            <el-input v-model.number="form.params.dropout" type="number" placeholder="请输入dropout" />
          </el-form-item>
        </el-col>
      </el-row>
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
    <el-scrollbar>
      <el-dialog
        ref="myScrollbar"
        title="程序输出结果"
        :visible.sync="outputDialogVisible"
        width="70%"
        custom-class="pub_dialog"
        center
      >
        <p v-for="line in lines" :key="line">{{ line }}</p>
      </el-dialog>
    </el-scrollbar>
    <el-button type="text" @click="outputDialogVisible = true">点击打开程序输出</el-button>
  </div>
</template>

<script>
import { predictionModel } from '@/api/model'
import { getModelID } from '@/api/model'
import { pythonOutputCard } from '@/views/training/components/PythonOutputCard'

export default {
  components: [
    pythonOutputCard
  ],
  data() {
    return {
      form: {
        model: '',
        username: this.$store.getters.name,
        params: {
          dataset: 'activemq',
          embed_dim: 50,
          word_gru_hidden_dim: 64,
          sent_gru_hidden_dim: 64,
          word_gru_num_layers: 1,
          sent_gru_num_layers: 1,
          exp_name: '',
          target_epochs: 7,
          dropout: 0.2
        }

      },
      datasets: [
        { label: 'ActiveMQ', value: 'activemq' },
        { label: 'Camel', value: 'camel' },
        { label: 'Derby', value: 'derby' },
        { label: 'Groovy', value: 'groovy' },
        { label: 'HBase', value: 'hbase' },
        { label: 'Hive', value: 'hive' },
        { label: 'JRuby', value: 'jruby' },
        { label: 'Lucene', value: 'lucene' },
        { label: 'Wicket', value: 'wicket' }
      ],
      lines: [],
      outputDialogVisible: false,
      options: [],
      webSocket: null,
      timer: null
    }
  },
  mounted() {

  },
  created() {
    this.getOptions()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.webSocket.close()
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
        if (key == 'params') {
          formData.append(key, JSON.stringify(this.form[key]))
        } else {
          formData.append(key, this.form[key])
        }

        console.log(formData.get(key))
      }
      console.log(formData)
      formData.append('pre_data', this.data)
      predictionModel(formData).then(res => {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.lines = []
        this.outputDialogVisible = true
        // this.webSocket = new WebSocket('ws://192.168.1.146:8080/ws')
        this.webSocket = new WebSocket(`ws://localhost:8080/ws?username=${this.username}`)
        this.webSocket.onmessage = (event) => {
          this.lines.push(event.data)
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.webSocket.close()
          }, 15000)
        }
        this.timer = setTimeout(() => {
          this.webSocket.close()
        }, 15000)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style>
/*el-dialog {*/
/*  background-color: black; !* 将背景颜色设置为黑色 *!*/
/*  color: white; !* 将字体颜色设置为白色 *!*/
/*  max-height: 400px; !* 设置固定高度，根据实际需要调整 *!*/
/*  overflow-y: auto; !* 启用纵向滚动条 *!*/
/*}*/

.el-dialog__header,
.el-dialog__body {
  background-color: black; /* 将背景颜色设置为黑色 */
  color: white; /* 将字体颜色设置为白色 */
}

.el-scrollbar__wrap {
  /*overflow: visible !important;*/
  /*height: 50% ;*/
  /*max-height: 50%;*/
  overflow-x: hidden !important;
}

.el-form-item__label {
  /*white-space: nowrap;*/
  font-size: 10px;
}

.el-form-item--medium .el-form-item__label {
  line-height: 20px;
  text-align-all: center;
}

.el-dialog__wrapper {
  /*height: 60%;*/
  margin-top: 10%;
  max-height: 60%;
}

.el-dialog__body {

}

</style>

