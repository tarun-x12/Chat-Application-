import axios from "axios";
import Cookies from "js-cookie";
import { HOST } from "./constants";

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
    });

    this.initializeRequestInterceptor();
  }

  // Initialize the request interceptor
  initializeRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get("access-token");

        if (
          token &&
          !config.url.includes("/login") &&
          !config.url.includes("/signup")
        ) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Generic GET request
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Generic POST request
  async post(url, data, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Generic PUT request
  async put(url, data, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Centralized error handling
  handleError(error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Export an instance of ApiClient
const apiClientInstance = new ApiClient(HOST);
export default apiClientInstance;
