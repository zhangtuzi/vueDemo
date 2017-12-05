import axios from 'axios'

class HttpClient {
    static get (url, params, onSuccess, onError) {
        axios.get(url, {
            params: params,
            timeout: 20000
        }).then(response => {
            // 成功
            onSuccess(response)

        }).catch(error => {
            // 请求失败错误、状态码不等于200的都会走到这里
            onError(error.toString())
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                // console.log(error.response.data)
                // console.log(error.response.status)
                // console.log(error.response.headers)
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js

                // console.log(error.request)
            } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message)
            }
        })
    }
}

export { HttpClient }
