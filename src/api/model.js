import request from '@/utils/request'

export function modellist(data) {
  console.log(data)
  return request({
    url: '/modellist',
    method: 'get',
    params: data
  })
}

