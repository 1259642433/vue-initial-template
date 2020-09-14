import request from '@/utils/request'

export function testGet(params){
    return request({
        url:'/v1/test',
        method:'GET',
        params
    })
}

export function testPost(data){
    return request({
        url:'/v1/test',
        method:'POST',
        data
    })
}