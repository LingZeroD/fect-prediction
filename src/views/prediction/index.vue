<template>
  <div style="margin: 30px">
    <Form :data="formData" />
  </div>
</template>

<script>
import Form from './form'

export default {
  name: 'Test',
  components: { Form },
  data() {
    return {
      formData: {
        width: '100px',
        items: [
          {
            type: 'Input',
            label: 'Description',
            prop: 'description',
            width: '500px',
            placeholder: 'Add your description... ',
            default: ''
          },
          {
            type: 'Select',
            label: 'Agorithm',
            prop: 'agorithm',
            placeholder: 'Please select an algorithm',
            default: 'algorithm1',
            options: [
              {
                label: 'algorithm1',
                value: 'algorithm1'
              },
              {
                label: 'algorithm2',
                value: 'algorithm2'
              }
            ]
          },
          {
            type: 'Upload',
            label: 'File',
            prop: 'file'
          }
        ],
        buttons: [
          {
            label: 'Submit',
            type: 'primary',
            action: 'submit',
            call: (data) => {
              console.log(data)
            }
          },
          {
            label: 'Reset',
            type: 'primary',
            action: 'reset',
            call: () => {
              console.log('reset')
            }
          }
        ],
        rules: {
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ]
        }
      }
    }
  }
}
</script>

    <style scoped>

    </style>

