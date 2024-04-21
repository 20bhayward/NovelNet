import axios from 'axios';

const apiBaseURL = 'http://localhost:5000';

export default axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});