import axios from "axios";

const API = axios.create({
      // baseURL: "http://localhost:8000/",
      baseURL : "https://iot-smart-garbage-can.vercel.app/"
});

export default API;