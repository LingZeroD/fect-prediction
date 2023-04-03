<template>
  <el-card class="python-output-card">
    <div slot="header" class="python-output-card__header">
      <el-tooltip content="Close" placement="top">
        <i class="el-icon-close python-output-card__close" @click="close" />
      </el-tooltip>
      <h3 class="python-output-card__title">{{ title }}</h3>
    </div>
    <div class="python-output-card__body">
      <p v-for="line in lines" class="python-output-card__line">{{ line }}</p>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Python Output'
    },
    lines: {
      type: Array
    }
  },
  data() {
    return {
      // lines: ['2223','123','12355']
    }
  },
  mounted() {
    // const socket = new WebSocket('ws://localhost:8080/socket')
    // socket.onmessage = (event) => {
    //   this.lines.push(event.data)
    // }
  },
  methods: {
    // close() {
    //   this.$emit('close')
    // }
  }
}
</script>

<style scoped>
.python-output-card {
  width: 400px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
.python-output-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.python-output-card__close {
  cursor: pointer;
}
.python-output-card__title {
  margin: 0;
}
.python-output-card__body {
  height: 200px;
  overflow-y: auto;
}
.python-output-card__line {
  margin: 0;
}
</style>
