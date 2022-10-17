import request from '@/utils/request'

export function trainModel(data) {
  return request({
    url: '/train',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function predictionModel(data) {
  return request({
    url: '/predict',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getModelID() {
  return request({
    url: '/model',
    method: 'get'
  })
}
export function getRecord() {
  return request({
    url: '/result',
    method: 'get'
  })
}

export function downloadRecord() {
  return request({
    url: '/download',
    method: 'get'
  })
}
