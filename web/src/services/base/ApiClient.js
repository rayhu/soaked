import axios from "axios"
import _ from "lodash"

/**
 * API Client to call API classes
 */
class ApiClient {
    constructor(baseUrl, defaultHeaders) {
        this.apiBaseUrl = baseUrl
        this.headers = _.assign({}, defaultHeaders)
    }

    async get (url, query = {}) {
        const response = await axios.request({
            url: url,
            baseURL: this.apiBaseUrl,
            params: query,
            method: "get",
            data: undefined,
            headers: undefined, //this.headers,
            validateStatus: () => true,
        })
        this.checkResponse(response, url, "get")
        return response.data
    }

    async post (url, body, query = {}) {
        const response = await axios.request({
            url: url,
            baseURL: this.apiBaseUrl,
            params: query,
            method: "post",
            data: body,
            headers: this.headers,
            validateStatus: () => true,
        })
        this.checkResponse(response, url, "post")
        return response.data
    }

    async put (url, body, query = {}) {
        const response = await axios.request({
            url: url,
            baseURL: this.apiBaseUrl,
            params: query,
            method: "put",
            data: body,
            headers: this.headers,
            validateStatus: () => true,
        })
        this.checkResponse(response, url, "put")
        return response.data
    }

    async delete (url, query = {}) {
        const response = await axios.request({
            url: url,
            baseURL: this.apiBaseUrl,
            params: query,
            method: "delete",
            data: undefined,
            headers: this.headers,
            validateStatus: () => true,
        })
        this.checkResponse(response, url, "delete")
        return response.data
    }

    checkResponse (response, url, method) {
        if (response.status !== 200) {
            let body = response.data
            if (!body) throw new Error(`Error calling ${method} API: ${url}`)
            if (body.messageTemplate) {
                throw new Error(body.messageTemplate)
            }
            if (body.message) {
                throw new Error(body.message)
            }
            throw new Error(`Error calling ${method} API: ${url}`)
        }
    }
}

export default ApiClient
