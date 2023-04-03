<template>
  <div style="margin: 30px">
    <Form :data="formData" />
    <Table :data="tableData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Form from './components/form'
import Table from './components/table'

export default {
  name: 'Test',
  // eslint-disable-next-line vue/no-unused-components
  components: { Form, Table },
  data() {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name
      }
    }
  }
}
</script>

<style scoped>

</style>

