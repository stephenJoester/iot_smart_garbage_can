import axios from "axios";

const API = axios.create({
      // baseURL: "http://localhost:8000/",
      baseURL : "https://iot-smart-garbage-can.vercel.app/",
      // baseURL: "http://192.168.2.87:8000/",
});

export default API;