import axios from 'axios'
import {message} from "antd";

axios.defaults.baseURL = 'http://localhost:8081';

export default function ajax(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    let promise
    if (method === "GET") {
      promise = axios.get(url, {params: data})
    } else {
      promise = axios.post(url, data)
    }
    promise.then(res => {
      if(res.data.status === 0) {
        resolve(res.data)
      } else {
        message.error(res.data.msg)
      }
    }).catch(err => {
      message.error(`请求出错了: ${err.message}`)
    })
  })
}