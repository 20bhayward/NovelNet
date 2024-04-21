import axios from 'axios';

const apiBaseURL = 'https://lore-library-server-62fd6c0714e1.herokuapp.com/';

export default axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});