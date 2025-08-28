import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.100.136:5000/api", // 👈 your machine's IP
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
