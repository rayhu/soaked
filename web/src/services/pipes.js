import ApiClient from "./base/ApiClient"
import settings from "./base/Settings"

//const apiClient = new ApiClient(settings.API_URL_BASE)
const apiClient = new ApiClient("http://127.0.0.1:9996")

export const getPipes = async data => {
    try {
        const response = await apiClient.get("/pipes")
        if (response && response.accessToken) {
            localStorage.setItem(settings.pipesObj, JSON.stringify(response))
            return response
        } else {
            throw new Error("Error in getting response")
        }
    } catch (error) {
        throw new Error(error.message)
    }
}


export const putPipe = () => {

}
