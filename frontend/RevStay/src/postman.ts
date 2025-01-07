import axios from 'axios'

export const postman = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

postman.interceptors.request.use((config) => {
    const controller = new AbortController()
    const token = sessionStorage.getItem('token')

    if (token !== null && !config.headers.has('Authorization')) {
        config.headers.set('Authorization', `Bearer ${token}`)
    }

    return {...config, signal: controller.signal}
})
