import axios from "axios";
import { message } from "ant-design-vue";
// import router from "../router/index";

export const http = axios.create({
  timeout: 60 * 1000,
  //baseURL: "http://localhost:8088",
  baseURL: "../",
});

http.interceptors.request.use(
  (cfg) => {
    const httpCfg = { ...cfg };
    httpCfg.headers["Access-Control-Allow-Origin"] = "*";
    delete httpCfg.headers.Authorization;
    return httpCfg;
  },
  (error) => {
    // Do something with request error
    console.log("somethings error here, please process");
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    // console.log(err);
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "错误请求";
          break;
        case 404:
          err.message = "资源未找到";
          break;
        case 500:
          err.message = "服务器错误";
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
    } else if (err.code === "ECONNABORTED") {
      err.message = "请求超时";
    } else if (err.constructor.toString().includes("Cancel")) {
      err.message = "Cancel";
    } else {
      err.message = "连接到服务器失败";
    }
    message.error(err.message);
    return err;
  }
);
