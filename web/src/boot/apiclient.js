import Vue from "vue"
import ApiClient from "../services/base/ApiClient"

let configs = Vue.prototype.$configuration

let defaultApiHeaders = { "API-KEY": configs.API_KEY }
// Vue.prototype.$api = new ApiClient(configs.API_URL_BASE, defaultApiHeaders)
Vue.prototype.$api = new ApiClient("http://localhost:9996", defaultApiHeaders)

// "async" is optional
export default async ({ /* app, router, Vue, ... */ }) => {
}

