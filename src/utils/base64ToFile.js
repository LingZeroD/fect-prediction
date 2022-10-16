// const util = {
//   // 创建一个a标签，并做下载点击事件
//   downloadFile: function(blob, fileName) {
//     const link = document.createElement('a')
//     link.href = window.URL.createObjectURL(blob)
//     link.download = fileName
//     // 此写法兼容可火狐浏览器
//     document.body.appendChild(link)
//     const evt = document.createEvent('MouseEvents')
//     evt.initEvent('click', false, false)
//     link.dispatchEvent(evt)
//     document.body.removeChild(link)
//   },
//   // 将Base64文件转为 Blob
//   buildBlobByByte: function(data) {
//     const raw = window.atob(data)
//     const rawLength = raw.length
//     const uInt8Array = new Uint8Array(rawLength)
//     for (let i = 0; i < rawLength; ++i) {
//       uInt8Array[i] = raw.charCodeAt(i)
//     }
//     return new Blob([uInt8Array])
//   },
//   // 二进制数组 生成文件
//   downloadFileByByte: function(data, fileName) {
//     const blob = this.buildBlobByByte(data)
//     this.downloadFile(blob, fileName)
//   }
// }
