<template>
  <div style="margin: 30px">
    <Form :data="formData" />
  </div>
</template>

<script>
import Form from './Form'

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
            label: '活动名称',
            prop: 'name',
            width: '240px',
            placeholder: '请填写活动名称',
            default: '请'
          },
          {
            type: 'Select',
            label: '活动区域',
            prop: 'region',
            placeholder: '请选择活动区域',
            default: 'beijing',
            options: [
              {
                label: '上海',
                value: 'shanghai'
              },
              {
                label: '北京',
                value: 'beijing'
              }
            ]
          },
          {
            type: 'Switch',
            label: '即时配送',
            prop: 'delivery',
            default: true
          },
          {
            type: 'Checkbox',
            label: '活动性质',
            prop: 'type',
            default: '1',
            options: [
              {
                label: '线下主题活动',
                value: '1'
              },
              {
                label: '单纯品牌曝光',
                value: '2'
              }
            ]
          },
          {
            type: 'Radio',
            label: '特殊资源',
            prop: 'resource',
            default: 'b',
            options: [
              {
                label: '线上品牌商赞助',
                value: 'a'
              },
              {
                label: '线下场地免费',
                value: 'b'
              }
            ]
          },
          {
            type: 'Textarea',
            label: '活动形式',
            prop: 'desc',
            placeholder: '请填写活动形式',
            default: '活动'
            // span:5
          },
          {
            type: 'Date',
            label: '活动日期',
            prop: 'date1',
            placeholder: '请选择活动日期',
            default: '2022-6-1'

          },
          {
            type: 'Time',
            label: '活动时间',
            prop: 'date2',
            placeholder: '请选择活动时间',
            default: '2022-6-2 12:00:01'

          },
          {
            type: 'Datetime',
            label: '活动日期时间',
            prop: 'date3',
            placeholder: '请选择活动日期时间',
            default: '2022-6-1 12:00:03'

          }
        ],
        buttons: [
          {
            label: '确定',
            type: 'primary',
            action: 'submit',
            call: (data) => {
              console.log(data)
            }
          },
          {
            label: '重置',
            type: 'primary',
            action: 'reset',
            call: () => {
              console.log('reset')
            }
          },
          {
            label: '其他',
            type: 'primary',
            call: (data) => {
              console.log(data)
            }
          }
        ],
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
