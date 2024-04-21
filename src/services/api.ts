import axios from 'axios';

const apiBaseURL = 'https://lorelibraryserver.onrender.com';

export default axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});